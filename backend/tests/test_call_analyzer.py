import pytest
from app.engine.call_analyzer import analyze_call_transcript

def test_benign_customer_service():
    transcript = (
        "Agent: Thank you for calling customer service. How can I help you today? "
        "User: I'd like to check the balance on my broadband internet account. "
        "Agent: Sure, your current balance is zero and your next invoice date is the 25th of the month. "
        "User: Great, thank you very much. Have a nice day."
    )
    result = analyze_call_transcript(transcript)
    assert result["risk_score"] < 30
    assert result["risk_level"] == "Low Risk"
    assert result["indicators_count"] == 0

def test_digital_arrest_tactics():
    transcript = (
        "This is DCP Sharma from Mumbai Police Crime Branch. A parcel intercepted at airport containing MDMA drugs "
        "and fake passports with your Aadhaar details. An arrest warrant issued against you. "
        "You are placed under digital arrest. Stay on video call and do not inform your family or lawyer."
    )
    result = analyze_call_transcript(transcript, claimed_org="Mumbai Police Crime Branch")
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_DIGITAL_ARREST" in rule_ids
    assert "CALL_SECRECY_ISOLATION" in rule_ids

def test_remote_access_software_coercion():
    transcript = (
        "Caller: Sir, to fix your internet banking error, you need to install AnyDesk from Play Store. "
        "Once installed, read me the 9-digit code on screen so I can access your device and configure settings."
    )
    result = analyze_call_transcript(transcript, claimed_org="Technical Support")
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_REMOTE_ACCESS_APP" in rule_ids

def test_security_deposit_fake_rbi_transfer():
    transcript = (
        "Caller: To verify your innocence and unfreeze your accounts, you must transfer funds to RBI "
        "security verification account immediately. This is a refundable security deposit."
    )
    result = analyze_call_transcript(transcript, caller_demand="Transfer to verify innocence")
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_SECURITY_DEPOSIT_TRANSFER" in rule_ids

def test_call_credential_demand():
    transcript = (
        "Caller: Someone is trying to withdraw money from your account. I have triggered a cancellation. "
        "Please read me the 6-digit code OTP sent to your mobile phone right now to stop the charge."
    )
    result = analyze_call_transcript(transcript)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_CREDENTIAL_DEMAND" in rule_ids

def test_sim_deactivation_threat():
    transcript = (
        "Automated voice: Calling from TRAI. Your mobile number and SIM card will be disconnected within 2 hours "
        "due to illegal activities. Press 9 to speak with an executive."
    )
    result = analyze_call_transcript(transcript)
    assert result["risk_score"] >= 30
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_SIM_DEACTIVATION_THREAT" in rule_ids

def test_mixed_benign_and_suspicious_transcript():
    transcript = (
        "Agent: Hello, this is internet technical support following up on your broadband ticket. "
        "User: Yes, my connection has been dropping occasionally. "
        "Agent: Understood. To diagnose the signal levels from your router, please install AnyDesk on your mobile. "
        "User: Is that required? "
        "Agent: Yes, install AnyDesk and share the code right away, and do not tell anyone else."
    )
    result = analyze_call_transcript(transcript)
    assert result["risk_score"] >= 60
    assert result["risk_level"] == "High Risk"
    rule_ids = [ind["rule_id"] for ind in result["indicators"]]
    assert "CALL_REMOTE_ACCESS_APP" in rule_ids
    assert "CALL_SECRECY_ISOLATION" in rule_ids

