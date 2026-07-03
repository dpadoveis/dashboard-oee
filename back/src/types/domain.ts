export type ReactorId = "R1" | "R2";
export type OperationalState = "P" | "A" | "O" | "I";

export interface TelemetriaRow {
  timestamp: string;
  temp_r1: number;
  temp_r2: number;
  silo_weight_r1: number;
  silo_weight_r2: number;
}

export interface EventoEnsacamento {
  id_bag: string;
  timestamp_production: string;
  peso_bag: number;
  reator_id: ReactorId;
}

export interface IndicadorDiario {
  data: string;
  reator: ReactorId;
  tempo_operacao_efetiva: number;
  tempo_parada_nao_plan: number;
  producao_real: number;
  producao_ideal: number;
  disponibilidade: number;
  performance: number;
  oee: number;
  qualidade: number;
  processed_at: string;
}

export interface TelemetriaClassificada {
  timestamp: string;
  reator: ReactorId;
  temp: number;
  delta_peso: number;
  temp_ok: 0 | 1;
  prod_ok: 0 | 1;
  estado: OperationalState;
}

export interface OeeSummaryResponse {
  periodo: { inicio: string; fim: string };
  reatores: {
    [K in ReactorId]: {
      oee_medio: number;
      disponibilidade_media: number;
      performance_media: number;
      producao_total_kg: number;
      total_paradas_min: number;
      total_operacao_min: number;
      dias_processados: number;
    };
  };
}

export interface OeeDailyResponse {
  data: string;
  R1: OeeDayRecord | null;
  R2: OeeDayRecord | null;
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

export interface BagsResponse {
  total_bags: number;
  total_kg: number;
  bags: EventoEnsacamento[];
}
