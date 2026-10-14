from typing import List, Dict, Any, Tuple
from app.core.config import settings

def calculate_risk_score(
    indicators: List[Dict[str, Any]], 
    is_benign_advisory: bool = False
) -> Tuple[int, str]:
    """
    Computes an explainable risk score from 0 to 100 based on detected indicators.
    Returns (score, risk_level).
    
    Thresholds:
    - 0-29: Low Risk
    - 30-59: Suspicious
    - 60-100: High Risk
    """
    if not indicators:
        return (5 if not is_benign_advisory else 0, "Low Risk")

    # If it is clearly an official bank warning advising people NOT to share OTPs
    if is_benign_advisory:
        # Check if there is actual phishing / malicious attack indicators present simultaneously
        has_phish_link = any(ind.get("rule_id", "").startswith("URL_") or "PHISH" in ind.get("rule_id", "") for ind in indicators)
        has_remote_access = any("REMOTE" in ind.get("rule_id", "") for ind in indicators)
        
        if not (has_phish_link or has_remote_access):
            # It's a legitimate safety warning
            return (5, "Low Risk")

    # Group indicators by category to prevent duplicate over-counting
    seen_categories: Dict[str, int] = {}
    total_raw_weight = 0
    has_critical = False

    for ind in indicators:
        cat = ind.get("category", "General")
        weight = ind.get("weight", 10)
        sev = ind.get("severity", "medium")
        
        if sev == "critical":
            has_critical = True

        # Diminishing returns for multiple indicators in the exact same category
        cat_count = seen_categories.get(cat, 0)
        if cat_count == 0:
            total_raw_weight += weight
        elif cat_count == 1:
            total_raw_weight += int(weight * 0.5)
        else:
            total_raw_weight += int(weight * 0.25)
        
        seen_categories[cat] = cat_count + 1

    # Base score scaling
    score = total_raw_weight

    # If at least one critical threat indicator was triggered (e.g., OTP extraction or digital arrest)
    if has_critical:
        score = max(score, 65)

    # If multiple distinct threat categories are triggered (e.g. Impersonation + Urgency + Payment)
    if len(seen_categories) >= 3:
        score += 15
    elif len(seen_categories) >= 2:
        score += 8

    # Clamp between 0 and 100
    score = min(max(score, 0), 100)

    # Determine risk category
    if score < settings.LOW_RISK_THRESHOLD:
        risk_level = "Low Risk"
    elif score < settings.HIGH_RISK_THRESHOLD:
        risk_level = "Suspicious"
    else:
        risk_level = "High Risk"

    return (score, risk_level)
