import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface SafetyCenterProps {
  language: Language;
}

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ language }) => {
  const [openTopicId, setOpenTopicId] = useState<string>('otp-scams');

  const topics = [
    {
      id: "otp-scams",
      title: "1. OTP & Credential Theft Scams",
      mechanism: "Fraudsters pretend to be bank managers, fraud prevention staff, or telecom agents claiming your account is compromised or SIM is being upgraded. They request the 6-digit OTP code sent to your phone to 'cancel' or 'verify' the request.",
      warningSigns: [
        "Caller claims an unauthorized transaction occurred and asks for your OTP to cancel it.",
        "Caller asks you to read or forward an SMS received from your bank.",
        "Pressure to share the code within seconds before it expires."
      ],
      doActions: [
        "Read the full SMS: Notice if the message says 'OTP for transaction of Rs X' or 'Netbanking login OTP'.",
        "Immediately disconnect any call where someone asks for your OTP or password.",
        "Lock your card or netbanking via your official bank mobile app."
      ],
      dontActions: [
        "NEVER read, tell, or type your OTP into any phone call, email, or third-party website.",
        "Never believe that someone needs your OTP to 'send' you money or 'cancel' a charge."
      ],
      example: "'Dear customer, Rs 45,000 debit initiated. To cancel, please tell executive the OTP sent to your mobile.'"
    },
    {
      id: "kyc-fraud",
      title: "2. Fake KYC & Account Suspension Messages",
      mechanism: "Scammers send urgent SMS messages claiming your Bank Account, SIM card, PAN card, or Electricity service is suspended or will be blocked tonight due to missing KYC updates.",
      warningSigns: [
        "Artificial deadlines such as 'Account will be blocked within 24 hours' or 'Electricity disconnected at 9:30 PM'.",
        "A suspicious short link or unverified mobile number to contact.",
        "Demands to click a web link to 'update PAN' or 're-verify Aadhaar'."
      ],
      doActions: [
        "Check your account directly by logging into your official bank portal or official app.",
        "Contact the official branch or authorized customer service directly.",
        "Ignore SMS messages from random personal mobile numbers claiming to represent utility boards."
      ],
      dontActions: [
        "Never click on links in SMS messages to complete KYC.",
        "Never upload Aadhaar, PAN photos, or banking signatures to unverified third-party websites."
      ],
      example: "'Your SBI account has been deactivated due to pending KYC. Click http://sbi-kyc-verify.top to reactivate.'"
    },
    {
      id: "upi-fraud",
      title: "3. UPI 'Receive Money' & Collect Request Fraud",
      mechanism: "Scammers convince victims selling goods online (e.g. OLX) or claiming a lottery/refund that they need to approve a 'collect request' or enter their UPI PIN on Google Pay/PhonePe to receive funds.",
      warningSigns: [
        "You receive a payment request notification asking for approval to 'receive money'.",
        "The caller insists that entering your UPI PIN is needed to verify your bank account.",
        "The caller sends a QR code and asks you to scan it to 'receive payment'."
      ],
      doActions: [
        "Remember the golden rule of UPI: You only enter a PIN to SEND money, never to RECEIVE money.",
        "Decline and report suspicious collect requests directly in your UPI application."
      ],
      dontActions: [
        "Never scan a QR code to receive a payment.",
        "Never enter your UPI PIN on your phone keypad unless you intend to deduct money from your account."
      ],
      example: "'You have won ₹5,000 PhonePe cashback! Click to approve collect request and enter UPI PIN to claim.'"
    },
    {
      id: "digital-arrest",
      title: "4. Digital Arrest & Fake Police / Customs Intimidation",
      mechanism: "Criminals call masquerading as Police Officers, Narcotics Bureau (NCB), CBI, or Customs. They allege an illegal package with your identity papers was seized at an airport, and threaten immediate arrest unless you remain on video call and pay a 'clearance deposit'.",
      warningSigns: [
        "Threats of digital arrest over Skype, WhatsApp, or regular phone calls.",
        "Demands for absolute secrecy (citing national security or Official Secrets Act).",
        "Directing you to transfer money into an alleged 'RBI Verification Account'."
      ],
      doActions: [
        "Understand that Indian law enforcement NEVER arrests anyone or holds trials over Skype or WhatsApp calls.",
        "Disconnect the call immediately and report to 1930.",
        "Visit your nearest local police station if you have any genuine concerns."
      ],
      dontActions: [
        "Never transfer any money to prove innocence or unfreeze accounts.",
        "Never isolate yourself in a room or comply with video surveillance demands from strangers."
      ],
      example: "'DCP Crime Branch speaking. Your Aadhaar is tied to a seized parcel with drugs. You are under digital arrest.'"
    },
    {
      id: "remote-access",
      title: "5. Remote Desktop Applications (AnyDesk, TeamViewer)",
      mechanism: "Callers pretend to be technical executives fixing an app glitch, internet router error, or failed transaction. They instruct you to download AnyDesk or TeamViewer and share the connection code.",
      warningSigns: [
        "Caller instructs you to install AnyDesk, TeamViewer, RustDesk, or QuickSupport from Play Store.",
        "Caller asks for the 9-digit session code shown on your screen.",
        "Caller asks you to log in to your bank app while the screen share session is active."
      ],
      doActions: [
        "Uninstall any remote desktop tool immediately if installed at the instruction of an incoming caller.",
        "Disconnect your device from the internet (turn on Airplane mode) if someone is controlling your screen."
      ],
      dontActions: [
        "Never share remote screen access with any unknown incoming caller.",
        "Never open financial applications or type passwords while sharing your screen."
      ],
      example: "'To refund your failed payment, install AnyDesk app from Play Store and give me the 9-digit code.'"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Safety Center & Anti-Fraud Educational Playbook
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive safety guides, warning signs, and official response protocols (Offline accessible).
        </p>
      </div>

      {/* Official Reporting Emergency Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
          <PhoneCall className="w-5 h-5" />
          <span>Official Indian Cyber Crime Reporting Channels</span>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If you have transferred funds or shared confidential information with scammers, immediately report the incident within the golden hour to minimize financial loss.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">National Cyber Crime Helpline</div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-0.5">1930</div>
              <div className="text-[11px] text-slate-500">Toll-free 24x7 government assistance</div>
            </div>
            <a
              href="tel:1930"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Dial 1930
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">National Cyber Crime Reporting Portal</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">cybercrime.gov.in</div>
              <div className="text-[11px] text-slate-500">Official Ministry of Home Affairs portal</div>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Disclaimer: ScamShield AI does not promise or guarantee recovery of lost funds. Official reporting is handled strictly by authorized government and banking authorities.
        </p>
      </div>

      {/* Accordion Topics */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Common Scam Playbooks & How to Protect Yourself
        </h2>

        {topics.map((topic) => {
          const isOpen = openTopicId === topic.id;
          return (
            <div 
              key={topic.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenTopicId(isOpen ? '' : topic.id)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-base font-bold text-white">{topic.title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm text-slate-300">
                  {/* Mechanism */}
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                      How This Scam Works:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{topic.mechanism}</p>
                  </div>

                  {/* Synthetic Sample */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs text-amber-300">
                    <span className="text-slate-500 select-none mr-2">Example Lure:</span>
                    {topic.example}
                  </div>

                  {/* Warning Signs */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold text-amber-400 tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Warning Signs to Watch For:</span>
                    </span>
                    <ul className="space-y-1.5 pl-2">
                      {topic.warningSigns.map((ws, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                          <span>{ws}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Do's and Don'ts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>What You Should Do</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {topic.doActions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase tracking-wider">
                        <XCircle className="w-4 h-4" />
                        <span>What You Must Avoid</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {topic.dontActions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
