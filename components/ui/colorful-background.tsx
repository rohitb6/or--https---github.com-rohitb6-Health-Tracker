import React from 'react';

interface ColorfulBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function ColorfulBackground({ children, className = '' }: ColorfulBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-gradient" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 opacity-50 animate-gradient-delayed" />
      <div className="absolute inset-0 bg-gradient-to-bl from-violet-400 via-purple-500 to-fuchsia-500 opacity-30 animate-gradient-slow" />
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
} 