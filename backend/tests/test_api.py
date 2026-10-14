import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    init_db()

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data

def test_analyze_sms_endpoint():
    payload = {
        "text": "Your account has been suspended. Click here to verify KYC: http://kyc-bank.xyz",
        "save_history": True
    }
    response = client.post("/api/analyze/sms", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["scan_type"] == "sms"
    assert 0 <= data["risk_score"] <= 100
    assert data["risk_level"] in ["Low Risk", "Suspicious", "High Risk"]
    assert "indicators" in data
    assert "recommendations" in data

def test_analyze_call_endpoint():
    payload = {
        "transcript": "DCP from Crime branch calling. You are under digital arrest. Stay on video call.",
        "claimed_organization": "Crime Branch",
        "save_history": True
    }
    response = client.post("/api/analyze/call", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["scan_type"] == "call"
    assert data["risk_level"] == "High Risk"

def test_analyze_url_endpoint():
    payload = {
        "url": "http://192.168.1.1/admin/login",
        "save_history": True
    }
    response = client.post("/api/analyze/url", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["scan_type"] == "url"
    assert "indicators" in data

def test_empty_input_validation():
    response = client.post("/api/analyze/sms", json={"text": " "})
    assert response.status_code == 422

def test_history_and_stats_endpoints():
    # Clear history first
    del_res = client.delete("/api/history")
    assert del_res.status_code == 200

    # Submit a scan
    client.post("/api/analyze/sms", json={"text": "Test sample SMS for history test", "save_history": True})

    # Retrieve history
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) >= 1

    # Check stats
    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_scans"] >= 1

def test_oversized_input_validation():
    oversized_text = "A" * 10005
    response = client.post("/api/analyze/sms", json={"text": oversized_text})
    assert response.status_code == 422

    oversized_url = "https://example.com/" + ("x" * 2050)
    url_resp = client.post("/api/analyze/url", json={"url": oversized_url})
    assert url_resp.status_code == 422

def test_history_by_id_and_not_found():
    # Test 404 for unknown ID
    resp = client.get("/api/history/non-existent-uuid-12345")
    assert resp.status_code == 404

    # Create a real scan
    post_resp = client.post("/api/analyze/sms", json={"text": "Test record for ID retrieval", "save_history": True})
    assert post_resp.status_code == 200
    scan_id = post_resp.json()["scan_id"]

    # Retrieve by ID
    get_resp = client.get(f"/api/history/{scan_id}")
    assert get_resp.status_code == 200
    record = get_resp.json()
    assert record["scan_id"] == scan_id

