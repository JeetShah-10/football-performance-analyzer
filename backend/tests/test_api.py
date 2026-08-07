import pytest
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from fastapi.testclient import TestClient

from backend.main import app
from backend.services.analytics_service import AnalyticsService, FBREF_FEATURE_COLUMNS


@pytest.fixture(autouse=True)
def setup_mock_analytics_service():
    """Sets up an in-memory test dataset and mock artifacts for API testing."""
    scaled_cols = [f"{c}_scaled" for c in FBREF_FEATURE_COLUMNS]
    pct_cols = [f"{c}_pct" for c in FBREF_FEATURE_COLUMNS]

    # Create 4 sample rows representing Defenders, Midfielders, and Forwards
    data = [
        {
            'player_id': 'bukayo_saka_eng_2001',
            'player_name': 'Bukayo Saka',
            'squad': 'Arsenal',
            'league': 'Premier League',
            'position': 'FW,MF',
            'position_group': 'Forward',
            'minutes_played': 1850,
            'cluster_id': 1,
            'cluster_name': 'Dynamic Winger',
            'pca_x': 1.425,
            'pca_y': -0.812,
            'npxG_per90': 0.35,
            'xAG_per90': 0.38,
            'KP_per90': 3.0,
            'PrgP_per90': 5.4,
            'PrgC_per90': 4.8,
            'Tkl_per90': 1.6,
            'Int_per90': 0.45,
            'Succ_per90': 2.1,
        },
        {
            'player_id': 'khvicha_kvaratskhelia_geo_2001',
            'player_name': 'Khvicha Kvaratskhelia',
            'squad': 'Napoli',
            'league': 'Serie A',
            'position': 'FW',
            'position_group': 'Forward',
            'minutes_played': 1700,
            'cluster_id': 1,
            'cluster_name': 'Dynamic Winger',
            'pca_x': 1.410,
            'pca_y': -0.800,
            'npxG_per90': 0.34,
            'xAG_per90': 0.36,
            'KP_per90': 2.9,
            'PrgP_per90': 5.2,
            'PrgC_per90': 4.7,
            'Tkl_per90': 1.5,
            'Int_per90': 0.40,
            'Succ_per90': 2.0,
        },
        {
            'player_id': 'gabriel_magalhaes_bra_1997',
            'player_name': 'Gabriel Magalhaes',
            'squad': 'Arsenal',
            'league': 'Premier League',
            'position': 'DF',
            'position_group': 'Defender',
            'minutes_played': 2000,
            'cluster_id': 1,
            'cluster_name': 'Stopper / Defensive Destroyer',
            'pca_x': -1.500,
            'pca_y': 0.300,
            'npxG_per90': 0.08,
            'xAG_per90': 0.02,
            'KP_per90': 0.3,
            'PrgP_per90': 2.1,
            'PrgC_per90': 0.8,
            'Tkl_per90': 2.8,
            'Int_per90': 1.8,
            'Succ_per90': 0.2,
        },
        {
            'player_id': 'martin_odegaard_nor_1998',
            'player_name': 'Martin Odegaard',
            'squad': 'Arsenal',
            'league': 'Premier League',
            'position': 'MF',
            'position_group': 'Midfielder',
            'minutes_played': 1900,
            'cluster_id': 0,
            'cluster_name': 'Deep-Lying Playmaker',
            'pca_x': 0.800,
            'pca_y': 0.900,
            'npxG_per90': 0.22,
            'xAG_per90': 0.32,
            'KP_per90': 3.2,
            'PrgP_per90': 7.1,
            'PrgC_per90': 3.1,
            'Tkl_per90': 1.2,
            'Int_per90': 0.6,
            'Succ_per90': 1.1,
        },
    ]

    df_mock = pd.DataFrame(data)

    # Add mock scaled features and percentiles
    for c in FBREF_FEATURE_COLUMNS:
        df_mock[f"{c}_scaled"] = (df_mock[c] - df_mock[c].mean()) / (df_mock[c].std() + 1e-6)
        df_mock[f"{c}_pct"] = 75.0

    # Fit NearestNeighbors mock model
    X_full = df_mock[scaled_cols].values
    nn_model = NearestNeighbors(n_neighbors=len(df_mock), metric='cosine')
    nn_model.fit(X_full)

    # Mock cluster signatures keyed by position_group -> cluster_id (both Defender and Forward have cluster_id=1)
    cluster_signatures = {
        'Forward': {
            1: {
                'name': 'Dynamic Winger',
                'description': 'High successful take-ons and progressive carries',
                'signature_stats': [
                    {'feature': 'PrgC_per90', 'cluster_mean': 4.8, 'pos_mean': 3.0, 'z_score_diff': 0.95},
                    {'feature': 'Succ_per90', 'cluster_mean': 2.1, 'pos_mean': 1.2, 'z_score_diff': 0.85},
                ],
            }
        },
        'Defender': {
            1: {
                'name': 'Stopper / Defensive Destroyer',
                'description': 'High tackles and interceptions volume',
                'signature_stats': [
                    {'feature': 'Tkl_per90', 'cluster_mean': 2.8, 'pos_mean': 1.5, 'z_score_diff': 1.2},
                    {'feature': 'Int_per90', 'cluster_mean': 1.8, 'pos_mean': 0.9, 'z_score_diff': 1.0},
                ],
            }
        },
        'Midfielder': {
            0: {
                'name': 'Deep-Lying Playmaker',
                'description': 'High key passes and progressive distribution',
                'signature_stats': [
                    {'feature': 'KP_per90', 'cluster_mean': 3.2, 'pos_mean': 1.8, 'z_score_diff': 0.9},
                ],
            }
        },
    }

    mock_artifacts = {
        'nn_model': nn_model,
        'cluster_signatures': cluster_signatures,
    }

    service = AnalyticsService(df=df_mock, model_artifacts=mock_artifacts)
    AnalyticsService.set_instance(service)
    yield service


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["dataset"] == "FBref 2024-2025"
    assert data["total_players"] == 4


