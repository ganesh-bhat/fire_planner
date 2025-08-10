import { FireType, UserInput, OneTimeExpense, RecurringExpense, FireCalculation } from '../types/fire';

export function calculateFireGoal(
  fireType: FireType,
  userInput: UserInput,
  oneTimeExpenses: OneTimeExpense[] = [],
  recurringExpenses: RecurringExpense[] = []
): FireCalculation {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyExpenses,
    monthlyIncome,
    currentMonthlySavings,
    expectedReturn,
    inflationRate
  } = userInput;

  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  
  // Calculate future monthly expenses with inflation
  const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  
  // Calculate annual expenses at retirement
  const futureAnnualExpenses = futureMonthlyExpenses * 12;
  
  // Calculate required corpus based on FIRE type
  let requiredCorpus: number;
  let monthlyRequiredIncome: number | undefined;
  
  if (fireType.hasIncomeComponent && fireType.monthlyIncomeRatio) {
    // For income-based FIRE types (Barista, Hobby)
    // Only need corpus to cover the portion NOT covered by part-time income
    const passiveIncomeNeeded = futureAnnualExpenses * (1 - fireType.monthlyIncomeRatio);
    requiredCorpus = passiveIncomeNeeded * fireType.multiplier;
    monthlyRequiredIncome = (futureAnnualExpenses * fireType.monthlyIncomeRatio) / 12;
  } else {
    // For pure passive income FIRE types
    // Need corpus to cover full annual expenses
    requiredCorpus = futureAnnualExpenses * fireType.multiplier;
  }
  
  // Add one-time expenses (inflated to future value)
  const oneTimeTotal = oneTimeExpenses.reduce((total, expense) => {
    const yearsToExpense = expense.targetYear - new Date().getFullYear();
    // Use custom inflation rate if specified, otherwise use global inflation rate
    const inflationToUse = expense.inflationRate !== undefined ? expense.inflationRate : inflationRate;
    const inflatedAmount = expense.amount * Math.pow(1 + inflationToUse / 100, yearsToExpense);
    return total + inflatedAmount;
  }, 0);
  
  // Add recurring expenses impact on required corpus
  const recurringTotal = recurringExpenses.reduce((total, expense) => {
    // Calculate the additional annual expense this adds
    const additionalAnnualExpense = expense.monthlyAmount * 12;
    // Inflate to retirement value
    const inflatedAnnualExpense = additionalAnnualExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    // Add to corpus requirement using the same multiplier
    return total + (inflatedAnnualExpense * fireType.multiplier);
  }, 0);
  
  const totalRequiredCorpus = requiredCorpus + oneTimeTotal + recurringTotal;
  
  // Calculate current savings growth to retirement
  const annualReturn = expectedReturn / 100;
  const currentSavingsGrowth = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
  
  // Calculate future value of current monthly savings using PMT formula
  const monthlyReturn = expectedReturn / 100 / 12;
  let futureSavingsValue = 0;
  if (monthlyReturn > 0) {
    futureSavingsValue = currentMonthlySavings * (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
  } else {
    futureSavingsValue = currentMonthlySavings * monthsToRetirement;
  }
  
  const projectedCorpusAtRetirement = currentSavingsGrowth + futureSavingsValue;
  const shortfall = Math.max(0, totalRequiredCorpus - projectedCorpusAtRetirement);
  
  // Calculate additional monthly savings needed to cover shortfall
  let additionalMonthlySavingsNeeded = 0;
  if (shortfall > 0) {
    if (monthlyReturn > 0) {
      additionalMonthlySavingsNeeded = shortfall * monthlyReturn / (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1);
    } else {
      additionalMonthlySavingsNeeded = shortfall / monthsToRetirement;
    }
  }
  
  const totalRequiredMonthlySavings = currentMonthlySavings + additionalMonthlySavingsNeeded;
  const achievable = totalRequiredMonthlySavings <= (monthlyIncome * 0.8); // Max 80% savings rate
  
  // Calculate passive income at retirement (4% rule or based on expected return)
  const withdrawalRate = Math.min(expectedReturn / 100, 0.04); // Conservative 4% max
  const monthlyPassiveIncome = (projectedCorpusAtRetirement * withdrawalRate) / 12;
  
  return {
    fireType,
    requiredCorpus: totalRequiredCorpus,
    monthlyRequiredSavings: totalRequiredMonthlySavings,
    yearsToGoal: yearsToRetirement,
    totalMonthsToGoal: monthsToRetirement,
    projectedCorpusAtRetirement: Math.max(projectedCorpusAtRetirement, totalRequiredCorpus),
    shortfall,
    achievable,
    monthlyPassiveIncome,
    monthlyRequiredIncome
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toFixed(0)}`;
}

export function calculateGeoFireSavings(originalExpenses: number, newCityMultiplier: number): number {
  return originalExpenses * (1 - newCityMultiplier);
}