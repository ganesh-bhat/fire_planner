import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface InsightCardProps {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
}

export function InsightCard({ type, title, description }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-orange-600" size={20} />;
      case 'info':
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getBackgroundColor()} backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div>
          <h4 className="font-medium text-gray-800 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}