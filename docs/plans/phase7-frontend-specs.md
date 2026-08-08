# Phase 7 Plan: React Frontend Dashboard Specifications

**Author**: Pooja (Frontend Lead)  
**Collaborators**: Jeet Shah (Lead & ML Spec), Dev (Backend Lead), Vishvam (Docs Lead)  
**Status**: Ready for Implementation  

---

## 1. Overview & Objectives

Phase 7 delivers the user-facing React web application for the **Football Player Style Dashboard**, providing interactive visualizations for:
1. **Player Directory & Search**: Filtering 1,802 outfield players by position group, league, search query, and Under-21 status.
2. **2D PCA Tactical Cluster Scatter Plot**: Dimensionality-reduced 2D visualization (`pca_x`, `pca_y`) of player tactical styles color-coded by K-Means cluster.
3. **Player Profile Modal**: Percentile rank Radar Chart (8 per-90 metrics), GMM Soft-Clustering probability breakdown bars, and similarity recommendations.
4. **Scouting Radar (U21 Talent Discovery)**: Dedicated scouting panel for discovering under-21 talent (`u21_only=true`) matching established stars.
5. **AI Scout Agent Interface**: Chatbot drawer connected to `POST /scout-agent/query`.

---

## 2. API Contract Mapping

Base URL: `http://localhost:8000`

| Frontend Component | API Endpoint | Query / Body Parameters | Output Data Used |
| :--- | :--- | :--- | :--- |
| `Navbar.jsx` | `GET /health` | None | `status`, `total_players` |
| `DirectoryTab.jsx` | `GET /players` | `search`, `position_group`, `league`, `u21_only`, `limit`, `offset` | Player list items (`player_id`, `player_name`, `squad`, `cluster_name`, `pca_x`, `pca_y`) |
| `ClusterMap2D.jsx` | `GET /players` | `limit=1802` | `pca_x`, `pca_y`, `cluster_name` scatter plot points |
| `PlayerProfileModal.jsx` | `GET /players/{id}` | Path parameter: `player_id` | `stats` (percentiles 0–100), `gmm_probabilities` (dict of archetype probabilities) |
| `GmmBreakdownWidget.jsx` | `GET /players/{id}` | Included in `PlayerDetail` | `gmm_probabilities` (e.g. `Stopper / Defensive Destroyer`: 0.9896) |
| `U21ScoutingTab.jsx` | `GET /similar/{id}` | `u21_only=true`, `n=5` | Top similar candidate cards (Age $\le 21$) |
| `ScoutAgentChat.jsx` | `POST /scout-agent/query` | Body: `{ "query": "..." }` | `synthesized_response`, `intent`, `entities`, `data` |

---

## 3. Technology Stack & Design System

* **Framework**: React 19 + Vite (`frontend/`)
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
* **Design Theme**: Deep Slate / Midnight Dark Mode (`#0B0F19`), Emerald (`#10B981`) & Indigo (`#6366F1`) accents, glassmorphism cards (`border-white/10`).
* **Icons**: `lucide-react`
* **Charts**: `recharts` (`RadarChart`, `ScatterChart`, `BarChart`)
* **HTTP Client**: `axios`

---

## 4. Component Tree & File Layout

```
frontend/src/
├── api/
│   └── client.js                 # Axios API wrapper targeting http://localhost:8000
├── components/
│   ├── Navbar.jsx                # Branding, health badge, tab switcher
│   ├── DirectoryTab.jsx          # Searchable player grid & filter controls
│   ├── ClusterMap2D.jsx          # Recharts 2D PCA Scatter plot (1,802 players)
│   ├── PlayerProfileModal.jsx    # Detail modal (Percentile Radar + GMM widget + Similarity)
│   ├── GmmBreakdownWidget.jsx    # GMM soft-clustering probability bars
│   ├── U21ScoutingTab.jsx        # U21 talent discovery panel
│   └── ScoutAgentChat.jsx        # Conversational AI Scout Agent chat
└── App.jsx                       # Main application state & tab router
```

---

## 5. Verification Roadmap

1. **Build Check**: Run `npm run build` in `frontend/` to confirm 0 TypeScript/Vite compilation errors.
2. **Integration Verification**: Start backend (`uvicorn backend.main:app --port 8000`) and frontend (`npm run dev`) simultaneously and verify:
   - Clicking Saka displays `gmm_probabilities` (`Dynamic Winger / Dribbler: 1.0`).
   - Toggling U21 filter on similarity query returns players with `age <= 21`.
   - Sending `POST /scout-agent/query` returns natural language agent responses.
