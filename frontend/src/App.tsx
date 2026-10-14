import React, { useState, useEffect } from 'react';
import { AppPage, Language } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SmsAnalyzer } from './pages/SmsAnalyzer';
import { CallAnalyzer } from './pages/CallAnalyzer';
import { UrlChecker } from './pages/UrlChecker';
import { ScanHistory } from './pages/ScanHistory';
import { ThreatInsights } from './pages/ThreatInsights';
import { SafetyCenter } from './pages/SafetyCenter';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { checkBackendHealth } from './services/api';
import { Shield } from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkHealth() {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);
    }
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} language={language} />;
      case 'sms':
        return <SmsAnalyzer language={language} />;
      case 'call':
        return <CallAnalyzer language={language} />;
      case 'url':
        return <UrlChecker language={language} />;
      case 'history':
        return <ScanHistory language={language} />;
      case 'insights':
        return <ThreatInsights language={language} />;
      case 'safety':
        return <SafetyCenter language={language} />;
      case 'about':
        return <About language={language} />;
      case 'settings':
        return <Settings language={language} onLanguageChange={setLanguage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Top Application Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
        isBackendOnline={isBackendOnline}
        isMobileMenuOpen={isMobileOpen}
        onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
      />

      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          language={language}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Application Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-cyan-500" />
          <span className="font-semibold text-slate-400">ScamShield AI</span>
          <span>•</span>
          <span>AI-Powered Scam & Fraud Prevention Defense</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-500">
          ScamShield AI is an explainable risk evaluation platform. It does not replace professional security analysis or guarantee safety. Always verify suspicious communications through official channels or dial 1930.
        </p>
      </footer>
    </div>
  );
}

export default App;
