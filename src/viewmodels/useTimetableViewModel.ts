import { useState, useCallback, useEffect } from 'react';
import { Timetable, DayPlan, Session, FlightDetails } from '../timetable';
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

  const onDragEnd = useCallback((result: DropResult, cart: TravelSpot[]) => {
    if (!result.destination || !timetable) return;

    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destId = destination.droppableId; // format: "dayIndex-period-sessionIndex" e.g., "0-morning-0" or "0-breakfast-0"

    // Moving from Cart to Schedule
    if (sourceId === 'cart') {
      const spot = cart[source.index];
      const [dayIdxStr, period, sessionIdxStr] = destId.split('-');
      const dayIndex = parseInt(dayIdxStr, 10);
      const sessionIndex = parseInt(sessionIdxStr, 10);

      const newSchedule = [...timetable.schedule];
      const daySessions = newSchedule[dayIndex].sessions;
      
      // Determine target session
      let targetSession: Session;
      if (['breakfast', 'lunch', 'dinner'].includes(period)) {
         // @ts-ignore
        targetSession = daySessions[period];
      } else {
         // @ts-ignore
        targetSession = daySessions[period][sessionIndex];
      }

      // Add to activities
      // We insert at the specific index if needed, but for now just push or splice
      targetSession.activities.splice(destination.index, 0, spot);

      const newTimetable = { ...timetable, schedule: newSchedule };
      setTimetable(newTimetable);
      updatePlanTimetable(newTimetable);
    } 
    // Reordering within schedule (optional, but good to have)
    else {
        // Implement reorder if source and dest are same session, or move between sessions
        // For simplicity, let's handle "cart to schedule" primarily as per request implicit focus on "adding".
        // But drag and drop usually expects reordering.
        
        // TODO: specific reorder logic if needed. 
        // For now, let's assume Cart -> Schedule is the primary flow. 
        // If the user wants full reorder, we need deeper parsing.
    }
  }, [timetable, updatePlanTimetable]);

  return {
    timetable,
    generateTimetableFromFlight,
    addSessionRow,
    onDragEnd,
  };
};
