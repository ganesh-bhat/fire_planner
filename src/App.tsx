import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FireTypeSelector } from './components/FireTypeSelector';
import { UserInputForm } from './components/UserInputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ScenarioPlanner } from './components/ScenarioPlanner';
import { GeoFirePlanner } from './components/GeoFirePlanner';
import { FireType, UserInput, OneTimeExpense, RecurringExpense } from './types/fire';
import { fireTypes } from './data/fireTypes';

type ActiveTab = 'calculator' | 'scenarios' | 'geo-fire';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [selectedFireType, setSelectedFireType] = useState<FireType | null>(null);
  const [userInput, setUserInput] = useState<UserInput>({
    currentAge: 25,
    retirementAge: 45,
    lifeExpectancy: 85,
    currentSavings: 500000,
    monthlyExpenses: 40000,
    monthlyIncome: 80000,
    currentMonthlySavings: 30000,
    expectedReturn: 12,
    inflationRate: 6
  });
  const [oneTimeExpenses, setOneTimeExpenses] = useState<OneTimeExpense[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Show results initially when a FIRE type is selected
  useEffect(() => {
    if (selectedFireType) {
      setShowResults(true);
    }
  }, [selectedFireType]);

  const handleFireTypeSelect = (fireType: FireType) => {
    setSelectedFireType(fireType);
  };

  const handleInputChange = (input: UserInput) => {
    setUserInput(input);
    setShowResults(true);
  };

  const handleAddOneTimeExpense = (expense: OneTimeExpense) => {
    setOneTimeExpenses([...oneTimeExpenses, expense]);
  };

  const handleAddRecurringExpense = (expense: RecurringExpense) => {
    setRecurringExpenses([...recurringExpenses, expense]);
  };

  const handleRemoveOneTimeExpense = (id: string) => {
    setOneTimeExpenses(oneTimeExpenses.filter(e => e.id !== id));
  };

  const handleRemoveRecurringExpense = (id: string) => {
    setRecurringExpenses(recurringExpenses.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            {!selectedFireType ? (
              <FireTypeSelector
                fireTypes={fireTypes}
                onSelectFireType={handleFireTypeSelect}
              />
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                    <button
                      onClick={() => setSelectedFireType(null)}
                      className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors"
                    >
                      ← Back to FIRE Types
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                      <div 
                        className="p-3 rounded-xl text-white"
                        style={{ backgroundColor: selectedFireType.color }}
                      >
                        <span className="text-xl">🎯</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">{selectedFireType.name}</h2>
                        <p className="text-gray-600 text-sm">{selectedFireType.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <UserInputForm
                    initialInput={userInput}
                    oneTimeExpenses={oneTimeExpenses}
                    recurringExpenses={recurringExpenses}
                    onInputChange={handleInputChange}
                    onAddOneTimeExpense={handleAddOneTimeExpense}
                    onAddRecurringExpense={handleAddRecurringExpense}
                    onRemoveOneTimeExpense={handleRemoveOneTimeExpense}
                    onRemoveRecurringExpense={handleRemoveRecurringExpense}
                  />
                </div>
                
                {showResults && (
                  <div className="lg:sticky lg:top-8">
                    <ResultsDashboard
                      fireType={selectedFireType}
                      userInput={userInput}
                      oneTimeExpenses={oneTimeExpenses}
                      recurringExpenses={recurringExpenses}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scenarios' && (
          <ScenarioPlanner
            userInput={userInput}
            fireTypes={fireTypes}
            oneTimeExpenses={oneTimeExpenses}
            recurringExpenses={recurringExpenses}
          />
        )}

        {activeTab === 'geo-fire' && (
          <GeoFirePlanner
            userInput={userInput}
            fireTypes={fireTypes}
          />
        )}
      </main>
    </div>
  );
}

export default App;