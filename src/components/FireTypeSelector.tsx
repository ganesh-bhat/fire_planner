import React from 'react';
import { FireType } from '../types/fire';
import { 
  Leaf, 
  Waves, 
  Coffee, 
  Home, 
  Crown, 
  Bird, 
  MapPin, 
  Palette 
} from 'lucide-react';

interface FireTypeSelectorProps {
  fireTypes: FireType[];
  onSelectFireType: (fireType: FireType) => void;
}

const iconMap = {
  Leaf,
  Waves,
  Coffee,
  Home,
  Crown,
  Bird,
  MapPin,
  Palette
};

export function FireTypeSelector({ fireTypes, onSelectFireType }: FireTypeSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Choose Your FIRE Strategy
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select the Financial Independence approach that aligns with your lifestyle goals. 
          Each strategy has different requirements and timelines.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fireTypes.map((fireType) => {
          const Icon = iconMap[fireType.icon as keyof typeof iconMap];
          
          return (
            <button
              key={fireType.id}
              onClick={() => onSelectFireType(fireType)}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div 
                  className="p-4 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: fireType.color }}
                >
                  <Icon size={32} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    {fireType.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {fireType.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100 w-full">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    {fireType.multiplier}x multiplier
                  </span>
                  {fireType.hasIncomeComponent && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Part-time income
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-blue-600">💡</span>
          Quick Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Lean/Coast FIRE:</strong> Minimal expenses, maximum frugality</p>
            <p><strong>Chubby/Fat FIRE:</strong> Comfortable to luxurious lifestyle</p>
          </div>
          <div>
            <p><strong>Barista/Hobby FIRE:</strong> Partial income from work/hobbies</p>
            <p><strong>Geo/Flamingo FIRE:</strong> Location or lifestyle optimized</p>
          </div>
        </div>
      </div>
    </div>
  );
}