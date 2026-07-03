export type ReactorId = "R1" | "R2";

export interface OeeReactorSummary {
  oee_medio: number;
  disponibilidade_media: number;
  performance_media: number;
  producao_total_kg: number;
  total_paradas_min: number;
  total_operacao_min: number;
  dias_processados: number;
}

export interface OeeSummary {
  periodo: {
    inicio: string;
    fim: string;
  };
  reatores: Record<ReactorId, OeeReactorSummary>;
}

export interface OeeDayRecord {
  oee: number;
  disponibilidade: number;
  performance: number;
  producao_real: number;
  producao_ideal: number;
  tempo_operacao_efetiva: number;
  tempo_parada_nao_plan: number;
}

export interface OeeDaily {
  data: string;
  R1: OeeDayRecord | null;
  R2: OeeDayRecord | null;
}
