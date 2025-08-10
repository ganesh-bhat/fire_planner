export interface FireType {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  hasIncomeComponent: boolean;
  monthlyIncomeRatio?: number; // For types like Barista/Hobby FIRE
  icon: string;
  color: string;
}

export interface UserInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  currentMonthlySavings: number;
  expectedReturn: number;
  inflationRate: number;
}

export interface OneTimeExpense {
  id: string;
  name: string;
  amount: number;
  targetYear: number;
  category: 'marriage' | 'house' | 'car' | 'education' | 'other';
  inflationRate?: number; // Optional custom inflation rate for this expense
}

export interface RecurringExpense {
  id: string;
  name: string;
  monthlyAmount: number;
  startYear: number;
  endYear?: number;
  category: 'travel' | 'luxury' | 'health' | 'other';
}

export interface FireCalculation {
  fireType: FireType;
  requiredCorpus: number;
  monthlyRequiredSavings: number;
  yearsToGoal: number;
  totalMonthsToGoal: number;
  projectedCorpusAtRetirement: number;
  shortfall: number;
  achievable: boolean;
  monthlyPassiveIncome: number;
  monthlyRequiredIncome?: number; // For income-based FIRE types
}

export interface City {
  id: string;
  name: string;
  state: string;
  costMultiplier: number; // Relative to base city
  averageRent: number;
  averageUtilities: number;
  averageFood: number;
  averageTransport: number;
}