import type { ProductionRepository } from "../../ports/ProductionRepository.js";

export class GetDailyProductionUseCase {
  constructor(private readonly productionRepository: ProductionRepository) {}

  execute(filter: { startDate?: string; endDate?: string }): Array<{
    data: string;
    reator: string;
    total_bags: number;
    total_kg: number;
  }> {
    return this.productionRepository.getDailyByReactor(filter);
  }
}
