import { TravelSpot } from "./spots";

export interface FlightDetails {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string; 
  arrivalTime: string;
  flightNumber: string;
}

export enum TravelMethod {
  Walk = 'Walk',
  Bus = 'Bus',
  MTR = 'MTR',
  Taxi = 'Taxi',
}

export interface TravelPlan {
  from: string | TravelSpot;
  to: string | TravelSpot;
  method: TravelMethod;
  route?: string;
}

export interface Session {
  id: string;
  type: 'breakfast' | 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'night';
  activities: (TravelSpot | string)[]; 
}

export interface DayPlan {
  date: string; 
  sessions: {
    breakfast: Session;
    morning: Session[];
    lunch: Session;
    afternoon: Session[];
    dinner: Session;
    night: Session[];
  };
}

export interface Timetable {
  flight: { arrival: FlightDetails, departure: FlightDetails };
  schedule: DayPlan[];
}

export interface Plan {
  id: string;
  title: string;
  createdAt: string;
  timetable: Timetable | null;
  cart: TravelSpot[];
}
