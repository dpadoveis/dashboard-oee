import * as XLSX from "xlsx";
import {
  fetchBags,
  fetchProductionDaily,
  fetchProductionStats,
} from "../features/production/api/productionApi";
import {
  fetchOeeDaily,
  fetchOeeSummary,
} from "../features/oee/api/oeeApi";

const PCT = (v: unknown) =>
  typeof v === "number" && isFinite(v) ? +(v * 100).toFixed(2) : 0;
const NUM = (v: unknown, d = 2) =>
  typeof v === "number" && isFinite(v) ? +v.toFixed(d) : 0;

interface OeeRecord {
  oee: number;
  disponibilidade: number;
  performance: number;
  producao_real: number;
  producao_ideal: number;
  tempo_operacao_efetiva: number;
  tempo_parada_nao_plan: number;
}

interface DailyRow {
  data: string;
  R1: OeeRecord | null;
  R2: OeeRecord | null;
}

interface BagRow {
  id_bag: string;
  timestamp_production: string;
  peso_bag: number;
  reator_id: string;
}

interface ReactorAgg {
  oee_medio: number;
  disponibilidade_media: number;
  performance_media: number;
  producao_total_kg: number;
  total_paradas_min: number;
  total_operacao_min: number;
  dias_processados: number;
}

interface SummaryResponse {
  periodo: { inicio: string; fim: string };
  reatores: { R1: ReactorAgg; R2: ReactorAgg };
}

function autoFit(rows: Array<Record<string, unknown>>, headers: string[]) {
  return headers.map((h) => {
    const maxData = rows.reduce((m, r) => {
      const v = r[h];
      const len = v == null ? 0 : String(v).length;
      return Math.max(m, len);
    }, h.length);
    return { wch: Math.min(40, maxData + 2) };
  });
}

function sheetResumo(
  summary: SummaryResponse,
  prodStats: { total_bags: number; total_kg: number; media_peso_kg: number },
  startDate: string,
  endDate: string,
): XLSX.WorkSheet {
  const aoa: (string | number)[][] = [
    ["Métrica", "Valor"],
    ["Período (início)", startDate],
    ["Período (fim)", endDate],
    ["Dias processados R1", summary.reatores.R1?.dias_processados ?? 0],
    ["Dias processados R2", summary.reatores.R2?.dias_processados ?? 0],
    [],
    ["REATOR 1", ""],
    ["OEE médio (%)", PCT(summary.reatores.R1?.oee_medio)],
    ["Disponibilidade média (%)", PCT(summary.reatores.R1?.disponibilidade_media)],
    ["Performance média (%)", PCT(summary.reatores.R1?.performance_media)],
    ["Produção total (kg)", NUM(summary.reatores.R1?.producao_total_kg)],
    ["Tempo total operando (min)", NUM(summary.reatores.R1?.total_operacao_min, 0)],
    ["Tempo total parado (min)", NUM(summary.reatores.R1?.total_paradas_min, 0)],
    [],
    ["REATOR 2", ""],
    ["OEE médio (%)", PCT(summary.reatores.R2?.oee_medio)],
    ["Disponibilidade média (%)", PCT(summary.reatores.R2?.disponibilidade_media)],
    ["Performance média (%)", PCT(summary.reatores.R2?.performance_media)],
    ["Produção total (kg)", NUM(summary.reatores.R2?.producao_total_kg)],
    ["Tempo total operando (min)", NUM(summary.reatores.R2?.total_operacao_min, 0)],
    ["Tempo total parado (min)", NUM(summary.reatores.R2?.total_paradas_min, 0)],
    [],
    ["PRODUÇÃO TOTAL", ""],
    ["Bags produzidas", prodStats.total_bags],
    ["Peso total (kg)", NUM(prodStats.total_kg)],
    ["Peso médio por bag (kg)", NUM(prodStats.media_peso_kg)],
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 32 }, { wch: 18 }];
  return ws;
}

function sheetIndicadores(daily: DailyRow[]): XLSX.WorkSheet {
  const rows: Array<Record<string, string | number>> = [];
  for (const d of daily) {
    for (const r of ["R1", "R2"] as const) {
      const rec = d[r];
      if (!rec) continue;
      rows.push({
        Data: d.data,
        Reator: r,
        "Disponibilidade (%)": PCT(rec.disponibilidade),
        "Performance (%)": PCT(rec.performance),
        "OEE (%)": PCT(rec.oee),
        "Operação efetiva (min)": NUM(rec.tempo_operacao_efetiva, 0),
        "Parada não planejada (min)": NUM(rec.tempo_parada_nao_plan, 0),
        "Produção real (kg)": NUM(rec.producao_real),
        "Produção ideal (kg)": NUM(rec.producao_ideal),
      });
    }
  }
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  ws["!cols"] = autoFit(rows, headers);
  return ws;
}

function sheetProducaoDiaria(
  daily: Array<{ data: string; reator: string; total_bags: number; total_kg: number }>,
): XLSX.WorkSheet {
  const rows = daily.map((d) => ({
    Data: d.data,
    Reator: d.reator,
    Bags: d.total_bags,
    "Peso total (kg)": NUM(d.total_kg),
  }));
  const headers = ["Data", "Reator", "Bags", "Peso total (kg)"];
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  ws["!cols"] = autoFit(rows, headers);
  return ws;
}

function sheetBags(bags: BagRow[]): XLSX.WorkSheet {
  const rows = bags.map((b) => ({
    "ID Bag": b.id_bag,
    Timestamp: b.timestamp_production,
    Reator: b.reator_id,
    "Peso (kg)": NUM(b.peso_bag),
  }));
  const headers = ["ID Bag", "Timestamp", "Reator", "Peso (kg)"];
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  ws["!cols"] = autoFit(rows, headers);
  return ws;
}

export async function exportXlsx(
  startDate: string,
  endDate: string,
): Promise<void> {
  const [summary, daily, prodStats, bagsResp, prodDaily] = await Promise.all([
    fetchOeeSummary(startDate, endDate),
    fetchOeeDaily(startDate, endDate),
    fetchProductionStats(startDate, endDate),
    fetchBags(startDate, endDate),
    fetchProductionDaily(startDate, endDate),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    sheetResumo(summary, prodStats, startDate, endDate),
    "Resumo",
  );
  XLSX.utils.book_append_sheet(
    wb,
    sheetIndicadores(daily),
    "Indicadores Diários",
  );
  XLSX.utils.book_append_sheet(
    wb,
    sheetProducaoDiaria(prodDaily),
    "Produção Diária",
  );
  XLSX.utils.book_append_sheet(wb, sheetBags(bagsResp.bags ?? []), "Bags");

  const filename = `planta1_${startDate}_a_${endDate}.xlsx`;
  XLSX.writeFile(wb, filename);
}
