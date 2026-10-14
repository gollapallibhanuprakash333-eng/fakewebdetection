import pytest
from app.engine.sms_analyzer import analyze_sms_message

def test_ordinary_appointment_reminder():
    text = "Dear William, your dentist appointment is scheduled for tomorrow at 4:00 PM at Apex Dental Clinic. Reply RESCHEDULE if needed."
    result = analyze_sms_message(text)
    assert result["risk_score"] < 30
    assert result["risk_level"] == "Low Risk"
    assert result["scan_type"] == "sms"

def test_credential_otp_theft():
    text = "URGENT: Your account has had a suspicious login. Reply with the OTP sent to your phone immediately to verify your identity."
    result = analyze_sms_message(text)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CRED_OTP_DEMAND" in rule_ids

def test_fake_kyc_threat():
    text = "Dear Customer, Your SBI NetBanking account will be blocked today. Please complete your KYC verification immediately by visiting http://sbi-kyc-update.xyz"
    result = analyze_sms_message(text)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "KYC_ACCOUNT_BLOCK_THREAT" in rule_ids

def test_lottery_prize_scam():
    text = "Congratulations! You have won Rs 25,00,000 in Kaun Banega Crorepati lucky draw. Call our officer to claim your prize reward."
    result = analyze_sms_message(text)
    assert result["risk_score"] >= 30
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "LOTTERY_CASHBACK_SCAM" in rule_ids

def test_upi_collect_fraud():
    text = "Dear user, you received cashback of Rs 3,000. Enter UPI PIN to claim money into your bank account immediately."
    result = analyze_sms_message(text)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "UPI_COLLECTION_REQUEST" in rule_ids

def test_legitimate_bank_safety_advisory():
    # Prompt rule: Distinguish between requesting OTP vs warning users NEVER to share OTP
    text = "HDFC Bank Alert: Never share your OTP, PIN, password or CVV with anyone. Bank never asks for confidential details. Beware of fraud."
    result = analyze_sms_message(text)
    assert result["risk_score"] < 30
    assert result["risk_level"] == "Low Risk"
    # Should not classify warning as credential theft
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CRED_OTP_DEMAND" not in rule_ids
    assert "BENIGN_SECURITY_ADVISORY" in rule_ids

def test_malicious_apk_link():
    text = "Your courier delivery failed. Download our official app from http://delivery-tracking.xyz/app.apk to update address."
    result = analyze_sms_message(text)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "MALICIOUS_APK_DOWNLOAD" in rule_ids

def test_score_boundaries():
    text = "Normal clean text message without any triggers."
    result = analyze_sms_message(text)
    assert 0 <= result["risk_score"] <= 100
    assert len(result["safe_actions"]) > 0
    assert result["limitation_notice"]

def test_duplicate_indicator_prevention():
    # Repeating OTP demand phrase multiple times should only trigger CRED_OTP_DEMAND once
    text = "Share OTP now! Send OTP immediately! Share verification code now!"
    result = analyze_sms_message(text)
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert rule_ids.count("CRED_OTP_DEMAND") == 1

