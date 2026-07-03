import type { TelemetryRepository } from "../../ports/TelemetryRepository.js";
import type {
  ClassifiedTelemetryMinute,
  ReactorId,
} from "../../../domain/entities/oee.js";
import { TelemetryClassifier } from "../../../domain/services/TelemetryClassifier.js";

export class ClassifyTelemetryUseCase {
  constructor(
    private readonly telemetryRepository: TelemetryRepository,
    private readonly classifier: TelemetryClassifier,
  ) {}

  execute(input: {
    date: string;
    reator: ReactorId;
    dryRun?: boolean;
  }): ClassifiedTelemetryMinute[] {
    const rows = this.telemetryRepository.findRawByDateAndReactor(
      input.date,
      input.reator,
    );
    const classified = this.classifier.classify(input.date, rows);

    if (!input.dryRun) {
      this.telemetryRepository.saveClassified(input.reator, classified);
    }

    return classified;
  }
}
