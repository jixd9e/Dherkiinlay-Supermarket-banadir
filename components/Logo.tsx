import React from 'react';

export const LogoIcon: React.FC<{ className?: string; color?: string }> = ({ className = "w-10 h-10", color }) => {
  const strokeColor = color || "#15803d";
  const leafFill = color ? "#fff" : "#4ade80";
  const bodyFill = color || "#16a34a";
  const textureStroke = color || "#14532d";

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Handle */}
      <path d="M25 35 C25 10 75 10 75 35" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" />
      
      {/* Leaf */}
       <path d="M72 35 C72 35 85 15 95 25 C95 25 90 45 72 35" fill={leafFill} />
      
      {/* Basket Body */}
      <path d="M10 35 H90 L80 80 C78 90 70 95 50 95 C30 95 22 90 20 80 L10 35 Z" fill={bodyFill} />
      
      {/* Grid/Texture */}
      <path d="M15 55 H85" stroke={textureStroke} strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M20 75 H80" stroke={textureStroke} strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M35 35 L40 92" stroke={textureStroke} strokeWidth="3" strokeOpacity="0.3"/>
      <path d="M65 35 L60 92" stroke={textureStroke} strokeWidth="3" strokeOpacity="0.3"/>
    </svg>
  );
};

export const Logo: React.FC<{ className?: string; variant?: 'default' | 'white' }> = ({ className, variant = 'default' }) => {
  const isWhite = variant === 'white';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon className="w-10 h-10 flex-shrink-0" color={isWhite ? '#fff' : undefined} />
      <div className="flex flex-col leading-none justify-center">
        <span className={`text-xl md:text-2xl font-bold tracking-tight ${isWhite ? 'text-white' : 'text-green-700'}`}>Dherkiinlay</span>
        <span className={`text-[0.6rem] md:text-xs font-bold tracking-widest uppercase ${isWhite ? 'text-yellow-300' : 'text-orange-500'}`}>Supermarket</span>
      </div>
    </div>
  );
};