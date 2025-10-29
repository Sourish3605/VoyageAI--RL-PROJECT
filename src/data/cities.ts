import { City } from '@/types/travel';

export const INDIAN_CITIES: City[] = [
  { id: '1', name: 'Hyderabad', code: 'HYD', state: 'Telangana', popular: true },
  { id: '2', name: 'Bangalore', code: 'BLR', state: 'Karnataka', popular: true },
  { id: '3', name: 'Mumbai', code: 'BOM', state: 'Maharashtra', popular: true },
  { id: '4', name: 'Delhi', code: 'DEL', state: 'Delhi', popular: true },
  { id: '5', name: 'Chennai', code: 'MAA', state: 'Tamil Nadu', popular: true },
  { id: '6', name: 'Kolkata', code: 'CCU', state: 'West Bengal', popular: true },
  { id: '7', name: 'Pune', code: 'PNQ', state: 'Maharashtra', popular: true },
  { id: '8', name: 'Ahmedabad', code: 'AMD', state: 'Gujarat', popular: true },
  { id: '9', name: 'Jaipur', code: 'JAI', state: 'Rajasthan', popular: false },
  { id: '10', name: 'Lucknow', code: 'LKO', state: 'Uttar Pradesh', popular: false },
  { id: '11', name: 'Khammam', code: 'KMM', state: 'Telangana', popular: false },
  { id: '12', name: 'Vijayawada', code: 'VGA', state: 'Andhra Pradesh', popular: false },
  { id: '13', name: 'Visakhapatnam', code: 'VTZ', state: 'Andhra Pradesh', popular: false },
  { id: '14', name: 'Coimbatore', code: 'CJB', state: 'Tamil Nadu', popular: false },
  { id: '15', name: 'Kochi', code: 'COK', state: 'Kerala', popular: false },
  { id: '16', name: 'Indore', code: 'IDR', state: 'Madhya Pradesh', popular: false },
  { id: '17', name: 'Nagpur', code: 'NAG', state: 'Maharashtra', popular: false },
  { id: '18', name: 'Chandigarh', code: 'IXC', state: 'Chandigarh', popular: false },
  { id: '19', name: 'Bhopal', code: 'BHO', state: 'Madhya Pradesh', popular: false },
  { id: '20', name: 'Goa', code: 'GOI', state: 'Goa', popular: true },
];

// Typo mappings for smart autocomplete
export const CITY_TYPO_MAPPINGS: Record<string, string> = {
  'hyd': 'Hyderabad',
  'blr': 'Bangalore',
  'bom': 'Mumbai',
  'del': 'Delhi',
  'maa': 'Chennai',
  'ccu': 'Kolkata',
  'pnq': 'Pune',
  'amd': 'Ahmedabad',
  'bang': 'Bangalore',
  'beng': 'Bangalore',
  'bombay': 'Mumbai',
  'calcutta': 'Kolkata',
  'madras': 'Chennai',
};

// Transport mode availability between cities
export const TRANSPORT_AVAILABILITY: Record<string, TransportMode[]> = {
  'Hyderabad-Bangalore': ['flight', 'train', 'bus'],
  'Hyderabad-Mumbai': ['flight', 'train', 'bus'],
  'Hyderabad-Delhi': ['flight', 'train', 'bus'],
  'Hyderabad-Chennai': ['flight', 'train', 'bus'],
  'Hyderabad-Khammam': ['train', 'bus'],
  'Bangalore-Mumbai': ['flight', 'train', 'bus'],
  'Bangalore-Delhi': ['flight', 'train', 'bus'],
  'Mumbai-Delhi': ['flight', 'train', 'bus'],
  'Delhi-Chennai': ['flight', 'train', 'bus'],
  'Mumbai-Goa': ['flight', 'bus'],
};

export type TransportMode = 'flight' | 'train' | 'bus';

export const getAvailableTransportModes = (origin: string, destination: string): TransportMode[] => {
  const key1 = `${origin}-${destination}`;
  const key2 = `${destination}-${origin}`;
  
  return TRANSPORT_AVAILABILITY[key1] || TRANSPORT_AVAILABILITY[key2] || ['flight', 'train', 'bus'];
};
