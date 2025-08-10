import React from 'react';
import { FireCalculation, UserInput } from '../types/fire';
import { formatCurrency } from '../utils/fireCalculations';
import { BarChart3, TrendingUp } from 'lucide-react';

interface YearlyProgressChartProps {
  calculation: FireCalculation;
  userInput: UserInput;
}

interface YearlyData {
  year: number;
  age: number;
  totalCorpus: number;
  yearlyContribution: number;
  progressPercentage: number;
  cumulativeContributions: number;
  investmentGrowth: number;
}

export function YearlyProgressChart({ calculation, userInput }: YearlyProgressChartProps) {
  const generateYearlyData = (): YearlyData[] => {
    const data: YearlyData[] = [];
    const currentYear = new Date().getFullYear();
    const monthlyReturn = userInput.expectedReturn / 100 / 12;
    const yearsToRetirement = userInput.retirementAge - userInput.currentAge;
    
    let runningCorpus = userInput.currentSavings;
    let totalContributions = 0;
    
    // Year 0 (current year)
    data.push({
      year: currentYear,
      age: userInput.currentAge,
      totalCorpus: userInput.currentSavings,
      yearlyContribution: 0,
      progressPercentage: (userInput.currentSavings / calculation.requiredCorpus) * 100,
      cumulativeContributions: 0,
      investmentGrowth: 0
    });
    
    // Future years
    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearNumber = currentYear + year;
      const age = userInput.currentAge + year;
      
      // Calculate yearly contribution (12 months of required savings)
      const yearlyContribution = calculation.monthlyRequiredSavings * 12;
      totalContributions += yearlyContribution;
      
      // Apply monthly compounding for the year
      let yearEndCorpus = runningCorpus;
      for (let month = 0; month < 12; month++) {
        // Apply monthly growth first
        yearEndCorpus *= (1 + monthlyReturn);
        // Add monthly savings
        yearEndCorpus += calculation.monthlyRequiredSavings;
      }
      
      runningCorpus = yearEndCorpus;
      const progressPercentage = (runningCorpus / calculation.requiredCorpus) * 100;
      const investmentGrowth = runningCorpus - userInput.currentSavings - totalContributions;
      
      data.push({
        year: yearNumber,
        age,
        totalCorpus: runningCorpus,
        yearlyContribution,
        progressPercentage: Math.min(progressPercentage, 100),
        cumulativeContributions: totalContributions,
        investmentGrowth: Math.max(investmentGrowth, 0)
      });
    }
    
    return data;
  };

  const yearlyData = generateYearlyData();
  const maxCorpus = Math.max(...yearlyData.map(d => d.totalCorpus), calculation.requiredCorpus);
  const targetReached = yearlyData.find(d => d.progressPercentage >= 100);

  // Show every 2-3 years to avoid overcrowding
  const displayData = yearlyData.filter((_, index) => 
    index === 0 || 
    index === yearlyData.length - 1 || 
    index % Math.max(2, Math.floor(yearlyData.length / 8)) === 0
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          Yearly Progress to FIRE Goal
        </h3>
        <div className="text-sm text-gray-600">
          Target: {formatCurrency(calculation.requiredCorpus)}
        </div>
      </div>

      {/* Horizontal Chart Container */}
      <div className="relative bg-gray-50 rounded-lg p-4">
        {/* Chart Bars */}
        <div className="space-y-3">
          {displayData.map((data, index) => {
            const barWidth = Math.max((data.totalCorpus / maxCorpus) * 100, 2); // Minimum 2% width
            const initialSavingsRatio = userInput.currentSavings / data.totalCorpus;
            const contributionRatio = data.cumulativeContributions / data.totalCorpus;
            const growthRatio = data.investmentGrowth / data.totalCorpus;
            const isTargetYear = data.progressPercentage >= 100 && (!targetReached || data.year === targetReached.year);
            
            return (
              <div key={data.year} className="group relative">
                {/* Year and Age Labels */}
                <div className="flex items-center mb-2">
                  <div className="w-20 text-sm font-medium text-gray-700">
                    {data.year}
                  </div>
                  <div className="w-16 text-xs text-gray-500">
                    Age {data.age}
                  </div>
                  <div className="flex-1" />
                  <div className="text-xs text-gray-600">
                    {formatCurrency(data.totalCorpus)}
                  </div>
                  {isTargetYear && (
                    <div className="ml-2">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-yellow-600 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Horizontal Bar */}
                <div className="relative ml-36">
                  <div 
                    className="h-8 relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 bg-white"
                    style={{ width: `${barWidth}%` }}
                  >
                    {/* Initial Savings (Gray base) */}
                    {userInput.currentSavings > 0 && (
                      <div 
                        className="absolute left-0 h-full bg-gray-400"
                        style={{ width: `${initialSavingsRatio * 100}%` }}
                      />
                    )}
                    
                    {/* Contributions (Blue) */}
                    {data.cumulativeContributions > 0 && (
                      <div 
                        className="absolute left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500"
                        style={{ 
                          width: `${(initialSavingsRatio + contributionRatio) * 100}%`
                        }}
                      />
                    )}
                    
                    {/* Investment Growth (Green) */}
                    {data.investmentGrowth > 0 && (
                      <div 
                        className="absolute right-0 h-full bg-gradient-to-r from-green-400 to-green-500"
                        style={{ width: `${growthRatio * 100}%` }}
                      />
                    )}
                  </div>

                  {/* Progress Percentage */}
                  <div className="absolute right-0 top-0 h-8 flex items-center">
                    <span className="ml-2 text-xs text-gray-600 font-medium">
                      {data.progressPercentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap">
                    <div className="font-medium">{data.year} (Age {data.age})</div>
                    <div>Total Corpus: {formatCurrency(data.totalCorpus)}</div>
                    <div>Progress: {data.progressPercentage.toFixed(1)}%</div>
                    {data.yearlyContribution > 0 && (
                      <div>Yearly Savings: {formatCurrency(data.yearlyContribution)}</div>
                    )}
                    {data.investmentGrowth > 0 && (
                      <div>Investment Growth: {formatCurrency(data.investmentGrowth)}</div>
                    )}
                  </div>
                </div>

                {/* Target Line Indicator */}
                {data.totalCorpus >= calculation.requiredCorpus && (
                  <div className="absolute right-0 top-0 h-full flex items-center">
                    <div className="w-0.5 h-8 bg-red-400 ml-2" style={{ 
                      marginLeft: `${36 + (calculation.requiredCorpus / maxCorpus) * 100}%`
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Target Line */}
        <div className="absolute top-4 bottom-4 pointer-events-none">
          <div 
            className="h-full border-l-2 border-dashed border-red-400"
            style={{ 
              left: `${36 + (calculation.requiredCorpus / maxCorpus) * 60}%`
            }}
          />
          <span 
            className="absolute top-0 bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium transform -translate-y-full"
            style={{ 
              left: `${36 + (calculation.requiredCorpus / maxCorpus) * 60}%`
            }}
          >
            FIRE Goal
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded" />
          <span className="text-gray-600">Initial Savings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded" />
          <span className="text-gray-600">Contributions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded" />
          <span className="text-gray-600">Investment Growth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-600" />
          <span className="text-gray-600">FIRE Goal Achieved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-400 border-dashed" />
          <span className="text-gray-600">Target Line</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-600" size={16} />
            <span className="text-sm font-medium text-blue-800">Total Contributions</span>
          </div>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(calculation.monthlyRequiredSavings * 12 * calculation.yearsToGoal)}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-600" size={16} />
            <span className="text-sm font-medium text-green-800">Investment Growth</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(Math.max(0, calculation.projectedCorpusAtRetirement - userInput.currentSavings - (calculation.monthlyRequiredSavings * 12 * calculation.yearsToGoal)))}
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-purple-600" size={16} />
            <span className="text-sm font-medium text-purple-800">Final Corpus</span>
          </div>
          <p className="text-lg font-bold text-purple-600">
            {formatCurrency(calculation.projectedCorpusAtRetirement)}
          </p>
        </div>
      </div>

      {targetReached && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-lg">🎯</span>
            <span className="font-medium">
              FIRE goal achieved in {targetReached.year} at age {targetReached.age}!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}