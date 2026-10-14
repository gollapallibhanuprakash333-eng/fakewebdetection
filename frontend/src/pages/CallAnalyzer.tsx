import React, { useState } from 'react';
import { 
  PhoneCall, 
  Send, 
  Trash2, 
  Clipboard, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Building2, 
  HelpCircle,
  Sparkles,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { Language, AnalysisResponse } from '../types';
import { translations } from '../i18n/translations';
import { analyzeCallApi } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { RiskBadge } from '../components/RiskBadge';
import { IndicatorsList } from '../components/IndicatorsList';
import { RecommendationsCard } from '../components/RecommendationsCard';

interface CallAnalyzerProps {
  language: Language;
}

export const CallAnalyzer: React.FC<CallAnalyzerProps> = ({ language }) => {
  const t = translations[language];
  const [transcript, setTranscript] = useState('');
  const [claimedOrg, setClaimedOrg] = useState('');
  const [callerDemand, setCallerDemand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const samples = [
    {
      title: "Digital Arrest & Airport Parcel",
      type: "High Risk",
      claimedOrg: "Mumbai Police & Narcotics Bureau",
      demand: "Stay on video call and transfer verification deposit",
      content: "Caller: I am DCP Sharma calling from Mumbai Police Cyber Cell. An international parcel was seized at Mumbai airport under your Aadhaar number containing MDMA narcotics and 5 fake passports. An arrest warrant has been issued. You are placed under digital arrest right now. Do not tell your family or disconnect the Skype call, or officers will raid your home."
    },
    {
      title: "Remote Access AnyDesk Scam",
      type: "High Risk",
      claimedOrg: "Bank Technical Support",
      demand: "Install AnyDesk app from Play Store",
      content: "Caller: Hello sir, I am calling from bank technical department. Your mobile banking has a critical security bug. To resolve this immediately, please download AnyDesk from Google Play Store. Once opened, tell me the 9-digit code displayed on your screen so I can securely configure your settings."
    },
    {
      title: "Fake Fraud Prevention OTP Demand",
      type: "High Risk",
      claimedOrg: "Credit Card Fraud Cell",
      demand: "Read out the OTP to cancel payment",
      content: "Caller: Urgent alert from card division. An unauthorized international transaction of ₹78,500 has just been initiated on your credit card. I can cancel this charge immediately for you, but I need the 6-digit OTP code that was just sent to your phone. Please read it to me quickly before the transaction settles."
    },
    {
      title: "Normal Broadband Customer Service",
      type: "Low Risk",
      claimedOrg: "Airtel Broadband Care",
      demand: "Account renewal inquiry",
      content: "Agent: Good afternoon, thank you for reaching out to Airtel broadband customer care. I see your optical fiber plan is expiring next week on the 20th. Would you like to renew with the same speed plan or upgrade to our gigabit speed package?"
    }
  ];

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError("Please paste or type the conversation transcript.");
      return;
    }

    if (transcript.length < 5) {
      setError("Transcript must contain at least 5 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await analyzeCallApi(transcript, claimedOrg, callerDemand, language);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to analyze call transcript. Ensure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setClaimedOrg('');
    setCallerDemand('');
    setResult(null);
    setError(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = [
      `=== ScamShield AI Risk Assessment Report ===`,
      `Type: Phone Call Transcript Analysis`,
      `Risk Level: ${result.risk_level}`,
      `Risk Score: ${result.risk_score} / 100`,
      `Claimed Organization: ${claimedOrg || 'Not specified'}`,
      `Caller Demands: ${callerDemand || 'Not specified'}`,
      `Timestamp: ${result.timestamp}`,
      `\nDetected Tactics:`,
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
              <PhoneCall className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t.nav.call}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Detect digital arrest intimidation, AnyDesk remote-access traps, secret accounts, and fear tactics.
          </p>
        </div>

        <div className="text-xs text-amber-400/90 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Analyzes user-supplied text (no audio tapping)</span>
        </div>
      </div>

      {/* Input Workspace */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4 shadow-xl">
        {/* Optional Context Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Claimed Organization / Entity (Optional)</span>
            </label>
            <input
              type="text"
              value={claimedOrg}
              onChange={(e) => setClaimedOrg(e.target.value)}
              placeholder="e.g. CBI, Mumbai Police, HDFC Bank, FedEx..."
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 p-3 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Specific Demand or Request (Optional)</span>
            </label>
            <input
              type="text"
              value={callerDemand}
              onChange={(e) => setCallerDemand(e.target.value)}
              placeholder="e.g. Transfer money to safe account, install AnyDesk..."
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 p-3 text-xs text-white placeholder-slate-600 outline-none"
            />
          </div>
        </div>

        {/* Transcript Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200">
              Call Transcript or Conversation Summary
            </label>
            <span className="text-xs text-slate-400">{transcript.length} chars</span>
          </div>

          <textarea
            rows={6}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type or paste what the caller said to you... (e.g. 'DCP calling from Cyber branch. A package in your name was seized with narcotics...')"
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all resize-y"
          />
        </div>

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
            disabled={!transcript && !result}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.actions.clear}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !transcript.trim()}
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
                <span>Analyze Call Script</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Demonstration Buttons */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Test Real Scam Call Scenarios:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {samples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(s.content);
                  setClaimedOrg(s.claimedOrg);
                  setCallerDemand(s.demand);
                  setResult(null);
                  setError(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-left"
              >
                <span className="font-medium">{s.title}</span>
                <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded ${
                  s.type === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
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
                    {result.indicators_count} Coercion Flags Triggered
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Social Engineering Risk: {result.risk_level}
                </h3>
                <p className="text-xs text-slate-400">
                  Method: {result.analysis_method} • {new Date(result.timestamp).toLocaleTimeString()}
                </p>
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

          {/* Indicators & Evidence */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">
              Social Engineering & Psychological Manipulation Findings
            </h4>
            <IndicatorsList 
              indicators={result.indicators} 
              emptyMessage="No aggressive coercion, digital arrest threats, or credential extortion patterns detected in this transcript."
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
