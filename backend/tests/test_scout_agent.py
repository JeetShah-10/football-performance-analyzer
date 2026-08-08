import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_scout_agent_find_similar():
    res = client.post("/scout-agent/query", json={"query": "find players like bukayo saka"})
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_intent"] == "find_similar"
    assert "Bukayo Saka" in data["extracted_entities"]["matched_players"]
    assert len(data["backend_methods_called"]) > 0
    assert "Scouting Report" in data["report_markdown"]

def test_scout_agent_compare_players():
    res = client.post("/scout-agent/query", json={"query": "compare saka and mbeumo"})
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_intent"] == "compare_players"
    assert "Bukayo Saka" in data["extracted_entities"]["matched_players"]
    assert "Side-by-Side" in data["report_markdown"]

def test_scout_agent_explain_player():
    res = client.post("/scout-agent/query", json={"query": "tell me about van dijk's style"})
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_intent"] == "explain_player"
    assert "Virgil van Dijk" in data["extracted_entities"]["matched_players"]
    assert "Tactical Breakdown" in data["report_markdown"]

def test_scout_agent_find_by_criteria():
    res = client.post("/scout-agent/query", json={"query": "young ball playing defenders under 21"})
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_intent"] == "find_by_criteria"
    assert data["extracted_entities"]["position_group"] == "Defender"
    assert data["extracted_entities"]["max_age"] == 21
    assert "Criteria Scouting Results" in data["report_markdown"]
