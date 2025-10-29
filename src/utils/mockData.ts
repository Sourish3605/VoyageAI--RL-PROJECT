import { SearchResults, TravelOption, SearchParams, TransportMode } from '@/types/travel';

const PROVIDERS = {
  flight: ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'Go First'],
  train: ['Rajdhani Express', 'Shatabdi Express', 'Duronto Express', 'Garib Rath', 'Humsafar Express'],
  bus: ['RedBus', 'AbhiBus', 'VRL Travels', 'Orange Travels', 'SRS Travels'],
};

const AMENITIES = {
  flight: ['WiFi', 'Meals', 'Entertainment', 'Power Outlets'],
  train: ['AC', 'Meals', 'Blankets', 'Charging Points'],
  bus: ['AC', 'WiFi', 'Water', 'Charging Points', 'Sleeper'],
};

// Calculate days until departure
const getDaysUntilDeparture = (departureDate: Date | null): number => {
  if (!departureDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(departureDate);
  departure.setHours(0, 0, 0, 0);
  return Math.floor((departure.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Calculate price multiplier based on transport mode and days until departure
const getPriceMultiplier = (transportMode: TransportMode, daysUntil: number): number => {
  if (daysUntil < 0) return 1;
  
  if (transportMode === 'flight') {
    // Flights: High prices for next 5 days, then decrease
    if (daysUntil <= 5) {
      return 1.5 + (5 - daysUntil) * 0.15; // 1.5x to 2.25x (increases as date gets closer)
    } else if (daysUntil <= 10) {
      return 1.2 + (10 - daysUntil) * 0.06; // 1.2x to 1.5x (gradually increases)
    } else {
      return 0.9 + Math.random() * 0.3; // 0.9x to 1.2x (cheapest)
    }
  } else if (transportMode === 'train') {
    // Trains: Moderate increase for next 5 days, stable after
    if (daysUntil <= 5) {
      return 1.3 + (5 - daysUntil) * 0.08; // 1.3x to 1.7x
    } else if (daysUntil <= 10) {
      return 1.15 + (10 - daysUntil) * 0.03; // 1.15x to 1.3x
    } else {
      return 1.0 + Math.random() * 0.15; // 1.0x to 1.15x
    }
  } else {
    // Bus: Slight increase for next 5 days, then decrease
    if (daysUntil <= 5) {
      return 1.2 + (5 - daysUntil) * 0.06; // 1.2x to 1.5x
    } else if (daysUntil <= 10) {
      return 1.1 + (10 - daysUntil) * 0.02; // 1.1x to 1.2x
    } else {
      return 0.95 + Math.random() * 0.15; // 0.95x to 1.1x
    }
  }
};

// Generate realistic travel times and prices based on distance
const generateTravelData = (params: SearchParams): TravelOption[] => {
  const options: TravelOption[] = [];
  // Use transport-mode-specific base price ranges so flights are consistently more expensive
  let basePrice: number;
  if (params.transportMode === 'flight') {
    // Flights: base between 3000-6000
    basePrice = Math.random() * 3000 + 3000;
  } else if (params.transportMode === 'train') {
    // Trains: base between 1500-3500
    basePrice = Math.random() * 2000 + 1500;
  } else {
    // Buses: base between 800-2000
    basePrice = Math.random() * 1200 + 800;
  }
  const providers = PROVIDERS[params.transportMode];
  const amenities = AMENITIES[params.transportMode];
  const daysUntil = getDaysUntilDeparture(params.departureDate);
  const priceMultiplier = getPriceMultiplier(params.transportMode, daysUntil);
  
  for (let i = 0; i < 8; i++) {
    const departureHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
    const durationHours = params.transportMode === 'flight' ? 1 + Math.random() * 2 : 4 + Math.random() * 8;
    const price = Math.round(basePrice * priceMultiplier * (0.7 + Math.random() * 0.6));
    const arrivalHour = (departureHour + Math.floor(durationHours)) % 24;
    
    options.push({
      id: `${params.transportMode}-${i}`,
      provider: providers[i % providers.length],
      transportMode: params.transportMode,
      departure: {
        time: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        location: params.origin?.name || '',
      },
      arrival: {
        time: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        location: params.destination?.name || '',
      },
      duration: `${Math.floor(durationHours)}h ${Math.floor((durationHours % 1) * 60)}m`,
      price,
      currency: 'INR',
      seats: Math.floor(Math.random() * 50) + 10,
      amenities: amenities.slice(0, Math.floor(Math.random() * amenities.length) + 1),
      score: Math.random(), // AI score between 0-1
    });
  }
  
  return options.sort((a, b) => b.score - a.score);
};

// Calculate AI recommendations based on multiple factors
export const generateMockResults = (params: SearchParams): SearchResults => {
  const options = generateTravelData(params);
  
  // Find best option (highest AI score - balanced)
  const best = options.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  );
  
  // Find cheapest option
  const cheapest = options.reduce((prev, current) => 
    current.price < prev.price ? current : prev
  );
  
  // Find fastest option (shortest duration)
  const fastest = options.reduce((prev, current) => {
    const prevDuration = parseFloat(prev.duration);
    const currentDuration = parseFloat(current.duration);
    return currentDuration < prevDuration ? current : prev;
  });
  
  // Calculate price statistics
  const prices = options.map(o => o.price);
  const priceStats = {
    lowest: Math.min(...prices),
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    highest: Math.max(...prices),
  };
  
  // Respect `params.prefer` when choosing which option to mark as `best`.
  // If the user requests 'cheapest', prefer the cheapest option as the primary recommendation.
  let recommendedBest = best;
  if (params.prefer === 'cheapest') {
    recommendedBest = cheapest;
  } else if (params.prefer === 'fastest') {
    recommendedBest = fastest;
  }

  return {
    options,
    recommendations: {
      best: recommendedBest,
      cheapest,
      fastest,
    },
    priceStats,
  };
};
