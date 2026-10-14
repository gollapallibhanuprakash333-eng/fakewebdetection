import React from 'react';
import { RiskLevel } from '../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ 
  score, 
  level, 
  size = 180 
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score clamped 0-100
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const colorConfig = {
    'Low Risk': {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)',
      text: 'text-emerald-400',
      label: 'Low Risk'
    },
    'Suspicious': {
      stroke: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      text: 'text-amber-400',
      label: 'Suspicious'
    },
    'High Risk': {
      stroke: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.4)',
      text: 'text-rose-400',
      label: 'High Risk'
    }
  }[level] || {
    stroke: '#64748b',
    glow: 'rgba(100, 116, 139, 0.4)',
    text: 'text-slate-400',
    label: level
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <svg 
          width={size} 
          height={size} 
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorConfig.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${colorConfig.glow})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">
            {clampedScore}
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            out of 100
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className={`inline-block font-semibold text-sm tracking-wide ${colorConfig.text}`}>
          {colorConfig.label}
        </span>
      </div>
    </div>
  );
};
