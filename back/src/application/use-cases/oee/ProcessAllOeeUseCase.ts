import type { TelemetryRepository } from "../../ports/TelemetryRepository.js";
import type { DailyOeeIndicator } from "../../../domain/entities/oee.js";
import { REACTORS } from "../../../domain/entities/oee.js";
import { ProcessOeeDayUseCase } from "./ProcessOeeDayUseCase.js";

export class ProcessAllOeeUseCase {
  constructor(
    private readonly telemetryRepository: TelemetryRepository,
    private readonly processOeeDay: ProcessOeeDayUseCase,
  ) {}

  execute(input: { dryRun?: boolean } = {}): DailyOeeIndicator[] {
    const dates = this.telemetryRepository.findAvailableDates();
    const results: DailyOeeIndicator[] = [];

    for (const date of dates) {
      for (const reator of REACTORS) {
        results.push(
          this.processOeeDay.execute({
            date,
            reator,
            dryRun: input.dryRun,
          }),
        );
      }
    }

    return results;
  }
}
