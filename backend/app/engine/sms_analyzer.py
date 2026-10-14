import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from app.engine.rules import BENIGN_ADVISORY_PATTERNS, TARGETED_BRANDS, KNOWN_SHORTENERS
from app.engine.scorer import calculate_risk_score
from app.core.config import settings

SMS_RULES = [
    # A. Credential theft
    {
        "rule_id": "CRED_OTP_DEMAND",
        "category": "Credential Theft",
        "severity": "critical",
        "weight": 40,
        "patterns": [
            r"(?:share|send|provide|enter|submit|reply\s+with)\s+(?:the\s+)?(?:otp|one[- ]time\s+password|verification\s+code)",
            r"(?:otp|code)\s+is\s+(?:required|needed)\s+to\s+(?:verify|cancel|stop|activate)",
            r"send\s+otp\s+to\s+\d+"
        ],
        "explanation": "Legitimate organizations and banks will NEVER ask you to disclose or forward your OTP.",
        "recommendation": "Never share or forward your OTP or security codes with anyone, under any circumstances."
    },
    {
        "rule_id": "CRED_PIN_CVV_PASSWORD",
        "category": "Credential Theft",
        "severity": "critical",
        "weight": 35,
        "patterns": [
            r"(?:enter|provide|update|verify)\s+(?:your\s+)?(?:atm\s+)?(?:pin|mpin|cvv|netbanking\s+password|login\s+password)",
            r"card\s+(?:expiry|cvv|number)\s+required"
        ],
        "explanation": "Demanding ATM PIN, MPIN, CVV or passwords is a direct indicator of unauthorized financial access.",
        "recommendation": "Keep your PIN, passwords, and CVV strictly confidential. Banks never request them."
    },

    # B. Fake KYC and account threats
    {
        "rule_id": "KYC_ACCOUNT_BLOCK_THREAT",
        "category": "Account Threat / Fake KYC",
        "severity": "high",
        "weight": 30,
        "patterns": [
            r"(?:account|debit\s+card|netbanking|sim\s+card|pan\s+card|kyc)\s+(?:will\s+be|has\s+been)?\s*(?:blocked|suspended|deactivated|closed|terminated|on\s+hold)",
            r"(?:update|complete|verify)\s+(?:your\s+)?(?:kyc|pan|aadhaar)\s+(?:immediately|urgent|today|within\s+\d+\s*(?:hours|hrs|mins))",
            r"electricity\s+(?:power\s+)?will\s+be\s+disconnected\s+tonight\s+at\s+\d+"
        ],
        "explanation": "Scammers fabricate urgent account blocks or utility disconnections to trigger panic and bypass skepticism.",
        "recommendation": "Do not use links or phone numbers from the SMS. Contact your bank or provider through their verified official website."
    },

    # C. Financial manipulation & UPI fraud
    {
        "rule_id": "UPI_COLLECTION_REQUEST",
        "category": "Financial Manipulation",
        "severity": "high",
        "weight": 30,
        "patterns": [
            r"(?:enter|put)\s+(?:upi\s+)?pin\s+to\s+(?:receive|claim|accept|credit)\s+(?:money|cashback|refund)",
            r"(?:approve|accept)\s+(?:collect\s+request|payment\s+request)\s+to\s+get",
            r"pay\s+re\.?\s*1|transfer\s+re\.?\s*1\s+for\s+verification"
        ],
        "explanation": "Entering a UPI PIN ALWAYS deducts money from your account. You NEVER need to enter a UPI PIN to receive money.",
        "recommendation": "Reject the request. Never enter your UPI PIN to receive a payment or refund."
    },

    # D. Prize and lottery scams
    {
        "rule_id": "LOTTERY_CASHBACK_SCAM",
        "category": "Prize / Lottery Scam",
        "severity": "high",
        "weight": 32,
        "patterns": [
            r"(?:congratulations|congrats)!?\s+(?:you\s+have\s+)?(?:won|selected\s+for)\s+(?:rs\.?|inr|₹|\$)\s*[\d,]+",
            r"(?:kbc|kaun\s+banega\s+crorepati|lucky\s+draw|cashback|lottery\s+winner)",
            r"(?:claim|redeem)\s+(?:your\s+)?(?:reward|prize|cashback)\s+before\s+it\s+expires"
        ],
        "explanation": "Unsolicited lottery wins, prize rewards, or scratch cards requesting action or processing fees are almost invariably scams.",
        "recommendation": "Do not attempt to claim unsolicited rewards or pay any 'processing fee' or 'registration tax'."
    },

    # E. Phishing link & malicious application indicators
    {
        "rule_id": "MALICIOUS_APK_DOWNLOAD",
        "category": "Malicious Software Indicator",
        "severity": "critical",
        "weight": 35,
        "patterns": [
            r"https?://\S+\.apk\b",
            r"(?:install|download)\s+(?:this\s+)?(?:app|apk|update)\s+from\s+https?://",
            r"(?:sbi|hdfc|kyc|support|reward)[\w.-]*\.apk"
        ],
        "explanation": "Prompting users to manually download and install an APK file from an SMS bypasses official app store safety protections.",
        "recommendation": "NEVER download or install APK files from links in SMS. Install apps only from Google Play Store or Apple App Store."
    },
    {
        "rule_id": "SUSPICIOUS_SHORT_URL",
        "category": "Phishing Link Indicator",
        "severity": "medium",
        "weight": 20,
        "patterns": [
            r"https?://(?:www\.)?(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|shorturl\.at|rb\.gy|tiny\.cc)/\S+"
        ],
        "explanation": "Shortened URLs mask the true destination web address, commonly used in phishing attacks to conceal malicious domains.",
        "recommendation": "Do not click on shortened URLs in SMS. Inspect destination addresses with safety tools first."
    },
    {
        "rule_id": "UNOFFICIAL_VERIFICATION_LINK",
        "category": "Phishing Link Indicator",
        "severity": "high",
        "weight": 25,
        "patterns": [
            r"(?:click|visit|tap|link)\s*:\s*https?://\S+",
            r"https?://[^\s/]*(?:kyc|update|login|pan|reward|support|verify)[^\s/]*\.\w+/\S*"
        ],
        "explanation": "Links containing banking keywords hosted on unverified third-party domains often mimic legitimate bank login portals.",
        "recommendation": "Access your bank or service only by typing their authentic web address directly into your browser."
    },

    # F. Social engineering pressure
    {
        "rule_id": "URGENCY_ARTIFICIAL_DEADLINE",
        "category": "Social Engineering",
        "severity": "medium",
        "weight": 18,
        "patterns": [
            r"(?:immediately|urgent|within\s+24\s*hours?|within\s+12\s*hours?|today\s+only|action\s+required)",
            r"(?:failure\s+to\s+comply|otherwise\s+your\s+account\s+will\s+be)",
            r"final\s+(?:warning|notice|reminder)"
        ],
        "explanation": "Scammers manufacture artificial urgency to force impulsive compliance before the victim has time to verify.",
        "recommendation": "Take a breath. Scammers rely on urgency. Real banks and official services will give reasonable written notices."
    },

    # G. Impersonation of trusted entities
    {
        "rule_id": "IMPERSONATION_OFFICIAL_ENTITY",
        "category": "Impersonation",
        "severity": "medium",
        "weight": 18,
        "patterns": [
            r"\b(?:dear\s+customer|dear\s+user|sbi\s+user|hdfc\s+user|bank\s+alert)\b",
            r"(?:indpost|india\s+post|fedex|courier|delivery)\s+parcel\s+(?:cannot\s+be\s+delivered|address\s+missing)",
            r"(?:income\s+tax\s+refund|rbi\s+guidelines)"
        ],
        "explanation": "Impersonating recognized financial institutions, delivery couriers, or government agencies builds false trust.",
        "recommendation": "Verify communications through customer support numbers listed on official physical cards or verified websites."
    }
]

