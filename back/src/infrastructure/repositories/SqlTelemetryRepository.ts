import { Database } from "sql.js";
import type { TelemetryRepository } from "../../application/ports/TelemetryRepository.js";
import type {
  ClassifiedTelemetryMinute,
  RawTelemetryMinute,
  ReactorId,
  TelemetriaClassificada,
} from "../../domain/entities/oee.js";
import { dbAll, dbTransaction } from "../../database/db.js";

export class SqlTelemetryRepository implements TelemetryRepository {
  findAvailableDates(): string[] {
    return dbAll<{ d: string }>(
      `SELECT DISTINCT date(timestamp) AS d FROM telemetria_bruta ORDER BY d`,
    ).map((row) => row.d);
  }

  findRawByDateAndReactor(
    date: string,
    reator: ReactorId,
  ): RawTelemetryMinute[] {
    const reactorColumn = reator.toLowerCase();
    return dbAll<RawTelemetryMinute>(
      `SELECT timestamp, temp_${reactorColumn} AS temp, silo_weight_${reactorColumn} AS silo_weight
       FROM telemetria_bruta WHERE date(timestamp) = ? ORDER BY timestamp`,
      [date],
    );
  }

  saveClassified(
    reator: ReactorId,
    classified: ClassifiedTelemetryMinute[],
  ): void {
    dbTransaction((db: Database) => {
      const stmt = db.prepare(
        `INSERT OR REPLACE INTO telemetria_classificada
         (timestamp, reator, temp, delta_peso, temp_ok, prod_ok, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      );

      for (const minute of classified) {
        stmt.run([
          minute.timestamp,
          reator,
          minute.temp,
          minute.delta_peso,
          minute.temp_ok,
          minute.prod_ok,
          minute.estado,
        ]);
      }

      stmt.free();
    });
  }

  findClassifiedByDateAndReactor(
    date: string,
    reator: ReactorId,
  ): TelemetriaClassificada[] {
    return dbAll<TelemetriaClassificada>(
      `SELECT timestamp, reator, temp, delta_peso, temp_ok, prod_ok, estado
       FROM telemetria_classificada
       WHERE date(timestamp) = ? AND reator = ? ORDER BY timestamp`,
      [date, reator],
    );
  }
}
