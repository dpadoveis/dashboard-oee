import { makeProductionUseCases } from "../../main/factories/makeProductionUseCases.js";
import type { ProductionBag, ReactorId } from "../../domain/entities/oee.js";

export function getBags(
  _db: unknown,
  startDate?: string,
  endDate?: string,
  reator?: ReactorId,
): ProductionBag[] {
  return makeProductionUseCases().getBags.execute({
    startDate,
    endDate,
    reator,
  });
}

export function getBagStats(
  _db: unknown,
  startDate?: string,
  endDate?: string,
): { total_bags: number; total_kg: number; media_peso_kg: number } {
  return makeProductionUseCases().getProductionStats.execute({
    startDate,
    endDate,
  });
}

export function getDailyProductionByReactor(
  _db: unknown,
  startDate?: string,
  endDate?: string,
): Array<{
  data: string;
  reator: string;
  total_bags: number;
  total_kg: number;
}> {
  return makeProductionUseCases().getDailyProduction.execute({
    startDate,
    endDate,
  });
}
