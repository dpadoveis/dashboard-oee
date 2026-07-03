import type { ProductionRepository } from "../../application/ports/ProductionRepository.js";
import type { ProductionBag, ReactorId } from "../../domain/entities/oee.js";
import { dbAll, dbGet } from "../../database/db.js";

export class SqlProductionRepository implements ProductionRepository {
  findBags(filter: {
    startDate?: string;
    endDate?: string;
    reator?: ReactorId;
  }): ProductionBag[] {
    let sql = `SELECT id_bag,timestamp_production,peso_bag,reator_id FROM eventos_ensacamento WHERE 1=1`;
    const params: string[] = [];

    if (filter.startDate) {
      sql += ` AND date(timestamp_production) >= ?`;
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      sql += ` AND date(timestamp_production) <= ?`;
      params.push(filter.endDate);
    }
    if (filter.reator) {
      sql += ` AND reator_id = ?`;
      params.push(filter.reator);
    }

    sql += ` ORDER BY timestamp_production`;
    return dbAll<ProductionBag>(sql, params);
  }

  getStats(filter: { startDate?: string; endDate?: string }): {
    total_bags: number;
    total_kg: number;
    media_peso_kg: number;
  } {
    let sql = `SELECT COUNT(*) AS total_bags, COALESCE(SUM(peso_bag),0) AS total_kg, COALESCE(AVG(peso_bag),0) AS media_peso_kg FROM eventos_ensacamento WHERE 1=1`;
    const params: string[] = [];

    if (filter.startDate) {
      sql += ` AND date(timestamp_production) >= ?`;
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      sql += ` AND date(timestamp_production) <= ?`;
      params.push(filter.endDate);
    }

    return (
      dbGet<{ total_bags: number; total_kg: number; media_peso_kg: number }>(
        sql,
        params,
      ) ?? { total_bags: 0, total_kg: 0, media_peso_kg: 0 }
    );
  }

  getDailyByReactor(filter: {
    startDate?: string;
    endDate?: string;
  }): Array<{
    data: string;
    reator: string;
    total_bags: number;
    total_kg: number;
  }> {
    let sql = `SELECT date(timestamp_production) AS data, reator_id AS reator,
               COUNT(*) AS total_bags, COALESCE(SUM(peso_bag),0) AS total_kg
               FROM eventos_ensacamento WHERE 1=1`;
    const params: string[] = [];

    if (filter.startDate) {
      sql += ` AND date(timestamp_production) >= ?`;
      params.push(filter.startDate);
    }
    if (filter.endDate) {
      sql += ` AND date(timestamp_production) <= ?`;
      params.push(filter.endDate);
    }

    sql += ` GROUP BY data, reator ORDER BY data, reator`;
    return dbAll(sql, params) as Array<{
      data: string;
      reator: string;
      total_bags: number;
      total_kg: number;
    }>;
  }

  sumProductionKg(date: string, reator: ReactorId): number {
    const row = dbGet<{ producao_real: number }>(
      `SELECT COALESCE(SUM(peso_bag), 0.0) AS producao_real
       FROM eventos_ensacamento
       WHERE date(timestamp_production) = ? AND reator_id = ?`,
      [date, reator],
    );

    return row?.producao_real ?? 0;
  }
}
