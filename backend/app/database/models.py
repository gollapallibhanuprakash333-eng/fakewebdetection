import json
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(String(36), primary_key=True, index=True)
    scan_type = Column(String(20), nullable=False, index=True)  # sms, call, url
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)  # Low Risk, Suspicious, High Risk
    indicators_count = Column(Integer, default=0)
    indicators_json = Column(Text, default="[]")
    recommendations_json = Column(Text, default="[]")
    analysis_method = Column(String(80), default="Explainable Rule Engine v1.0")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    # Stored summary or domain (not raw personal message text for privacy by default)
    summary = Column(String(255), default="")

    def get_indicators(self):
        try:
            return json.loads(self.indicators_json) if self.indicators_json else []
        except Exception:
            return []

    def get_recommendations(self):
        try:
            return json.loads(self.recommendations_json) if self.recommendations_json else []
        except Exception:
            return []
