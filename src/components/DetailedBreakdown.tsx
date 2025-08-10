import React, { useState } from 'react';
import { FireCalculation, UserInput } from '../types/fire';
import { formatCurrency } from '../utils/fireCalculations';
import { Calculator, TrendingDown, Clock, AlertCircle, Info } from 'lucide-react';

interface DetailedBreakdownProps {
  calculation: FireCalculation;
  userInput: UserInput;
}

interface WithdrawalYear {
  year: number;
  age: number;
  startingCorpus: number;
  annualWithdrawal: number;
  investmentGrowth: number;
  endingCorpus: number;
  inflationAdjustedWithdrawal: number;
  corpusDepletionRisk: boolean;
}

export function DetailedBreakdown({ calculation, userInput }: DetailedBreakdownProps) {
  const [activeTab, setActiveTab] = useState<'accumulation' | 'withdrawal' | 'assumptions'>('accumulation');

  // Calculate corpus requirement breakdown
  const calculateCorpusBreakdown = () => {
    const yearsToRetirement = userInput.retirementAge - userInput.currentAge;
    const yearsInRetirement = userInput.lifeExpectancy - userInput.retirementAge;
    
    // Future monthly expenses at retirement (inflated)
    const futureMonthlyExpenses = userInput.monthlyExpenses * Math.pow(1 + userInput.inflationRate / 100, yearsToRetirement);
    const futureAnnualExpenses = futureMonthlyExpenses * 12;
    
    // Base corpus calculation
    let baseCorpusNeeded: number;
    let partTimeIncomeNeeded = 0;
    
    if (calculation.fireType.hasIncomeComponent && calculation.fireType.monthlyIncomeRatio) {
      // For income-based FIRE types
      const passiveIncomeNeeded = futureAnnualExpenses * (1 - calculation.fireType.monthlyIncomeRatio);
      baseCorpusNeeded = passiveIncomeNeeded * calculation.fireType.multiplier;
      partTimeIncomeNeeded = futureAnnualExpenses * calculation.fireType.monthlyIncomeRatio;
    } else {
      // For pure passive income FIRE types
      baseCorpusNeeded = futureAnnualExpenses * calculation.fireType.multiplier;
    }

    return {
      futureAnnualExpenses,
      baseCorpusNeeded,
      partTimeIncomeNeeded,
      yearsInRetirement,
      withdrawalRate: 1 / calculation.fireType.multiplier
    };
  };

  // Calculate year-by-year withdrawal projections
  const calculateWithdrawalProjections = (): WithdrawalYear[] => {
    const breakdown = calculateCorpusBreakdown();
    const projections: WithdrawalYear[] = [];
    
    let currentCorpus = calculation.projectedCorpusAtRetirement;
    const baseWithdrawal = breakdown.futureAnnualExpenses;
    const postRetirementReturn = Math.max(userInput.expectedReturn - 2, 4); // Conservative post-retirement return
    
    for (let year = 0; year < breakdown.yearsInRetirement; year++) {
      const currentYear = userInput.retirementAge + year;
      const age = currentYear;
      
      // Inflation-adjusted withdrawal
      const inflationAdjustedWithdrawal = baseWithdrawal * Math.pow(1 + userInput.inflationRate / 100, year);
      
      // Investment growth on remaining corpus
      const investmentGrowth = currentCorpus * (postRetirementReturn / 100);
      
      // Ending corpus after withdrawal
      const endingCorpus = currentCorpus + investmentGrowth - inflationAdjustedWithdrawal;
      
      projections.push({
        year: currentYear,
        age,
        startingCorpus: currentCorpus,
        annualWithdrawal: inflationAdjustedWithdrawal,
        investmentGrowth,
        endingCorpus: Math.max(0, endingCorpus),
        inflationAdjustedWithdrawal,
        corpusDepletionRisk: endingCorpus < 0
      });
      
      currentCorpus = Math.max(0, endingCorpus);
      
      // Stop if corpus is depleted
      if (currentCorpus <= 0) break;
    }
    
    return projections;
  };

  const breakdown = calculateCorpusBreakdown();
  const withdrawalProjections = calculateWithdrawalProjections();
  const corpusDepletionYear = withdrawalProjections.find(p => p.corpusDepletionRisk);
  const safeWithdrawalRate = (breakdown.futureAnnualExpenses / calculation.projectedCorpusAtRetirement) * 100;

  const tabs = [
    { id: 'accumulation' as const, label: 'Corpus Calculation', icon: Calculator },
    { id: 'withdrawal' as const, label: 'Withdrawal Phase', icon: TrendingDown },
    { id: 'assumptions' as const, label: 'Key Assumptions', icon: Info }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {/* Accumulation Tab */}
        {activeTab === 'accumulation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How Your Required Corpus is Calculated</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Step 1: Future Annual Expenses</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Current monthly expenses:</span>
                      <span className="font-medium">{formatCurrency(userInput.monthlyExpenses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inflation rate:</span>
                      <span className="font-medium">{userInput.inflationRate}% per year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Years to retirement:</span>
                      <span className="font-medium">{userInput.retirementAge - userInput.currentAge} years</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-300 pt-2 font-semibold">
                      <span>Future annual expenses:</span>
                      <span className="text-blue-600">{formatCurrency(breakdown.futureAnnualExpenses)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Step 2: {calculation.fireType.name} Calculation</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>FIRE multiplier:</span>
                      <span className="font-medium">{calculation.fireType.multiplier}x</span>
                    </div>
                    {calculation.fireType.hasIncomeComponent && (
                      <>
                        <div className="flex justify-between">
                          <span>Income coverage:</span>
                          <span className="font-medium">{((calculation.fireType.monthlyIncomeRatio || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passive income needed:</span>
                          <span className="font-medium">{formatCurrency(breakdown.futureAnnualExpenses * (1 - (calculation.fireType.monthlyIncomeRatio || 0)))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Part-time income needed:</span>
                          <span className="font-medium">{formatCurrency(breakdown.partTimeIncomeNeeded)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t border-green-300 pt-2 font-semibold">
                      <span>Base corpus required:</span>
                      <span className="text-green-600">{formatCurrency(breakdown.baseCorpusNeeded)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Step 3: Additional Expenses</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>One-time future expenses:</span>
                      <span className="font-medium">{formatCurrency(calculation.requiredCorpus - breakdown.baseCorpusNeeded)}</span>
                    </div>
                    <div className="flex justify-between border-t border-purple-300 pt-2 font-semibold">
                      <span>Total corpus required:</span>
                      <span className="text-purple-600">{formatCurrency(calculation.requiredCorpus)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Tab */}
        {activeTab === 'withdrawal' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Retirement Withdrawal Projections</h3>
              
              {/* Warning if corpus might be depleted */}
              {corpusDepletionYear && (
                <div className="mb-4 p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle size={20} />
                    <span className="font-medium">
                      Warning: Corpus may be depleted by age {corpusDepletionYear.age}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Consider increasing your corpus target or reducing withdrawal rate.
                  </p>
                </div>
              )}

              {/* Safe Withdrawal Rate */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Withdrawal Rate Analysis</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 block">Your Withdrawal Rate</span>
                    <span className="text-lg font-bold text-blue-600">{safeWithdrawalRate.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-blue-700 block">Safe Rate (4% Rule)</span>
                    <span className="text-lg font-bold text-blue-600">4.00%</span>
                  </div>
                  <div>
                    <span className="text-blue-700 block">Safety Margin</span>
                    <span className={`text-lg font-bold ${safeWithdrawalRate <= 4 ? 'text-green-600' : 'text-red-600'}`}>
                      {safeWithdrawalRate <= 4 ? 'Safe' : 'Risky'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yearly Projections Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3">Year</th>
                      <th className="text-left py-2 px-3">Age</th>
                      <th className="text-right py-2 px-3">Starting Corpus</th>
                      <th className="text-right py-2 px-3">Annual Withdrawal</th>
                      <th className="text-right py-2 px-3">Investment Growth</th>
                      <th className="text-right py-2 px-3">Ending Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalProjections.slice(0, 15).map((projection, index) => (
                      <tr 
                        key={projection.year} 
                        className={`border-b border-gray-100 ${projection.corpusDepletionRisk ? 'bg-red-50' : index % 2 === 0 ? 'bg-gray-50' : ''}`}
                      >
                        <td className="py-2 px-3 font-medium">{projection.year}</td>
                        <td className="py-2 px-3">{projection.age}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(projection.startingCorpus)}</td>
                        <td className="py-2 px-3 text-right text-red-600">-{formatCurrency(projection.annualWithdrawal)}</td>
                        <td className="py-2 px-3 text-right text-green-600">+{formatCurrency(projection.investmentGrowth)}</td>
                        <td className={`py-2 px-3 text-right font-medium ${projection.corpusDepletionRisk ? 'text-red-600' : ''}`}>
                          {formatCurrency(projection.endingCorpus)}
                        </td>
                      </tr>
                    ))}
                    {withdrawalProjections.length > 15 && (
                      <tr>
                        <td colSpan={6} className="py-2 px-3 text-center text-gray-500 italic">
                          ... and {withdrawalProjections.length - 15} more years
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Assumptions Tab */}
        {activeTab === 'assumptions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Planning Assumptions</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-3">Investment Assumptions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Pre-retirement return:</span>
                        <span className="font-medium">{userInput.expectedReturn}% per year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Post-retirement return:</span>
                        <span className="font-medium">{Math.max(userInput.expectedReturn - 2, 4)}% per year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inflation rate:</span>
                        <span className="font-medium">{userInput.inflationRate}% per year</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current age:</span>
                        <span className="font-medium">{userInput.currentAge} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retirement age:</span>
                        <span className="font-medium">{userInput.retirementAge} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Life expectancy:</span>
                        <span className="font-medium">{userInput.lifeExpectancy} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Years in retirement:</span>
                        <span className="font-medium">{userInput.lifeExpectancy - userInput.retirementAge} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-800 mb-3">FIRE Strategy</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Strategy:</span>
                        <span className="font-medium">{calculation.fireType.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multiplier:</span>
                        <span className="font-medium">{calculation.fireType.multiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Withdrawal rate:</span>
                        <span className="font-medium">{(100 / calculation.fireType.multiplier).toFixed(2)}%</span>
                      </div>
                      {calculation.fireType.hasIncomeComponent && (
                        <div className="flex justify-between">
                          <span>Income component:</span>
                          <span className="font-medium">{((calculation.fireType.monthlyIncomeRatio || 0) * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Post-retirement returns are assumed to be 2% lower for safety</li>
                      <li>• Withdrawals are inflation-adjusted each year</li>
                      <li>• Healthcare costs may increase faster than general inflation</li>
                      <li>• Consider having an emergency fund separate from FIRE corpus</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}