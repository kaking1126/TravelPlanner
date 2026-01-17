export interface TravelSpot {
  id: string;
  name: string;
  position: [number, number];
  cityId: string;
  description: string;
  imageUrl: string;
}

export const travelSpots: TravelSpot[] = [
  // London
  { id: 'tower-of-london', name: 'Tower of London', position: [51.5081, -0.0759], cityId: 'london', description: 'Historic castle located on the north bank of the River Thames.', imageUrl: 'https://picsum.photos/id/1015/300/200' },
  { id: 'buckingham-palace', name: 'Buckingham Palace', position: [51.5014, -0.1419], cityId: 'london', description: 'The London residence and administrative headquarters of the monarch of the United Kingdom.', imageUrl: 'https://picsum.photos/id/1016/300/200' },
  // Paris
  { id: 'eiffel-tower', name: 'Eiffel Tower', position: [48.8584, 2.2945], cityId: 'paris', description: 'A wrought-iron lattice tower on the Champ de Mars in Paris, France.', imageUrl: 'https://picsum.photos/id/1018/300/200' },
  { id: 'louvre-museum', name: 'Louvre Museum', position: [48.8606, 2.3376], cityId: 'paris', description: 'The world\'s largest art museum and a historic monument in Paris, France.', imageUrl: 'https://picsum.photos/id/1019/300/200' },
  // New York
  { id: 'statue-of-liberty', name: 'Statue of Liberty', position: [40.6892, -74.0445], cityId: 'new-york', description: 'A colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City.', imageUrl: 'https://picsum.photos/id/1021/300/200' },
  { id: 'central-park', name: 'Central Park', position: [40.785091, -73.968285], cityId: 'new-york', description: 'An urban park in New York City located between the Upper West and Upper East Sides of Manhattan.', imageUrl: 'https://picsum.photos/id/1022/300/200' },
  // Tokyo
  { id: 'senso-ji', name: 'Sensō-ji', position: [35.7148, 139.7967], cityId: 'tokyo', description: 'An ancient Buddhist temple located in Asakusa, Tokyo, Japan.', imageUrl: 'https://picsum.photos/id/1025/300/200' },
  { id: 'tokyo-skytree', name: 'Tokyo Skytree', position: [35.7101, 139.8107], cityId: 'tokyo', description: 'A broadcasting and observation tower in Sumida, Tokyo.', imageUrl: 'https://picsum.photos/id/1026/300/200' },
  { id: 'meiji-shrine', name: 'Meiji Shrine', position: [35.6764, 139.6993], cityId: 'tokyo', description: 'A Shinto shrine in Shibuya, Tokyo, that is dedicated to the deified spirits of Emperor Meiji and his wife, Empress Shōken.', imageUrl: 'https://picsum.photos/id/1028/300/200' },
  { id: 'shibuya-crossing', name: 'Shibuya Crossing', position: [35.6595, 139.7005], cityId: 'tokyo', description: 'A popular scrambling intersection in Shibuya, Tokyo, Japan. It is rumored to be the busiest intersection in the world.', imageUrl: 'https://picsum.photos/id/1031/300/200' },
  { id: 'tokyo-imperial-palace', name: 'Tokyo Imperial Palace', position: [35.6852, 139.7528], cityId: 'tokyo', description: 'The primary residence of the Emperor of Japan.', imageUrl: 'https://picsum.photos/id/1032/300/200' },
  { id: 'tsukiji-market', name: 'Tsukiji Market', position: [35.6655, 139.7708], cityId: 'tokyo', description: 'A large wholesale market for fish, fruits and vegetables in central Tokyo.', imageUrl: 'https://picsum.photos/id/1033/300/200' },
];
