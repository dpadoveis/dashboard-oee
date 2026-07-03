import type { DailyOeeIndicator } from "../../domain/entities/oee.js";

export interface OeeRepository {
  findDailyIndicators(filter: {
    startDate?: string;
    endDate?: string;
  }): DailyOeeIndicator[];
  saveDailyIndicator(indicator: DailyOeeIndicator): void;
}
