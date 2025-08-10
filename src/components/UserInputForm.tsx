import React, { useState } from 'react';
import { UserInput, OneTimeExpense, RecurringExpense } from '../types/fire';
import { Plus, X, Calendar, DollarSign, TrendingUp, User, Percent } from 'lucide-react';

interface UserInputFormProps {
  initialInput: UserInput;
  oneTimeExpenses: OneTimeExpense[];
  recurringExpenses: RecurringExpense[];
  onInputChange: (input: UserInput) => void;
  onAddOneTimeExpense: (expense: OneTimeExpense) => void;
  onAddRecurringExpense: (expense: RecurringExpense) => void;
  onRemoveOneTimeExpense: (id: string) => void;
  onRemoveRecurringExpense: (id: string) => void;
}

export function UserInputForm({
  initialInput,
  oneTimeExpenses,
  recurringExpenses,
  onInputChange,
  onAddOneTimeExpense,
  onAddRecurringExpense,
  onRemoveOneTimeExpense,
  onRemoveRecurringExpense
}: UserInputFormProps) {
  const [input, setInput] = useState<UserInput>(initialInput);
  const [showOneTimeForm, setShowOneTimeForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [oneTimeForm, setOneTimeForm] = useState({
    name: '',
    amount: '',
    targetYear: new Date().getFullYear() + 5,
    category: 'other' as const,
    inflationRate: '',
    useCustomInflation: false
  });
  const [recurringForm, setRecurringForm] = useState({
    name: '',
    monthlyAmount: '',
    startYear: new Date().getFullYear() + 1,
    endYear: '',
    category: 'other' as const
  });

  const handleInputChange = (field: keyof UserInput, value: number) => {
    const newInput = { ...input, [field]: value };
    setInput(newInput);
    onInputChange(newInput);
  };

  const handleAddOneTimeExpense = () => {
    if (oneTimeForm.name && oneTimeForm.amount) {
      const expense: OneTimeExpense = {
        id: Date.now().toString(),
        name: oneTimeForm.name,
        amount: parseFloat(oneTimeForm.amount),
        targetYear: oneTimeForm.targetYear,
        category: oneTimeForm.category
      };

      // Add custom inflation rate if specified
      if (oneTimeForm.useCustomInflation && oneTimeForm.inflationRate) {
        expense.inflationRate = parseFloat(oneTimeForm.inflationRate);
      }

      onAddOneTimeExpense(expense);
      setOneTimeForm({ 
        name: '', 
        amount: '', 
        targetYear: new Date().getFullYear() + 5, 
        category: 'other',
        inflationRate: '',
        useCustomInflation: false
      });
      setShowOneTimeForm(false);
    }
  };

  const handleAddRecurringExpense = () => {
    if (recurringForm.name && recurringForm.monthlyAmount) {
      onAddRecurringExpense({
        id: Date.now().toString(),
        name: recurringForm.name,
        monthlyAmount: parseFloat(recurringForm.monthlyAmount),
        startYear: recurringForm.startYear,
        endYear: recurringForm.endYear ? parseInt(recurringForm.endYear) : undefined,
        category: recurringForm.category
      });
      setRecurringForm({ name: '', monthlyAmount: '', startYear: new Date().getFullYear() + 1, endYear: '', category: 'other' });
      setShowRecurringForm(false);
    }
  };

  const calculateInflatedAmount = (expense: OneTimeExpense) => {
    const yearsToExpense = expense.targetYear - new Date().getFullYear();
    const inflationToUse = expense.inflationRate || input.inflationRate;
    return expense.amount * Math.pow(1 + inflationToUse / 100, yearsToExpense);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="text-blue-600" size={20} />
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Age
            </label>
            <input
              type="number"
              value={input.currentAge}
              onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Retirement Age
            </label>
            <input
              type="number"
              value={input.retirementAge}
              onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="45"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Life Expectancy
            </label>
            <input
              type="number"
              value={input.lifeExpectancy}
              onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="85"
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="text-green-600" size={20} />
          Financial Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Savings (₹)
            </label>
            <input
              type="number"
              value={input.currentSavings}
              onChange={(e) => handleInputChange('currentSavings', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income (₹)
            </label>
            <input
              type="number"
              value={input.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="80000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Expenses (₹)
            </label>
            <input
              type="number"
              value={input.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="40000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Monthly Savings (₹)
            </label>
            <input
              type="number"
              value={input.currentMonthlySavings}
              onChange={(e) => handleInputChange('currentMonthlySavings', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="30000"
            />
          </div>
        </div>
      </div>

      {/* Investment Assumptions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-600" size={20} />
          Investment Assumptions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={input.expectedReturn}
              onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={input.inflationRate}
              onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="6"
            />
          </div>
        </div>
      </div>

      {/* One-time Expenses */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="text-orange-600" size={20} />
            One-time Future Expenses
          </h3>
          <button
            onClick={() => setShowOneTimeForm(!showOneTimeForm)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>

        {showOneTimeForm && (
          <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Expense name (e.g., Child's wedding)"
                value={oneTimeForm.name}
                onChange={(e) => setOneTimeForm({ ...oneTimeForm, name: e.target.value })}
                className="px-3 py-2 border border-orange-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={oneTimeForm.amount}
                onChange={(e) => setOneTimeForm({ ...oneTimeForm, amount: e.target.value })}
                className="px-3 py-2 border border-orange-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Target year"
                value={oneTimeForm.targetYear}
                onChange={(e) => setOneTimeForm({ ...oneTimeForm, targetYear: parseInt(e.target.value) })}
                className="px-3 py-2 border border-orange-200 rounded-lg"
              />
              <select
                value={oneTimeForm.category}
                onChange={(e) => setOneTimeForm({ ...oneTimeForm, category: e.target.value as any })}
                className="px-3 py-2 border border-orange-200 rounded-lg"
              >
                <option value="marriage">Marriage</option>
                <option value="house">House</option>
                <option value="car">Car</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Custom Inflation Rate Option */}
            <div className="mb-4">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={oneTimeForm.useCustomInflation}
                  onChange={(e) => setOneTimeForm({ ...oneTimeForm, useCustomInflation: e.target.checked })}
                  className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-orange-800">Use custom inflation rate</span>
              </label>
              {oneTimeForm.useCustomInflation && (
                <div className="flex items-center gap-2">
                  <Percent className="text-orange-600" size={16} />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Custom inflation rate (%)"
                    value={oneTimeForm.inflationRate}
                    onChange={(e) => setOneTimeForm({ ...oneTimeForm, inflationRate: e.target.value })}
                    className="flex-1 px-3 py-2 border border-orange-200 rounded-lg"
                  />
                  <span className="text-xs text-orange-600">
                    Default: {input.inflationRate}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddOneTimeExpense}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowOneTimeForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {oneTimeExpenses.map((expense) => {
            const inflatedAmount = calculateInflatedAmount(expense);
            const inflationUsed = expense.inflationRate || input.inflationRate;
            
            return (
              <div key={expense.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{expense.name}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {expense.targetYear}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>Today's value: ₹{expense.amount.toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-orange-600">
                        Future value: ₹{inflatedAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Inflation rate: {inflationUsed}% 
                      {expense.inflationRate && (
                        <span className="text-orange-600 ml-1">(custom)</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveOneTimeExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 transition-colors ml-3"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recurring Expenses */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Recurring Lifestyle Expenses
          </h3>
          <button
            onClick={() => setShowRecurringForm(!showRecurringForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>

        {showRecurringForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Expense name (e.g., Annual travel)"
                value={recurringForm.name}
                onChange={(e) => setRecurringForm({ ...recurringForm, name: e.target.value })}
                className="px-3 py-2 border border-blue-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Monthly amount (₹)"
                value={recurringForm.monthlyAmount}
                onChange={(e) => setRecurringForm({ ...recurringForm, monthlyAmount: e.target.value })}
                className="px-3 py-2 border border-blue-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="Start year"
                value={recurringForm.startYear}
                onChange={(e) => setRecurringForm({ ...recurringForm, startYear: parseInt(e.target.value) })}
                className="px-3 py-2 border border-blue-200 rounded-lg"
              />
              <input
                type="number"
                placeholder="End year (optional)"
                value={recurringForm.endYear}
                onChange={(e) => setRecurringForm({ ...recurringForm, endYear: e.target.value })}
                className="px-3 py-2 border border-blue-200 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddRecurringExpense}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowRecurringForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {recurringExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{expense.name}</span>
                <span className="text-gray-600 ml-2">₹{expense.monthlyAmount.toLocaleString()}/month</span>
                <span className="text-gray-500 ml-2">
                  ({expense.startYear}{expense.endYear ? ` - ${expense.endYear}` : '+'})
                </span>
              </div>
              <button
                onClick={() => onRemoveRecurringExpense(expense.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}