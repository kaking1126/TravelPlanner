import React from 'react';
import { CostEstimation } from '../costs';

interface CostEstimationProps {
  costEstimation: CostEstimation;
}

const CostEstimationComponent: React.FC<CostEstimationProps> = ({ costEstimation }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Cost Estimation</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-text-secondary">Flights</h3>
          <ul>
            {costEstimation.flights.map((item, index) => (
              <li key={index}>{item.name}: ${item.cost}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-secondary">Accommodation</h3>
          <ul>
            {costEstimation.accommodation.map((item, index) => (
              <li key={index}>{item.name}: ${item.cost}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-secondary">Activities</h3>
          <ul>
            {costEstimation.activities.map((item, index) => (
              <li key={index}>{item.name}: ${item.cost}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-secondary">Food</h3>
          <ul>
            {costEstimation.food.map((item, index) => (
              <li key={index}>{item.name}: ${item.cost}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-secondary">Transportation</h3>
          <ul>
            {costEstimation.transportation.map((item, index) => (
              <li key={index}>{item.name}: ${item.cost}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 text-2xl font-bold">
        Total: ${costEstimation.total}
      </div>
    </div>
  );
};

export default CostEstimationComponent;
