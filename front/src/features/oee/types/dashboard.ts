import type { OeeDaily, OeeSummary } from "./oee";
import type { ProductionStats } from "../../production/types/production";

export interface DashboardData {
  summary: OeeSummary;
  daily: OeeDaily[];
  prodStats: ProductionStats;
}