def check_benign_advisory(text: str) -> Tuple[bool, str]:
    """
    Checks if message is an authentic safety warning / advisory message.
    """
    for pattern in BENIGN_ADVISORY_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return True, match.group(0)
    return False, ""

def analyze_sms_message(text: str) -> Dict[str, Any]:
    """
    Analyzes an SMS message against rules and computes explainable score.
    """
    cleaned_text = text.strip()
    is_benign, advisory_match = check_benign_advisory(cleaned_text)
    
    triggered_indicators: List[Dict[str, Any]] = []
    seen_rule_ids = set()

    for rule in SMS_RULES:
        rule_id = rule["rule_id"]
        for pat in rule["patterns"]:
            match = re.search(pat, cleaned_text, re.IGNORECASE)
            if match and rule_id not in seen_rule_ids:
                # If message is benign advisory and matches credential pattern (e.g. "Do not share OTP")
                if is_benign and rule["category"] == "Credential Theft":
                    # Skip labeling legitimate warning as credential theft
                    continue

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

    # If benign advisory detected and no hostile attack indicators triggered
    if is_benign and not any(ind["severity"] in ["critical", "high"] for ind in triggered_indicators):
        triggered_indicators.append({
            "rule_id": "BENIGN_SECURITY_ADVISORY",
            "category": "Official Security Notice",
            "severity": "low",
            "weight": 0,
            "evidence": advisory_match,
            "explanation": "This message appears to be a legitimate security or fraud-prevention advisory educating users not to share sensitive information.",
            "recommendation": "Follow the advice: Never share OTPs or credentials, and keep caution."
        })

    # Calculate explainable score
    score, risk_level = calculate_risk_score(triggered_indicators, is_benign_advisory=is_benign)

    # Compile recommendations
    recommendations: List[str] = []
    safe_actions: List[str] = []

    if risk_level == "High Risk":
        safe_actions.append("Do NOT click any links, open attachments, or download APK files from this message.")
        safe_actions.append("Never share OTP, PIN, password, or bank details under any pressure.")
        safe_actions.append("Block the sender and report to cybercrime portal (1930 or cybercrime.gov.in in India).")
    elif risk_level == "Suspicious":
        safe_actions.append("Exercise extreme caution. Do not trust urgency claims without independent verification.")
        safe_actions.append("Call your bank or service provider using an independently confirmed customer care number.")
    else:
        safe_actions.append("This communication appears consistent with normal or advisory correspondence.")
        safe_actions.append("Always remain vigilant and remember that genuine institutions will never request your secret PIN or passwords.")

    for ind in triggered_indicators:
        if ind["recommendation"] not in recommendations:
            recommendations.append(ind["recommendation"])

    return {
        "scan_id": str(uuid.uuid4()),
        "scan_type": "sms",
        "risk_score": score,
        "risk_level": risk_level,
        "indicators_count": len(triggered_indicators),
        "indicators": triggered_indicators,
        "recommendations": recommendations,
        "safe_actions": safe_actions,
        "analysis_method": "ScamShield Explainable Rule Engine v1.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "limitation_notice": settings.LIMITATION_NOTICE,
        "details": {
            "text_length": len(cleaned_text),
            "is_benign_advisory": is_benign,
            "detected_rules_count": len(triggered_indicators)
        }
    }
