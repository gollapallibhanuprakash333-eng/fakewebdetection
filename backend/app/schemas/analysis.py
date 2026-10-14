from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class Indicator(BaseModel):
    rule_id: str
    category: str
    severity: str  # "low", "medium", "high", "critical"
    weight: int
    evidence: str
    explanation: str
    recommendation: str

class SMSAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=2, max_length=10000, description="SMS text content to analyze")
    language: Optional[str] = Field("en", description="Interface/preferred language (en/te)")
    save_history: Optional[bool] = Field(True, description="Whether to record scan metadata")

class CallAnalysisRequest(BaseModel):
    transcript: str = Field(..., min_length=5, max_length=10000, description="User-supplied call transcript text")
    claimed_organization: Optional[str] = Field(None, max_length=150, description="Organization claimed by caller")
    caller_demand: Optional[str] = Field(None, max_length=250, description="Description of caller's demand")
    language: Optional[str] = Field("en", description="Interface/preferred language (en/te)")
    save_history: Optional[bool] = Field(True, description="Whether to record scan metadata")

class URLAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="URL string to inspect")
    save_history: Optional[bool] = Field(True, description="Whether to record scan metadata")

class AnalysisResponse(BaseModel):
    scan_id: str
    scan_type: str  # "sms", "call", "url"
    risk_score: int  # 0 to 100
    risk_level: str  # "Low Risk", "Suspicious", "High Risk"
    indicators_count: int
    indicators: List[Indicator]
    recommendations: List[str]
    safe_actions: List[str]
    analysis_method: str
    timestamp: str
    limitation_notice: str
    details: Optional[Dict[str, Any]] = None

class ScanHistoryItem(BaseModel):
    scan_id: str
    scan_type: str
    risk_score: int
    risk_level: str
    indicators_count: int
    analysis_method: str
    created_at: str
    summary: Optional[str] = None
    indicators: Optional[List[Indicator]] = None
    recommendations: Optional[List[str]] = None

class StatsResponse(BaseModel):
    total_scans: int
    low_risk_scans: int
    suspicious_scans: int
    high_risk_scans: int
    sms_scans: int
    call_scans: int
    url_scans: int
