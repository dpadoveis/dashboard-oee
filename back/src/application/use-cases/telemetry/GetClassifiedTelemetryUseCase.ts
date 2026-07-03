import type { TelemetryRepository } from "../../ports/TelemetryRepository.js";
import type {
  ReactorId,
  TelemetriaClassificada,
} from "../../../domain/entities/oee.js";

export class GetClassifiedTelemetryUseCase {
  constructor(private readonly telemetryRepository: TelemetryRepository) {}

  execute(input: {
    date: string;
    reator: ReactorId;
  }): TelemetriaClassificada[] {
    return this.telemetryRepository.findClassifiedByDateAndReactor(
      input.date,
      input.reator,
    );
  }
}
