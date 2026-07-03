import { StopTimeCalculator } from "../../domain/services/StopTimeCalculator.js";
import { makeTelemetryUseCases } from "../../main/factories/makeTelemetryUseCases.js";
import { oeeRules } from "../../main/factories/oeeRules.js";
import type {
  ClassifiedTelemetryMinute,
  ReactorId,
  TelemetriaClassificada,
} from "../../domain/entities/oee.js";

export function stage1ClassifyTelemetry(
  _db: unknown,
  reator: ReactorId,
  date: string,
  dryRun = false,
): ClassifiedTelemetryMinute[] {
  return makeTelemetryUseCases().classifyTelemetry.execute({
    date,
    reator,
    dryRun,
  });
}

export function stage2ComputeStopTimes(
  classified: ClassifiedTelemetryMinute[],
): {
  tempo_operacao_efetiva: number;
  tempo_parada_nao_plan: number;
} {
  return new StopTimeCalculator(oeeRules).calculate(classified);
}

export function getTelemetryClassified(
  _db: unknown,
  date: string,
  reator: ReactorId,
): TelemetriaClassificada[] {
  return makeTelemetryUseCases().getClassifiedTelemetry.execute({
    date,
    reator,
  });
}

export function getAvailableDates(_db: unknown): string[] {
  return makeTelemetryUseCases().getAvailableDates.execute();
}
