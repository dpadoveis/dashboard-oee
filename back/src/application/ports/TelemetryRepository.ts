import type {
  ClassifiedTelemetryMinute,
  RawTelemetryMinute,
  ReactorId,
  TelemetriaClassificada,
} from "../../domain/entities/oee.js";

export interface TelemetryRepository {
  findAvailableDates(): string[];
  findRawByDateAndReactor(
    date: string,
    reator: ReactorId,
  ): RawTelemetryMinute[];
  saveClassified(
    reator: ReactorId,
    classified: ClassifiedTelemetryMinute[],
  ): void;
  findClassifiedByDateAndReactor(
    date: string,
    reator: ReactorId,
  ): TelemetriaClassificada[];
}
