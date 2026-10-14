import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ 
  level, 
  size = 'md', 
  showIcon = true 
}) => {
  const config = {
    'Low Risk': {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-emerald-500/10',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    'Suspicious': {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'shadow-amber-500/10',
      icon: AlertTriangle,
      label: 'Suspicious'
    },
    'High Risk': {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glow: 'shadow-rose-500/20',
      icon: ShieldAlert,
      label: 'High Risk'
    }
  }[level] || {
    bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    glow: '',
    icon: ShieldCheck,
    label: level
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5 font-medium',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${config.glow} ${sizeClasses}`}>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{config.label}</span>
    </span>
  );
};
