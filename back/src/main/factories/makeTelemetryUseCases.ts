import { TelemetryClassifier } from "../../domain/services/TelemetryClassifier.js";
import { ClassifyTelemetryUseCase } from "../../application/use-cases/telemetry/ClassifyTelemetryUseCase.js";
import { GetAvailableDatesUseCase } from "../../application/use-cases/telemetry/GetAvailableDatesUseCase.js";
import { GetClassifiedTelemetryUseCase } from "../../application/use-cases/telemetry/GetClassifiedTelemetryUseCase.js";
import { makeRepositories } from "./makeRepositories.js";
import { oeeRules } from "./oeeRules.js";

export function makeTelemetryUseCases() {
  const { telemetryRepository } = makeRepositories();
  const telemetryClassifier = new TelemetryClassifier(oeeRules);

  return {
    classifyTelemetry: new ClassifyTelemetryUseCase(
      telemetryRepository,
      telemetryClassifier,
    ),
    getAvailableDates: new GetAvailableDatesUseCase(telemetryRepository),
    getClassifiedTelemetry: new GetClassifiedTelemetryUseCase(
      telemetryRepository,
    ),
  };
}
