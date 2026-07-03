import type { ProductionBag, ReactorId } from "../../domain/entities/oee.js";

export interface ProductionRepository {
  findBags(filter: {
    startDate?: string;
    endDate?: string;
    reator?: ReactorId;
  }): ProductionBag[];
  getStats(filter: {
    startDate?: string;
    endDate?: string;
  }): { total_bags: number; total_kg: number; media_peso_kg: number };
  getDailyByReactor(filter: {
    startDate?: string;
    endDate?: string;
  }): Array<{
    data: string;
    reator: string;
    total_bags: number;
    total_kg: number;
  }>;
  sumProductionKg(date: string, reator: ReactorId): number;
}
