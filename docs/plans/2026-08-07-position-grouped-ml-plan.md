# Position-Grouped ML Clustering & Percentile Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Upgrade the Data Science pipeline to perform position-grouped K-Means clustering (Defenders, Midfielders, Forwards) and compute league percentile ranks for every metric.

**Architecture:** Updates `backend/data/process_raw_kaggle.py`, `backend/clustering/preprocess.py`, and `backend/clustering/train_model.py` to process Kaggle Transfermarkt raw CSVs into high-accuracy tactical archetypes.

**Tech Stack:** Python 3.11+, pandas, scikit-learn, joblib.

---

### Task 1: Enhance Dataset Aggregator (`process_raw_kaggle.py`)

**Files:**
- Modify: `backend/data/process_raw_kaggle.py`

**Step 1: Update Aggregation Logic**
Ensure positional mapping categorizes players into 3 major groups:
- `Defenders` (CB, LB, RB, DF)
- `Midfielders` (CM, DM, AM, MF)
- `Forwards` (ST, CF, LW, RW, FW)

**Step 2: Verify raw data joining**
Join `players.csv` and `appearances.csv` on `player_id`.

**Step 3: Commit**

```bash
git add backend/data/process_raw_kaggle.py
git commit -m "feat(ds): add position grouping logic to Kaggle dataset aggregator"
```

---

### Task 2: Implement Position-Grouped K-Means & Percentile Scoring (`train_model.py`)

**Files:**
- Modify: `backend/clustering/train_model.py`

**Step 1: Implement Position-Grouped K-Means**
Run K-Means within Defenders ($k=3$), Midfielders ($k=4$), and Forwards ($k=3$).

**Step 2: Calculate Percentile Ranks (0-100%)**
Compute percentile rank for each metric (`scipy.stats.percentileofscore` or `df[col].rank(pct=True) * 100`) for visual radar rendering.

**Step 3: Export Upgraded Model & CSV Artifacts**
Save `players_processed.csv` and `model.pkl` to `backend/data/processed/`.

**Step 4: Commit**

```bash
git add backend/clustering/train_model.py
git commit -m "feat(ds): implement position-grouped KMeans and percentile scoring in training pipeline"
```
