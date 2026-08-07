# FBREF 2024-2025 DATASET ML PIPELINE & CLUSTERING DESIGN
**Project**: Football Player Style Dashboard  
**Lead Architect & ML Lead**: Jeet Shah  
**Date**: 2026-08-07

---

## 1. System Goal & Scope Boundary

Given any European outfield player (Big 5 Leagues, 2024–2025 season), this machine learning pipeline answers two core questions:
1. **Playing Style Archetype**: Which tactical cluster does the player belong to?
2. **Scout Similarity Replacement**: Which other players play most similarly to them?

---

## 2. Dataset Architecture & Preprocessing Rules

### Raw Source & Freezing
- **Dataset**: FBref Big-5 European Leagues 2024–2025 (`hubertsidorowicz/football-players-stats-2024-2025`).
- **Frozen File**: `backend/data/raw/players_data-2024_2025.csv`.
- **Metadata Log**: `backend/data/raw/DATASET_METADATA.json`.

### Cleaning Contracts
1. **Explicit Goalkeeper Exclusion**: 212 Goalkeeper rows (`Pos.str.contains('GK')`) are omitted prior to clustering to prevent degenerate outfield feature scaling.
2. **Multi-Club Row Merging**: Players transferred mid-season (e.g., Tammy Abraham at Roma & Milan) are grouped by `['Player', 'Nation', 'Born']`. Min, MP, and raw counts (`npxG`, `xAG`, `KP`, `PrgP`, `PrgC`, `Tkl`, `Int`, `Succ`) are summed across rows before computing per-90 metrics.
3. **Minutes Thresholding**: `Min >= 450` filters out fringe substitutes (687 low-minute players dropped; 1,802 first-team players retained).
4. **Exact Position Group Mapping**: Primary FBref position code (`DF`, `MF`, `FW`) maps players into 3 position groups (`Defender`: 748, `Midfielder`: 603, `Forward`: 451). Asserted $>0$ players per group.
5. **Position-Grouped Percentiles**: `npxG_per90_pct`, `xAG_per90_pct`, etc., are ranked **within** each position group (`groupby('position_group')`).

---

## 3. Unsupervised K-Means & Cluster Signatures

- **Silhouette Sweep**: Dynamic $k \in [2..6]$ sweep executed per position group independently and exported to `backend/clustering/silhouette_report.json`.
- **Optimal Cluster Choices**: $k=2$ chosen per group based on peak silhouette scores (`Defender`: 0.2958, `Midfielder`: 0.2820, `Forward`: 0.3176).
- **Signature Stats**: Top 3 features per cluster with largest std-dev $Z$-score deviation from position group mean are computed and saved in `model.pkl`.

---

## 4. NearestNeighbors Similarity Engine

- **Metric**: Cosine Distance in 8D scaled feature space.
- **Self-Match Filter**: `get_similar_players()` queries $N+1$ neighbors, strips the target player's self-match at index 0, and returns exactly $N$ distinct scouting recommendations with similarity percentage.
