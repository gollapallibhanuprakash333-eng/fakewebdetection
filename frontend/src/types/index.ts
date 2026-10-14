export type RiskLevel = 'Low Risk' | 'Suspicious' | 'High Risk';
export type ScanType = 'sms' | 'call' | 'url';
export type Language = 'en' | 'te';

export type AppPage = 
  | 'dashboard'
  | 'sms'
  | 'call'
  | 'url'
  | 'history'
  | 'insights'
  | 'safety'
  | 'about'
  | 'settings';

export interface Indicator {
  rule_id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface AnalysisResponse {
  scan_id: string;
  scan_type: ScanType;
  risk_score: number;
  risk_level: RiskLevel;
  indicators_count: number;
  indicators: Indicator[];
  recommendations: string[];
  safe_actions: string[];
  analysis_method: string;
  timestamp: string;
  limitation_notice: string;
  details?: Record<string, any>;
}

export interface ScanHistoryItem {
  scan_id: string;
  scan_type: ScanType;
  risk_score: number;
  risk_level: RiskLevel;
  indicators_count: number;
  analysis_method: string;
  created_at: string;
  summary?: string;
  indicators?: Indicator[];
  recommendations?: string[];
}

export interface StatsResponse {
  total_scans: number;
  low_risk_scans: number;
  suspicious_scans: number;
  high_risk_scans: number;
  sms_scans: number;
  call_scans: number;
  url_scans: number;
}
