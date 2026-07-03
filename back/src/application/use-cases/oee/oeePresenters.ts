import type {
  DailyOeeIndicator,
  ReactorId,
} from "../../../domain/entities/oee.js";
import type {
  OeeDailyResponse,
  OeeSummaryResponse,
} from "../../../types/domain.js";

export function buildOeeSummary(
  indicators: DailyOeeIndicator[],
): OeeSummaryResponse {
  const byReactor = (id: ReactorId) =>
    indicators.filter((indicator) => indicator.reator === id);

  const aggregate = (rows: DailyOeeIndicator[]) => {
    if (!rows.length) {
      return {
        oee_medio: 0,
        disponibilidade_media: 0,
        performance_media: 0,
        producao_total_kg: 0,
        total_paradas_min: 0,
        total_operacao_min: 0,
        dias_processados: 0,
      };
    }

    const avg = (values: number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      oee_medio: avg(rows.map((row) => row.oee)),
      disponibilidade_media: avg(rows.map((row) => row.disponibilidade)),
      performance_media: avg(rows.map((row) => row.performance)),
      producao_total_kg: rows.reduce(
        (sum, row) => sum + row.producao_real,
        0,
      ),
      total_paradas_min: rows.reduce(
        (sum, row) => sum + row.tempo_parada_nao_plan,
        0,
      ),
      total_operacao_min: rows.reduce(
        (sum, row) => sum + row.tempo_operacao_efetiva,
        0,
      ),
      dias_processados: rows.length,
    };
  };

  const allDates = [...new Set(indicators.map((indicator) => indicator.data))].sort();

  return {
    periodo: {
      inicio: allDates[0] ?? "",
      fim: allDates[allDates.length - 1] ?? "",
    },
    reatores: {
      R1: aggregate(byReactor("R1")),
      R2: aggregate(byReactor("R2")),
    },
  };
}

export function buildOeeDaily(
  indicators: DailyOeeIndicator[],
): OeeDailyResponse[] {
  const byDate = new Map<string, DailyOeeIndicator[]>();

  for (const indicator of indicators) {
    if (!byDate.has(indicator.data)) byDate.set(indicator.data, []);
    byDate.get(indicator.data)!.push(indicator);
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, rows]) => {
      const r1 = rows.find((row) => row.reator === "R1");
      const r2 = rows.find((row) => row.reator === "R2");
      const toRecord = (row: DailyOeeIndicator | undefined) =>
        row
          ? {
              oee: row.oee,
              disponibilidade: row.disponibilidade,
              performance: row.performance,
              producao_real: row.producao_real,
              producao_ideal: row.producao_ideal,
              tempo_operacao_efetiva: row.tempo_operacao_efetiva,
              tempo_parada_nao_plan: row.tempo_parada_nao_plan,
            }
          : null;

      return { data, R1: toRecord(r1), R2: toRecord(r2) };
    });
}
