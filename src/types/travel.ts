export type TransportMode = 'flight' | 'train' | 'bus';

export interface City {
  id: string;
  name: string;
  code: string;
  state: string;
  popular: boolean;
}

export interface SearchParams {
  origin: City | null;
  destination: City | null;
  departureDate: Date | null;
  returnDate: Date | null;
  transportMode: TransportMode;
  tripType: 'one-way' | 'round-trip';
  // Optional preference hint for AI recommendations. When set to 'cheapest',
  // the AI will prefer recommending the lowest-price option.
  prefer?: 'cheapest' | 'fastest' | 'balanced';
}

export interface TravelOption {
  id: string;
  provider: string;
  transportMode: TransportMode;
  departure: {
    time: string;
    location: string;
  };
  arrival: {
    time: string;
    location: string;
  };
  duration: string;
  price: number;
  currency: string;
  seats: number;
  amenities: string[];
  score: number; // AI recommendation score
}

export interface SearchResults {
  options: TravelOption[];
  recommendations: {
    best: TravelOption;
    cheapest: TravelOption;
    fastest: TravelOption;
  };
  priceStats: {
    lowest: number;
    average: number;
    highest: number;
  };
}
