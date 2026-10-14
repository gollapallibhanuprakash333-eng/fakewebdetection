import re
import uuid
from urllib.parse import urlparse, parse_qs, unquote
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from app.engine.rules import TARGETED_BRANDS, KNOWN_SHORTENERS, SUSPICIOUS_TLDS, TRUSTED_DOMAINS
from app.engine.scorer import calculate_risk_score
from app.core.config import settings

def extract_domain_parts(hostname: str) -> Tuple[str, str, str]:
    """
    Safely decomposes hostname into (subdomain, domain_name, tld) without external network calls.
    Handles common compound TLDs like .co.in, .gov.in, .org.in, .com.au, etc.
    """
    clean_host = hostname.lower().strip()
    if not clean_host:
        return "", "", ""
        
    parts = clean_host.split(".")
    if len(parts) <= 1:
        return "", clean_host, ""

    compound_tlds = {"co.in", "gov.in", "org.in", "edu.in", "net.in", "com.au", "co.uk", "gov.uk", "org.uk"}
    
    if len(parts) >= 3 and f"{parts[-2]}.{parts[-1]}" in compound_tlds:
        tld = f"{parts[-2]}.{parts[-1]}"
        domain_name = parts[-3]
        subdomain = ".".join(parts[:-3])
    else:
        tld = parts[-1]
        domain_name = parts[-2]
        subdomain = ".".join(parts[:-2])

    return subdomain, domain_name, tld

