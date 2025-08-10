import React, { useState } from 'react';
import { FireType, UserInput, City } from '../types/fire';
import { calculateFireGoal, formatCurrency, calculateGeoFireSavings } from '../utils/fireCalculations';
import { indianCities } from '../data/cities';
import { MapPin, TrendingDown, Calculator, ArrowRight } from 'lucide-react';

interface GeoFirePlannerProps {
  userInput: UserInput;
  fireTypes: FireType[];
}

export function GeoFirePlanner({ userInput, fireTypes }: GeoFirePlannerProps) {
  const [selectedFireType, setSelectedFireType] = useState<FireType>(fireTypes.find(t => t.id === 'geo') || fireTypes[0]);
  const [currentCity, setCurrentCity] = useState<City>(indianCities[0]);
  const [targetCity, setTargetCity] = useState<City>(indianCities[4]); // Goa as default

  const calculateCityComparison = (city: City) => {
    const adjustedExpenses = userInput.monthlyExpenses * city.costMultiplier;
    const adjustedInput = { ...userInput, monthlyExpenses: adjustedExpenses };
    return calculateFireGoal(selectedFireType, adjustedInput);
  };

  const currentCityCalculation = calculateCityComparison(currentCity);
  const targetCityCalculation = calculateCityComparison(targetCity);
  
  const monthlySavings = calculateGeoFireSavings(userInput.monthlyExpenses, targetCity.costMultiplier);
  const annualSavings = monthlySavings * 12;
  const corpusReduction = currentCityCalculation.requiredCorpus - targetCityCalculation.requiredCorpus;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Geo FIRE Planner
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover how relocating to a different city can accelerate your path to financial independence
          by reducing your living costs and required FIRE corpus.
        </p>
      </div>

      {/* Configuration */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="text-blue-600" size={20} />
            Configuration
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FIRE Strategy
              </label>
              <select
                value={selectedFireType.id}
                onChange={(e) => setSelectedFireType(fireTypes.find(t => t.id === e.target.value) || fireTypes[0])}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {fireTypes.map((fireType) => (
                  <option key={fireType.id} value={fireType.id}>
                    {fireType.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current City
              </label>
              <select
                value={currentCity.id}
                onChange={(e) => setCurrentCity(indianCities.find(c => c.id === e.target.value) || indianCities[0])}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {indianCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Retirement City
              </label>
              <select
                value={targetCity.id}
                onChange={(e) => setTargetCity(indianCities.find(c => c.id === e.target.value) || indianCities[0])}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {indianCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown className="text-green-600" size={20} />
            Geo FIRE Benefits
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Monthly Savings</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(monthlySavings)}
                </span>
              </div>
              <p className="text-xs text-green-700">
                Reduced monthly expenses by relocating
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Annual Savings</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(annualSavings)}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Total yearly cost reduction
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Corpus Reduction</span>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(corpusReduction)}
                </span>
              </div>
              <p className="text-xs text-purple-700">
                Less FIRE corpus needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* City Comparison */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="text-orange-600" size={20} />
          City Comparison
        </h3>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Current City */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin className="text-gray-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{currentCity.name}</h4>
                <p className="text-sm text-gray-600">{currentCity.state}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Expenses:</span>
                <span className="font-medium">{formatCurrency(userInput.monthlyExpenses * currentCity.costMultiplier)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Corpus:</span>
                <span className="font-medium">{formatCurrency(currentCityCalculation.requiredCorpus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Savings Needed:</span>
                <span className="font-medium">{formatCurrency(currentCityCalculation.monthlyRequiredSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Years to FIRE:</span>
                <span className="font-medium">{currentCityCalculation.yearsToGoal} years</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center lg:flex-col">
            <ArrowRight className="text-blue-600 lg:rotate-90" size={32} />
          </div>

          {/* Target City */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{targetCity.name}</h4>
                <p className="text-sm text-gray-600">{targetCity.state}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Expenses:</span>
                <span className="font-medium text-green-600">{formatCurrency(userInput.monthlyExpenses * targetCity.costMultiplier)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Corpus:</span>
                <span className="font-medium text-green-600">{formatCurrency(targetCityCalculation.requiredCorpus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Savings Needed:</span>
                <span className="font-medium text-green-600">{formatCurrency(targetCityCalculation.monthlyRequiredSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Years to FIRE:</span>
                <span className="font-medium text-green-600">{targetCityCalculation.yearsToGoal} years</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Rankings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-6">FIRE-Friendly City Rankings</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indianCities
            .map(city => ({
              ...city,
              calculation: calculateCityComparison(city)
            }))
            .sort((a, b) => a.calculation.requiredCorpus - b.calculation.requiredCorpus)
            .map((city, index) => (
              <div
                key={city.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  city.id === targetCity.id
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setTargetCity(city)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{city.name}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{city.state}</p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corpus:</span>
                    <span className="font-medium">{formatCurrency(city.calculation.requiredCorpus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Years:</span>
                    <span className="font-medium">{city.calculation.yearsToGoal}y</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Factor:</span>
                    <span className="font-medium">{(city.costMultiplier * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Lifestyle Considerations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-600">⚖️</span>
          Lifestyle Considerations
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Financial Benefits</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Lower cost of living reduces FIRE corpus requirement</li>
              <li>• Accelerated timeline to financial independence</li>
              <li>• Higher purchasing power for the same income</li>
              <li>• Potential for better investment opportunities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Quality of Life Factors</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Climate and weather preferences</li>
              <li>• Healthcare and infrastructure quality</li>
              <li>• Social connections and community</li>
              <li>• Cultural activities and entertainment options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}