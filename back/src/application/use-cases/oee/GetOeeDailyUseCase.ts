import type { OeeRepository } from "../../ports/OeeRepository.js";
import type { OeeDailyResponse } from "../../../types/domain.js";
import { buildOeeDaily } from "./oeePresenters.js";

export class GetOeeDailyUseCase {
  constructor(private readonly oeeRepository: OeeRepository) {}

  execute(filter: { startDate?: string; endDate?: string }): OeeDailyResponse[] {
    return buildOeeDaily(this.oeeRepository.findDailyIndicators(filter));
  }
}
