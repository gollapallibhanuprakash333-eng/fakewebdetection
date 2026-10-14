import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareWarning, 
  PhoneCall, 
  Link2, 
  History, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { AppPage, Language } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  language: Language;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  language,
  isMobileOpen,
  onCloseMobile
}) => {
  const t = translations[language];

  const navItems: { id: AppPage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'sms', label: t.nav.sms, icon: MessageSquareWarning },
    { id: 'call', label: t.nav.call, icon: PhoneCall },
    { id: 'url', label: t.nav.url, icon: Link2 },
    { id: 'history', label: t.nav.history, icon: History },
    { id: 'insights', label: t.nav.insights, icon: TrendingUp },
    { id: 'safety', label: t.nav.safety, icon: ShieldCheck },
    { id: 'about', label: t.nav.about, icon: Info },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  const handleItemClick = (page: AppPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40
        w-64 bg-slate-950/95 border-r border-slate-800/80 p-4
        flex flex-col justify-between overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {language === 'te' ? 'విశ్లేషణ & సమాచారం' : 'Analyzers & Insights'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${isActive 
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-500 space-y-1 px-2">
          <div className="font-semibold text-slate-400">ScamShield AI v1.0</div>
          <div>100% Offline Rule Engine</div>
          <div className="text-[11px] text-slate-500">Privacy by default</div>
        </div>
      </aside>
    </>
  );
};
