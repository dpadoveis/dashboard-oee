import type { TelemetryRepository } from "../../ports/TelemetryRepository.js";

export class GetAvailableDatesUseCase {
  constructor(private readonly telemetryRepository: TelemetryRepository) {}

  execute(): string[] {
    return this.telemetryRepository.findAvailableDates();
  }
}
