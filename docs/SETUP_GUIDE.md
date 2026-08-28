# 🛠️ Complete Installation, Setup & User Guide

Welcome to **Eleven — Modern Football Player Intelligence & Tactical Analysis Platform**.  
This guide provides complete instructions for cloning, installing, running, and using the application on your local machine across **Windows**, **macOS**, and **Linux**.

---

## 📋 System Prerequisites

Before getting started, make sure you have the following installed:

| Tool | Minimum Version | Recommended | Check Command |
| :--- | :--- | :--- | :--- |
| **Python** | `3.10+` | `3.12` or `3.13` | `python --version` |
| **Node.js** | `18.0+` (LTS) | `20.x` or `22.x` | `node --version` |
| **npm** | `9.0+` | Latest | `npm --version` |
| **Git** | Any modern version | Latest | `git --version` |

---

## ⚡ Method 1: One-Click Automated Launch (Windows)

For Windows users, pre-configured launcher scripts handle environment detection, dependency verification, and startup sequencing automatically:

### 1. Start the Application:
* **Option A**: Double-click [`start_app.bat`](../start_app.bat) in the project root.
* **Option B (PowerShell)**: Run:
  ```powershell
  .\start_app.ps1
  ```

### What the Automated Launcher Does:
1. Detects Python (auto-detects virtual environment if present).
2. Verifies Node.js and npm availability.
3. Launches the **FastAPI Backend** on `http://127.0.0.1:8000`.
4. Actively polls `http://127.0.0.1:8000/health` until the machine learning models and dataset (1,802 players) are loaded into RAM.
5. Launches the **Vite React Frontend** on `http://localhost:5173`.
6. Automatically opens your default web browser to the dashboard.

### 2. Stop the Application:
* Double-click [`stop_app.bat`](../stop_app.bat) to terminate backend and frontend processes cleanly and free ports `8000` and `5173`.

---

## 💻 Method 2: Manual Step-by-Step Installation (All OS)

If you are on macOS/Linux or prefer manual terminal control, follow these steps:

### Step 1: Clone the Repository
```bash
git clone https://github.com/JeetShah-10/football-performance-analyzer.git
cd football-player-analyzer
```

---

### Step 2: Backend Setup (Terminal 1)

```bash
# 1. Create a Python virtual environment (recommended)
python -m venv venv

# 2. Activate virtual environment
# Windows (cmd/PowerShell):
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r backend/requirements.txt

# 4. Start the FastAPI backend server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

* Backend Health Check: `http://127.0.0.1:8000/health`
* Interactive API Documentation: `http://127.0.0.1:8000/docs` (Swagger UI)

---

### Step 3: Frontend Setup (Terminal 2)

Open a **new terminal window** and navigate to the `frontend/` directory:

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite development server
npm run dev
```

* Frontend Application: `http://localhost:5173`

---

## 🧪 Testing & Verification

Ensure everything is running with full integrity by executing the automated test suites:

### 1. Run the Backend Test Suite (52 Automated Tests)
```bash
python -m pytest backend/tests/ -v
```
*Expected Output:*
```text
============================= 52 passed in 2.25s =============================
- backend/tests/test_api.py (9 passed)
- backend/tests/test_api_security.py (7 passed)
- backend/tests/test_mathematical_invariants.py (27 passed)
- backend/tests/test_real_integration.py (5 passed)
- backend/tests/test_scout_agent.py (4 passed)
```

### 2. Verify Frontend Production Build
```bash
cd frontend
npm run build
```
*Expected Output:*
```text
✓ built in ~750ms with 0 errors
```

---

## 🎮 Interactive Platform Navigation & Features

Once the application is running at `http://localhost:5173/`, explore the 5 integrated tactical modules:

```
┌───────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Module            │ How to Use & Key Capabilities                                          │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🗺️ Pitch Map Studio│ Navigate to `/pitch-map`. Hover over any of the 1,802 player nodes on │
│ (/pitch-map)      │ the 2D tactical pitch to view live headshot HUDs and mini radars.      │
│                   │ Toggle between "2D Pitch Scatter" and "8D Metric Correlation Matrix".  │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ ⚔️ Compare Arena   │ Navigate to `/compare`. Select any two players from Europe's Top 5     │
│ (/compare)        │ Leagues to view side-by-side overlapping 8D radar spiderwebs, metric   │
│                   │ dominance deltas, and URL shareable comparisons (?p1=...&p2=...).      │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 🎯 U21 Wonderkids │ Navigate to `/u21-scouting`. Pick a world-class benchmark star (Saka,  │
│ (/u21-scouting)   │ Haaland, Rodri, Saliba) to compute top youth replacements (Age <= 21). │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ 📊 GMM Archetypes │ Navigate to `/gmm-matrix`. Explore 16 Gaussian Mixture Model clusters, │
│ (/gmm-matrix)     │ continuous soft probabilities (sum p_k = 1.0), and interactive normal   │
│                   │ density bell curves (N(mu, sigma^2)) with Z-score crosshairs.          │
├───────────────────┼────────────────────────────────────────────────────────────────────────┤
│ ⚡ AI Scout       │ Navigate to `/scout-chat`. Chat in natural language (e.g. "Find young  │
│ (/scout-chat)     │ wingers in La Liga similar to Saka") with real-time ML telemetry,      │
│                   │ interactive candidate cards, and 1-click jump CTAs.                    │
└───────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting & FAQ

### 1. `ECONNREFUSED 127.0.0.1:8000` in Frontend Terminal
* **Cause**: The Vite frontend development server started and made API requests before the FastAPI backend server was fully initialized.
* **Fix**: Ensure Terminal 1 (Backend) is started first and shows `Application startup complete`. If using `start_app.bat`, the script automatically waits for backend health confirmation before opening the browser.

### 2. Port `8000` or `5173` is Already in Use
* **Fix (Windows)**: Run [`stop_app.bat`](../stop_app.bat) to terminate any hanging background processes.
* **Fix (macOS/Linux)**:
  ```bash
  lsof -ti:8000 | xargs kill -9
  lsof -ti:5173 | xargs kill -9
  ```

### 3. PowerShell Script Execution Policy (`start_app.ps1`)
* If PowerShell blocks the script due to execution policies, run:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\start_app.ps1
  ```

### 4. Are External API Keys or Internet Required?
* **No!** Eleven is **100% self-contained and offline-ready**. All 1,802 player statistics, pre-fitted scikit-learn models (`scaler.pkl`, `gmm.pkl`, `intent_classifier.pkl`), and 1,711 player face photos are stored locally in `backend/data/`.
