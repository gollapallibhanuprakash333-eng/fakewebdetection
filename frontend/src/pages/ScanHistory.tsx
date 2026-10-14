import React, { useEffect, useState } from 'react';
import { 
  History, 
  Trash2, 
  Filter, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { Language, ScanHistoryItem, RiskLevel, ScanType } from '../types';
import { translations } from '../i18n/translations';
import { fetchScanHistory, clearAllHistoryApi } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { IndicatorsList } from '../components/IndicatorsList';
import { RiskGauge } from '../components/RiskGauge';

interface ScanHistoryProps {
  language: Language;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ language }) => {
  const t = translations[language];
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setIsLoading(true);
    try {
      const data = await fetchScanHistory();
      setHistory(data);
    } catch (err) {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all scan records?")) {
      return;
    }
    setIsClearing(true);
    try {
      await clearAllHistoryApi();
      setHistory([]);
      setSelectedScan(null);
    } catch (err) {
      alert("Failed to clear history.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleCopyReport = (scan: ScanHistoryItem) => {
    const text = [
      `=== ScamShield AI Scan Report ===`,
      `ID: ${scan.scan_id}`,
      `Type: ${scan.scan_type.toUpperCase()}`,
      `Risk Level: ${scan.risk_level}`,
      `Risk Score: ${scan.risk_score}/100`,
      `Date: ${new Date(scan.created_at).toLocaleString()}`,
      `Indicators Count: ${scan.indicators_count}`,
      `Summary: ${scan.summary || 'N/A'}`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedId(scan.scan_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHistory = history.filter(item => {
    if (filterType !== 'all' && item.scan_type !== filterType) return false;
    if (filterRisk !== 'all' && item.risk_level !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {t.nav.history}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Review past risk evaluations. Raw message text is never stored for user privacy.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isClearing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.actions.clearHistory}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-800 text-xs text-white px-2.5 py-1 outline-none"
            >
              <option value="all">All Types</option>
              <option value="sms">SMS</option>
              <option value="call">Call</option>
              <option value="url">URL</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Risk Level:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="rounded-lg bg-slate-950 border border-slate-800 text-xs text-white px-2.5 py-1 outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Suspicious">Suspicious</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing {filteredHistory.length} of {history.length} records
        </div>
      </div>

      {/* History Table or Empty State */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-400">
          Loading scan history...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Scan Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run an SMS, Call, or URL scan to populate your local privacy-conscious scan telemetry log.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Risk Category</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item.scan_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {item.scan_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                      {item.summary || `Scan ID: ${item.scan_id.slice(0, 8)}`}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={item.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {item.risk_score} / 100
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedScan(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleCopyReport(item)}
                        className="px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Copy Summary"
                      >
                        {copiedId === item.scan_id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="uppercase font-mono font-bold text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs">
                  {selectedScan.scan_type}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Scan Record: {selectedScan.summary || selectedScan.scan_id.slice(0, 8)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-around p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <RiskGauge score={selectedScan.risk_score} level={selectedScan.risk_level} size={130} />
              <div className="space-y-1.5 text-xs text-slate-400">
                <div><span className="font-semibold text-slate-300">Scan ID:</span> <span className="font-mono text-[11px]">{selectedScan.scan_id}</span></div>
                <div><span className="font-semibold text-slate-300">Timestamp:</span> {new Date(selectedScan.created_at).toLocaleString()}</div>
                <div><span className="font-semibold text-slate-300">Method:</span> {selectedScan.analysis_method}</div>
                <div><span className="font-semibold text-slate-300">Indicators:</span> {selectedScan.indicators_count}</div>
              </div>
            </div>

            {selectedScan.indicators && selectedScan.indicators.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white">Triggered Warning Indicators</h4>
                <IndicatorsList indicators={selectedScan.indicators} />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleCopyReport(selectedScan)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
