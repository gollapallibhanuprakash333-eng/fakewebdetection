import React from 'react';
import { 
  Shield, 
  Cpu, 
  Lock, 
  Eye, 
  CheckCircle2, 
  Terminal, 
  Code2, 
  FileCheck 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AboutProps {
  language: Language;
}

export const About: React.FC<AboutProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              About ScamShield AI
            </h1>
            <p className="text-xs text-cyan-400 font-mono mt-0.5">
              Tagline: Detect Scams Before They Detect You
            </p>
          </div>
        </div>
      </div>

      {/* Core Mission */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Project Vision & Mission
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          In an era where scammers deploy sophisticated social-engineering techniques—including fake digital arrests, deceptive UPI collect requests, synthetic KYC threats, and typosquatted domains—ordinary citizens and senior citizens bear the brunt of financial fraud.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-cyan-400 font-semibold">ScamShield AI</strong> was built to empower smartphone users, digital banking customers, students, and elders across India and worldwide with an explainable, privacy-conscious first line of cyber defense.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Explainable AI vs Black Boxes
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rather than relying on hallucination-prone black-box LLMs, ScamShield AI uses a deterministic, rule-based heuristic scoring engine. Every flagged warning comes with verified evidence, severity ratings, and actionable explanations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Privacy-by-Default Architecture
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We never harvest personal communications. SMS messages, phone transcripts, and URLs are analyzed locally. Raw private message text is never committed to persistent databases by default.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Zero Network SSRF-Safe URLs
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The URL Security Checker evaluates suspicious web addresses through pure local static decomposition—no outbound HTTP requests, no DNS poisoning, and no tracking leaks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Dual-Language Support
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Designed for digital inclusivity, ScamShield AI provides native bilingual interface translation in English and Telugu (తెలుగు), ensuring vital security advice reaches non-English native speakers.
          </p>
        </div>
      </div>

      {/* Limitations Notice */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
        <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          System Limitations & Safety Boundaries
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          ScamShield AI provides heuristic risk evaluations based on known scam, phishing, and social-engineering tactics. The absence of detected warning flags does not guarantee that an unknown caller, sender, or link is legitimate. Always exercise caution and verify through official channels.
        </p>
      </div>
    </div>
  );
};
