import { getJson, toQueryString } from "../../../shared/api/request";
import type {
  BagsResponse,
  DailyProduction,
  ProductionStats,
} from "../types/production";

export function fetchProductionStats(
  startDate?: string,
  endDate?: string,
): Promise<ProductionStats> {
  return getJson<ProductionStats>(
    `/api/production/stats${toQueryString({ startDate, endDate })}`,
  );
}

export function fetchBags(
  startDate?: string,
  endDate?: string,
): Promise<BagsResponse> {
  return getJson<BagsResponse>(
    `/api/production/bags${toQueryString({ startDate, endDate })}`,
  );
}

export function fetchProductionDaily(
  startDate?: string,
  endDate?: string,
): Promise<DailyProduction[]> {
  return getJson<DailyProduction[]>(
    `/api/production/daily${toQueryString({ startDate, endDate })}`,
  );
}
