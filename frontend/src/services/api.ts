import { AnalysisResponse, ScanHistoryItem, StatsResponse, ScanType } from '../types';

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function getApiBaseUrl(): string {
  return localStorage.getItem('scamshield_api_base') || DEFAULT_API_BASE;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem('scamshield_api_base', url.trim());
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/health`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function analyzeSmsApi(text: string, language: string = 'en'): Promise<AnalysisResponse> {
  const saveHistory = localStorage.getItem('scamshield_save_history') !== 'false';
  const response = await fetch(`${getApiBaseUrl()}/analyze/sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, save_history: saveHistory })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned error (${response.status})`);
  }

  return response.json();
}

export async function analyzeCallApi(
  transcript: string, 
  claimedOrg?: string, 
  callerDemand?: string, 
  language: string = 'en'
): Promise<AnalysisResponse> {
  const saveHistory = localStorage.getItem('scamshield_save_history') !== 'false';
  const response = await fetch(`${getApiBaseUrl()}/analyze/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transcript,
      claimed_organization: claimedOrg || null,
      caller_demand: callerDemand || null,
      language,
      save_history: saveHistory
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned error (${response.status})`);
  }

  return response.json();
}

export async function analyzeUrlApi(url: string): Promise<AnalysisResponse> {
  const saveHistory = localStorage.getItem('scamshield_save_history') !== 'false';
  const response = await fetch(`${getApiBaseUrl()}/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, save_history: saveHistory })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned error (${response.status})`);
  }

  return response.json();
}

export async function fetchScanHistory(): Promise<ScanHistoryItem[]> {
  const response = await fetch(`${getApiBaseUrl()}/history?limit=50`);
  if (!response.ok) {
    throw new Error('Failed to retrieve scan history');
  }
  return response.json();
}

export async function fetchScanById(id: string): Promise<ScanHistoryItem> {
  const response = await fetch(`${getApiBaseUrl()}/history/${id}`);
  if (!response.ok) {
    throw new Error('Failed to retrieve scan record');
  }
  return response.json();
}

export async function clearAllHistoryApi(): Promise<{ message: string; deleted_count: number }> {
  const response = await fetch(`${getApiBaseUrl()}/history`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to clear history');
  }
  return response.json();
}

export async function fetchStatsApi(): Promise<StatsResponse> {
  const response = await fetch(`${getApiBaseUrl()}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
}
