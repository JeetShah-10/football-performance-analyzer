# Eleven — FastAPI Backend & ML Analytics Service

High-performance, async Python backend serving the **Eleven Football Player Intelligence Platform**, built with FastAPI, scikit-learn, Pydantic V2, and NumPy.

---

## ⚡ Architecture & Performance Highlights

* **Framework**: FastAPI (Async ASGI Architecture on Uvicorn)
* **Micro-Latency**: Sub-15ms response times across all endpoints via in-memory pre-indexed data structures and vectorized NumPy calculations.
* **Security & Hardening**:
  * OWASP security headers (`nosniff`, `DENY`, `1; mode=block`, `strict-origin-when-cross-origin`).
  * Rate limiting via `slowapi` (60 requests/minute per client).
  * Global exception masking (zero stack traces leaked to clients).
  * Path traversal protection on player headshot image retrieval.
* **Compression**: HTTP GZip middleware active on all responses > 1KB.

---

## 📂 Project Structure

```
backend/
├── clustering/              # Offline ML training scripts (GMM, K-Means, PCA, Intent Classifier)
├── data/
│   ├── processed/           # model.pkl, players_processed.csv, intent_classifier.pkl
│   └── player_images.zip    # 1,711 real player face photos
├── routers/                 # Modular API endpoint routers
│   ├── players.py           # /players, /players/{id}, /players/{id}/image
│   ├── clusters.py          # /clusters (GMM & K-Means centroid profiles)
│   ├── similar.py           # /similar/{id} (8D Cosine similarity twin engine)
│   └── scout_agent.py       # /scout-agent/query (TF-IDF ML Intent Agent)
├── schemas/                 # Strict Pydantic V2 request & response models
├── services/                # Singleton domain services
│   ├── analytics_service.py # In-memory player search, filtering, and Cosine math
│   └── ai_agent_service.py  # TF-IDF intent prediction and fuzzy entity extraction
├── tests/                   # 52 automated pytest tests
│   ├── conftest.py          # Session-scoped fixtures
│   ├── test_api.py          # REST endpoint smoke tests
│   ├── test_api_security.py # OWASP headers, SQLi/XSS fuzzing, path traversal
│   ├── test_mathematical_invariants.py # GMM probability axioms, Cosine bounds
│   ├── test_real_integration.py # 1,802 player dataset verification
│   └── test_scout_agent.py  # Intent classifier accuracy & markdown synthesis
├── main.py                  # ASGI entry point, CORS, Rate Limiting, OWASP headers
└── requirements.txt         # Pinned backend dependencies
```

---

## 🚀 Running Locally

```bash
# 1. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Start development server
uvicorn backend.main:app --reload --port 8000

# 4. Run automated test suite
python -m pytest backend/tests/ -v
```

*Interactive API Docs: `http://localhost:8000/docs` (Swagger UI).*
