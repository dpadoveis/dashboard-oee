import fs from "fs";
import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data", "planta1_dados.db");

let _SQL: SqlJsStatic | null = null;
let _db: Database | null = null;

export type Row = Record<string, unknown>;

export function dbAll<T = Row>(sql: string, params: unknown[] = []): T[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params as any);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

export function dbGet<T = Row>(
  sql: string,
  params: unknown[] = [],
): T | undefined {
  return dbAll<T>(sql, params)[0];
}

export function dbRun(sql: string, params: unknown[] = []): void {
  const db = getDb();
  db.run(sql, params as any);
  persistDb();
}

export function dbTransaction(fn: (db: Database) => void): void {
  const db = getDb();
  db.run("BEGIN");
  try {
    fn(db);
    db.run("COMMIT");
  } catch (err) {
    db.run("ROLLBACK");
    throw err;
  }
  persistDb();
}

export async function initDb(): Promise<void> {
  if (_SQL) return;
  _SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    _db = new _SQL.Database(buf);
  } else {
    _db = new _SQL.Database();
  }
  _db.run("PRAGMA foreign_keys = ON");
}

export function getDb(): Database {
  if (!_db)
    throw new Error("Banco não inicializado. Chame await initDb() primeiro.");
  return _db;
}

export function persistDb(): void {
  if (!_db) return;
  const data = _db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, data);
}

export function closeDb(): void {
  if (_db) {
    persistDb();
    _db.close();
    _db = null;
  }
}

export function createTables(): void {
  const db = getDb();
  db.run(`CREATE TABLE IF NOT EXISTS telemetria_bruta (
    timestamp DATETIME NOT NULL PRIMARY KEY, temp_r1 REAL, temp_r2 REAL,
    silo_weight_r1 REAL, silo_weight_r2 REAL)`);
  db.run(`CREATE TABLE IF NOT EXISTS eventos_ensacamento (
    id_bag TEXT NOT NULL PRIMARY KEY, timestamp_production DATETIME NOT NULL,
    peso_bag REAL NOT NULL, reator_id TEXT NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS telemetria_classificada (
    timestamp DATETIME NOT NULL, reator TEXT NOT NULL, temp REAL, delta_peso REAL,
    temp_ok INTEGER, prod_ok INTEGER, estado TEXT, PRIMARY KEY (timestamp, reator))`);
  db.run(`CREATE TABLE IF NOT EXISTS indicadores_diarios (
    data DATE NOT NULL, reator TEXT NOT NULL, tempo_operacao_efetiva INTEGER NOT NULL,
    tempo_parada_nao_plan INTEGER NOT NULL, producao_real REAL NOT NULL,
    producao_ideal REAL NOT NULL, disponibilidade REAL NOT NULL, performance REAL NOT NULL,
    oee REAL NOT NULL, qualidade REAL NOT NULL DEFAULT 1.0,
    processed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (data, reator))`);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_tel_date ON telemetria_bruta (date(timestamp))`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_bags_date_reator ON eventos_ensacamento (date(timestamp_production), reator_id)`,
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_ind_data ON indicadores_diarios (data)`,
  );
  persistDb();
}

export function resetTables(): void {
  const db = getDb();
  db.run(`
    DROP TABLE IF EXISTS indicadores_diarios;
    DROP TABLE IF EXISTS telemetria_classificada;
    DROP TABLE IF EXISTS eventos_ensacamento;
    DROP TABLE IF EXISTS telemetria_bruta;
  `);
  createTables();
}
