import React from 'react';
import { FireType, UserInput, OneTimeExpense, RecurringExpense } from '../types/fire';
import { calculateFireGoal, formatCurrency } from '../utils/fireCalculations';
import { Target, TrendingUp, Clock, DollarSign, Coffee } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { InsightCard } from './InsightCard';
import { YearlyProgressChart } from './YearlyProgressChart';
import { DetailedBreakdown } from './DetailedBreakdown';

interface ResultsDashboardProps {
  fireType: FireType;
  userInput: UserInput;
  oneTimeExpenses: OneTimeExpense[];
  recurringExpenses: RecurringExpense[];
}

export function ResultsDashboard({
  fireType,
  userInput,
  oneTimeExpenses,
  recurringExpenses
}: ResultsDashboardProps) {
  const calculation = calculateFireGoal(fireType, userInput, oneTimeExpenses, recurringExpenses);
  
  const currentProgress = (userInput.currentSavings / calculation.requiredCorpus) * 100;
  const savingsRate = (userInput.currentMonthlySavings / userInput.monthlyIncome) * 100;
  const requiredSavingsRate = (calculation.monthlyRequiredSavings / userInput.monthlyIncome) * 100;

  const insights = [
    {
      type: calculation.achievable ? 'success' : 'warning' as const,
      title: calculation.achievable ? 'Goal Achievable!' : 'Challenging Goal',
      description: calculation.achievable 
        ? `You can achieve ${fireType.name} by saving ${formatCurrency(calculation.monthlyRequiredSavings)} monthly.`
        : `This goal requires ${requiredSavingsRate.toFixed(0)}% savings rate. Consider adjusting your timeline or target.`
    },
    {
      type: 'info' as const,
      title: 'Current Progress',
      description: `You're ${currentProgress.toFixed(1)}% of the way to your FIRE goal with ${formatCurrency(userInput.currentSavings)} saved.`
    },
    {
      type: savingsRate >= 20 ? 'success' : 'warning' as const,
      title: 'Savings Rate',
      description: `Your current savings rate is ${savingsRate.toFixed(0)}%. ${savingsRate >= 50 ? 'Excellent!' : savingsRate >= 20 ? 'Good start!' : 'Consider increasing savings.'}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-3 rounded-xl text-white"
            style={{ backgroundColor: fireType.color }}
          >
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {fireType.name} Results
            </h2>
            <p className="text-gray-600">Your path to financial independence</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <span className="font-medium text-gray-800">Required Corpus</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculation.requiredCorpus)}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600" size={20} />
                <span className="font-medium text-gray-800">Monthly Savings Needed</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(calculation.monthlyRequiredSavings)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-orange-600" size={20} />
                <span className="font-medium text-gray-800">Time to Goal</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {calculation.yearsToGoal} years
              </p>
            </div>

            {fireType.hasIncomeComponent && calculation.monthlyRequiredIncome && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="text-purple-600" size={20} />
                  <span className="font-medium text-gray-800">Part-time Income Needed</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(calculation.monthlyRequiredIncome)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yearly Progress Chart */}
      <YearlyProgressChart 
        calculation={calculation} 
        userInput={userInput} 
      />

      {/* Detailed Breakdown */}
      <DetailedBreakdown 
        calculation={calculation} 
        userInput={userInput} 
      />
      {/* Progress Visualization */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-blue-600" size={20} />
          Your Progress
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">FIRE Goal Progress</span>
              <span className="text-sm text-gray-600">{currentProgress.toFixed(1)}%</span>
            </div>
            <ProgressBar 
              progress={currentProgress} 
              color={fireType.color}
              className="h-3"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Current Savings Rate</span>
              <span className="text-sm text-gray-600">{savingsRate.toFixed(0)}%</span>
            </div>
            <ProgressBar 
              progress={Math.min(savingsRate, 80)} 
              color={savingsRate >= 20 ? '#10B981' : '#F59E0B'}
              className="h-3"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Required Savings Rate</span>
              <span className="text-sm text-gray-600">{requiredSavingsRate.toFixed(0)}%</span>
            </div>
            <ProgressBar 
              progress={Math.min(requiredSavingsRate, 80)} 
              color={requiredSavingsRate <= 50 ? '#10B981' : '#EF4444'}
              className="h-3"
            />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-blue-600">💡</span>
          Personalized Insights
        </h3>
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4">Additional Metrics</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Projected corpus at retirement:</span>
              <span className="font-medium">{formatCurrency(calculation.projectedCorpusAtRetirement)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly passive income:</span>
              <span className="font-medium">{formatCurrency(calculation.monthlyPassiveIncome)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Current age:</span>
              <span className="font-medium">{userInput.currentAge} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">FIRE age:</span>
              <span className="font-medium">{userInput.retirementAge} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Life expectancy:</span>
              <span className="font-medium">{userInput.lifeExpectancy} years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}