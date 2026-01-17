export interface CostItem {
  name: string;
  cost: number;
}

export interface CostEstimation {
  flights: CostItem[];
  accommodation: CostItem[];
  activities: CostItem[];
  food: CostItem[];
  transportation: CostItem[];
  total: number;
}
