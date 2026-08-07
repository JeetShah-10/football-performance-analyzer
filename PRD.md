# PRODUCT REQUIREMENTS DOCUMENT (PRD.md)
## Football Player Style Dashboard

---

## 1. Executive Summary & Vision

The **Football Player Style Dashboard** is an end-to-end data science and web application that analyzes player performance metrics from top European leagues, clusters players into distinct playing-style archetypes using unsupervised machine learning (K-Means & PCA), and surfaces an interactive scouting/replacement similarity engine. 

This project serves as a dual university mini-project submission:
* **FAI (Data Science & ML)**: Data pipeline, feature engineering, clustering model, silhouette evaluation, and nearest-neighbors similarity engine.
* **ETT (Frontend & Web Engineering)**: High-performance React dashboard, interactive Plotly/Recharts visualizations, and REST API integration with FastAPI.

---

## 2. Team Member Responsibility Matrix

| Team Member | Primary Focus Area | Secondary Focus Area | Key Deliverables & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Jeet Shah (Lead & ML Spec)** | Data Science & ML Pipeline | Full-Stack Guidance | Raw data cleaning, per-90 metric engineering, K-Means clustering, PCA, model evaluation, `.pkl` export, cross-stack integration oversight. |
| **Dev** | Backend API & Security | Server Infrastructure | FastAPI REST endpoints (`/players`, `/clusters`, `/similar`), Pydantic schemas, CORS, rate limiting, error masking. |
| **Pooja** | Frontend & UI/UX | Visual Analytics | React UI components (PCA 2D Plot, Radar Charts, Compare View), dashboard styling (Tailwind + `shadcn/ui`), client-side state. |
| **Vishvam** | Documentation & Non-Tech | Project Management | Project PRD maintenance, viva documentation, report generation, system architecture diagrams, user guides. |

---

## 3. System Architecture & Component Integration

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER (React / Vite)                     │
│  - Scatter Plot (PCA 2D Cluster Map)   - Radar Chart Comparison        │
│  - Player Detail Card                  - Nearest-Neighbor Scout Cards  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST API (port 8000)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND (Python)                        │
│  - Pydantic Response Models            - Rate Limiting Middleware      │
│  - GET /players                        - GET /players/{id}             │
│  - GET /clusters                       - GET /similar/{id}?n=5         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Loads pre-trained model & data (.pkl)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE ML PIPELINE (scikit-learn)                  │
│  - Data Cleaning & Minutes Filter (>=450 mins)                         │
│  - Per-90 Metric Calculation           - StandardScaler Normalization │
│  - K-Means Clustering (k=4..6)         - NearestNeighbors Engine       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Functional Requirements

### FR-1: Data Processing & Feature Engineering (Jeet)
- **Input**: Kaggle Transfermarkt player statistics CSV.
- **Minutes Filter**: Exclude low-sample outliers (`minutes_played < 450`).
- **Per-90 Normalization**: Calculate `(stat / total_minutes) * 90` for goals, assists, key passes, tackles, interceptions, progressive passes, etc.
- **Feature Scaling**: Standardize features using `StandardScaler` ($\mu=0, \sigma=1$).

### FR-2: Clustering & Visual Dimension Reduction (Jeet)
- **Algorithms**: `KMeans(n_clusters=k)` evaluated across $k \in [2, 10]$ using Elbow Method (Inertia) and Silhouette Score.
- **Archetype Labeling**: Human-readable naming of cluster centroids (e.g., *Poacher*, *Deep-Lying Playmaker*, *Ball-Winning Midfielder*).
- **PCA 2D Coordinates**: Apply Principal Component Analysis (PCA) to reduce feature space to 2 dimensions (`pca_x`, `pca_y`) strictly for scatter plot rendering.

### FR-3: Similarity Engine (Jeet & Dev)
- **Algorithm**: `NearestNeighbors(n_neighbors=5, metric='cosine')` trained in the high-dimensional scaled feature space (not PCA space).
- **Output**: Returns top $N$ closest player matches for any selected target player.

