import type { OeeRepository } from "../../ports/OeeRepository.js";
import type { ProductionRepository } from "../../ports/ProductionRepository.js";
import type { TelemetryRepository } from "../../ports/TelemetryRepository.js";
import type {
  DailyOeeIndicator,
  ReactorId,
} from "../../../domain/entities/oee.js";
import { OeeCalculator } from "../../../domain/services/OeeCalculator.js";
import { StopTimeCalculator } from "../../../domain/services/StopTimeCalculator.js";
import { TelemetryClassifier } from "../../../domain/services/TelemetryClassifier.js";

export class ProcessOeeDayUseCase {
  constructor(
    private readonly telemetryRepository: TelemetryRepository,
    private readonly productionRepository: ProductionRepository,
    private readonly oeeRepository: OeeRepository,
    private readonly telemetryClassifier: TelemetryClassifier,
    private readonly stopTimeCalculator: StopTimeCalculator,
    private readonly oeeCalculator: OeeCalculator,
  ) {}

  execute(input: {
    date: string;
    reator: ReactorId;
    dryRun?: boolean;
  }): DailyOeeIndicator {
    const rawTelemetry = this.telemetryRepository.findRawByDateAndReactor(
      input.date,
      input.reator,
    );
    const classified = this.telemetryClassifier.classify(
      input.date,
      rawTelemetry,
    );
    const stopTimes = this.stopTimeCalculator.calculate(classified);
    const producao_real = this.productionRepository.sumProductionKg(
      input.date,
      input.reator,
    );
    const indicator = this.oeeCalculator.calculate({
      date: input.date,
      reator: input.reator,
      producao_real,
      ...stopTimes,
    });

    if (!input.dryRun) {
      this.telemetryRepository.saveClassified(input.reator, classified);
      this.oeeRepository.saveDailyIndicator(indicator);
    }

    return indicator;
  }
}
