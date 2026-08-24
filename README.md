# ⚽ Eleven AI — Modern Football Player Intelligence & Tactical Analysis Platform

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.8-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6.1-F7931E?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://python.org/)
[![Tests](https://img.shields.io/badge/pytest-52%20passed%20(100%25)-44CC11?logo=pytest&logoColor=white)](backend/tests/)
[![Security](https://img.shields.io/badge/Security-OWASP%20Hardened-FF3C00)](SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An end-to-end Data Science and Full-Stack Web Platform that analyzes granular per-90 performance metrics across Europe's Top 5 Leagues (1,802 players), clusters outfield players into 16 distinct tactical playing-style archetypes using **Gaussian Mixture Models (GMM with Soft Probabilities)** and **PCA 2D Spatial Pitch Projection**, surfaces an interactive **U21 Wonderkid Scouting & Replacement Twin Engine**, and delivers an autonomous **AI Scout Intelligence Terminal** powered by a trained Machine Learning intent classification pipeline.

---

## 🎓 Academic Viva & Course Context

This project serves as a comprehensive dual university mini-project submission:
* **FAI (Foundations of AI & Machine Learning)**: Unsupervised ML pipeline, feature engineering, GMM Expectation-Maximization soft clustering ($\sum P(C_k \mid x) = 1.0$), 2D PCA dimension reduction, Cosine `NearestNeighbors` similarity engine, and supervised TF-IDF + Logistic Regression natural language query intent routing.
* **ETT (Enterprise Web Technology & Engineering)**: High-performance React 19 dashboard, zero-dependency mathematical SVG radar spiderwebs and Gaussian density curves, Framer Motion & GSAP animations, asynchronous code splitting (<750ms build), and a secured FastAPI REST API (<15ms latency).

---

## 👥 Team Member Roles & Work Distribution

| Team Member | Domain & Ownership | Core Deliverables & Responsibilities |
| :--- | :--- | :--- |
| **Jeet Shah** | Project Lead, ML, Security, Full Frontend & Docs | Data Science & ML pipeline (GMM Soft Clustering, PCA, Cosine Twin Engine, TF-IDF Intent Classifier), full frontend architecture & visual engineering (React 19, Motion, Tactical Radars, Pitch Map & Scout Terminal), OWASP security hardening, 52-test invariant test suite, and technical documentation & ADRs. |
| **Dev** | Backend & Security Contributor | FastAPI REST API development (`/players`, `/clusters`, `/similar`, `/scout-agent/query`), router modularization, Pydantic schemas, and backend rate limiting & CORS security integration. |
| **Pooja** | Frontend Contributor | Foundational frontend scaffolding, initial UI component wireframing, and base layout setup. |
| **Vishvam** | Data & Asset Acquisition | Player face photo retrieval, image extraction from Transfermarkt/FBref datasets, and asset cataloging for the player headshot archive. |


---

## 🌟 Platform Feature Tour

```
                                  ⚽ ELEVEN AI PLATFORM
       ┌────────────────────────────────────┼────────────────────────────────────┐
       ▼                                    ▼                                    ▼
┌──────────────┐                     ┌──────────────┐                     ┌──────────────┐
│  DATA & ML   │                     │ FASTAPI CORE │                     │  REACT 19 UI │
├──────────────┤                     ├──────────────┤                     ├──────────────┤
│• 1,802 Players│                    │• <15ms Latency│                    │• 100dvh Zero-│
│• 8D Per-90   │                     │• In-Memory   │                     │  Scroll Views│
│  Percentiles │                     │  NumPy Vectors│                    │• Pure Math   │
│• GMM Soft    │                     │• OWASP Shield│                     │  SVG Radars  │
│  Archetypes  │                     │• SlowAPI Rate│                     │• Obsidian    │
│• PCA Pitch   │                     │  Limiting    │                     │  Aesthetic   │
│  Mapping     │                     │• TF-IDF Query│                     │• Zero Emojis │
│• TF-IDF + LR │                     │  Routing     │                     │• GSAP/Framer │
└──────────────┘                     └──────────────┘                     └──────────────┘
```

### 1. 🗺️ PCA Spatial Studio (`/pitch-map`)
* **2D Pitch Scatter View**: 1,802 players projected onto orthogonal tactical pitch axes ($PC_1$: Attacking Threat & Progression vs $PC_2$: Wide Play & Chance Creation).
* **Live Hover HUD**: Interactive popup surfacing player headshot, archetype badge, primary stats, and mini radar preview.
* **Metric Correlation Matrix**: Interactive heatmap analyzing Pearson & Spearman coefficients across all 8 performance metrics.

### 2. ⚔️ Tactical Compare Arena (`/compare`)
* **Side-by-Side Face-Off**: Synchronized comparison of any two players across Europe's Top 5 Leagues.
* **Dual 8D Radar Overlay**: Mathematical multi-polygon spiderweb chart highlighting stat divergence and visual style dominance.
* **Atmospheric Glow**: Immersive tactical amber-orange ambient aura with live URL slot syncing (`?p1=...&p2=...`).

### 3. 🎯 U21 Wonderkid Scouting Twin Engine (`/u21-scouting`)
* **Benchmark Target Selection**: Select elite superstars (Bukayo Saka, Erling Haaland, Rodri, William Saliba).
* **Cosine Similarity Ranking**: Computes real-time vector distance across 8 scaled metrics strictly filtered to players aged $\le 21$.
* **Side-by-Side Radar Matchup**: Shows tactical style similarity score ($0–100\%$) and per-metric delta breakdown.

### 4. 📊 GMM Gaussian Archetype Lab (`/gmm-matrix`)
* **16 Tactical Archetypes**: 4 positional cohorts $\times$ 4 specialized clusters (e.g. *Creative Playmaker*, *Ball-Winning Anchor*, *Dynamic Winger*, *Box Striker*).
* **Soft Probability Distribution**: Every player receives continuous probability memberships ($\sum P(C_k \mid x) = 1.0$), capturing multi-positional versatility.
* **Gaussian Normal Density Studio**: Bespoke SVG bell curves visualizing $\mathcal{N}(\mu_{\text{cluster}}, \sigma^2)$ vs $\mathcal{N}(\mu_{\text{position}}, \sigma^2)$ with interactive $z$-score distance crosshairs.

### 5. ⚡ AI Scout Intelligence Terminal (`/scout-chat`)
* **Local Machine Learning Intent Routing**: TF-IDF Vectorizer + Logistic Regression pipeline classifying queries into 4 operational intents in $<16\text{ms}$.
* **Fuzzy Entity Extraction**: Fuzzy player matching (`difflib`) against 1,802 database records, regex age bounds (`under 22`), and league/position filters.
* **Interactive Candidate Mini-Cards**: Headshots, archetype badges, and 1-click CTA buttons (`VS Compare`, `Twins`, `Dossier`).
* **Real-Time Telemetry Bar**: Latency in milliseconds, classified intent, active filters, and backend methods called.

---

## 🏗️ Technical Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER (React 19 / Vite)                  │
│  - 2D Pitch Scatter Studio             - Gaussian Density Bell Curves  │
│  - Dual Radar Compare Arena            - Zero-Scroll 100dvh Terminal   │
│  - Framer Motion & GSAP Animations     - Native Trigonometric SVGs     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON REST API (Port 8000)
                                    │ GZip Compressed (>1KB) + CORS
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND (Python 3.12+)                  │
│  - In-Memory Singleton Analytics Engine - OWASP Security Middleware    │
│  - SlowAPI Rate Limiting (60 req/min)  - Global Exception Masking      │
│  - Pydantic V2 Request/Response Schemas- Vectorized NumPy Similarity   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Loads Pre-Fitted Artifacts at Startup
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE DATA SCIENCE & ML PIPELINE                  │
│  - FBref Big-5 2024-2025 Dataset       - Minutes Filter (Min >= 450)   │
│  - 8 Per-90 Normalized Metrics         - Position-Grouped Percentiles  │
│  - GMM Soft Probability Clustering     - 2D PCA Dimension Reduction    │
│  - TF-IDF + Logistic Regression Intent - Cosine NearestNeighbors Engine│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Dataset & Feature Engineering Specifications

* **Data Source**: FBref Big-5 European Leagues 2024–2025 (`Premier League`, `La Liga`, `Serie A`, `Bundesliga`, `Ligue 1`).
* **Zero Synthetic Data**: 100% real per-90 metrics calculated from raw match events.
* **Outfield Sample Size**: 1,802 players passing the `Min >= 450` filter (`Defender`: 748, `Midfielder`: 603, `Forward`: 451).
* **Headshot Coverage**: 1,711 real player photos extracted dynamically from in-memory sanitized archive.
* **8 Core Standardized Metrics**:
  1. `npxG_per90`: Non-Penalty Expected Goals
  2. `xAG_per90`: Expected Assisted Goals
  3. `KP_per90`: Key Passes
  4. `PrgP_per90`: Progressive Passes
  5. `PrgC_per90`: Progressive Carries
  6. `Tkl_per90`: Tackles Won
  7. `Int_per90`: Interceptions
  8. `Succ_per90`: Successful Take-Ons

---

## 🔌 REST API Reference

All endpoints return strict Pydantic JSON models and are protected by OWASP headers and SlowAPI rate limiting:

| Method | Endpoint | Description | Response Time |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Health check, dataset metadata, and loaded player count | **~5 ms** |
| `GET` | `/players` | Paginated player list with filters (`position_group`, `league`, `search`, `u21_only`) | **~17 ms** |
| `GET` | `/players/{id}` | Full player dossier with per-90 metrics, percentiles, GMM soft probabilities, and PCA $(x,y)$ | **~5 ms** |
| `GET` | `/players/{id}/image` | Dynamically streams player face photo from sanitized in-memory ZIP archive | **~4 ms** |
| `GET` | `/clusters` | Centroid profiles, descriptions, and signature stats for all 16 archetypes | **~6 ms** |
| `GET` | `/similar/{id}?n=5` | Top $N$ tactical twin recommendations based on 8D Cosine distance | **~9 ms** |
| `POST` | `/scout-agent/query` | Natural language scouting agent with TF-IDF intent routing and fuzzy player extraction | **~15 ms** |

For complete request/response JSON schemas, refer to [`docs/api-contract.md`](docs/api-contract.md).

---

## 🧪 Testing & Quality Assurance

The test suite contains **52 automated tests** covering security, mathematical invariants, and end-to-end integration:

```bash
python -m pytest backend/tests/ -v
============================= 52 passed in 2.25s =============================
```

### Test Suite Breakdown:
1. **[`conftest.py`](backend/tests/conftest.py)**: Session-scoped FastAPI `TestClient` and singleton service fixtures.
2. **[`test_api.py`](backend/tests/test_api.py)**: Endpoint contracts, HTTP status codes, and pagination boundaries.
3. **[`test_api_security.py`](backend/tests/test_api_security.py)**: OWASP security headers, SQLi / XSS payload resilience, parameter fuzzing, and directory traversal defense.
4. **[`test_mathematical_invariants.py`](backend/tests/test_mathematical_invariants.py)**: GMM probability axioms ($\sum p_k = 1.0, p_k \ge 0$), Cosine similarity bounds $[0, 100]\%$, PCA coordinate finiteness, and 15-permutation league/position sweeps.
5. **[`test_real_integration.py`](backend/tests/test_real_integration.py)**: Dataset loading (1,802 players), cluster assignments, and percentile bounds.
6. **[`test_scout_agent.py`](backend/tests/test_scout_agent.py)**: TF-IDF intent classification accuracy, entity extraction, and markdown report synthesis.

---

## 🏛️ Architecture Decision Records (ADRs)

Key architectural decisions and engineering trade-offs are formally documented in [`docs/decisions/`](docs/decisions/):

* **[ADR-001: Gaussian Mixture Models (GMM) with Soft Probabilities](docs/decisions/ADR-001-gmm-soft-clustering.md)**
* **[ADR-002: Principal Component Analysis (PCA) for 8D Tactical Pitch Projection](docs/decisions/ADR-002-pca-spatial-projection.md)**
* **[ADR-003: In-Memory Vectorized Analytics Service in FastAPI](docs/decisions/ADR-003-in-memory-fastapi-service.md)**
* **[ADR-004: Native Mathematical SVG Visualizations over Heavy Charting Libraries](docs/decisions/ADR-004-native-svg-visualizations.md)**
* **[ADR-005: Local TF-IDF Intent Classification & Fuzzy Entity Extraction for AI Scout Agent](docs/decisions/ADR-005-tfidf-intent-classifier.md)**

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
* **Python 3.10+** (Tested on Python 3.12 & 3.13)
* **Node.js 18+** & **npm**

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/JeetShah-10/football-performance-analyzer.git
cd football-player-analyzer

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server
uvicorn backend.main:app --reload --port 8000
```
*API documentation available at `http://localhost:8000/docs`.*

### 3. Frontend Setup
```bash
# In a separate terminal
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*Application available at `http://localhost:5173`.*

---

## 📁 Repository Structure

```
football-player-analyzer/
├── backend/
│   ├── clustering/          # ML scripts (GMM, K-Means, PCA, Intent Classifier)
│   ├── data/
│   │   ├── processed/       # model.pkl, players_processed.csv, intent_classifier.pkl
│   │   └── player_images.zip# 1,711 real player face photos
│   ├── routers/             # FastAPI endpoint routers (players, clusters, scout)
│   ├── schemas/             # Pydantic V2 response & request contracts
│   ├── services/            # AnalyticsService & AIScoutAgentService singletons
│   ├── tests/               # 52 automated tests (conftest, security, invariants)
│   └── main.py              # FastAPI application, OWASP headers, SlowAPI
├── frontend/
│   ├── src/
│   │   ├── components/      # RadarChart, TacticalRadar, GMMArchetypeCanvas, HUD
│   │   ├── pages/           # PitchMapTab, ComparePage, U21ScoutingTab, GMMTab, ScoutChatTab
│   │   ├── lib/             # api.js, gmmUtils.js, metricConfigs.js
│   │   └── App.jsx          # Route splitting, lazy suspense, Obsidian theme
│   ├── package.json         # React 19, Tailwind CSS v4, Framer Motion, GSAP
│   └── vite.config.js       # Fast Rollup chunk splitting
├── docs/
│   ├── decisions/           # 5 formal Architecture Decision Records (ADRs)
│   ├── api-contract.md      # Field-by-field JSON API schemas
│   └── viva_dataset_guide.md# Complete Kaggle Transfermarkt Viva defense guide
├── PRD.md                   # Product Requirements Document
├── DESIGN.md                # 34-Point Anti-Slop Design Specification
├── SECURITY.md              # Security hardening & OWASP API rules
└── README.md                # Enhanced root documentation
```

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
