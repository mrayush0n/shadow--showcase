
import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-aurora-200 dark:border-aurora-800" />

      {/* Spinning gradient ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
        style={{
          borderTopColor: '#6366f1',
          borderRightColor: '#ec4899',
          animationDuration: '0.8s',
        }}
      />

      {/* Inner glow */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-aurora-500/20 to-rose-500/20 blur-sm animate-pulse" />
    </div>
  );
};