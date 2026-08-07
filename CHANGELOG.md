# CHANGELOG: Rework of Data Science Pipeline (Phases 1–4)

**Date:** 2026-08-07  
**Scope:** Rework of Data Science & Machine Learning Pipeline (Phases 1–4)

---

## 1. Executive Summary of Changes

The raw dataset source was completely replaced from Kaggle Transfermarkt to the official FBref Big-5 European Leagues 2024–2025 dataset (`hubertsidorowicz/football-players-stats-2024-2025`). All synthetic/pseudo-random feature generation was eliminated. Key defects in position group mapping, percentile computation, silhouette sweeps, and similarity search self-matching were resolved.

---

## 2. Before vs. After Benchmark Comparison

| Dimension | Before (Transfermarkt Pipeline) | After (FBref 2024-2025 Rework) |
| :--- | :--- | :--- |
| **Data Source** | Kaggle Transfermarkt (synthetic stats) | FBref Big-5 European Leagues 2024–2025 |
| **Synthetic / Random Data** | **6 of 8 features randomly generated** | **ZERO synthetic data (100% real FBref stats)** |
| **Total Raw Rows** | 29,530 | 2,854 |
| **Goalkeeper Handling** | Mixed into outfield clusters | **Explicitly excluded (212 GK rows dropped)** |
| **Multi-Club Handling** | Duplicate rows per club | **Merged across transferred clubs by `Player`+`Nation`+`Born`** |
| **Minutes Filter** | `Min >= 450` | `Min >= 450` (5 full 90s, 1,802 players survived) |
| **Position Mapping** | Substring `'DF'` matched `"MIDFIELD"` | **Exact primary position code matching (`DF`, `MF`, `FW`)** |
| **Position Breakdown** | Defender: 12,868, **Midfielder: 0 (BUG)**, Forward: 7,292 | **Defender: 748, Midfielder: 603, Forward: 451** |
| **Percentile Ranking** | Computed globally across all positions | **Computed WITHIN each position group** |
| **Silhouette Sweep** | Hardcoded $k$ values without report | **Dynamic sweep saved to `silhouette_report.json`** |
| **Defender Best $k$ / Score** | $k=3$ / `0.3728` | **$k=2$ / `0.2958`** |
| **Midfielder Best $k$ / Score** | $k=4$ / `0.0000` (0 rows) | **$k=2$ / `0.2820`** |
| **Forward Best $k$ / Score** | $k=3$ / `0.2938` | **$k=2$ / `0.3176`** |
| **2D PCA Cumulative Variance**| `75.01%` | **`67.23%` (PC1: 44.06%, PC2: 23.17%)** |
| **Similarity Self-Match Bug** | Query player returned as neighbor 0 | **FIXED (Query player explicitly filtered out)** |

---

## 3. Key Bug Fixes & Architectural Improvements

1. **Elimination of Synthetic Data:** Replaced dummy features with 8 real FBref per-90 metrics: `npxG_per90`, `xAG_per90`, `KP_per90`, `PrgP_per90`, `PrgC_per90`, `Tkl_per90`, `Int_per90`, `Succ_per90`.
2. **Multi-Club Merging:** Combined statistics for mid-season transfer players (e.g. Tammy Abraham: Roma + Milan) using `Player` + `Nation` + `Born` before computing per-90 metrics.
3. **Exact Position Matching:** Fixed substring matching bug that misclassified all 14,000+ midfielders. All position groups now have $>0$ players.
4. **Position-Grouped Percentiles:** Percentiles are calculated within each position group (`groupby('position_group')`), matching standard scouting report benchmarks.
5. **Per-Position Silhouette Sweep:** Swept $k \in [2..6]$ for each position group independently and exported results to `backend/clustering/silhouette_report.json`.
6. **Cluster Signature Stats:** Computed features with largest std-dev $Z$-score deviation per cluster and saved alongside archetype names.
7. **Similarity Search Fix:** `get_similar_players()` queries $N+1$ neighbors and strips the self-match at index 0.
8. **Dataset Freezing:** Frozen local raw data at `backend/data/raw/players_data-2024_2025.csv` and created `DATASET_METADATA.json`.
9. **Defensive Archetype Disambiguation (Van Dijk Validation Example):** Virgil van Dijk's `Tkl_per90` sits at the 10.4th percentile among defenders while his `Int_per90` sits at the 71.2nd percentile. This demonstrates that the feature model separates "winning the ball through anticipation/positioning" from "winning the ball through physical duels" rather than treating defensive contribution as an undifferentiated single number.
