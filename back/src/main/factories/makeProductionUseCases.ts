import { GetBagsUseCase } from "../../application/use-cases/production/GetBagsUseCase.js";
import { GetDailyProductionUseCase } from "../../application/use-cases/production/GetDailyProductionUseCase.js";
import { GetProductionStatsUseCase } from "../../application/use-cases/production/GetProductionStatsUseCase.js";
import { makeRepositories } from "./makeRepositories.js";

export function makeProductionUseCases() {
  const { productionRepository } = makeRepositories();

  return {
    getBags: new GetBagsUseCase(productionRepository),
    getProductionStats: new GetProductionStatsUseCase(productionRepository),
    getDailyProduction: new GetDailyProductionUseCase(productionRepository),
  };
}
