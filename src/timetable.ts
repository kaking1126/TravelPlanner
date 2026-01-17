import { TravelSpot } from "./spots";

export interface FlightDetails {
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
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
  route?: string; // For bus or MTR
}

export interface DayActivity {
  time: string;
  activity: string | TravelSpot | TravelPlan;
}

export interface DayPlan {
  date: Date;
  meals: {
    breakfast: DayActivity[];
    lunch: DayActivity[];
    dinner: DayActivity[];
  };
  activities: DayActivity[];
}

export interface Timetable {
  flight: FlightDetails;
  schedule: DayPlan[];
}
