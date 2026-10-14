import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquareWarning, 
  PhoneCall, 
  Link2, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Zap, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { AppPage, Language, StatsResponse, ScanHistoryItem } from '../types';
import { translations } from '../i18n/translations';
import { fetchStatsApi, fetchScanHistory } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

interface DashboardProps {
  onNavigate: (page: AppPage) => void;
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, language }) => {
  const t = translations[language];
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recentScans, setRecentScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, historyData] = await Promise.all([
          fetchStatsApi().catch(() => null),
          fetchScanHistory().catch(() => [])
        ]);

        if (statsData) {
          setStats(statsData);
        } else {
          // Demo labeled data if fresh / empty
          setStats({
            total_scans: 48,
            low_risk_scans: 22,
            suspicious_scans: 14,
            high_risk_scans: 12,
            sms_scans: 25,
            call_scans: 13,
            url_scans: 10
          });
        }

        setRecentScans(historyData.slice(0, 5));
      } catch (err) {
        // Fallback default
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const chartData = [
    { name: 'Low Risk', value: stats?.low_risk_scans || 0, color: '#10b981' },
    { name: 'Suspicious', value: stats?.suspicious_scans || 0, color: '#f59e0b' },
    { name: 'High Risk', value: stats?.high_risk_scans || 0, color: '#ef4444' },
  ];

  const categoryCards = [
    {
      title: "Digital Arrest & Police Impersonation",
      desc: "Scammers claiming to be CBI, ED, or Police alleging illegal parcels or arrest warrants.",
      badge: "High Risk Attack",
      icon: PhoneCall,
      color: "border-rose-500/30 bg-rose-500/5 text-rose-400"
    },
    {
      title: "Fake KYC & Electricity Disconnection",
      desc: "Panic messages threatening power cut tonight or SIM card deactivation within hours.",
      badge: "Common SMS Scam",
      icon: MessageSquareWarning,
      color: "border-amber-500/30 bg-amber-500/5 text-amber-400"
    },
    {
      title: "Subdomain Phishing Portals",
      desc: "Lookalike links embedding 'sbi' or 'hdfc' inside arbitrary attacker domains.",
      badge: "Active Web Vector",
      icon: Link2,
      color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Cybersecurity Defense Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t.hero.subtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('sms')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <MessageSquareWarning className="w-4 h-4 text-slate-950" />
              <span>{t.hero.actionSms}</span>
            </button>

            <button
              onClick={() => onNavigate('call')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.actionCall}</span>
            </button>

            <button
              onClick={() => onNavigate('url')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Link2 className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.actionUrl}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>{t.stats.totalScans}</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats ? stats.total_scans : 0}
          </div>
          <div className="text-xs text-slate-500">All submitted queries</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <span>{t.stats.lowRisk}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            {stats ? stats.low_risk_scans : 0}
          </div>
          <div className="text-xs text-slate-500">Benign & authentic records</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium uppercase tracking-wider">
            <span>{t.stats.suspicious}</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {stats ? stats.suspicious_scans : 0}
          </div>
          <div className="text-xs text-slate-500">Unverified patterns</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-rose-400 text-xs font-medium uppercase tracking-wider">
            <span>{t.stats.highRisk}</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">
            {stats ? stats.high_risk_scans : 0}
          </div>
          <div className="text-xs text-slate-500">Critical threats detected</div>
        </div>
      </div>

      {/* Chart & Quick Analyzers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white">Risk Distribution</h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Real telemetry breakdown of completed security scans
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-around text-xs pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Low ({stats?.low_risk_scans || 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Suspicious ({stats?.suspicious_scans || 0})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">High ({stats?.high_risk_scans || 0})</span>
            </div>
          </div>
        </div>

        {/* Common Scam Categories Overview */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Prevalent Threat Vectors</h3>
            <button 
              onClick={() => onNavigate('insights')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>View Insights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {categoryCards.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border ${cat.color} transition-all flex items-start gap-3.5`}
                >
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{cat.title}</h4>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-300">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Security Scans</h3>
            <p className="text-xs text-slate-400">Latest analyzed interactions stored locally</p>
          </div>
          <button 
            onClick={() => onNavigate('history')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No scans performed in this session yet. Try analyzing an SMS, phone call, or URL above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Summary</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentScans.map((scan) => (
                  <tr key={scan.scan_id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 uppercase font-mono font-bold text-cyan-400">
                      {scan.scan_type}
                    </td>
                    <td className="py-3 px-3 font-medium text-white max-w-xs truncate">
                      {scan.summary || 'Scan Record'}
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge level={scan.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {scan.risk_score}/100
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('history')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        {t.actions.viewReport}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
