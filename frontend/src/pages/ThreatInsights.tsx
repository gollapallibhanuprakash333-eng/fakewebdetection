import React from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  PhoneCall, 
  CreditCard, 
  Zap, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface ThreatInsightsProps {
  language: Language;
}

export const ThreatInsights: React.FC<ThreatInsightsProps> = ({ language }) => {
  const threats = [
    {
      id: "digital-arrest",
      title: "Digital Arrest & Impersonation Coercion",
      severity: "Critical Threat",
      severityColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      overview: "Fraudsters pose as Police, CBI, ED, or Customs officials over video calls, claiming illegal parcels containing contraband were seized in the victim's name.",
      tactics: [
        "Presenting forged arrest warrants and police logos over Skype video calls.",
        "Fabricating 'Digital Arrest' and ordering victims not to disconnect or tell family.",
        "Coercing victims to transfer money to a fake 'RBI Secret Verification Account'."
      ],
      defense: "Indian law enforcement NEVER conducts arrests via video calls. Disconnect immediately and dial 1930."
    },
    {
      id: "upi-collect",
      title: "UPI PIN Inversion & Fake Cashback Fraud",
      severity: "High Volume",
      severityColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      overview: "Victims are sent a payment request masquerading as a reward, refund, or cashback, with instructions that entering the UPI PIN will credit money.",
      tactics: [
        "Sending 'Collect Request' notifications on Google Pay, PhonePe, or Paytm.",
        "Asserting that the UPI PIN is required to 'authenticate receiving the refund'.",
        "Diverting attention with rapid verbal coaching over phone calls."
      ],
      defense: "A UPI PIN is ONLY used to DEBIT money from your bank account. You NEVER need to enter a PIN to receive funds."
    },
    {
      id: "fake-kyc",
      title: "Urgent Electricity & SIM Card Deactivation Threats",
      severity: "High Urgency",
      severityColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      overview: "SMS alerts threatening immediate disconnection of electricity power tonight at 9:30 PM or SIM deactivation due to incomplete KYC.",
      tactics: [
        "Imposing strict 2-hour or midnight deadlines to induce panic.",
        "Providing an unverified mobile number of a fake 'Electricity Officer'.",
        "Instructing victims to install remote-desktop software to 'update credentials'."
      ],
      defense: "Utility boards and telecom providers issue billing notices on official invoices, never instant cutoff threats via personal SMS."
    },
    {
      id: "remote-access",
      title: "Screen Sharing & Remote Access Exploitation (AnyDesk/TeamViewer)",
      severity: "Device Takeover",
      severityColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      overview: "Victims are guided to download screen-sharing utilities under the guise of technical support or banking maintenance.",
      tactics: [
        "Directing victims to install AnyDesk, TeamViewer, QuickSupport, or RustDesk.",
        "Requesting the 9-digit remote session access code.",
        "Viewing bank OTP notifications and credentials in real-time as the victim types them."
      ],
      defense: "Never install remote access applications upon the instruction of any incoming phone caller."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Threat Intelligence & Scam Vector Insights
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Analysis of prevalent social engineering, psychological manipulation, and technical vectors.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="space-y-6">
        {threats.map((threat) => (
          <div 
            key={threat.id}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {threat.title}
              </h3>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${threat.severityColor}`}>
                {threat.severity}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {threat.overview}
            </p>

            {/* Attack Tactics */}
            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                Common Attack Tactics Observed
              </span>
              <ul className="space-y-1.5">
                {threat.tactics.map((tactic, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <span>{tactic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Defense Directive */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400 mr-1.5">ScamShield Defense Playbook:</span>
                <span>{threat.defense}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
