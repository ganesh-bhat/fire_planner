import { FireType } from '../types/fire';

export const fireTypes: FireType[] = [
  {
    id: 'lean',
    name: 'Lean FIRE',
    description: 'Minimal expenses, frugal lifestyle',
    multiplier: 25,
    hasIncomeComponent: false,
    icon: 'Leaf',
    color: '#10B981'
  },
  {
    id: 'coast',
    name: 'Coast FIRE',
    description: 'Enough saved to coast to traditional retirement',
    multiplier: 25,
    hasIncomeComponent: false,
    icon: 'Waves',
    color: '#06B6D4'
  },
  {
    id: 'barista',
    name: 'Barista FIRE',
    description: 'Part-time work covers partial expenses',
    multiplier: 15,
    hasIncomeComponent: true,
    monthlyIncomeRatio: 0.4, // 40% of expenses covered by part-time work
    icon: 'Coffee',
    color: '#8B5CF6'
  },
  {
    id: 'chubby',
    name: 'Chubby FIRE',
    description: 'Comfortable lifestyle with some luxuries',
    multiplier: 30,
    hasIncomeComponent: false,
    icon: 'Home',
    color: '#F59E0B'
  },
  {
    id: 'fat',
    name: 'Fat FIRE',
    description: 'Luxurious lifestyle, high expenses',
    multiplier: 35,
    hasIncomeComponent: false,
    icon: 'Crown',
    color: '#EF4444'
  },
  {
    id: 'flamingo',
    name: 'Flamingo FIRE',
    description: 'Single person optimized approach',
    multiplier: 22,
    hasIncomeComponent: false,
    icon: 'Bird',
    color: '#EC4899'
  },
  {
    id: 'geo',
    name: 'Geo FIRE',
    description: 'Retire in lower cost-of-living area',
    multiplier: 20,
    hasIncomeComponent: false,
    icon: 'MapPin',
    color: '#14B8A6'
  },
  {
    id: 'hobby',
    name: 'Hobby FIRE',
    description: 'Monetize hobbies for partial income',
    multiplier: 18,
    hasIncomeComponent: true,
    monthlyIncomeRatio: 0.3, // 30% of expenses covered by hobby income
    icon: 'Palette',
    color: '#6366F1'
  }
];