import { City } from '../types/fire';

export const indianCities: City[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    costMultiplier: 1.0, // Base city
    averageRent: 35000,
    averageUtilities: 3500,
    averageFood: 12000,
    averageTransport: 4000
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    state: 'Karnataka',
    costMultiplier: 0.85,
    averageRent: 25000,
    averageUtilities: 3000,
    averageFood: 10000,
    averageTransport: 3500
  },
  {
    id: 'delhi',
    name: 'Delhi',
    state: 'Delhi',
    costMultiplier: 0.9,
    averageRent: 28000,
    averageUtilities: 3200,
    averageFood: 11000,
    averageTransport: 3800
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    costMultiplier: 0.7,
    averageRent: 18000,
    averageUtilities: 2500,
    averageFood: 8500,
    averageTransport: 3000
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    costMultiplier: 0.6,
    averageRent: 15000,
    averageUtilities: 2200,
    averageFood: 7500,
    averageTransport: 2500
  },
  {
    id: 'kochi',
    name: 'Kochi',
    state: 'Kerala',
    costMultiplier: 0.55,
    averageRent: 12000,
    averageUtilities: 2000,
    averageFood: 7000,
    averageTransport: 2200
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    costMultiplier: 0.5,
    averageRent: 10000,
    averageUtilities: 1800,
    averageFood: 6500,
    averageTransport: 2000
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    costMultiplier: 0.45,
    averageRent: 8000,
    averageUtilities: 1500,
    averageFood: 5500,
    averageTransport: 1800
  }
];