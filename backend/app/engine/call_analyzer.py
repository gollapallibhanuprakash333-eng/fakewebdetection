import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from app.engine.scorer import calculate_risk_score
from app.core.config import settings

CALL_RULES = [
    # 1. Digital Arrest & Fake Law Enforcement / Customs
    {
        "rule_id": "CALL_DIGITAL_ARREST",
        "category": "Digital Arrest / Impersonation",
        "severity": "critical",
        "weight": 45,
        "patterns": [
            r"(?:digital\s+arrest|placed\s+under\s+arrest|stay\s+on\s+(?:the\s+)?(?:skype|video\s+call|call))",
            r"(?:cbi|ed|narcotics|customs|crime\s+branch|cyber\s+cell|mumbai\s+police|delhi\s+police)\s+officer",
            r"(?:parcel|package)\s+(?:seized|intercepted|stopped)\s+at\s+(?:airport|customs)\s+(?:with|containing)\s+(?:drugs|mdma|contraband|fake\s+passports)",
            r"(?:arrest\s+warrant|fir)\s+(?:issued|registered)\s+against\s+(?:you|your\s+aadhaar)"
        ],
        "explanation": "Indian law enforcement and courts do NOT conduct 'digital arrests' over Skype, WhatsApp, or phone calls. This is a severe criminal intimidation scam.",
        "recommendation": "Immediately disconnect the call. Do not pay any money. Report immediately to 1930 and cybercrime.gov.in."
    },

    # 2. Remote Access Software Installation
    {
        "rule_id": "CALL_REMOTE_ACCESS_APP",
        "category": "Remote Access Exploitation",
        "severity": "critical",
        "weight": 40,
        "patterns": [
            r"(?:install|download)\s+(?:anydesk|teamviewer|rustdesk|quicksupport|airdroid|zoho\s+assist)",
            r"(?:give|share|read)\s+(?:me\s+)?(?:the\s+)?(?:\d+[- ]digit\s+)?code\s+(?:from\s+anydesk|from\s+teamviewer|on\s+screen)",
            r"(?:share|cast)\s+(?:your\s+)?(?:mobile\s+)?screen"
        ],
        "explanation": "Caller is instructing you to install remote access tools that grant total control over your device, allowing them to view bank apps and steal OTPs in real-time.",
        "recommendation": "Never install AnyDesk, TeamViewer, or remote access apps at the request of any caller."
    },

    # 3. Security Account / Verification Money Transfer
    {
        "rule_id": "CALL_SECURITY_DEPOSIT_TRANSFER",
        "category": "Financial Manipulation",
        "severity": "critical",
        "weight": 40,
        "patterns": [
            r"(?:transfer|deposit|send)\s+(?:money|funds|amount)?\s*(?:to\s+)?.*?(?:rbi|government|court|safe|verification)\s+account",
            r"(?:refundable|security)\s+deposit",
            r"transfer\s+to\s+verify\s+(?:your\s+)?(?:innocence|status|account)"
        ],
        "explanation": "No court, police agency, or the RBI maintains a 'safe account' or 'verification account' where citizens must transfer money to prove innocence.",
        "recommendation": "Do not transfer money. Real law enforcement conducts financial investigations through formal banking channels, never via UPI/NEFT transfers to unknown accounts."
    },

    # 4. Demanding OTP, PIN or Banking Passwords
    {
        "rule_id": "CALL_CREDENTIAL_DEMAND",
        "category": "Credential Theft",
        "severity": "critical",
        "weight": 35,
        "patterns": [
            r"(?:tell|read|give|share)\s+(?:me\s+)?(?:the\s+)?(?:otp|6[- ]digit\s+code|verification\s+code|pin|cvv)",
            r"(?:i\s+need\s+the\s+otp\s+to\s+(?:cancel|stop|reverse)\s+the\s+(?:transaction|charge))",
            r"(?:what\s+is\s+your\s+(?:atm\s+)?pin|netbanking\s+password)"
        ],
        "explanation": "Callers claiming to be bank fraud prevention staff asking for OTPs to 'stop a fraud' are themselves the scammers attempting unauthorized withdrawals.",
        "recommendation": "Never read OTPs or give PIN numbers over the phone. Legitimate bank representatives never ask for OTPs."
    },

    # 5. Secrecy & Isolation Tactics
    {
        "rule_id": "CALL_SECRECY_ISOLATION",
        "category": "Social Engineering / Secrecy",
        "severity": "high",
        "weight": 25,
        "patterns": [
            r"(?:do\s+not\s+(?:tell|inform|discuss\s+with)\s+(?:anyone|your\s+family|friends|lawyer|police))",
            r"(?:keep\s+this\s+matter|under)\s+(?:confidential|secret|national\s+security|official\s+secrets\s+act)",
            r"(?:lock\s+yourself\s+in\s+a\s+room|stay\s+isolated)"
        ],
        "explanation": "Demanding absolute secrecy is designed to prevent the victim from seeking a second opinion from trusted family, friends, or real authorities.",
        "recommendation": "Break the isolation. Hang up and immediately consult a trusted family member or call the 1930 cyber helpline."
    },

    # 6. Panic Creation / Fabricated Unauthorized Transaction
    {
        "rule_id": "CALL_PANIC_TRANSACTION_ALERT",
        "category": "Fear & Urgency",
        "severity": "medium",
        "weight": 20,
        "patterns": [
            r"(?:unauthorized|fraudulent|suspicious)\s+(?:transaction|charge|purchase)\s+of\s+(?:rs\.?|inr|₹|\$)\s*[\d,]+",
            r"(?:someone\s+is\s+using\s+your\s+(?:card|account|identity))",
            r"(?:electricity\s+bill\s+unpaid|power\s+cut\s+in\s+\d+\s*hours)"
        ],
        "explanation": "Fabricating large fraudulent transactions creates panic, inducing the victim to act recklessly without thinking.",
        "recommendation": "Hang up and check your official banking mobile app directly or call the toll-free number printed on the back of your debit/credit card."
    },

    # 7. Fake Telecom / SIM Disconnection Notice
    {
        "rule_id": "CALL_SIM_DEACTIVATION_THREAT",
        "category": "Account Threat / Impersonation",
        "severity": "high",
        "weight": 32,
        "patterns": [
            r"(?:sim\s+card|mobile\s+number)\s+will\s+be\s+(?:disconnected|blocked|terminated)\s+(?:within|in)\s+\d+\s*(?:hours|hrs)",
            r"(?:calling\s+from\s+trai|telecom\s+regulatory\s+authority)",
            r"(?:multiple\s+complaints\s+received\s+against\s+your\s+number)"
        ],
        "explanation": "TRAI has explicitly stated they never call subscribers to threaten phone disconnection.",
        "recommendation": "Ignore the threat. Verify directly with your cellular provider (Jio, Airtel, Vi, BSNL) via their official app or branch."
    }
]

