import type { OeeRepository } from "../../application/ports/OeeRepository.js";
import type { DailyOeeIndicator } from "../../domain/entities/oee.js";
import { dbAll, dbRun } from "../../database/db.js";

export class SqlOeeRepository implements OeeRepository {
  findDailyIndicators(filter: {
    startDate?: string;
    endDate?: string;
  }): DailyOeeIndicator[] {
    let sql = `SELECT * FROM indicadores_diarios WHERE 1=1`;
    const params: string[] = [];

    if (filter.startDate) {
      sql += ` AND data >= ?`;
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      sql += ` AND data <= ?`;
      params.push(filter.endDate);
    }

    sql += ` ORDER BY data, reator`;
    return dbAll<DailyOeeIndicator>(sql, params);
  }

  saveDailyIndicator(indicator: DailyOeeIndicator): void {
    dbRun(
      `INSERT OR REPLACE INTO indicadores_diarios
         (data,reator,tempo_operacao_efetiva,tempo_parada_nao_plan,
          producao_real,producao_ideal,disponibilidade,performance,oee,qualidade,processed_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        indicator.data,
        indicator.reator,
        indicator.tempo_operacao_efetiva,
        indicator.tempo_parada_nao_plan,
        indicator.producao_real,
        indicator.producao_ideal,
        indicator.disponibilidade,
        indicator.performance,
        indicator.oee,
        indicator.qualidade,
        indicator.processed_at,
      ],
    );
  }
}