def analyze_url_target(url_string: str) -> Dict[str, Any]:
    """
    Pure offline local static URL analyzer. Performs zero outbound network calls.
    """
    clean_url = url_string.strip()
    # Add scheme if missing for safe parsing
    parsed_input = clean_url if "://" in clean_url else f"http://{clean_url}"
    
    try:
        parsed = urlparse(parsed_input)
    except Exception as e:
        return {
            "scan_id": str(uuid.uuid4()),
            "scan_type": "url",
            "risk_score": 60,
            "risk_level": "Suspicious",
            "indicators_count": 1,
            "indicators": [{
                "rule_id": "URL_MALFORMED_SYNTAX",
                "category": "URL Syntax",
                "severity": "medium",
                "weight": 30,
                "evidence": clean_url[:60],
                "explanation": "The URL has an invalid or malformed structure.",
                "recommendation": "Do not attempt to visit malformed web links."
            }],
            "recommendations": ["Do not click or browse to malformed URLs."],
            "safe_actions": ["Avoid visiting this address."],
            "analysis_method": "ScamShield Local Static URL Analyzer v1.0",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "limitation_notice": settings.LIMITATION_NOTICE,
            "details": {"url": clean_url, "error": str(e)}
        }

    hostname = (parsed.hostname or "").lower()
    port = parsed.port
    scheme = parsed.scheme.lower()
    path = parsed.path
    query = parsed.query
    username = parsed.username
    password = parsed.password

    subdomain, domain_name, tld = extract_domain_parts(hostname)
    registrable_domain = f"{domain_name}.{tld}" if domain_name and tld else hostname

    triggered_indicators: List[Dict[str, Any]] = []
    seen_rule_ids = set()

    # 1. IP address used as hostname
    ip_pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    if re.match(ip_pattern, hostname):
        triggered_indicators.append({
            "rule_id": "URL_IP_ADDRESS_HOST",
            "category": "Host Obfuscation",
            "severity": "high",
            "weight": 35,
            "evidence": hostname,
            "explanation": "Legitimate institutions and public websites rarely present raw IP addresses instead of recognized domain names.",
            "recommendation": "Avoid visiting IP-based addresses directly unless you are an administrator on a known private network."
        })
        seen_rule_ids.add("URL_IP_ADDRESS_HOST")

    # 2. Insecure Protocol (HTTP vs HTTPS)
    if scheme == "http":
        triggered_indicators.append({
            "rule_id": "URL_INSECURE_HTTP",
            "category": "Insecure Protocol",
            "severity": "low",
            "weight": 12,
            "evidence": "http://",
            "explanation": "The connection uses unencrypted HTTP. Any credentials or data entered can be intercepted in transit.",
            "recommendation": "Never enter passwords, OTPs, or financial information on an unencrypted HTTP page."
        })
        seen_rule_ids.add("URL_INSECURE_HTTP")

    # 3. Known URL Shortener
    if hostname in KNOWN_SHORTENERS or registrable_domain in KNOWN_SHORTENERS:
        triggered_indicators.append({
            "rule_id": "URL_SHORTENER_MASK",
            "category": "URL Cloaking",
            "severity": "medium",
            "weight": 22,
            "evidence": hostname,
            "explanation": "Shortened URLs mask the true destination domain, preventing inspection before loading.",
            "recommendation": "Do not follow shortened links received in unsolicited messages."
        })
        seen_rule_ids.add("URL_SHORTENER_MASK")

    # 4. Embedded credentials in URL (e.g. https://user:pass@evil.com)
    if username or password:
        triggered_indicators.append({
            "rule_id": "URL_EMBEDDED_CREDENTIALS",
            "category": "URL Obfuscation",
            "severity": "high",
            "weight": 35,
            "evidence": f"{username or ''}:{password or ''}@",
            "explanation": "The URL contains embedded user authority credentials before the '@' sign, a classic trick to disguise the real destination host.",
            "recommendation": "Do not interact with URLs that format hostnames with '@' notation."
        })
        seen_rule_ids.add("URL_EMBEDDED_CREDENTIALS")

    # 5. Non-standard web ports
    standard_ports = {80, 443, None}
    if port and port not in standard_ports:
        triggered_indicators.append({
            "rule_id": "URL_NON_STANDARD_PORT",
            "category": "Unusual Port Configuration",
            "severity": "medium",
            "weight": 20,
            "evidence": f":{port}",
            "explanation": f"The URL connects over port {port}, which is uncommon for standard consumer services and often seen in temporary attack servers.",
            "recommendation": "Verify whether the service normally operates on unconventional network ports."
        })
        seen_rule_ids.add("URL_NON_STANDARD_PORT")

    # 6. Excessive subdomains (deep subdomain hierarchy)
    subdomain_parts = [p for p in subdomain.split(".") if p]
    if len(subdomain_parts) >= 3:
        triggered_indicators.append({
            "rule_id": "URL_EXCESSIVE_SUBDOMAINS",
            "category": "Subdomain Camouflage",
            "severity": "medium",
            "weight": 20,
            "evidence": subdomain,
            "explanation": "Multiple nested subdomains are frequently deployed to make a domain appear authentic on mobile phone screen viewports.",
            "recommendation": "Look at the actual apex domain (the last two segments before the path) rather than the long prefix."
        })
        seen_rule_ids.add("URL_EXCESSIVE_SUBDOMAINS")

    # 7. Brand squatting & Impersonation in subdomain or path
    # Example: sbi.login-portal.top or secure-verify.com/hdfc-kyc
    brand_found_in_subdomain = None
    brand_found_in_path = None

    for brand in TARGETED_BRANDS:
        # Check if brand appears in subdomain or path, but NOT legitimate domain
        if brand in subdomain:
            brand_found_in_subdomain = brand
        if brand in path.lower():
            brand_found_in_path = brand

    # Check if registrable domain is officially trusted for this brand
    is_official_brand_domain = False
    for trusted_dom, brand_label in TRUSTED_DOMAINS.items():
        if registrable_domain == trusted_dom or hostname.endswith(f".{trusted_dom}"):
            is_official_brand_domain = True
            break

    if brand_found_in_subdomain and not is_official_brand_domain:
        triggered_indicators.append({
            "rule_id": "URL_BRAND_IN_SUBDOMAIN",
            "category": "Brand Impersonation / Squatting",
            "severity": "critical",
            "weight": 40,
            "evidence": f"Brand '{brand_found_in_subdomain}' in subdomain while apex domain is '{registrable_domain}'",
            "explanation": f"The URL places '{brand_found_in_subdomain}' in a subdomain, but the real registered domain owner is '{registrable_domain}'.",
            "recommendation": f"This is very likely an impersonation phishing portal. Do not open or enter information."
        })
        seen_rule_ids.add("URL_BRAND_IN_SUBDOMAIN")

    # 8. Suspicious TLD combined with sensitive path or keywords
    if tld in SUSPICIOUS_TLDS and not is_official_brand_domain:
        triggered_indicators.append({
            "rule_id": "URL_HIGH_RISK_TLD",
            "category": "High-Risk Domain Extension",
            "severity": "medium",
            "weight": 20,
            "evidence": f".{tld}",
            "explanation": f"The domain extension '.{tld}' is frequently used in disposable, high-volume automated phishing attacks.",
            "recommendation": "Be extremely cautious with websites registered under low-cost disposable TLDs."
        })
        seen_rule_ids.add("URL_HIGH_RISK_TLD")

    # 9. Suspicious keywords in URL path or parameters
    suspicious_path_patterns = [
        (r"\.apk\b", "Direct Android APK download link", "high", 30),
        (r"(?:verify[-_]?kyc|pan[-_]?update|aadhaar[-_]?link)", "KYC / PAN update trap", "high", 30),
        (r"(?:login[-_]?banking|netbanking[-_]?login|secure[-_]?account)", "Banking login camouflage", "medium", 20),
        (r"(?:claim[-_]?reward|lottery[-_]?cashback|win[-_]?prize)", "Prize lure path", "medium", 20)
    ]

    for pat, desc, sev, wt in suspicious_path_patterns:
        if re.search(pat, path.lower()) and not is_official_brand_domain:
            triggered_indicators.append({
                "rule_id": "URL_SUSPICIOUS_PATH_PATTERN",
                "category": "Malicious Lure in Path",
                "severity": sev,
                "weight": wt,
                "evidence": path[:60],
                "explanation": f"The URL path contains '{desc}', a common pattern found in phishing and credential interception links.",
                "recommendation": "Do not download files or input account credentials via this path."
            })
            seen_rule_ids.add("URL_SUSPICIOUS_PATH_PATTERN")
            break

    # 10. Open redirect query parameters
    query_params = parse_qs(query)
    redirect_keys = ["redirect", "redirect_url", "return_to", "next", "url", "target", "goto"]
    for rk in redirect_keys:
        if rk in query_params:
            triggered_indicators.append({
                "rule_id": "URL_OPEN_REDIRECT_PARAM",
                "category": "Potential Open Redirect",
                "severity": "low",
                "weight": 15,
                "evidence": f"?{rk}={query_params[rk][0][:40]}",
                "explanation": "Contains a parameter that may redirect visitors away from the apparent destination to an unverified third party.",
                "recommendation": "Confirm where the redirect parameter leads before clicking."
            })
            seen_rule_ids.add("URL_OPEN_REDIRECT_PARAM")
            break

    # If it is a confirmed trusted official domain and has zero suspicious flags
    if is_official_brand_domain and len(triggered_indicators) == 0:
        triggered_indicators.append({
            "rule_id": "URL_VERIFIED_TRUSTED_DOMAIN",
            "category": "Official Domain Match",
            "severity": "low",
            "weight": 0,
            "evidence": registrable_domain,
            "explanation": f"The domain '{registrable_domain}' matches a recognized authentic official domain in our database.",
            "recommendation": "Still confirm the address bar begins with https:// and has no typos."
        })

    score, risk_level = calculate_risk_score(triggered_indicators, is_benign_advisory=is_official_brand_domain)

    recommendations: List[str] = []
    safe_actions: List[str] = []

    if risk_level == "High Risk":
        safe_actions.append("Do NOT open this URL in your browser.")
        safe_actions.append("Do NOT submit any credentials, phone numbers, or OTPs.")
        safe_actions.append("Warn others if this link was shared in a group or message.")
    elif risk_level == "Suspicious":
        safe_actions.append("Do not enter banking credentials or personal identity information on this site.")
        safe_actions.append("Access the intended service by navigating directly from your browser's bookmarks or official search result.")
    else:
        safe_actions.append("The URL structure does not exhibit blatant phishing heuristics.")
        safe_actions.append("Always inspect the browser address bar for correct spelling and valid HTTPS security.")

    for ind in triggered_indicators:
        if ind["recommendation"] not in recommendations:
            recommendations.append(ind["recommendation"])

    return {
        "scan_id": str(uuid.uuid4()),
        "scan_type": "url",
        "risk_score": score,
        "risk_level": risk_level,
        "indicators_count": len(triggered_indicators),
        "indicators": triggered_indicators,
        "recommendations": recommendations,
        "safe_actions": safe_actions,
        "analysis_method": "ScamShield Local Static URL Analyzer v1.0 (Zero Network Calls)",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "limitation_notice": (
            "URL analysis is performed strictly through static structural heuristics without contacting "
            "the server (to prevent SSRF and protect privacy). It is a risk estimation tool, not an absolute "
            "reputation verdict."
        ),
        "details": {
            "submitted_url": clean_url,
            "hostname": hostname,
            "subdomain": subdomain,
            "registrable_domain": registrable_domain,
            "tld": tld,
            "scheme": scheme,
            "has_credentials": bool(username or password),
            "port": port or (443 if scheme == "https" else 80),
            "is_official_known": is_official_brand_domain
        }
    }
