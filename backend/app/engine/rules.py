"""
Configurable detection rules dictionary and metadata for ScamShield AI.
Each rule defines:
- rule_id: unique identifier
- category: human-readable category
- severity: 'critical' | 'high' | 'medium' | 'low'
- weight: numeric impact on risk score (0-100)
- explanation: plain-language explanation of why this indicator matters
- recommendation: actionable safety guidance for the user
"""

# Major Indian and Global Brands commonly targeted for impersonation
TARGETED_BRANDS = [
    "sbi", "state bank", "hdfc", "icici", "axis bank", "pnb", "punjab national",
    "kotak", "bank of baroda", "canara", "paytm", "phonepe", "gpay", "google pay",
    "bhim", "amazon", "flipkart", "netflix", "apple", "microsoft", "paypal",
    "rbi", "income tax", "customs", "cbi", "ed", "police", "trai", "bsnl", "airtel", "jio"
]

# URL Shortener domains
KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "cutt.ly",
    "shorturl.at", "rb.gy", "goo.gl", "tiny.cc", "v.gd", "clck.ru", "rebrand.ly"
}

# Suspicious TLDs often abused in fast-flux phishing campaigns
SUSPICIOUS_TLDS = {
    "xyz", "top", "buzz", "club", "work", "loan", "rest", "stream", "live", "guru", "fit", "gq", "cf", "ml", "tk", "ga"
}

# Trusted well-known apex domains for lookalike comparison
TRUSTED_DOMAINS = {
    "onlinesbi.sbi": "State Bank of India",
    "sbi.co.in": "State Bank of India",
    "hdfcbank.com": "HDFC Bank",
    "icicibank.com": "ICICI Bank",
    "axisbank.com": "Axis Bank",
    "pnbindia.in": "Punjab National Bank",
    "kotak.com": "Kotak Mahindra Bank",
    "paytm.com": "Paytm",
    "phonepe.com": "PhonePe",
    "google.com": "Google",
    "amazon.in": "Amazon India",
    "amazon.com": "Amazon",
    "flipkart.com": "Flipkart",
    "incometax.gov.in": "Income Tax Department",
    "cybercrime.gov.in": "National Cyber Crime Reporting Portal",
    "rbi.org.in": "Reserve Bank of India",
    "apple.com": "Apple",
    "microsoft.com": "Microsoft",
    "paypal.com": "PayPal",
    "netflix.com": "Netflix",
    "airtel.in": "Airtel",
    "jio.com": "Reliance Jio"
}

# Safety advice keywords (to detect benign bank advisories and avoid false positives)
BENIGN_ADVISORY_PATTERNS = [
    r"(?:never|do not|don't)\s+(?:share|disclose|reveal|give)\s+(?:your\s+)?(?:otp|pin|password|cvv|credentials)",
    r"(?:bank|we|rbi)\s+(?:never|will never|does not)\s+ask\s+(?:for\s+)?(?:otp|pin|password|cvv)",
    r"(?:beware|alert|caution|be aware)\s+of\s+(?:fraud|fake|phishing|scam|impostors)",
    r"(?:never\s+click|do\s+not\s+click)\s+on\s+(?:suspicious|unknown|unverified)\s+links",
    r"if\s+not\s+(?:done|authorized|initiated)\s+by\s+you,?\s+(?:call|contact|block|report)",
    r"official\s+(?:customer\s+care|helpline|website)"
]
