import type { OeeRepository } from "../../ports/OeeRepository.js";
import type { OeeSummaryResponse } from "../../../types/domain.js";
import { buildOeeSummary } from "./oeePresenters.js";

export class GetOeeSummaryUseCase {
  constructor(private readonly oeeRepository: OeeRepository) {}

  execute(filter: { startDate?: string; endDate?: string }): OeeSummaryResponse {
    return buildOeeSummary(this.oeeRepository.findDailyIndicators(filter));
  }
}
