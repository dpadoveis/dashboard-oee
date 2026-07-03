import type { ProductionRepository } from "../../ports/ProductionRepository.js";
import type { ProductionBag, ReactorId } from "../../../domain/entities/oee.js";

export class GetBagsUseCase {
  constructor(private readonly productionRepository: ProductionRepository) {}

  execute(filter: {
    startDate?: string;
    endDate?: string;
    reator?: ReactorId;
  }): ProductionBag[] {
    return this.productionRepository.findBags(filter);
  }
}
