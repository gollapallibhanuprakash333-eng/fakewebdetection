import React from 'react';
import { ShieldCheck, PhoneCall, ExternalLink, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../types';

interface RecommendationsCardProps {
  level: RiskLevel;
  safeActions: string[];
  recommendations: string[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  level,
  safeActions,
  recommendations
}) => {
  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400" />
        <h4 className="text-base font-bold text-white tracking-wide">
          Safe Next Steps & Safety Protocol
        </h4>
      </div>

      {/* Immediate Safe Actions */}
      {safeActions && safeActions.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            Immediate Recommended Actions
          </span>
          <ul className="space-y-2">
            {safeActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specific indicator recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            Rule-Specific Safeguards
          </span>
          <ul className="space-y-2">
            {recommendations.slice(0, 4).map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Cybercrime Helpline & Portal Guidance */}
      <div className="mt-4 p-3.5 rounded-lg bg-slate-950/70 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Suspect Cyber Fraud? (India Helpline)</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>National Helpline:</span>
              <span className="text-cyan-400 font-mono text-base">1930</span>
            </div>
          </div>
        </div>

        <a 
          href="https://cybercrime.gov.in" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
        >
          <span>cybercrime.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
};
