import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Server, 
  ShieldCheck, 
  Trash2, 
  Check, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth, clearAllHistoryApi } from '../services/api';

interface SettingsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Settings: React.FC<SettingsProps> = ({ language, onLanguageChange }) => {
  const t = translations[language];
  const [apiUrl, setApiUrl] = useState<string>(getApiBaseUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveHistory, setSaveHistory] = useState<boolean>(
    localStorage.getItem('scamshield_save_history') !== 'false'
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveApiUrl = () => {
    setApiBaseUrl(apiUrl);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const isOk = await checkBackendHealth();
      if (isOk) {
        setTestResult({ success: true, message: "Connected successfully to ScamShield AI API!" });
      } else {
        setTestResult({ success: false, message: "Could not reach backend at specified URL. Ensure Uvicorn is running." });
      }
    } catch (err) {
      setTestResult({ success: false, message: "Connection failed." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleSaveHistory = (enabled: boolean) => {
    setSaveHistory(enabled);
    localStorage.setItem('scamshield_save_history', enabled ? 'true' : 'false');
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all stored scan records?")) return;
    try {
      await clearAllHistoryApi();
      alert("Scan history cleared successfully.");
    } catch (err) {
      alert("Failed to clear scan history.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Application Settings & Preferences
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Configure API endpoints, language localization, and privacy telemetry options.
        </p>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Interface Language</h3>
          </div>
          <p className="text-xs text-slate-400">
            Select your preferred display language for menus, risk notifications, and safety recommendations.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                language === 'en'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              English (EN)
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                language === 'te'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

        {/* Backend API Configuration */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">FastAPI Backend Endpoint</h3>
          </div>
          <p className="text-xs text-slate-400">
            Configure the base URL of the local Python FastAPI detection service. Default is <code className="text-cyan-400 font-mono">http://localhost:8000/api</code>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 p-3 text-xs font-mono text-white outline-none"
            />
            <button
              onClick={handleSaveApiUrl}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors whitespace-nowrap"
            >
              {savedNotice ? "Saved!" : "Save URL"}
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700 whitespace-nowrap"
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              testResult.success 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            }`}>
              {testResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Privacy Safeguards */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Privacy Controls</h3>
          </div>
          <p className="text-xs text-slate-400">
            Control whether scan metadata (timestamp, risk level, score) is saved to the local SQLite database.
          </p>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Record Scan History Metadata</div>
              <div className="text-[11px] text-slate-500">Only scores, types, and timestamps are recorded. Raw message text is never saved.</div>
            </div>
            <button
              onClick={() => handleToggleSaveHistory(!saveHistory)}
              className={`w-11 h-6 rounded-full transition-colors relative ${saveHistory ? 'bg-cyan-500' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${saveHistory ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stored Scan Telemetry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
