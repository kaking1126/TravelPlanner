export interface City {
  id: string;
  name: string;
  position: [number, number];
  description: string;
  imageUrl: string;
}

export const cities: City[] = [
  {
    id: 'london',
    name: 'London',
    position: [51.5074, -0.1278],
    description: 'The capital of England and the United Kingdom.',
    imageUrl: 'https://picsum.photos/id/1015/300/200'
  },
  {
    id: 'paris',
    name: 'Paris',
    position: [48.8566, 2.3522],
    description: "France's capital, a major European city and a global center for art, fashion, gastronomy and culture.",
    imageUrl: 'https://picsum.photos/id/1018/300/200'
  },
  {
    id: 'new-york',
    name: 'New York',
    position: [40.7128, -74.0060],
    description: 'An iconic city that never sleeps, known for its skyline, Broadway, and diverse culture.',
    imageUrl: 'https://picsum.photos/id/1021/300/200'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    position: [35.6762, 139.6503],
    description: "Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.",
    imageUrl: 'https://picsum.photos/id/1025/300/200'
  }
];