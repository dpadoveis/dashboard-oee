import type { ProductionRepository } from "../../ports/ProductionRepository.js";

export class GetProductionStatsUseCase {
  constructor(private readonly productionRepository: ProductionRepository) {}

  execute(filter: { startDate?: string; endDate?: string }): {
    total_bags: number;
    total_kg: number;
    media_peso_kg: number;
  } {
    return this.productionRepository.getStats(filter);
  }
}
