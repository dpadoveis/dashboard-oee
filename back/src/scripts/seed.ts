import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { Database } from "sql.js";
import {
  BAG_DROP_TOLERANCE_KG,
  DROP_THRESHOLD,
  WINDOW_MINUTES,
} from "../config/constants.js";
import {
  closeDb,
  dbTransaction,
  initDb,
  resetTables,
} from "../database/db.js";
import { processAll } from "../modules/oee/oeeProcessor.js";
import type { ReactorId } from "../types/domain.js";

interface TelRow {
  timestamp: string;
  temp_r1: string;
  temp_r2: string;
  silo_weight_r1: string;
  silo_weight_r2: string;
}

interface BagRow {
  id_bag: string;
  timestamp_production: string;
  peso_bag: string;
}

interface Assignment {
  reactor: ReactorId;
  fallback: boolean;
}

function assignReactor(
  bag: BagRow,
  idx: Map<string, { d1: number; d2: number }>,
  usedDrops: Set<string>,
): Assignment {
  const timestamp = bag.timestamp_production.slice(0, 16);
  const bagWeight = parseFloat(bag.peso_bag);
  const candidates: Array<{
    reactor: ReactorId;
    errorKg: number;
    offset: number;
    dropKey: string;
  }> = [];

  for (let offset = -WINDOW_MINUTES; offset <= WINDOW_MINUTES; offset++) {
    const minuteKey = shiftMinute(timestamp, offset);
    const entry = idx.get(minuteKey);
    if (!entry) continue;

    for (const [reactor, delta] of [
      ["R1", entry.d1],
      ["R2", entry.d2],
    ] as const) {
      const dropKey = `${minuteKey}|${reactor}`;
      if (delta < DROP_THRESHOLD && !usedDrops.has(dropKey)) {
        candidates.push({
          reactor,
          errorKg: Math.abs(Math.abs(delta) - bagWeight),
          offset,
          dropKey,
        });
      }
    }
  }

  candidates.sort(
    (a, b) =>
      a.errorKg - b.errorKg ||
      Math.abs(a.offset) - Math.abs(b.offset),
  );

  const best = candidates[0];
  if (best && best.errorKg <= BAG_DROP_TOLERANCE_KG) {
    usedDrops.add(best.dropKey);
    return { reactor: best.reactor, fallback: false };
  }

  console.warn(
    `[seed] Bag ${bag.id_bag} sem queda compatível - atribuída ao R1`,
  );
  return { reactor: "R1", fallback: true };
}

function shiftMinute(timestamp: string, offset: number): string {
  const [datePart, timePart] = timestamp.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const shifted = new Date(
    Date.UTC(year, month - 1, day, hour, minute + offset),
  );
  return shifted.toISOString().slice(0, 16).replace("T", " ");
}

async function main() {
  console.log("[seed] Iniciando...");
  const dataDir = path.resolve(process.cwd(), "data");
  const telPath = path.join(dataDir, "telemetry_data.csv");
  const bagPath = path.join(dataDir, "production_data.csv");

  if (!fs.existsSync(telPath)) {
    throw new Error("telemetry_data.csv não encontrado em data/");
  }
  if (!fs.existsSync(bagPath)) {
    throw new Error("production_data.csv não encontrado em data/");
  }

  await initDb();
  resetTables();
  console.log("[seed] Banco limpo e tabelas recriadas.");

  const telRows = parse(fs.readFileSync(telPath, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  }) as TelRow[];

  dbTransaction((db: Database) => {
    const stmt = db.prepare(
      `INSERT INTO telemetria_bruta
       (timestamp,temp_r1,temp_r2,silo_weight_r1,silo_weight_r2)
       VALUES (?,?,?,?,?)`,
    );
    for (const row of telRows) {
      stmt.run([
        row.timestamp,
        +row.temp_r1,
        +row.temp_r2,
        +row.silo_weight_r1,
        +row.silo_weight_r2,
      ]);
    }
    stmt.free();
  });
  console.log(`[seed] ${telRows.length} linhas de telemetria inseridas.`);

  const dropIndex = new Map<string, { d1: number; d2: number }>();
  for (let index = 1; index < telRows.length; index++) {
    const current = telRows[index];
    const previous = telRows[index - 1];
    dropIndex.set(current.timestamp.slice(0, 16), {
      d1: +current.silo_weight_r1 - +previous.silo_weight_r1,
      d2: +current.silo_weight_r2 - +previous.silo_weight_r2,
    });
  }

  const bagRows = parse(fs.readFileSync(bagPath, "utf-8"), {
    columns: true,
    skip_empty_lines: true,
  }) as BagRow[];
  let fallbackCount = 0;
  const usedDrops = new Set<string>();

  dbTransaction((db: Database) => {
    const stmt = db.prepare(
      `INSERT INTO eventos_ensacamento
       (id_bag,timestamp_production,peso_bag,reator_id)
       VALUES (?,?,?,?)`,
    );
    for (const bag of bagRows) {
      const assignment = assignReactor(bag, dropIndex, usedDrops);
      if (assignment.fallback) fallbackCount++;
      stmt.run([
        bag.id_bag,
        bag.timestamp_production,
        +bag.peso_bag,
        assignment.reactor,
      ]);
    }
    stmt.free();
  });

  console.log(`[seed] ${bagRows.length} bags inseridas.`);
  console.log(
    `[seed] Atribuição: ${bagRows.length - fallbackCount} por queda; ` +
      `${fallbackCount} por fallback ` +
      `(${((fallbackCount / bagRows.length) * 100).toFixed(2)}%).`,
  );

  console.log("[seed] Processando OEE...");
  const results = processAll(null);
  const average = (values: number[]) =>
    values.length
      ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
          3,
        )
      : "0";
  const r1 = results.filter((result) => result.reator === "R1");
  const r2 = results.filter((result) => result.reator === "R2");

  console.log(
    `R1 - OEE médio: ${average(r1.map((result) => result.oee))} | ` +
      `Produção: ${r1.reduce((sum, result) => sum + result.producao_real, 0).toFixed(1)} kg`,
  );
  console.log(
    `R2 - OEE médio: ${average(r2.map((result) => result.oee))} | ` +
      `Produção: ${r2.reduce((sum, result) => sum + result.producao_real, 0).toFixed(1)} kg`,
  );

  closeDb();
  console.log("[seed] Concluído.");
}

main().catch((error) => {
  console.error("[seed] Erro fatal:", error);
  process.exit(1);
});
