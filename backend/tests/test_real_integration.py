import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.services.analytics_service import AnalyticsService


@pytest.fixture(autouse=True)
def setup_real_analytics_service():
    """Initializes AnalyticsService with the real FBref CSV and trained model.pkl."""
    real_service = AnalyticsService()  # Loads default real dataset & model
    AnalyticsService.set_instance(real_service)
    yield real_service


@pytest.fixture
def client():
    return TestClient(app)


def test_real_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["dataset"] == "FBref 2024-2025"
    assert data["total_players"] == 1802


def test_real_list_players(client):
    response = client.get("/players?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    assert data[0]["player_id"] is not None


def test_real_get_player_detail_saka(client):
    target_id = "bukayo_saka_eng_eng_2001_0"
    response = client.get(f"/players/{target_id}")
    assert response.status_code == 200
    data = response.json()

    assert data["player_id"] == target_id
    assert data["player_name"] == "Bukayo Saka"
    assert data["squad"] == "Arsenal"
    assert data["position_group"] == "Forward"

    # Check that all 8 required per-90 stats and percentiles exist
    required_features = [
        "npxG_per90", "xAG_per90", "KP_per90", "PrgP_per90",
        "PrgC_per90", "Tkl_per90", "Int_per90", "Succ_per90"
    ]
    for feat in required_features:
        assert feat in data["stats"]
        assert "value" in data["stats"][feat]
        assert "percentile" in data["stats"][feat]
        assert 0.0 <= data["stats"][feat]["percentile"] <= 100.0


def test_real_get_clusters_scoping(client):
    response = client.get("/clusters")
    assert response.status_code == 200
    data = response.json()

    # Must contain all 3 outfield position groups
    assert "Defender" in data
    assert "Midfielder" in data
    assert "Forward" in data

    assert len(data["Defender"]) > 0
    assert len(data["Midfielder"]) > 0
    assert len(data["Forward"]) > 0

    # Ensure signature stats exist for clusters
    fw_cluster = data["Forward"][0]
    assert "signature_stats" in fw_cluster
    assert len(fw_cluster["signature_stats"]) > 0


def test_real_get_similar_players_saka(client):
    target_id = "bukayo_saka_eng_eng_2001_0"
    response = client.get(f"/similar/{target_id}?n=5")
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 5
    # Target player must be excluded from results
    assert all(p["player_id"] != target_id for p in data)

    # Similarity scores must be between 0 and 100%
    for p in data:
        assert "similarity_score" in p
        assert 0.0 <= p["similarity_score"] <= 100.0
