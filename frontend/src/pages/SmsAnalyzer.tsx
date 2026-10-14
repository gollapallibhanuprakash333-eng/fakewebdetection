import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Send, 
  Trash2, 
  Clipboard, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Info,
  Sparkles,
  Copy
} from 'lucide-react';
import { Language, AnalysisResponse } from '../types';
import { translations } from '../i18n/translations';
import { analyzeSmsApi } from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { RiskBadge } from '../components/RiskBadge';
import { IndicatorsList } from '../components/IndicatorsList';
import { RecommendationsCard } from '../components/RecommendationsCard';

interface SmsAnalyzerProps {
  language: Language;
}

export const SmsAnalyzer: React.FC<SmsAnalyzerProps> = ({ language }) => {
  const t = translations[language];
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const samples = [
    {
      title: "Legitimate Bank Advisory",
      type: "Low Risk",
      content: "HDFC Bank Alert: Never share your OTP, PIN, password, or CVV with anyone. Our bank officials will never request secret codes. Beware of online impostors."
    },
    {
      title: "Urgent OTP Theft",
      type: "High Risk",
      content: "ALERT: Suspicious login detected on your NetBanking. Reply immediately with the 6-digit OTP sent to your phone to block unauthorized withdrawal."
    },
    {
      title: "Fake KYC & Electricity Threat",
      type: "High Risk",
      content: "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because your KYC update is pending. Call officer at 9876543210 immediately."
    },
    {
      title: "Kaun Banega Crorepati Lottery",
      type: "Suspicious",
      content: "Congratulations! You have won Rs 25,00,000 in Kaun Banega Crorepati WhatsApp Lucky Draw. Call our claims manager immediately to claim prize money."
    },
    {
      title: "Fraudulent UPI Cashback",
      type: "High Risk",
      content: "You have received ₹3,500 cashback reward from PhonePe. Enter your UPI PIN to accept and credit amount directly into your bank account."
    },
    {
      title: "Malicious APK Delivery Trap",
      type: "High Risk",
      content: "India Post parcel delivery failed due to missing pin code. Download our verification app at http://indiapost-update.xyz/track.apk to reschedule delivery."
    }
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please paste or type an SMS message to analyze.");
      return;
    }

    if (text.length > 10000) {
      setError("Input exceeds the maximum limit of 10,000 characters.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await analyzeSmsApi(text, language);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to analyze SMS. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
      }
    } catch (err) {
      // Clipboard access denied
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const reportText = [
      `=== ScamShield AI Risk Assessment Report ===`,
      `Type: SMS Message`,
      `Risk Level: ${result.risk_level}`,
      `Risk Score: ${result.risk_score} / 100`,
      `Timestamp: ${result.timestamp}`,
      `Indicators Found: ${result.indicators_count}`,
      `\nKey Findings:`,
      ...result.indicators.map(ind => `- [${ind.severity.toUpperCase()}] ${ind.category}: ${ind.explanation}`),
      `\nSafe Next Steps:`,
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
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t.nav.sms}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Detect credential theft, fake KYC, malicious APK links, UPI scams, and urgency tactics.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Privacy Guaranteed: No raw messages stored</span>
        </div>
      </div>

      {/* Input Workspace */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-200">
            Paste or Enter SMS Content
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{text.length} / 10,000 characters</span>
            <button
              onClick={handlePaste}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste suspicious SMS text here... (e.g. 'Your account will be suspended today. Click here to verify KYC...')"
          className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all resize-y"
        />

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleClear}
            disabled={!text && !result}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.actions.clear}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
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
                <span>{t.actions.analyze}</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Loaders */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Load Demonstration Samples:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {samples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(s.content);
                  setResult(null);
                  setError(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 hover:text-white transition-all text-left"
              >
                <span className="font-medium">{s.title}</span>
                <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded ${
                  s.type === 'Low Risk' ? 'bg-emerald-500/10 text-emerald-400' :
                  s.type === 'Suspicious' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  {s.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Results */}
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
                    {result.indicators_count} Warning Signs Triggered
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  SMS Risk Assessment: {result.risk_level}
                </h3>
                <p className="text-xs text-slate-400">
                  Method: {result.analysis_method} • {new Date(result.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Action buttons */}
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
              Detailed Rule Engine Findings & Evidence
            </h4>
            <IndicatorsList indicators={result.indicators} />
          </div>

          {/* Recommendations Card */}
          <RecommendationsCard
            level={result.risk_level}
            safeActions={result.safe_actions}
            recommendations={result.recommendations}
          />

          {/* Heuristic Limitation Notice */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Limitation Notice: </span>
            {result.limitation_notice}
          </div>
        </div>
      )}
    </div>
  );
};
