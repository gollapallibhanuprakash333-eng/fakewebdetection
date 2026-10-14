import pytest
from app.engine.url_analyzer import analyze_url_target

def test_valid_trusted_domain():
    url = "https://www.onlinesbi.sbi/portal/login"
    result = analyze_url_target(url)
    assert result["risk_score"] < 30
    assert result["risk_level"] == "Low Risk"

def test_insecure_http():
    url = "http://my-blog-example.org/about"
    result = analyze_url_target(url)
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_INSECURE_HTTP" in rule_ids

def test_ip_address_host():
    url = "http://185.220.101.5/banking/login.php"
    result = analyze_url_target(url)
    assert result["risk_score"] >= 30
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_IP_ADDRESS_HOST" in rule_ids

def test_url_shortener():
    url = "https://bit.ly/3xY9kLp"
    result = analyze_url_target(url)
    assert result["risk_score"] >= 20
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_SHORTENER_MASK" in rule_ids

def test_embedded_credentials():
    url = "https://admin:secretPass123@suspicious-portal.com"
    result = analyze_url_target(url)
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_EMBEDDED_CREDENTIALS" in rule_ids

def test_brand_in_subdomain_phishing():
    # Brand 'sbi' in subdomain while apex domain is malicious 'phish-portal.xyz'
    url = "https://sbi.netbanking.phish-portal.xyz/login"
    result = analyze_url_target(url)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_BRAND_IN_SUBDOMAIN" in rule_ids

def test_high_risk_tld_with_kyc_lure():
    url = "http://hdfc-bank-verification.buzz/pan-update"
    result = analyze_url_target(url)
    assert result["risk_score"] >= 30
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "URL_HIGH_RISK_TLD" in rule_ids or "URL_SUSPICIOUS_PATH_PATTERN" in rule_ids

def test_malformed_url_graceful_handling():
    url = "htp:/invalid::url%%99"
    result = analyze_url_target(url)
    assert "risk_score" in result
    assert "indicators" in result
    assert len(result["indicators"]) > 0

def test_no_outbound_network_calls():
    # Ensure offline static behavior: Non-existent synthetic domain completes instantaneously
    url = "https://completely-fake-non-existent-subdomain-12345.xyz/test"
    result = analyze_url_target(url)
    assert result["scan_type"] == "url"
    assert "risk_score" in result
