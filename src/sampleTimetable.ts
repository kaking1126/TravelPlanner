import { Timetable, TravelMethod } from './timetable';

export const sampleTimetable: Timetable = {
  flight: {
    departureAirport: 'LHR',
    arrivalAirport: 'CDG',
    departureTime: new Date('2024-08-01T10:00:00'),
    arrivalTime: new Date('2024-08-01T12:00:00'),
    flightNumber: 'BA308',
  },
  schedule: [
    {
      date: new Date('2024-08-01'),
      meals: {
        breakfast: [],
        lunch: [{ time: '13:00', activity: 'Lunch near Eiffel Tower' }],
        dinner: [{ time: '19:00', activity: 'Dinner at a local bistro' }],
      },
      activities: [
        { time: '14:00', activity: { from: 'Lunch', to: 'Eiffel Tower', method: TravelMethod.Walk } },
        { time: '14:30', activity: 'Eiffel Tower visit' },
      ],
    },
    {
      date: new Date('2024-08-02'),
      meals: {
        breakfast: [{ time: '09:00', activity: 'Breakfast at the hotel' }],
        lunch: [{ time: '12:30', activity: 'Lunch at a cafe near Louvre' }],
        dinner: [{ time: '20:00', activity: 'Dinner cruise on the Seine' }],
      },
      activities: [
        { time: '10:00', activity: { from: 'Hotel', to: 'Louvre Museum', method: TravelMethod.MTR, route: 'Line 1' } },
        { time: '10:30', activity: 'Louvre Museum visit' },
      ],
    },
  ],
};
