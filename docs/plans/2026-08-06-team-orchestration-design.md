# TEAM ORCHESTRATION & LEARNING DESIGN (SEQUENTIAL HANDOFF)
**Project**: Football Player Style Dashboard
**Lead Architect & ML Lead**: Jeet Shah (Guided step-by-step by Antigravity)
**Team Members**: Jeet, Dev, Pooja, Vishvam
**Date**: 2026-08-06

---

## 1. Sequential Handoff Strategy (Foolproof & Beginner-Friendly)

Instead of complex parallel mock APIs, we use a simple, reliable **Sequential Pipeline**:

```
PHASE 1: ML & DATA SCIENCE (Jeet + Antigravity)
  ├── 1. Data Cleaning & Outlier Removal (minutes >= 450)
  ├── 2. Per-90 Feature Engineering (Goals/90, Assists/90, etc.)
  ├── 3. Feature Normalization (StandardScaler)
  ├── 4. K-Means Clustering & PCA 2D Coordinates
  └── 5. Export processed CSV + model.pkl artifacts
                       │
                       │ (Handoff Artifacts)
                       ▼
PHASE 2: FASTAPI BACKEND (Dev & Pooja)
  ├── 1. Load model.pkl and processed CSV on server startup
  ├── 2. Build /players, /players/{id}, /clusters, /similar endpoints
  └── 3. Verify endpoints in FastAPI Swagger UI (/docs)
                       │
                       │ (Handoff Live Local API)
                       ▼
PHASE 3: REACT FRONTEND (Pooja & Dev)
  ├── 1. Build PCA 2D Scatter Plot (Cluster Overview)
  ├── 2. Build Player Detail & Radar Chart
  └── 3. Build Player Comparison View
                       │
                       │ (Handoff Working App)
                       ▼
PHASE 4: DOCUMENTATION & VIVA PREPARATION (Vishvam & All)
  ├── 1. Capture real charts, cluster maps, and API screenshots
  ├── 2. Complete Viva Report & Architecture Diagrams
  └── 3. Prepare project presentation
```

---

## 2. Jeet's Step-by-Step Mentorship & Leadership Roadmap

As Jeet is learning ML and System Architecture:

### Step 1: Guided Jupyter Notebook EDA (Jeet & Antigravity)
Antigravity will write and explain each block of Python code in `notebooks/01_eda.ipynb`:
- Why we filter low minutes (`minutes >= 450`).
- How per-90 math works (`stat / minutes * 90`).
- What `StandardScaler` does (turning stats into z-scores so 10 goals doesn't overpower 1.2 tackles).

### Step 2: Clustering & Model Export (Jeet & Antigravity)
- How K-Means partitions players into styles (Poacher, Playmaker, Winger, Destroyer).
- How PCA reduces 15 stat columns into 2 coordinates (`pca_x`, `pca_y`) for plotting.
- Exporting `model.pkl` and `players_processed.csv`.

### Step 3: Handoff to Backend (Jeet $\rightarrow$ Dev & Pooja)
- Jeet provides the exact `.pkl` file and `players_processed.csv` to Dev & Pooja with a clear column guide.

### Step 4: Handoff to Frontend (Dev & Pooja $\rightarrow$ User UI)
- Connecting React visualizers to live FastAPI data.

### Step 5: Viva Preparation (Jeet & Vishvam)
- Jeet and Vishvam write up the ML explanations for the viva report so Jeet can answer any professor's question with 100% confidence.