def analyze_call_transcript(
    transcript: str,
    claimed_org: Optional[str] = None,
    caller_demand: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyzes user-provided call transcript and metadata.
    """
    combined_text = f"{transcript}\n{claimed_org or ''}\n{caller_demand or ''}".strip()
    triggered_indicators: List[Dict[str, Any]] = []
    seen_rule_ids = set()

    for rule in CALL_RULES:
        rule_id = rule["rule_id"]
        for pat in rule["patterns"]:
            match = re.search(pat, combined_text, re.IGNORECASE)
            if match and rule_id not in seen_rule_ids:
                seen_rule_ids.add(rule_id)
                evidence = match.group(0)
                triggered_indicators.append({
                    "rule_id": rule_id,
                    "category": rule["category"],
                    "severity": rule["severity"],
                    "weight": rule["weight"],
                    "evidence": evidence,
                    "explanation": rule["explanation"],
                    "recommendation": rule["recommendation"]
                })
                break

    score, risk_level = calculate_risk_score(triggered_indicators, is_benign_advisory=False)

    recommendations: List[str] = []
    safe_actions: List[str] = []

    if risk_level == "High Risk":
        safe_actions.append("Disconnect the call immediately. Do NOT remain on Skype, WhatsApp, or phone.")
        safe_actions.append("Do NOT transfer any money for 'verification' or 'security deposits'.")
        safe_actions.append("Do NOT install AnyDesk, TeamViewer, or remote screen apps.")
        safe_actions.append("If intimidated with arrest or police threats, dial 1930 (National Cyber Crime Helpline) or go to the nearest local police station.")
    elif risk_level == "Suspicious":
        safe_actions.append("Do not disclose any financial or personal details over the call.")
        safe_actions.append("Ask for caller details and hang up. Verify through official published telephone numbers.")
    else:
        safe_actions.append("The supplied transcript does not exhibit acute high-risk social engineering or coercion indicators.")
        safe_actions.append("Always remember that callers can spoof caller IDs; never disclose OTPs or passwords over the phone.")

    for ind in triggered_indicators:
        if ind["recommendation"] not in recommendations:
            recommendations.append(ind["recommendation"])

    return {
        "scan_id": str(uuid.uuid4()),
        "scan_type": "call",
        "risk_score": score,
        "risk_level": risk_level,
        "indicators_count": len(triggered_indicators),
        "indicators": triggered_indicators,
        "recommendations": recommendations,
        "safe_actions": safe_actions,
        "analysis_method": "ScamShield Call Pattern Analyzer v1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "limitation_notice": (
            "This analysis is based solely on the text transcript and details you provided. "
            "ScamShield AI does not record, tap, or monitor phone calls. Real-world callers "
            "can vary in tactics."
        ),
        "details": {
            "transcript_length": len(transcript),
            "claimed_organization": claimed_org or "Not specified",
            "caller_demand": caller_demand or "Not specified",
            "detected_tactics_count": len(triggered_indicators)
        }
    }
