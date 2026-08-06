# Phase 1: Data Foundation & ML Pipeline Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Clean raw Kaggle Transfermarkt player dataset, engineer per-90 performance metrics, fit K-Means clustering & PCA models, build a nearest-neighbor similarity engine, and export serialized `.pkl` artifacts for backend serving.

**Architecture:** We use an offline Python pipeline (`notebooks/01_eda.ipynb`, `backend/clustering/preprocess.py`, `backend/clustering/train_model.py`) powered by `pandas` and `scikit-learn`. The pipeline outputs `players_processed.csv` and `model.pkl` into `backend/data/processed/`.

**Tech Stack:** Python 3.11+, pandas, scikit-learn, joblib, matplotlib, seaborn.

---

### Task 1: Dataset Setup & Python ML Environment Configuration

**Files:**
- Create: `backend/data/raw/transfermarkt_players.csv`
- Modify: `backend/requirements.txt`

**Step 1: Check Python environment & dependencies**
Verify `pandas`, `scikit-learn`, `joblib`, `jupyter`, `matplotlib`, `seaborn` are installed in the backend python environment.

**Step 2: Procure/Scaffold Dataset in `backend/data/raw/`**
Place the raw player statistics CSV containing player names, positions, minutes played, goals, assists, passes, tackles, interceptions, etc.

**Step 3: Commit initial raw data setup**

```bash
git checkout feature/ds-pipeline
git add backend/requirements.txt backend/data/raw/
git commit -m "feat(ds): initialize data science environment and raw dataset"
```

---

### Task 2: Exploratory Data Analysis & Low-Minute Filtering (Notebook 01)

**Files:**
- Create: `notebooks/01_eda.ipynb`

**Step 1: Write EDA notebook to inspect data distribution**
Load `transfermarkt_players.csv`, profile null values, inspect duplicate player entries, and plot the distribution of `minutes_played`.

**Step 2: Implement Minutes Thresholding (`minutes_played >= 450`)**
Filter out noisy low-sample entries (players with under 450 total minutes played ~ 5 full 90s).

**Step 3: Verify cleaned DataFrame**
Confirm zero null values in feature columns and document exclusion reasoning.

**Step 4: Commit**

```bash
git add notebooks/01_eda.ipynb
git commit -m "feat(ds): complete EDA and minutes filtering threshold in notebook"
```

---

### Task 3: Per-90 Feature Engineering & Standardization

**Files:**
- Create: `backend/clustering/preprocess.py`

**Step 1: Implement Per-90 Calculation Functions**
Calculate `(stat / minutes_played) * 90` for goals, assists, key passes, tackles, interceptions, progressive passes, passes completed, shots.

**Step 2: Implement `StandardScaler` Feature Scaling**
Standardize feature columns so each metric has mean $\mu=0$ and standard deviation $\sigma=1$.

**Step 3: Test pre-processing script**
Run `python -m backend.clustering.preprocess` and verify feature column means $\approx 0$ and standard deviations $\approx 1$.

**Step 4: Commit**

```bash
git add backend/clustering/preprocess.py
git commit -m "feat(ds): build per-90 feature calculation and StandardScaler preprocessor"
```

---

### Task 4: K-Means Clustering, PCA & Similarity Engine Export

**Files:**
- Create: `backend/clustering/train_model.py`
- Output: `backend/data/processed/players_processed.csv`
- Output: `backend/data/processed/model.pkl`

**Step 1: Implement K-Means ($k \in [2, 10]$) & Silhouette Evaluation**
Evaluate cluster inertia and silhouette scores to select optimal cluster count $k=4$ or $k=5$. Assign human-readable cluster archetype labels (e.g. *Poacher*, *Deep-Lying Playmaker*, *Winger*, *Destroyer*).

**Step 2: Calculate PCA 2D Coordinates**
Fit `PCA(n_components=2)` on scaled features to generate `pca_x` and `pca_y` coordinates for frontend scatter plot visualization.

**Step 3: Fit `NearestNeighbors` Similarity Engine**
Fit `NearestNeighbors(n_neighbors=5, metric='cosine')` on high-dimensional scaled features.

**Step 4: Export Artifacts**
Save serialized `model.pkl` (containing scaler, kmeans model, pca model, nearest_neighbors model) and `players_processed.csv` to `backend/data/processed/`.

**Step 5: Verify Artifact Handoff**
Run sanity check test querying `find_similar(player_id)` to ensure expected player styles match.

**Step 6: Commit**

```bash
git add backend/clustering/train_model.py backend/data/processed/
git commit -m "feat(ds): complete KMeans clustering, PCA, and nearest-neighbors export"
```
