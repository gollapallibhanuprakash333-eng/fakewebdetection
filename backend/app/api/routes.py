import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.database.models import ScanRecord
from app.schemas.analysis import (
    SMSAnalysisRequest,
    CallAnalysisRequest,
    URLAnalysisRequest,
    AnalysisResponse,
    ScanHistoryItem,
    StatsResponse
)
from app.engine.sms_analyzer import analyze_sms_message
from app.engine.call_analyzer import analyze_call_transcript
from app.engine.url_analyzer import analyze_url_target

router = APIRouter()

@router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "service": "ScamShield AI API",
        "version": "1.0.0",
        "mode": "Local Rule-Based Analysis",
        "privacy": "Privacy-by-default, zero external AI telemetry"
    }

@router.post("/analyze/sms", response_model=AnalysisResponse, tags=["Analysis"])
def analyze_sms(request: SMSAnalysisRequest, db: Session = Depends(get_db)):
    if len(request.text.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, 
            detail="SMS content is required and cannot be empty."
        )

    result = analyze_sms_message(request.text)

    if request.save_history:
        record = ScanRecord(
            id=result["scan_id"],
            scan_type="sms",
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            indicators_count=result["indicators_count"],
            indicators_json=json.dumps(result["indicators"]),
            recommendations_json=json.dumps(result["recommendations"]),
            analysis_method=result["analysis_method"],
            summary=f"SMS ({len(request.text.strip())} chars) - {result['risk_level']}"
        )
        db.add(record)
        db.commit()

    return result

@router.post("/analyze/call", response_model=AnalysisResponse, tags=["Analysis"])
def analyze_call(request: CallAnalysisRequest, db: Session = Depends(get_db)):
    if len(request.transcript.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Call transcript must contain at least 5 characters."
        )

    result = analyze_call_transcript(
        transcript=request.transcript,
        claimed_org=request.claimed_organization,
        caller_demand=request.caller_demand
    )

    if request.save_history:
        record = ScanRecord(
            id=result["scan_id"],
            scan_type="call",
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            indicators_count=result["indicators_count"],
            indicators_json=json.dumps(result["indicators"]),
            recommendations_json=json.dumps(result["recommendations"]),
            analysis_method=result["analysis_method"],
            summary=f"Call ({request.claimed_organization or 'Caller'}) - {result['risk_level']}"
        )
        db.add(record)
        db.commit()

    return result

@router.post("/analyze/url", response_model=AnalysisResponse, tags=["Analysis"])
def analyze_url(request: URLAnalysisRequest, db: Session = Depends(get_db)):
    if len(request.url.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="URL is required and cannot be empty."
        )

    result = analyze_url_target(request.url)

    if request.save_history:
        hostname = result.get("details", {}).get("hostname", "URL Target")
        record = ScanRecord(
            id=result["scan_id"],
            scan_type="url",
            risk_score=result["risk_score"],
            risk_level=result["risk_level"],
            indicators_count=result["indicators_count"],
            indicators_json=json.dumps(result["indicators"]),
            recommendations_json=json.dumps(result["recommendations"]),
            analysis_method=result["analysis_method"],
            summary=f"URL ({hostname[:35]}) - {result['risk_level']}"
        )
        db.add(record)
        db.commit()

    return result

@router.get("/history", response_model=List[ScanHistoryItem], tags=["History"])
def get_history(limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(ScanRecord).order_by(desc(ScanRecord.created_at)).limit(limit).all()
    history = []
    for r in records:
        history.append(ScanHistoryItem(
            scan_id=r.id,
            scan_type=r.scan_type,
            risk_score=r.risk_score,
            risk_level=r.risk_level,
            indicators_count=r.indicators_count,
            analysis_method=r.analysis_method,
            created_at=r.created_at.isoformat() if r.created_at else "",
            summary=r.summary,
            indicators=r.get_indicators(),
            recommendations=r.get_recommendations()
        ))
    return history

@router.get("/history/{scan_id}", response_model=ScanHistoryItem, tags=["History"])
def get_scan_by_id(scan_id: str, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found")
    
    return ScanHistoryItem(
        scan_id=record.id,
        scan_type=record.scan_type,
        risk_score=record.risk_score,
        risk_level=record.risk_level,
        indicators_count=record.indicators_count,
        analysis_method=record.analysis_method,
        created_at=record.created_at.isoformat() if record.created_at else "",
        summary=record.summary,
        indicators=record.get_indicators(),
        recommendations=record.get_recommendations()
    )

@router.delete("/history", tags=["History"])
def clear_history(db: Session = Depends(get_db)):
    deleted = db.query(ScanRecord).delete()
    db.commit()
    return {"message": "Scan history cleared successfully", "deleted_count": deleted}

@router.get("/stats", response_model=StatsResponse, tags=["Stats"])
def get_stats(db: Session = Depends(get_db)):
    total = db.query(ScanRecord).count()
    low = db.query(ScanRecord).filter(ScanRecord.risk_level == "Low Risk").count()
    suspicious = db.query(ScanRecord).filter(ScanRecord.risk_level == "Suspicious").count()
    high = db.query(ScanRecord).filter(ScanRecord.risk_level == "High Risk").count()
    
    sms_count = db.query(ScanRecord).filter(ScanRecord.scan_type == "sms").count()
    call_count = db.query(ScanRecord).filter(ScanRecord.scan_type == "call").count()
    url_count = db.query(ScanRecord).filter(ScanRecord.scan_type == "url").count()

    return StatsResponse(
        total_scans=total,
        low_risk_scans=low,
        suspicious_scans=suspicious,
        high_risk_scans=high,
        sms_scans=sms_count,
        call_scans=call_count,
        url_scans=url_count
    )
