import { SuitId } from './suits';

export interface NetworkSpider {
  id: string;
  codename: string;
  realName: string;
  suitId: SuitId;
  city: string;
  country: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  level: number;
  status: 'PATROLLING' | 'INTERCEPTING' | 'RECON' | 'ONLINE' | 'ENGAGED';
  signalStrength: number;
  lastActive: string;
}

export const WORLDWIDE_SPIDERS: NetworkSpider[] = [
  {
    id: 'spidey-nyc-01',
    codename: 'FRIENDLY NEIGHBORHOOD',
    realName: 'Peter Parker',
    suitId: 'classic',
    city: 'New York City',
    country: 'USA',
    location: { lat: 40.7128, lng: -74.006, address: 'Queensboro Bridge, Manhattan' },
    level: 10,
    status: 'PATROLLING',
    signalStrength: 99,
    lastActive: 'Just now'
  },
  {
    id: 'spidey-nyc-02',
    codename: 'SPIDER-MAN (MILES)',
    realName: 'Miles Morales',
    suitId: 'black',
    city: 'Brooklyn',
    country: 'USA',
    location: { lat: 40.6782, lng: -73.9442, address: 'Prospect Park, Brooklyn' },
    level: 8,
    status: 'ONLINE',
    signalStrength: 95,
    lastActive: '2m ago'
  },
  {
    id: 'spidey-london-01',
    codename: 'SPIDER-UK',
    realName: 'Billy Braddock',
    suitId: 'classic',
    city: 'London',
    country: 'United Kingdom',
    location: { lat: 51.5074, lng: -0.1278, address: 'Tower Bridge, London' },
    level: 7,
    status: 'PATROLLING',
    signalStrength: 92,
    lastActive: '5m ago'
  },
  {
    id: 'spidey-tokyo-01',
    codename: 'SUPAIDAMAN',
    realName: 'Takuya Yamashiro',
    suitId: 'iron',
    city: 'Tokyo',
    country: 'Japan',
    location: { lat: 35.6762, lng: 139.6503, address: 'Shibuya Scramble, Tokyo' },
    level: 9,
    status: 'ENGAGED',
    signalStrength: 98,
    lastActive: '1m ago'
  },
  {
    id: 'spidey-mumbai-01',
    codename: 'SPIDER-MAN INDIA',
    realName: 'Pavitr Prabhakar',
    suitId: 'scarlet',
    city: 'Mumbai',
    country: 'India',
    location: { lat: 19.076, lng: 72.8777, address: 'Bandra-Worli Sea Link, Mumbai' },
    level: 7,
    status: 'PATROLLING',
    signalStrength: 89,
    lastActive: '4m ago'
  },
  {
    id: 'spidey-paris-01',
    codename: 'SPIDER-GAUL',
    realName: 'Jean-Luc Parker',
    suitId: 'noir',
    city: 'Paris',
    country: 'France',
    location: { lat: 48.8566, lng: 2.3522, address: 'Eiffel Tower Spire, Paris' },
    level: 6,
    status: 'RECON',
    signalStrength: 87,
    lastActive: '12m ago'
  },
  {
    id: 'spidey-berlin-01',
    codename: 'CYBER-SPIDER',
    realName: 'Lukas Steiner',
    suitId: 'future',
    city: 'Berlin',
    country: 'Germany',
    location: { lat: 52.52, lng: 13.405, address: 'Brandenburg Gate, Berlin' },
    level: 6,
    status: 'ONLINE',
    signalStrength: 94,
    lastActive: '8m ago'
  },
  {
    id: 'spidey-sydney-01',
    codename: 'OUTBACK SLINGER',
    realName: 'Jack Kelly',
    suitId: 'stealth',
    city: 'Sydney',
    country: 'Australia',
    location: { lat: -33.8688, lng: 151.2093, address: 'Sydney Opera House, Sydney' },
    level: 5,
    status: 'PATROLLING',
    signalStrength: 91,
    lastActive: '3m ago'
  },
  {
    id: 'spidey-rio-01',
    codename: 'ARANHA TROPICAL',
    realName: 'Carlos Silva',
    suitId: 'america',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    location: { lat: -22.9068, lng: -43.1729, address: 'Corcovado Lookout, Rio' },
    level: 5,
    status: 'ONLINE',
    signalStrength: 85,
    lastActive: '15m ago'
  },
  {
    id: 'spidey-toronto-01',
    codename: 'NORTH WEAVER',
    realName: 'Devon Parker',
    suitId: 'classic',
    city: 'Toronto',
    country: 'Canada',
    location: { lat: 43.6532, lng: -79.3832, address: 'CN Tower Observation Deck' },
    level: 6,
    status: 'INTERCEPTING',
    signalStrength: 93,
    lastActive: '7m ago'
  },
  {
    id: 'spidey-seoul-01',
    codename: 'NEO-SEOUL SPIDER',
    realName: 'Min-ho Park',
    suitId: 'iron',
    city: 'Seoul',
    country: 'South Korea',
    location: { lat: 37.5665, lng: 126.978, address: 'N Seoul Tower, Gangnam' },
    level: 8,
    status: 'ENGAGED',
    signalStrength: 97,
    lastActive: 'Just now'
  },
  {
    id: 'spidey-cairo-01',
    codename: 'DESERT SPIDER',
    realName: 'Tariq Mansour',
    suitId: 'noir',
    city: 'Cairo',
    country: 'Egypt',
    location: { lat: 30.0444, lng: 31.2357, address: 'Nile Corniche, Cairo' },
    level: 4,
    status: 'PATROLLING',
    signalStrength: 83,
    lastActive: '20m ago'
  },
  {
    id: 'spidey-rome-01',
    codename: 'LEGIONNAIRE SPIDER',
    realName: 'Marco Rossi',
    suitId: 'scarlet',
    city: 'Rome',
    country: 'Italy',
    location: { lat: 41.9028, lng: 12.4964, address: 'Colosseum Outer Ring, Rome' },
    level: 7,
    status: 'ONLINE',
    signalStrength: 90,
    lastActive: '6m ago'
  },
  {
    id: 'spidey-madrid-01',
    codename: 'MATADOR SPIDER',
    realName: 'Diego Morales',
    suitId: 'black',
    city: 'Madrid',
    country: 'Spain',
    location: { lat: 40.4168, lng: -3.7038, address: 'Plaza Mayor, Madrid' },
    level: 6,
    status: 'PATROLLING',
    signalStrength: 88,
    lastActive: '11m ago'
  },
  {
    id: 'spidey-singapore-01',
    codename: 'MERLION WEAVER',
    realName: 'Aaron Tan',
    suitId: 'stealth',
    city: 'Singapore',
    country: 'Singapore',
    location: { lat: 1.3521, lng: 103.8198, address: 'Marina Bay Sands Skypark' },
    level: 8,
    status: 'RECON',
    signalStrength: 96,
    lastActive: '2m ago'
  },
  {
    id: 'spidey-dubai-01',
    codename: 'MIRAGE SPIDER',
    realName: 'Zayed Al-Fahim',
    suitId: 'iron',
    city: 'Dubai',
    country: 'UAE',
    location: { lat: 25.2048, lng: 55.2708, address: 'Burj Khalifa Pinnacle, Dubai' },
    level: 9,
    status: 'PATROLLING',
    signalStrength: 99,
    lastActive: 'Just now'
  },
  {
    id: 'spidey-mexico-01',
    codename: 'LUCHADOR SPIDER',
    realName: 'Alejandro Cruz',
    suitId: 'scarlet',
    city: 'Mexico City',
    country: 'Mexico',
    location: { lat: 19.4326, lng: -99.1332, address: 'Zocalo Square, CDMX' },
    level: 5,
    status: 'ONLINE',
    signalStrength: 86,
    lastActive: '9m ago'
  },
  {
    id: 'spidey-auckland-01',
    codename: 'KIWI WEAVER',
    realName: 'Liam Cooper',
    suitId: 'classic',
    city: 'Auckland',
    country: 'New Zealand',
    location: { lat: -36.8485, lng: 174.7633, address: 'Sky Tower Observation Deck' },
    level: 4,
    status: 'PATROLLING',
    signalStrength: 84,
    lastActive: '18m ago'
  },
  {
    id: 'spidey-bangkok-01',
    codename: 'SIAM SPIDER',
    realName: 'Somchai Prasert',
    suitId: 'future',
    city: 'Bangkok',
    country: 'Thailand',
    location: { lat: 13.7563, lng: 100.5018, address: 'Wat Arun Spire, Bangkok' },
    level: 6,
    status: 'RECON',
    signalStrength: 90,
    lastActive: '4m ago'
  }
];