def test_list_players_default(client):
    response = client.get("/players")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 4
    # Check fields of first item
    first = data[0]
    assert "player_id" in first
    assert "player_name" in first
    assert "cluster_name" in first
    assert "pca_x" in first
    assert "pca_y" in first


def test_list_players_filters(client):
    # Test position_group filter
    res_fw = client.get("/players?position_group=Forward")
    assert res_fw.status_code == 200
    fw_data = res_fw.json()
    assert len(fw_data) == 2
    assert all(p["position_group"] == "Forward" for p in fw_data)

    # Test search query
    res_search = client.get("/players?search=Saka")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert len(search_data) == 1
    assert search_data[0]["player_name"] == "Bukayo Saka"


def test_get_player_detail_success(client):
    response = client.get("/players/bukayo_saka_eng_2001")
    assert response.status_code == 200
    data = response.json()
    assert data["player_id"] == "bukayo_saka_eng_2001"
    assert data["player_name"] == "Bukayo Saka"
    assert data["squad"] == "Arsenal"
    assert "stats" in data
    assert "npxG_per90" in data["stats"]
    assert "value" in data["stats"]["npxG_per90"]
    assert "percentile" in data["stats"]["npxG_per90"]


def test_get_player_not_found(client):
    response = client.get("/players/non_existent_player_id")
    assert response.status_code == 404
    assert response.json() == {"detail": "Player 'non_existent_player_id' not found."}


def test_get_clusters_position_group_scoping(client):
    """Verifies cluster signatures are grouped by position_group without cluster_id collisions."""
    response = client.get("/clusters")
    assert response.status_code == 200
    data = response.json()

    assert "Forward" in data
    assert "Defender" in data
    assert "Midfielder" in data

    # Defender cluster_id=1 and Forward cluster_id=1 must have different names and signature stats
    fw_c1 = next(c for c in data["Forward"] if c["cluster_id"] == 1)
    df_c1 = next(c for c in data["Defender"] if c["cluster_id"] == 1)

    assert fw_c1["cluster_name"] == "Dynamic Winger"
    assert df_c1["cluster_name"] == "Stopper / Defensive Destroyer"
    assert fw_c1["signature_stats"][0]["feature"] == "PrgC_per90"
    assert df_c1["signature_stats"][0]["feature"] == "Tkl_per90"


def test_get_similar_players(client):
    # Saka query
    response = client.get("/similar/bukayo_saka_eng_2001?n=2")
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    # Self match must be excluded
    assert all(p["player_id"] != "bukayo_saka_eng_2001" for p in data)

    # Khvicha Kvaratskhelia should be the top similar player due to closest feature profile
    top_match = data[0]
    assert top_match["player_id"] == "khvicha_kvaratskhelia_geo_2001"
    assert "similarity_score" in top_match
    assert top_match["similarity_score"] > 80.0


def test_get_similar_players_not_found(client):
    response = client.get("/similar/unknown_id")
    assert response.status_code == 404


def test_rate_limiting_configuration(client):
    # Verify limiter state on app
    assert hasattr(app.state, "limiter")
