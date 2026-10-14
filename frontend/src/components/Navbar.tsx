import React from 'react';
import { Shield, Globe, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Language, AppPage } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isBackendOnline: boolean;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  language,
  onLanguageChange,
  isBackendOnline,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Backend Status Chip */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800">
            {isBackendOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Engine Online</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-rose-300">Engine Offline</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'en' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                language === 'te' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
