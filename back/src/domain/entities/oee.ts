export type ReactorId = "R1" | "R2";
export type OperationalState = "P" | "A" | "O" | "I";

export interface RawTelemetryMinute {
  timestamp: string;
  temp: number | null;
  silo_weight: number | null;
}

export interface ClassifiedTelemetryMinute {
  timestamp: string;
  temp: number;
  delta_peso: number;
  temp_ok: 0 | 1;
  prod_ok: 0 | 1;
  estado: OperationalState;
}

export interface TelemetriaClassificada extends ClassifiedTelemetryMinute {
  reator: ReactorId;
}

export interface ProductionBag {
  id_bag: string;
  timestamp_production: string;
  peso_bag: number;
  reator_id: ReactorId;
}

export interface DailyOeeIndicator {
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

export interface OeeRules {
  tempThreshold: number;
  pesoDeltaThreshold: number;
  rollingWindow: number;
  taxaBaseKgPorMin: number;
  tempoPlanejadoDia: number;
  paradaPlanejadaDia: number;
  limiarParada: number;
  qualidade: number;
  bagDropThreshold: number;
}

export const REACTORS: ReactorId[] = ["R1", "R2"];
