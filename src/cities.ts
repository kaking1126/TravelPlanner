export interface City {
  id: string;
  name: string;
  position: [number, number];
  country: string;
}

export const cities: City[] = [
  { id: 'london', name: 'London', position: [51.5074, -0.1278], country: 'United Kingdom' },
  { id: 'paris', name: 'Paris', position: [48.8566, 2.3522], country: 'France' },
  { id: 'new-york', name: 'New York', position: [40.7128, -74.0060], country: 'USA' },
  { id: 'tokyo', name: 'Tokyo', position: [35.6895, 139.6917], country: 'Japan' },
];
