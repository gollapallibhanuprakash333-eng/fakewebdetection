import React, { useState } from 'react';
import { 
  Link2, 
  Send, 
  Trash2, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles,
  Copy,
  Lock,
  Unlock,
  Server,
  Globe,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Language, AnalysisResponse } from '../types';
import { translations } from '../i18n/translations';
import { analyzeUrlApi } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { RiskBadge } from '../components/RiskBadge';
import { IndicatorsList } from '../components/IndicatorsList';
import { RecommendationsCard } from '../components/RecommendationsCard';

interface UrlCheckerProps {
  language: Language;
}

export const UrlChecker: React.FC<UrlCheckerProps> = ({ language }) => {
  const t = translations[language];
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const samples = [
    {
      title: "Legitimate Bank Portal",
      type: "Low Risk",
      url: "https://www.onlinesbi.sbi/portal/login.html"
    },
    {
      title: "Brand in Subdomain Trap",
      type: "High Risk",
      url: "https://sbi.login-portal.secure-banking.xyz/update-pan"
    },
    {
      title: "Raw IP Host with Insecure HTTP",
      type: "High Risk",
      url: "http://185.220.101.5/ebanking/login.php"
    },
    {
      title: "Obfuscated Shortened Link",
      type: "Suspicious",
      url: "https://bit.ly/3xY9kLp"
    },
    {
      title: "Suspicious TLD with APK Path",
      type: "High Risk",
      url: "http://indiapost-parcel-tracking.buzz/download-app.apk"
    },
    {
      title: "Embedded Credentials Trick",
      type: "High Risk",
      url: "https://admin:pass123@portal-verification.club/login"
    }
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError("Please enter a web address or link to inspect.");
      return;
    }

    if (url.length > 2048) {
      setError("URL exceeds the maximum limit of 2,048 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await analyzeUrlApi(url.trim());
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to analyze URL. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = [
      `=== ScamShield AI Risk Assessment Report ===`,
      `Type: URL Security Inspection (Zero Network Calls)`,
      `Submitted Link (Inactive Text): ${result.details?.submitted_url || url}`,
      `Risk Level: ${result.risk_level}`,
      `Risk Score: ${result.risk_score} / 100`,
      `Hostname: ${result.details?.hostname || 'Unknown'}`,
      `Registrable Domain: ${result.details?.registrable_domain || 'Unknown'}`,
      `Timestamp: ${result.timestamp}`,
      `\nKey Findings:`,
      ...result.indicators.map(ind => `- [${ind.severity.toUpperCase()}] ${ind.category}: ${ind.explanation}`),
      `\nSafe Action Protocol:`,
      ...result.safe_actions.map(act => `- ${act}`),
      `\nLimitation: ${result.limitation_notice}`
    ].join('\n');

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Link2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t.nav.url}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Static heuristic inspector: Subdomain squatting, IP addresses, URL shorteners, and credential phishing patterns.
          </p>
        </div>

        <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Network Outbound (SSRF Safe)</span>
        </div>
      </div>

      {/* Input Workspace */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4 shadow-xl">
        <label className="text-sm font-semibold text-slate-200">
          Target Web Address / URL
        </label>

        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://sbi.netbanking-update.xyz/verify-pan"
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 p-4 pl-4 text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <p className="text-xs text-slate-500">
          Tip: You do not need to click or open the link. We evaluate structure, domain ownership, and obfuscation heuristics locally without browsing to it.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleClear}
            disabled={!url && !result}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.actions.clear}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t.actions.analyzing}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>Inspect URL Safety</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Demonstration Links */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Load Demonstration Link Scenarios:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {samples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setUrl(s.url);
                  setResult(null);
                  setError(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-left"
              >
                <span className="font-medium">{s.title}</span>
                <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded ${
                  s.type === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-400' : 
                  s.type === 'Suspicious' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {s.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
          {/* Top Result Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <RiskGauge score={result.risk_score} level={result.risk_level} size={150} />
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <RiskBadge level={result.risk_level} size="lg" />
                  <span className="text-xs font-mono text-slate-400 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                    {result.indicators_count} Structural Risk Flags
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  URL Risk Level: {result.risk_level}
                </h3>
                {/* Submitted URL displayed as inert text only (never an active link) */}
                <div className="text-xs font-mono text-slate-300 bg-slate-950/90 px-3 py-1.5 rounded border border-slate-800 select-all break-all max-w-lg">
                  Target (Inert Text): {result.details?.submitted_url || url}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? t.actions.copied : t.actions.copyReport}</span>
              </button>

              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.actions.analyzeAnother}</span>
              </button>
            </div>
          </div>

          {/* Parsed Structure Diagnostics */}
          {result.details && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Technical Hostname Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Protocol</div>
                  <div className="text-white font-semibold flex items-center gap-1 mt-0.5">
                    {result.details.scheme === 'https' ? <Lock className="w-3 h-3 text-emerald-400" /> : <Unlock className="w-3 h-3 text-amber-400" />}
                    <span>{result.details.scheme?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Registrable Apex</div>
                  <div className="text-cyan-400 font-semibold truncate mt-0.5" title={result.details.registrable_domain}>
                    {result.details.registrable_domain || 'N/A'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Subdomain</div>
                  <div className="text-white font-semibold truncate mt-0.5" title={result.details.subdomain}>
                    {result.details.subdomain || '(None)'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">Target Port</div>
                  <div className="text-white font-semibold mt-0.5">
                    {result.details.port || 443}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Indicators & Evidence */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">
              URL Threat Heuristics & Findings
            </h4>
            <IndicatorsList 
              indicators={result.indicators} 
              emptyMessage="No structural spoofing, raw IP hosts, or brand lookalike indicators detected."
            />
          </div>

          {/* Recommendations Card */}
          <RecommendationsCard
            level={result.risk_level}
            safeActions={result.safe_actions}
            recommendations={result.recommendations}
          />

          {/* Disclaimer */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Limitation: </span>
            {result.limitation_notice}
          </div>
        </div>
      )}
    </div>
  );
};