### FR-4: REST API Layer (Dev)
- **Framework**: FastAPI with Pydantic response contracts and slowapi rate-limiting.
- **Endpoints**:
  - `GET /players`: Returns summarized player list with cluster labels and PCA coordinates.
  - `GET /players/{id}`: Returns detailed per-90 stats and cluster centroid comparison data.
  - `GET /clusters`: Returns metadata and centroid metric profiles for all clusters.
  - `GET /similar/{id}?n=5`: Returns top $N$ similar players.

### FR-5: React Frontend Dashboard (Pooja)
- **Overview Screen**: Interactive PCA 2D Scatter Plot colored by cluster archetype with search and position filters.
- **Player Detail Screen**: Metric Radar Chart comparing individual player stats against their cluster centroid average.
- **Compare View**: Side-by-side radar and statistical metric comparison between two players.

### FR-6: Documentation & Viva Deliverables (Vishvam)
- Comprehensive README with setup guides and architecture diagrams.
- Viva Report covering data distribution, clustering validation graphs (Elbow/Silhouette), and API benchmarks.

---

## 5. Non-Functional Requirements & Safety Contracts

- **Security ([SECURITY.md](SECURITY.md))**: Rate limiting on all routes, zero secrets in frontend, input validation via Pydantic, sanitized error messages (no stack trace leaks).
- **Design Taste ([DESIGN.md](DESIGN.md))**: Zero AI slop, no purple gradients, crisp typography, generous whitespace, strict 34-point quality checklist.
- **Performance**: Pre-computed model loaded at startup; API response latency $<50\text{ms}$ for similarity queries.

---

## 6. Phase Execution Roadmap & Current Status

| Phase | Description | Status | Responsible Lead | Key Artifacts / Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Project & Context Setup | ✅ **COMPLETED** | Jeet & Team | `.agents/AGENTS.md`, `PRD.md`, `DESIGN.md`, `SECURITY.md`, Git branches |
| **Phase 1** | Data Cleaning & EDA | ✅ **COMPLETED** | Jeet Shah | 1.89M match appearances aggregated, 29,530 Kaggle players cleaned, `01_eda.ipynb` |
| **Phase 2** | Per-90 Feature Engineering & Scaling | ✅ **COMPLETED** | Jeet Shah | 8 per-90 metrics, 0–100% percentile ranks, `StandardScaler` normalization |
| **Phase 3** | Position-Grouped K-Means Clustering | ✅ **COMPLETED** | Jeet Shah | Position-Grouped K-Means ($k=3..4$), Silhouette score `0.2234`, PCA 2D coordinates |
| **Phase 4** | Similarity Engine & Artifact Export | ✅ **COMPLETED** | Jeet Shah | Cosine `NearestNeighbors` engine, `model.pkl` & `players_processed.csv` exported |
| **Phase 5** | FastAPI Endpoint Implementation | ⏳ **NEXT UP** | Dev | REST API (`/players`, `/players/{id}`, `/clusters`, `/similar/{id}`), rate limiting |
| **Phase 6** | React Dashboard & Visualizations | ⏳ **UPCOMING** | Pooja | Vite + React, Tailwind CSS, PCA Scatter Plot, Hybrid Radar Chart, Compare View |
| **Phase 7** | Integration Polish & Error Handling | ⏳ **UPCOMING** | Dev, Pooja, Jeet | Security audit, error masking, zero-slop checklist verification |
| **Phase 8** | Production Deployment | ⏳ **UPCOMING** | Dev (Backend) & Pooja (Frontend) | FastAPI on Render / Railway, React UI on Vercel |
| **Phase 9** | Final Viva Documentation & Demo | 🔄 **IN PROGRESS** | Vishvam & Jeet | Viva dataset guide [`docs/viva_dataset_guide.md`](docs/viva_dataset_guide.md), report, presentation |

