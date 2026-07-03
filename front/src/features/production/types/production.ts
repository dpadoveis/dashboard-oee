export interface ProductionStats {
  total_bags: number;
  total_kg: number;
  media_peso_kg: number;
}

export interface ProductionBag {
  id_bag: string;
  timestamp_production: string;
  peso_bag: number;
  reator_id: "R1" | "R2";
}

export interface BagsResponse {
  total_bags: number;
  total_kg: number;
  bags: ProductionBag[];
}

export interface DailyProduction {
  data: string;
  reator: string;
  total_bags: number;
  total_kg: number;
}
