import { SqlOeeRepository } from "../../infrastructure/repositories/SqlOeeRepository.js";
import { SqlProductionRepository } from "../../infrastructure/repositories/SqlProductionRepository.js";
import { SqlTelemetryRepository } from "../../infrastructure/repositories/SqlTelemetryRepository.js";

export function makeRepositories() {
  const telemetryRepository = new SqlTelemetryRepository();
  const productionRepository = new SqlProductionRepository();
  const oeeRepository = new SqlOeeRepository();

  return {
    telemetryRepository,
    productionRepository,
    oeeRepository,
  };
}
