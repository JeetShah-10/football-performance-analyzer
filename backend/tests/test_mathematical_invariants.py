import pytest
import math


@pytest.mark.parametrize("league", [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
])
@pytest.mark.parametrize("position_group", [
    "Forward",
    "Midfielder",
    "Defender",
])
def test_filter_matrix_invariants(client, league, position_group):
    """Test all 15 permutations of Top 5 Leagues x Position Groups."""
    response = client.get(f"/players?league={league}&position_group={position_group}&limit=10")
    assert response.status_code == 200
    players = response.json()
    assert isinstance(players, list)
    
    for p in players:
        assert league.lower() in p["league"].lower()
        assert p["position_group"] == position_group


def test_u21_boundary_invariant(client):
    """Verify u21_only=True invariant strictly returns players aged 21 or under."""
    response = client.get("/players?u21_only=true&limit=100")
    assert response.status_code == 200
    players = response.json()
    assert len(players) > 0

    for p in players:
        assert p["age"] is not None
        assert p["age"] <= 21, f"Player {p['player_name']} age {p['age']} violated U21 constraint"


def test_gmm_soft_probability_invariants(analytics_service):
    """Verify GMM soft probabilities satisfy sum(p) == 1.0 and p_i >= 0 across sampled players."""
    players = analytics_service.list_players(limit=50)
    assert len(players) > 0

    for p in players:
        if p.gmm_probabilities:
            probs = list(p.gmm_probabilities.values())
            # Non-negative probability invariant
            for val in probs:
                assert val >= 0.0, f"Negative probability found for {p.player_name}: {val}"
            # Probability sum invariant: sum(P(C=k|x)) == 1.0
            prob_sum = sum(probs)
            assert math.isclose(prob_sum, 1.0, abs_tol=1e-2), f"GMM probability sum {prob_sum} != 1.0 for {p.player_name}"


def test_pca_spatial_coordinates_finite(analytics_service):
    """Verify PCA coordinates x and y are finite real numbers."""
    players = analytics_service.list_players(limit=100)
    for p in players:
        assert isinstance(p.pca_x, float)
        assert isinstance(p.pca_y, float)
        assert not math.isnan(p.pca_x)
        assert not math.isnan(p.pca_y)
        assert not math.isinf(p.pca_x)
        assert not math.isinf(p.pca_y)


def test_similarity_score_boundaries(client, sample_player_ids):
    """Verify similarity cosine scores lie strictly in [0, 100]% and exclude the query target."""
    saka_id = sample_player_ids["saka"]
    response = client.get(f"/similar/{saka_id}?n=10")
    assert response.status_code == 200
    similars = response.json()
    assert len(similars) == 10

    for item in similars:
        # Target player must be excluded
        assert item["player_id"] != saka_id
        # Bounded between 0 and 100
        assert 0.0 <= item["similarity_score"] <= 100.0


@pytest.mark.parametrize("query, expected_intent", [
    ("Find players similar to Saka", "find_similar"),
    ("Who plays like Erling Haaland?", "find_similar"),
    ("Compare Saka and Rodrygo", "compare_players"),
    ("Side by side comparison of Pedri and Bellingham", "compare_players"),
    ("Tell me about Saliba's style", "explain_player"),
    ("Explain Rodri's tactical profile", "explain_player"),
    ("Young midfielders under 22 in Serie A", "find_by_criteria"),
    ("Find defenders in Bundesliga under 20", "find_by_criteria"),
])
def test_intent_classifier_parameterized_fuzzing(scout_service, query, expected_intent):
    """Verify trained intent classifier robustness across varied natural language syntax."""
    pred = scout_service.predict_intent(query)
    assert pred == expected_intent
