import React, { useState } from 'react';
import { FireType, UserInput, OneTimeExpense, RecurringExpense } from '../types/fire';
import { calculateFireGoal, formatCurrency } from '../utils/fireCalculations';
import { BarChart3, TrendingUp, Settings } from 'lucide-react';

interface ScenarioPlannerProps {
  userInput: UserInput;
  fireTypes: FireType[];
  oneTimeExpenses: OneTimeExpense[];
  recurringExpenses: RecurringExpense[];
}

interface Scenario {
  name: string;
  changes: Partial<UserInput>;
  color: string;
}

export function ScenarioPlanner({
  userInput,
  fireTypes,
  oneTimeExpenses,
  recurringExpenses
}: ScenarioPlannerProps) {
  const [selectedFireType, setSelectedFireType] = useState<FireType>(fireTypes[0]);
  const [customScenario, setCustomScenario] = useState<Partial<UserInput>>({});
  
  const baseScenarios: Scenario[] = [
    {
      name: 'Current Plan',
      changes: {},
      color: '#6B7280'
    },
    {
      name: 'Increase Savings +₹10K',
      changes: { currentMonthlySavings: userInput.currentMonthlySavings + 10000 },
      color: '#10B981'
    },
    {
      name: 'Reduce Expenses -₹5K',
      changes: { monthlyExpenses: userInput.monthlyExpenses - 5000 },
      color: '#3B82F6'
    },
    {
      name: 'Retire 5 Years Later',
      changes: { retirementAge: userInput.retirementAge + 5 },
      color: '#F59E0B'
    },
    {
      name: 'Higher Returns +2%',
      changes: { expectedReturn: userInput.expectedReturn + 2 },
      color: '#8B5CF6'
    }
  ];

  const calculateScenario = (scenario: Scenario) => {
    const scenarioInput = { ...userInput, ...scenario.changes };
    return calculateFireGoal(selectedFireType, scenarioInput, oneTimeExpenses, recurringExpenses);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Scenario Planning
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Explore different what-if scenarios to understand how changes in your financial plan 
          affect your path to FIRE.
        </p>
      </div>

      {/* FIRE Type Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="text-blue-600" size={20} />
          Select FIRE Type for Analysis
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fireTypes.map((fireType) => (
            <button
              key={fireType.id}
              onClick={() => setSelectedFireType(fireType)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedFireType.id === fireType.id
                  ? 'bg-white shadow-md border-blue-300 text-blue-700'
                  : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white/80'
              }`}
            >
              {fireType.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="text-green-600" size={20} />
          Scenario Comparison for {selectedFireType.name}
        </h3>

        <div className="space-y-4">
          {baseScenarios.map((scenario, index) => {
            const calculation = calculateScenario(scenario);
            const isBaseline = index === 0;
            
            return (
              <div
                key={scenario.name}
                className={`p-4 rounded-xl border ${
                  isBaseline 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-100 hover:bg-gray-50 transition-colors'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: scenario.color }}
                    />
                    <h4 className="font-medium text-gray-800">{scenario.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-lg ${
                      calculation.achievable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {calculation.achievable ? 'Achievable' : 'Challenging'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Required Corpus</span>
                    <span className="font-semibold">{formatCurrency(calculation.requiredCorpus)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Monthly Savings</span>
                    <span className="font-semibold">{formatCurrency(calculation.monthlyRequiredSavings)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Time to Goal</span>
                    <span className="font-semibold">{calculation.yearsToGoal} years</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Shortfall</span>
                    <span className={`font-semibold ${
                      calculation.shortfall > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {calculation.shortfall > 0 ? formatCurrency(calculation.shortfall) : 'None'}
                    </span>
                  </div>
                </div>
                
                {Object.keys(scenario.changes).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(scenario.changes).map(([key, value]) => (
                        <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                          {key}: {typeof value === 'number' && key.includes('Savings') ? formatCurrency(value) : value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Scenario Builder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={20} />
          Build Custom Scenario
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Savings Change (₹)
            </label>
            <input
              type="number"
              placeholder="e.g., +15000"
              onChange={(e) => setCustomScenario({
                ...customScenario,
                currentMonthlySavings: userInput.currentMonthlySavings + parseInt(e.target.value || '0')
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retirement Age Adjustment
            </label>
            <input
              type="number"
              placeholder="e.g., +3"
              onChange={(e) => setCustomScenario({
                ...customScenario,
                retirementAge: userInput.retirementAge + parseInt(e.target.value || '0')
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Return Adjustment (%)
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g., +1.5"
              onChange={(e) => setCustomScenario({
                ...customScenario,
                expectedReturn: userInput.expectedReturn + parseFloat(e.target.value || '0')
              })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {Object.keys(customScenario).length > 0 && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-3">Custom Scenario Results</h4>
            {(() => {
              const customInput = { ...userInput, ...customScenario };
              const customCalculation = calculateFireGoal(selectedFireType, customInput, oneTimeExpenses, recurringExpenses);
              
              return (
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-purple-700 block">Required Corpus</span>
                    <span className="font-semibold text-purple-800">{formatCurrency(customCalculation.requiredCorpus)}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 block">Monthly Savings</span>
                    <span className="font-semibold text-purple-800">{formatCurrency(customCalculation.monthlyRequiredSavings)}</span>
                  </div>
                  <div>
                    <span className="text-purple-700 block">Time to Goal</span>
                    <span className="font-semibold text-purple-800">{customCalculation.yearsToGoal} years</span>
                  </div>
                  <div>
                    <span className="text-purple-700 block">Achievable</span>
                    <span className={`font-semibold ${
                      customCalculation.achievable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {customCalculation.achievable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">💡</span>
          Scenario Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <p><strong>Increasing Savings:</strong> Every ₹10,000 additional monthly savings can significantly reduce your time to FIRE.</p>
            <p><strong>Expense Reduction:</strong> Cutting expenses has a dual benefit - lower corpus needed and higher savings rate.</p>
          </div>
          <div>
            <p><strong>Timeline Flexibility:</strong> Working even 2-3 years longer can dramatically improve your financial security.</p>
            <p><strong>Return Assumptions:</strong> Conservative return estimates provide a safety buffer for your planning.</p>
          </div>
        </div>
      </div>
    </div>
  );
}