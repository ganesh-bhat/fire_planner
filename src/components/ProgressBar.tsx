import React from 'react';

interface ProgressBarProps {
  progress: number;
  color: string;
  className?: string;
}

export function ProgressBar({ progress, color, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full transition-all duration-700 ease-out rounded-full"
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
}