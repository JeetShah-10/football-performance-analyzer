# FASTAPI REST API CONTRACT & SCHEMA SPECIFICATION
**Project**: Football Player Style Dashboard  
**Version**: v1.0.0 (FBref 2024-2025 Real Dataset)

---

## 1. Overview & Response Conventions

All API responses are serialized JSON with standard HTTP status codes:
- `200 OK`: Request succeeded.
- `404 Not Found`: Target player or resource does not exist.
- `422 Unprocessable Entity`: Input validation failure.
- `429 Too Many Requests`: Rate limit exceeded.

---

## 2. API Endpoints

### `GET /players`
Returns summary list of all outfield players passing the minutes threshold (Min >= 450).

#### Query Parameters:
- `position_group` (optional): Filter by position group (`Defender`, `Midfielder`, `Forward`).
- `league` (optional): Partial string match on league (e.g. `La Liga`, `Premier League`).
- `search` (optional): Partial string match on player name or squad.
- `u21_only` (optional, default `false`): Convenience wrapper to filter players aged 21 or under (`max_age <= 21`).
- `limit` (optional, default `100`): Pagination limit.
- `offset` (optional, default `0`): Pagination offset.

#### Response (`200 OK`):
```json
[
  {
    "player_id": "bukayo_saka_eng_eng_2001_0",
    "player_name": "Bukayo Saka",
    "squad": "Arsenal",
    "league": "eng Premier League",
    "position": "FW,MF",
    "position_group": "Forward",
    "minutes_played": 1850,
    "age": 22,
    "cluster_id": 1,
    "cluster_name": "Dynamic Winger / Dribbler",
    "pca_x": 1.425,
    "pca_y": -0.812
  }
]
```

---

### `GET /players/{player_id}`
Returns detailed player statistics with per-90 values, position-group percentile ranks (0–100%), and GMM soft-clustering probability distributions.

#### Response (`200 OK`):
```json
{
  "player_id": "bukayo_saka_eng_eng_2001_0",
  "player_name": "Bukayo Saka",
  "squad": "Arsenal",
  "league": "eng Premier League",
  "position": "FW,MF",
  "position_group": "Forward",
  "minutes_played": 1850,
  "age": 22,
  "cluster_id": 1,
  "cluster_name": "Dynamic Winger / Dribbler",
  "gmm_probabilities": {
    "Clinical Finisher / Poacher": 0.0,
    "Dynamic Winger / Dribbler": 1.0
  },
  "pca_x": 1.425,
  "pca_y": -0.812,
  "stats": {
    "npxG_per90": { "value": 0.312, "percentile": 64.5 },
    "xAG_per90": { "value": 0.385, "percentile": 92.1 },
    "KP_per90": { "value": 3.019, "percentile": 98.4 },
    "PrgP_per90": { "value": 5.420, "percentile": 91.0 },
    "PrgC_per90": { "value": 4.810, "percentile": 94.2 },
    "Tkl_per90": { "value": 1.620, "percentile": 58.0 },
    "Int_per90": { "value": 0.450, "percentile": 42.1 },
    "Succ_per90": { "value": 2.100, "percentile": 89.5 }
  }
}
```

---

### `GET /clusters`
Returns metadata, centroid profiles, and signature stats for all tactical archetypes.

#### Response (`200 OK`):
```json
{
  "Forward": [
    {
      "cluster_id": 1,
      "cluster_name": "Dynamic Winger / Dribbler",
      "description": "High successful take-ons and progressive carries",
      "signature_stats": [
        { "feature": "PrgC_per90", "cluster_mean": 4.013, "pos_mean": 2.486, "z_score_diff": 0.917 },
        { "feature": "Succ_per90", "cluster_mean": 1.783, "pos_mean": 1.135, "z_score_diff": 0.823 },
        { "feature": "KP_per90", "cluster_mean": 1.720, "pos_mean": 1.252, "z_score_diff": 0.781 }
      ]
    }
  ]
}
```

---

### `GET /similar/{player_id}?n=5&u21_only=false`
Returns top $N$ closest tactical matches for a player using Cosine distance in 8D scaled feature space.

#### Query Parameters:
- `n` (optional, default `5`): Number of similar candidates to return (1 to 20).
- `u21_only` (optional, default `false`): When `true`, filters results strictly to candidates aged 21 or under (`age <= 21`).

> **Note:** Explicitly excludes the query player itself from nearest neighbor results.  
> **Note on Cross-Position Matching:** Cross-position matches (e.g. Midfielder returned for a Forward) are deliberate — similarity operates across the shared 8D scaled feature space to capture functional tactical style regardless of primary position labels.

#### Response (`200 OK`):
```json
[
  {
    "player_id": "khvicha_kvaratskhelia_ge_geo_2001_0",
    "player_name": "Khvicha Kvaratskhelia",
    "squad": "Napoli",
    "league": "it Serie A",
    "position_group": "Forward",
    "cluster_name": "Dynamic Winger / Dribbler",
    "similarity_score": 98.15
  }
]
```

---

### `GET /players/{player_id}/image`
Retrieves the real headshot photo for a player from the backend's in-memory sanitized archive.

#### Path Parameters:
- `player_id`: The unique normalized identifier of the player.

#### Response (`200 OK` or `404 Not Found`):
- Content-Type: `image/jpeg` or `image/png`
- Returns binary image stream directly. If unavailable, returns `404` with fallback avatar rendered by frontend.

---

### `POST /scout-agent/query`
Natural language AI Scout Agent endpoint powering intent classification, fuzzy entity extraction, candidate querying, and synthesized report generation.

#### Request Body (`application/json`):
```json
{
  "query": "find young forwards under 22 in la liga similar to Saka"
}
```

#### Response (`200 OK`):
```json
{
  "query": "find young forwards under 22 in la liga similar to Saka",
  "predicted_intent": "find_by_criteria",
  "confidence_score": 0.942,
  "extracted_entities": {
    "target_player": "Bukayo Saka",
    "position": "Forward",
    "league": "La Liga",
    "max_age": 22
  },
  "backend_methods_called": [
    "predict_intent",
    "extract_entities",
    "list_players"
  ],
  "latency_ms": 15.2,
  "report_markdown": "### 🎯 AI Scout Intelligence Report\n\n**Criteria Evaluated:**\n- Target Position: **Forward**\n- League: **es La Liga**\n- Max Age: **22**\n\n#### Identified Candidates (4 players found):\n1. **Lamine Yamal** (Barcelona | Age 17 | Dynamic Winger / Dribbler)\n2. ...",
  "players_data": [
    {
      "player_id": "lamine_yamal_es_esp_2007_0",
      "player_name": "Lamine Yamal",
      "squad": "Barcelona",
      "league": "es La Liga",
      "position": "FW",
      "position_group": "Forward",
      "minutes_played": 1920,
      "age": 17,
      "cluster_id": 1,
      "cluster_name": "Dynamic Winger / Dribbler",
      "pca_x": 1.58,
      "pca_y": -0.92
    }
  ]
}
```

