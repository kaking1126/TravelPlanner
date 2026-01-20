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

export interface ActivityItem {
    id: string;
    title: string;
    location: string;
    remarks?: string;
    spotReference?: TravelSpot; // Keep reference to original spot if applicable
}

export interface Session {
  id: string;
  type: 'breakfast' | 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'night';
  activities: ActivityItem[]; 
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