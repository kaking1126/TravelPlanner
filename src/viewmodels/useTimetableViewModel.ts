import { useState, useCallback, useEffect } from 'react';
import { Timetable, DayPlan, Session, FlightDetails, ActivityItem } from '../timetable';
import { v4 as uuidv4 } from 'uuid';
import { DropResult } from 'react-beautiful-dnd';
import { TravelSpot } from '../spots';

const createEmptySession = (type: Session['type']): Session => ({
  id: uuidv4(),
  type,
  activities: [],
});

const createEmptyDay = (date: Date): DayPlan => ({
  date: date.toISOString(),
  sessions: {
    breakfast: createEmptySession('breakfast'),
    morning: [createEmptySession('morning')],
    lunch: createEmptySession('lunch'),
    afternoon: [createEmptySession('afternoon')],
    dinner: createEmptySession('dinner'),
    night: [createEmptySession('night')],
  },
});

export const useTimetableViewModel = (
  initialTimetable: Timetable | null,
  updatePlanTimetable: (t: Timetable) => void
) => {
  const [timetable, setTimetable] = useState<Timetable | null>(initialTimetable);

  useEffect(() => {
    setTimetable(initialTimetable);
  }, [initialTimetable]);

  const generateTimetableFromFlight = useCallback((flight: { arrival: FlightDetails, departure: FlightDetails }) => {
    const arrival = new Date(flight.arrival.arrivalTime);
    const departure = new Date(flight.departure.departureTime);
    const days: DayPlan[] = [];
    let currentDate = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate());
    const endDate = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate());

    while (currentDate <= endDate) {
      days.push(createEmptyDay(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const newTimetable: Timetable = {
      flight,
      schedule: days,
    };
    setTimetable(newTimetable);
    updatePlanTimetable(newTimetable);
  }, [updatePlanTimetable]);

  const addSessionRow = useCallback((dayIndex: number, period: 'morning' | 'afternoon' | 'night') => {
    if (!timetable) return;
    const newSchedule = [...timetable.schedule];
    newSchedule[dayIndex].sessions[period].push(createEmptySession(period));
    
    const newTimetable = { ...timetable, schedule: newSchedule };
    setTimetable(newTimetable);
    updatePlanTimetable(newTimetable);
  }, [timetable, updatePlanTimetable]);

  const updateActivity = useCallback((dayIndex: number, period: string, sessionIndex: number, activityIndex: number, updates: Partial<ActivityItem>) => {
      if (!timetable) return;
      const newSchedule = [...timetable.schedule];
      const daySessions = newSchedule[dayIndex].sessions;
      
      let targetSession: Session;
      if (['breakfast', 'lunch', 'dinner'].includes(period)) {
         // @ts-ignore
        targetSession = daySessions[period];
      } else {
         // @ts-ignore
        targetSession = daySessions[period][sessionIndex];
      }

      if (targetSession && targetSession.activities[activityIndex]) {
          targetSession.activities[activityIndex] = { ...targetSession.activities[activityIndex], ...updates };
          const newTimetable = { ...timetable, schedule: newSchedule };
          setTimetable(newTimetable);
          updatePlanTimetable(newTimetable);
      }
  }, [timetable, updatePlanTimetable]);

  const onDragEnd = useCallback((result: DropResult, cart: TravelSpot[]) => {
    if (!result.destination || !timetable) return;

    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destId = destination.droppableId; 

    // Moving from Cart to Schedule
    if (sourceId === 'cart') {
      const spot = cart[source.index];
      const [dayIdxStr, period, sessionIdxStr] = destId.split('-');
      const dayIndex = parseInt(dayIdxStr, 10);
      const sessionIndex = parseInt(sessionIdxStr, 10);

      const newSchedule = [...timetable.schedule];
      const daySessions = newSchedule[dayIndex].sessions;
      
      let targetSession: Session;
      if (['breakfast', 'lunch', 'dinner'].includes(period)) {
         // @ts-ignore
        targetSession = daySessions[period];
      } else {
         // @ts-ignore
        targetSession = daySessions[period][sessionIndex];
      }

      // Create new ActivityItem from TravelSpot
      const newActivity: ActivityItem = {
          id: uuidv4(),
          title: spot.name,
          location: spot.cityId, // Using city ID or name as broad location, coordinates are in spotReference
          remarks: '',
          spotReference: spot
      };

      targetSession.activities.splice(destination.index, 0, newActivity);

      const newTimetable = { ...timetable, schedule: newSchedule };
      setTimetable(newTimetable);
      updatePlanTimetable(newTimetable);
    } 
  }, [timetable, updatePlanTimetable]);

  return {
    timetable,
    generateTimetableFromFlight,
    addSessionRow,
    updateActivity,
    onDragEnd,
  };
};
