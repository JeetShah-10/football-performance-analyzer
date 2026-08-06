# KAGGLE DATASET ML ACCURACY & FRONTEND VISUALIZATION DESIGN
**Project**: Football Player Style Dashboard
**Lead Architect & ML Lead**: Jeet Shah
**Date**: 2026-08-07

---

## 1. High-Accuracy ML Pipeline (Position-Grouped Clustering)

Instead of clustering all positions together (where Defenders and Forwards separate primarily by pitch location), we partition the 30,000+ Transfermarkt dataset into **3 Position Groups**:

```
                       TRANSFERMARKT DATASET (Kaggle)
                                    │
                        Filter minutes_played >= 450
                                    │
                  ┌─────────────────┼─────────────────┐
                  ▼                 ▼                 ▼
             DEFENDERS         MIDFIELDERS        FORWARDS
             (DF / CB / LB)    (MF / CM / DM)     (FW / ST / RW)
                  │                 │                 │
             StandardScaler    StandardScaler    StandardScaler
                  │                 │                 │
             K-Means (k=3)     K-Means (k=4)     K-Means (k=3)
                  │                 │                 │
                  ▼                 ▼                 ▼
          • Ball-Playing Def   • Deep Playmaker  • Clinical Poacher
          • Stopper / Tank     • Box-to-Box      • Target Man / Pivot
          • Attacking Fullback • Press Destroyer • Dynamic Winger
```

---

## 2. Advanced Per-90 & Percentile Feature Matrix

For each player, we engineer 8 core per-90 metrics and calculate their **League Percentile Rank (0 - 100%)**:

1. `goals_per90` (Finishing & Threat)
2. `assists_per90` (Goal Creation)
3. `shots_per90` (Offensive Ambition)
4. `key_passes_per90` (Vision & Passing)
5. `tackles_per90` (Defensive Engagement)
6. `interceptions_per90` (Reading & Ball Recovery)
7. `progressive_passes_per90` (Transition & Line Breaking)
8. `successful_dribbles_per90` (1v1 Carrying & Flair)

---

## 3. High-Impact Frontend UI Components (ETT Deliverable)

### Component 1: Position-Filtered PCA Scatter Plot
- Interactive 2D scatter plot colored by Position Group and Cluster Archetype.
- Hover tooltips showing player photo/badge, squad, league, and top stat.

### Component 2: Hybrid Radar Chart Overlay
- Primary Layer: Selected Player's per-90 percentile polygon (Emerald green).
- Secondary Layer: Cluster Archetype Centroid Average polygon (Slate gray).
- Comparison Mode: Optional dropdown to overlay a 2nd player (e.g. Mbappé vs Haaland).

### Component 3: Cosine Scout Similarity Cards
- Top 5 closest tactical matches with similarity percentage (e.g. *"94.2% Similarity match to Jude Bellingham"*).

---

## 4. Download & Directory Instructions for Jeet

To run this pipeline on real Kaggle data:
1. Go to **[kaggle.com/datasets/davidcariboo/player-scores](https://www.kaggle.com/datasets/davidcariboo/player-scores)**
2. Download `players.csv` and `appearances.csv` (or the zip)
3. Place them into:
   ```
   backend/data/raw/players.csv
   backend/data/raw/appearances.csv
   ```
4. Run dataset aggregator: `python -m backend.data.process_raw_kaggle`
5. Run ML pipeline: `python -m backend.clustering.train_model`
