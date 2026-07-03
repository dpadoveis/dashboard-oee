import { GetOeeDailyUseCase } from "../../application/use-cases/oee/GetOeeDailyUseCase.js";
import { GetOeeSummaryUseCase } from "../../application/use-cases/oee/GetOeeSummaryUseCase.js";
import { ProcessAllOeeUseCase } from "../../application/use-cases/oee/ProcessAllOeeUseCase.js";
import { ProcessOeeDayUseCase } from "../../application/use-cases/oee/ProcessOeeDayUseCase.js";
import { OeeCalculator } from "../../domain/services/OeeCalculator.js";
import { StopTimeCalculator } from "../../domain/services/StopTimeCalculator.js";
import { TelemetryClassifier } from "../../domain/services/TelemetryClassifier.js";
import { makeRepositories } from "./makeRepositories.js";
import { oeeRules } from "./oeeRules.js";

export function makeOeeUseCases() {
  const { telemetryRepository, productionRepository, oeeRepository } =
    makeRepositories();
  const telemetryClassifier = new TelemetryClassifier(oeeRules);
  const stopTimeCalculator = new StopTimeCalculator(oeeRules);
  const oeeCalculator = new OeeCalculator(oeeRules);
  const processOeeDay = new ProcessOeeDayUseCase(
    telemetryRepository,
    productionRepository,
    oeeRepository,
    telemetryClassifier,
    stopTimeCalculator,
    oeeCalculator,
  );

  return {
    getOeeSummary: new GetOeeSummaryUseCase(oeeRepository),
    getOeeDaily: new GetOeeDailyUseCase(oeeRepository),
    processOeeDay,
    processAllOee: new ProcessAllOeeUseCase(
      telemetryRepository,
      processOeeDay,
    ),
  };
}
