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
| **Jeet Shah** | Project Lead, ML & Architecture | Frontend & Security & Docs | Data Science & ML pipeline (GMM Soft Clustering, PCA, Cosine Engine, TF-IDF Intent Classifier), full frontend architecture & visual engineering (React 19, Motion, Tactical Radars, Pitch Map & Scout Terminal), OWASP security hardening, 52-test invariant test suite, and technical documentation & ADRs. |
| **Dev** | Backend API & Routing | Server Security | FastAPI REST endpoints (`/players`, `/clusters`, `/similar`, `/scout-agent/query`), Pydantic schemas, routing modularization, rate limiting, and CORS configuration. |
| **Pooja** | Frontend Development | UI Components | Initial frontend wireframing, baseline UI layout setup, and base component scaffolding. |
| **Vishvam** | Asset Acquisition & Data Support | Image Cataloging | Player face photo retrieval, headshot image dataset extraction, and asset cataloging for the player image archive. |

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
- **Input**: FBref Big-5 European Leagues 2024–2025 full-season dataset (`hubertsidorowicz/football-players-stats-2024-2025`).
- **Minutes Filter**: Exclude low-sample outliers (`minutes_played < 450`).
- **Per-90 Normalization**: Calculate `(stat / total_minutes) * 90` for goals, assists, key passes, tackles, interceptions, progressive passes, carries, take-ons.
- **Feature Scaling**: Standardize features using `StandardScaler` ($\mu=0, \sigma=1$).

### FR-2: Clustering & Visual Dimension Reduction (Jeet)
- **Algorithms**: `KMeans(n_clusters=k)` evaluated across $k \in [2, 6]$ per position group independently using Silhouette Score.
- **Archetype Labeling**: Human-readable naming of cluster centroids (e.g., *Stopper / Defensive Destroyer*, *Deep-Lying Playmaker*, *Dynamic Winger / Dribbler*).
- **PCA 2D Coordinates**: Apply Principal Component Analysis (PCA) to reduce feature space to 2 dimensions (`pca_x`, `pca_y`) explaining 67.23% variance strictly for scatter plot rendering.

### FR-3: Similarity Engine (Jeet & Dev)
- **Algorithm**: `NearestNeighbors(n_neighbors=5, metric='cosine')` trained in the high-dimensional scaled feature space (not PCA space).
- **Output**: Returns top $N$ closest player matches for any selected target player.

### FR-4: AI Scout Agent & REST API Layer (Dev & Jeet)
- **Framework**: FastAPI with Pydantic response contracts and slowapi rate-limiting.
- **Trained Intent Layer**: TF-IDF + Logistic Regression model trained on 84 sample query dataset (88.24% test accuracy) predicting query intents (`find_similar`, `find_by_criteria`, `explain_player`, `compare_players`).
- **Entity Extraction**: Rule-based matching (fuzzy player name matching via `difflib` against 1,802 database names, regex age limits, position keywords).
- **Report Synthesizer**: Template-based Markdown report generation over real retrieved `AnalyticsService` metrics.
- **Supervised Position Classifier**: `LogisticRegression` classifier (81.16% test accuracy) trained on 8 per-90 metrics predicting position groups (`Defender`, `Midfielder`, `Forward`), with confusion matrix evaluation saved in `position_classifier_report.json`.

### FR-5: React Frontend Dashboard & Visual Analytics (Jeet & Pooja)
- **Overview Screen**: Interactive PCA 2D Scatter Plot colored by cluster archetype with search and position filters.
- **Player Detail Screen**: Metric Radar Chart comparing individual player stats against their cluster centroid average.
- **Compare View**: Side-by-side radar and statistical metric comparison between two players.
- **Scout Intelligence Terminal**: 100dvh zero-scroll telemetry cockpit with interactive candidate cards.

### FR-6: Player Image Retrieval & Dataset Support (Vishvam)
- Acquisition and extraction of 1,711 player face photos from Transfermarkt/FBref archives.
- Cataloging player headshot file associations with unique player identifiers.

### FR-7: Documentation, Security & Testing (Jeet & Dev)
- 5 formal Architecture Decision Records (ADRs) in `docs/decisions/`.
- 52-test automated suite covering API contracts, mathematical invariants, and OWASP security headers.

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
| **Phase 1** | Data Cleaning & EDA | ✅ **COMPLETED** | Jeet Shah | 2,854 FBref rows cleaned, 212 GKs dropped, multi-club rows merged, 1,802 players retained |
| **Phase 2** | Per-90 Feature Engineering & Scaling | ✅ **COMPLETED** | Jeet Shah | 8 real per-90 metrics, position-grouped 0–100% percentiles, `StandardScaler` normalization |
| **Phase 3** | Position-Grouped K-Means Clustering | ✅ **COMPLETED** | Jeet Shah | Position-Grouped K-Means ($k=4$), GMM Soft Probabilities ($P(C_k \mid x)$), 2D PCA |
| **Phase 4** | Similarity Engine & Artifact Export | ✅ **COMPLETED** | Jeet Shah | Cosine `NearestNeighbors` engine, `model.pkl` & `players_processed.csv` exported |
| **Phase 5** | FastAPI Endpoint Implementation | ✅ **COMPLETED** | Dev | REST API (`/players`, `/players/{id}`, `/clusters`, `/similar/{id}`, `/scout-agent/query`), rate limiting |
| **Phase 6** | React Dashboard & Visualizations | ✅ **COMPLETED** | Pooja | Vite + React 19, Tailwind CSS, PCA Scatter Studio, GMM Gaussian Studio, Compare Arena |
| **Phase 7** | Integration Polish & Error Handling | ✅ **COMPLETED** | Dev, Pooja, Jeet | 52 automated tests, OWASP security headers, error masking, zero-slop checklist verification |
| **Phase 8** | AI Scout Intelligence Terminal | ✅ **COMPLETED** | Jeet & Dev | TF-IDF ML Intent Routing, rule-based entity extraction, interactive mini-cards |
| **Phase 9** | Final Viva Documentation & ADRs | ✅ **COMPLETED** | Vishvam & Jeet | 5 formal ADRs in `docs/decisions/`, `viva_dataset_guide.md`, `api-contract.md` |

