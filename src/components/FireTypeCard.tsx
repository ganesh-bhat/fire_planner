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

interface FireTypeCardProps {
  fireType: FireType;
  onSelect: (fireType: FireType) => void;
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

export function FireTypeCard({ fireType, onSelect }: FireTypeCardProps) {
  const Icon = iconMap[fireType.icon as keyof typeof iconMap];
  
  return (
    <button
      onClick={() => onSelect(fireType)}
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
}