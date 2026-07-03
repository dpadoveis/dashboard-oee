import { getJson, toQueryString } from "../../../shared/api/request";
import type { OeeDaily, OeeSummary } from "../types/oee";

export function fetchOeeSummary(
  startDate?: string,
  endDate?: string,
): Promise<OeeSummary> {
  return getJson<OeeSummary>(
    `/api/oee/summary${toQueryString({ startDate, endDate })}`,
  );
}

export function fetchOeeDaily(
  startDate?: string,
  endDate?: string,
): Promise<OeeDaily[]> {
  return getJson<OeeDaily[]>(
    `/api/oee/daily${toQueryString({ startDate, endDate })}`,
  );
}
