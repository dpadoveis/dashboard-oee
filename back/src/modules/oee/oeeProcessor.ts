import {
  buildOeeDaily,
  buildOeeSummary,
} from "../../application/use-cases/oee/oeePresenters.js";
import { OeeCalculator } from "../../domain/services/OeeCalculator.js";
import { makeOeeUseCases } from "../../main/factories/makeOeeUseCases.js";
import { makeRepositories } from "../../main/factories/makeRepositories.js";
import { oeeRules } from "../../main/factories/oeeRules.js";
import type {
  IndicadorDiario,
  ReactorId,
} from "../../types/domain.js";

export function stage3ComputeOee(
  _db: unknown,
  reator: ReactorId,
  date: string,
  tempo_operacao_efetiva: number,
  tempo_parada_nao_plan: number,
): IndicadorDiario {
  const { productionRepository } = makeRepositories();
  const oeeCalculator = new OeeCalculator(oeeRules);
  const producao_real = productionRepository.sumProductionKg(date, reator);

  return oeeCalculator.calculate({
    date,
    reator,
    tempo_operacao_efetiva,
    tempo_parada_nao_plan,
    producao_real,
  });
}

export function processDay(
  _db: unknown,
  reator: ReactorId,
  date: string,
  dryRun = false,
): IndicadorDiario {
  return makeOeeUseCases().processOeeDay.execute({ date, reator, dryRun });
}

export function processAll(_db: unknown, dryRun = false): IndicadorDiario[] {
  return makeOeeUseCases().processAllOee.execute({ dryRun });
}

export function getIndicadoresDiarios(
  _db: unknown,
  startDate?: string,
  endDate?: string,
): IndicadorDiario[] {
  return makeRepositories().oeeRepository.findDailyIndicators({
    startDate,
    endDate,
  });
}

export { buildOeeDaily, buildOeeSummary };
