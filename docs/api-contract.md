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
    "cluster_id": 1,
    "cluster_name": "Dynamic Winger / Dribbler",
    "pca_x": 1.425,
    "pca_y": -0.812
  }
]
```

---

### `GET /players/{player_id}`
Returns detailed player statistics with per-90 values and position-group percentile ranks (0–100%).

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
  "cluster_id": 1,
  "cluster_name": "Dynamic Winger / Dribbler",
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

### `GET /similar/{player_id}?n=5`
Returns top $N$ closest tactical matches for a player using Cosine distance in 8D scaled feature space.

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
