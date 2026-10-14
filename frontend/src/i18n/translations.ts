import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    sms: string;
    call: string;
    url: string;
    history: string;
    insights: string;
    safety: string;
    about: string;
    settings: string;
  };
  hero: {
    title: string;
    subtitle: string;
    actionSms: string;
    actionCall: string;
    actionUrl: string;
  };
  stats: {
    totalScans: string;
    lowRisk: string;
    suspicious: string;
    highRisk: string;
    liveStats: string;
  };
  risk: {
    low: string;
    suspicious: string;
    high: string;
    score: string;
    indicatorsDetected: string;
  };
  actions: {
    analyze: string;
    analyzing: string;
    clear: string;
    trySample: string;
    copyReport: string;
    copied: string;
    analyzeAnother: string;
    viewReport: string;
    clearHistory: string;
    exportPdf: string;
    close: string;
  };
  safetyNotice: string;
  disclaimerTitle: string;
  disclaimerText: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "ScamShield AI",
    tagline: "Detect Scams Before They Detect You",
    nav: {
      dashboard: "Dashboard",
      sms: "SMS Analyzer",
      call: "Call Analyzer",
      url: "URL Checker",
      history: "Scan History",
      insights: "Threat Insights",
      safety: "Safety Center",
      about: "About ScamShield",
      settings: "Settings",
    },
    hero: {
      title: "Stay One Step Ahead of Scams",
      subtitle: "Analyze suspicious messages, call scripts, and links to uncover warning signs before taking action.",
      actionSms: "Analyze SMS",
      actionCall: "Analyze Call",
      actionUrl: "Check URL",
    },
    stats: {
      totalScans: "Total Scans",
      lowRisk: "Low Risk",
      suspicious: "Suspicious",
      highRisk: "High Risk",
      liveStats: "System Threat Telemetry",
    },
    risk: {
      low: "Low Risk",
      suspicious: "Suspicious",
      high: "High Risk",
      score: "Risk Score",
      indicatorsDetected: "Indicators Detected",
    },
    actions: {
      analyze: "Analyze Now",
      analyzing: "Analyzing with AI Rules...",
      clear: "Clear Input",
      trySample: "Try Sample",
      copyReport: "Copy Risk Report",
      copied: "Copied to Clipboard!",
      analyzeAnother: "Analyze Another",
      viewReport: "View Full Report",
      clearHistory: "Clear Scan History",
      exportPdf: "Export Report",
      close: "Close",
    },
    safetyNotice: "Privacy First: We analyze text locally and never store raw private messages by default.",
    disclaimerTitle: "Important Heuristic Limitation",
    disclaimerText: "ScamShield AI is an explainable risk-assessment tool designed to detect known scam patterns. It does not replace professional security analysis or guarantee safety.",
  },
  te: {
    appName: "స్కామ్‌షీల్డ్ AI",
    tagline: "మోసాలు మిమ్మల్ని తాకకముందే గుర్తించండి",
    nav: {
      dashboard: "డాష్‌బోర్డ్",
      sms: "SMS విశ్లేషణ",
      call: "కాల్ విశ్లేషణ",
      url: "URL సెక్యూరిటీ",
      history: "స్కాన్ చరిత్ర",
      insights: "మోసాల సమాచారం",
      safety: "రక్షణ కేంద్రం",
      about: "స్కామ్‌షీల్డ్ గురించి",
      settings: "సెట్టింగ్‌లు",
    },
    hero: {
      title: "మోసాల కన్నా ఒక అడుగు ముందే ఉండండి",
      subtitle: "అనుమానాస్పద మెసేజ్‌లు, కాల్ స్క్రిప్ట్‌లు మరియు లింక్‌లను ముందుగానే విశ్లేషించి ప్రమాద సంకేతాలను గుర్తించండి.",
      actionSms: "SMS విశ్లేషించండి",
      actionCall: "కాల్ విశ్లేషించండి",
      actionUrl: "URL తనిఖీ చేయండి",
    },
    stats: {
      totalScans: "మొత్తం స్కాన్‌లు",
      lowRisk: "తక్కువ ప్రమాదం",
      suspicious: "అనుమానాస్పదం",
      highRisk: "అధిక ప్రమాదం",
      liveStats: "సిస్టమ్ రిస్క్ సమాచారం",
    },
    risk: {
      low: "తక్కువ ప్రమాదం",
      suspicious: "అనుమానాస్పదం",
      high: "అధిక ప్రమాదం",
      score: "ప్రమాద స్కోరు",
      indicatorsDetected: "గుర్తించిన సంకేతాలు",
    },
    actions: {
      analyze: "విశ్లేషించండి",
      analyzing: "విశ్లేషిస్తోంది...",
      clear: "తీసివేయండి",
      trySample: "నమూనా చూడండి",
      copyReport: "రిపోర్ట్ కాపీ చేయండి",
      copied: "కాపీ చేయబడింది!",
      analyzeAnother: "మరొకటి విశ్లేషించండి",
      viewReport: "రిపోర్ట్ చూడండి",
      clearHistory: "చరిత్రను తొలగించండి",
      exportPdf: "ఎగుమతి చేయండి",
      close: "మూసివేయి",
    },
    safetyNotice: "గోప్యత ముఖ్యం: మేము మీ వ్యక్తిగత సందేశాలను సేవ్ చేయము.",
    disclaimerTitle: "ముఖ్యమైన గమనిక",
    disclaimerText: "స్కామ్‌షీల్డ్ AI తెలిసిన మోసాల నమూనాలను గుర్తించే ఒక సహాయక సాధనం మాత్రమే. ఇది పూర్తి భద్రతా హామీని ఇవ్వదు.",
  }
};
