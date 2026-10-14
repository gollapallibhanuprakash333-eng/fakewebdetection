import React from 'react';
import { AlertCircle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { Indicator } from '../types';

interface IndicatorsListProps {
  indicators: Indicator[];
  emptyMessage?: string;
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({ 
  indicators,
  emptyMessage = "No suspicious indicators or high-risk scam patterns detected."
}) => {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  const getSeverityBadge = (severity: Indicator['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertOctagon className="w-3 h-3" /> Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <AlertCircle className="w-3 h-3" /> High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" /> Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Info className="w-3 h-3" /> Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {indicators.map((ind, idx) => (
        <div 
          key={`${ind.rule_id}-${idx}`}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                {ind.category}
              </span>
              <span className="text-xs font-mono text-slate-500">
                ({ind.rule_id})
              </span>
            </div>
            <div>
              {getSeverityBadge(ind.severity)}
            </div>
          </div>

          {/* Evidence snippet */}
          {ind.evidence && (
            <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-cyan-300 break-all">
              <span className="text-slate-500 select-none mr-2">Evidence:</span>
              "{ind.evidence}"
            </div>
          )}

          {/* Explanation */}
          <p className="text-sm text-slate-300 leading-relaxed mb-2">
            {ind.explanation}
          </p>

          {/* Recommended Safe Step */}
          {ind.recommendation && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-emerald-400/90 flex items-start gap-1.5 font-medium">
              <span className="text-emerald-500 font-bold select-none">Action:</span>
              <span>{ind.recommendation}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
