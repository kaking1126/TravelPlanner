import { CostEstimation } from './costs';

export const sampleCosts: CostEstimation = {
  flights: [
    { name: 'LHR to CDG', cost: 250 },
  ],
  accommodation: [
    { name: 'Hotel in Paris (2 nights)', cost: 400 },
  ],
  activities: [
    { name: 'Eiffel Tower visit', cost: 25 },
    { name: 'Louvre Museum visit', cost: 17 },
  ],
  food: [
    { name: 'Daily food budget', cost: 150 },
  ],
  transportation: [
    { name: 'MTR tickets', cost: 20 },
  ],
  total: 862,
};
