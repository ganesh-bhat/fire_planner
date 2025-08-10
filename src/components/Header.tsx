import React from 'react';
import { Calculator, TrendingUp, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'scenarios' | 'geo-fire';
  onTabChange: (tab: 'calculator' | 'scenarios' | 'geo-fire') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { 
      id: 'calculator' as const, 
      label: 'FIRE Calculator', 
      icon: Calculator,
      description: 'Calculate your path to financial independence'
    },
    { 
      id: 'scenarios' as const, 
      label: 'Scenario Planner', 
      icon: TrendingUp,
      description: 'Explore what-if scenarios'
    },
    { 
      id: 'geo-fire' as const, 
      label: 'Geo FIRE', 
      icon: MapPin,
      description: 'Compare cities for retirement'
    }
  ];

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <span className="text-white text-xl font-bold">🔥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FIRE Planner
              </h1>
              <p className="text-xs text-gray-600">Financial Independence, Retire Early</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value as any)}
              className="bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}