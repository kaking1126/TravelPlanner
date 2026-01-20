import { useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plan } from '../timetable';
import { v4 as uuidv4 } from 'uuid';

export const usePlanListViewModel = () => {
  const [plans, setPlans] = useLocalStorage<Plan[]>('travel-plans', []);

  const addPlan = useCallback(() => {
    const newPlan: Plan = {
      id: uuidv4(),
      title: `Trip to somewhere ${plans.length + 1}`,
      createdAt: new Date().toISOString(),
      timetable: null,
      cart: [],
    };
    setPlans((prev) => [...prev, newPlan]);
  }, [plans, setPlans]);

  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, [setPlans]);

  const updatePlan = useCallback((updatedPlan: Plan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  }, [setPlans]);

  return {
    plans,
    addPlan,
    deletePlan,
    updatePlan,
  };
};