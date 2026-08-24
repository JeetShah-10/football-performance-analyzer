import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_security_headers_present():
    """Verify standard OWASP security headers on responses."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert response.headers.get("x-xss-protection") == "1; mode=block"
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"


def test_pydantic_input_bounds_validation():
    """Verify strict Pydantic parameter boundaries reject invalid limits and offsets."""
    # Negative limit
    res_neg_limit = client.get("/players?limit=-10")
    assert res_neg_limit.status_code == 422

    # Excessive limit exceeding max (2000)
    res_huge_limit = client.get("/players?limit=50000")
    assert res_huge_limit.status_code == 422

    # Negative offset
    res_neg_offset = client.get("/players?offset=-5")
    assert res_neg_offset.status_code == 422


def test_sql_injection_resilience():
    """Verify raw SQL injection strings are treated as literal search strings and safely handled."""
    sqli_payloads = [
        "' OR '1'='1",
        "'; DROP TABLE players; --",
        "1' UNION SELECT null, null, null--",
        "admin'--",
    ]
    for payload in sqli_payloads:
        response = client.get(f"/players?search={payload}")
        assert response.status_code == 200
        # Returns safe empty or filtered list, never a 500 error or SQL exception
        assert isinstance(response.json(), list)


def test_xss_payload_in_scout_query():
    """Verify XSS payloads in natural language scout agent query do not cause server errors."""
    xss_payloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:alert(document.cookie)",
    ]
    for payload in xss_payloads:
        response = client.post("/scout-agent/query", json={"query": payload})
        assert response.status_code == 200
        data = response.json()
        assert "predicted_intent" in data
        assert "report_markdown" in data


def test_path_traversal_image_safety():
    """Verify path traversal sequences in player image endpoint cannot escape sandbox."""
    traversal_paths = [
        "../../etc/passwd",
        "..%2F..%2Fetc%2Fpasswd",
        "....//....//config.py",
        "C:\\Windows\\System32\\calc.exe",
    ]
    for path in traversal_paths:
        response = client.get(f"/players/{path}/image")
        # Must return 404 and NEVER 500 or leak arbitrary file content
        assert response.status_code == 404


def test_error_masking_on_invalid_player():
    """Verify 404 responses do not leak internal stack traces or database structures."""
    response = client.get("/players/invalid_unregistered_id_99999")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "Traceback" not in str(data)


def test_oversized_scout_agent_payload():
    """Verify oversized query strings are processed safely without crashing."""
    giant_string = "Find similar to Saka " + ("A" * 4000)
    response = client.post("/scout-agent/query", json={"query": giant_string})
    assert response.status_code == 200
