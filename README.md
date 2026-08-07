# ⚽ Football Player Style Dashboard

An end-to-end Data Science and Web Application that analyzes player performance metrics across top European leagues, clusters outfield players into distinct playing-style archetypes using unsupervised Machine Learning (K-Means & PCA), and surfaces an interactive scouting/replacement similarity engine.

---

## 🎓 Academic Viva Context

This project serves as a combined university mini-project submission:
* **FAI (Data Science & Machine Learning)**: Unsupervised ML pipeline, feature engineering, per-position silhouette evaluation, 2D PCA dimension reduction, and Cosine `NearestNeighbors` scouting engine.
* **ETT (Frontend & Web Engineering)**: High-performance React dashboard, interactive Plotly / Recharts visual analytics, and REST API integration with FastAPI.

---

## 👥 Team Member Roles & Domain Ownership

| Team Member | Domain & Ownership | Git Branch | Core Deliverables & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Jeet Shah** | Data Science & ML Lead + Architect | `feature/ds-pipeline` | Data cleaning, per-90 metric engineering, K-Means clustering, PCA, model evaluation, `.pkl` export, cross-stack integration oversight. |
| **Dev** | Backend API & Security Lead | `feature/fastapi-api` | FastAPI REST endpoints (`/players`, `/clusters`, `/similar`), Pydantic V2 schemas, CORS, rate limiting, error masking. |
| **Pooja** | Frontend & UI/UX Lead | `feature/react-ui` | React UI dashboard, Tailwind CSS, Plotly/Recharts visualizations (PCA 2D Scatter Plot, Metric Radar Chart, Compare View), client state. |
| **Vishvam** | Documentation & Non-Tech Lead | `docs/` | PRD maintenance, viva documentation, report generation, system architecture diagrams, presentation materials. |

---

## 🏗️ System Architecture

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
│  - K-Means Clustering (k=2 per group)  - NearestNeighbors Engine       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Dataset & Machine Learning Specifications

* **Data Source**: FBref Big-5 European Leagues 2024–2025 (`hubertsidorowicz/football-players-stats-2024-2025`).
* **Zero Synthetic Data**: 100% real per-90 metrics calculated directly from raw FBref stats.
* **Goalkeeper Exclusion**: 212 Goalkeepers excluded prior to clustering.
* **Multi-Club Merging**: Mid-season transfer rows (e.g., Tammy Abraham at Roma & Milan) merged by `['Player', 'Nation', 'Born']`.
* **Outfield Sample Size**: 1,802 players passing the `Min >= 450` filter (`Defender`: 748, `Midfielder`: 603, `Forward`: 451).
* **Position-Grouped Percentiles**: Ranks (0–100%) calculated **within** each position group.
* **Silhouette Evaluation**: Dynamic sweep ($k \in [2..6]$); $k=2$ chosen per group based on peak scores (`Defender`: 0.2958, `Midfielder`: 0.2820, `Forward`: 0.3176).
* **2D PCA Projection**: Explains **67.23%** of feature variance (PC1: 44.06%, PC2: 23.17%).
* **Similarity Engine**: Cosine `NearestNeighbors` in 8D scaled feature space with target self-match filtering.

---

## 🔌 REST API Endpoints

All API responses are serialized JSON. Rate limiting is enforced at 60 requests/minute per endpoint (`slowapi`).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System status, dataset label, and loaded player count. |
| `GET` | `/players` | Summary list of all outfield players (filters: `position_group`, `league`, `search`, `limit`, `offset`). |
| `GET` | `/players/{id}` | Detailed player statistics with raw per-90 metrics and position-group percentiles. |
| `GET` | `/clusters` | Centroid metric profiles, descriptions, and top 3 Z-score signature stats per cluster. |
| `GET` | `/similar/{id}?n=5` | Top $N$ similar player recommendations based on Cosine feature distance. |

For detailed field-by-field JSON schemas, refer to [`docs/api-contract.md`](docs/api-contract.md).

---

## 🚀 Quickstart Guide

### 1. Prerequisites
* Python 3.10+
* Node.js 18+ & npm

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/JeetShah-10/football-performance-analyzer.git
cd football-player-analyzer

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt # or install fastapi uvicorn slowapi scikit-learn pandas numpy pytest httpx

# Run tests
pytest backend/tests/ -v

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```
API docs available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📄 Documentation Links

* [PRD Document](PRD.md)
* [API Contract Specification](docs/api-contract.md)
* [Design Taste & Guidelines](DESIGN.md)
* [Security & Hardening](SECURITY.md)
* [Viva Dataset Guide](docs/viva_dataset_guide.md)
* [Changelog & Benchmarks](CHANGELOG.md)

---

## 📜 License

This project is open-source under the MIT License - see the [LICENSE](LICENSE) file for details.
