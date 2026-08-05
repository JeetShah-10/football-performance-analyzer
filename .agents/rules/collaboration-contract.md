# Team Collaboration & API/Data Safety Contracts

To prevent one team member's code from breaking another member's work, Antigravity AI agents MUST enforce the following immutable contracts.

---

## 1. Data Contract (Data Science ➡️ Backend)
The DS pipeline exports serialized artifacts to `backend/data/processed/`.
- **`model.pkl`**: Must contain fitted `KMeans` model, `StandardScaler`, and `NearestNeighbors` model.
- **`players_processed.csv`**: Must contain at least the following standard columns:
  - `player_id`: unique string/int
  - `player_name`: string
  - `position`: string
  - `minutes_played`: int
  - `cluster_id`: int
  - `cluster_name`: string (human-readable label, e.g., "Poacher")
  - `pca_x`: float (2D visualization coordinate)
  - `pca_y`: float (2D visualization coordinate)
  - Per-90 engineered stat columns (`goals_per90`, `assists_per90`, `tackles_per90`, `progressive_passes_per90`, etc.)

> [!CAUTION]
> Do NOT change the column names in `players_processed.csv` without updating the Backend Pydantic models.

---

## 2. API Contract (Backend ➡️ Frontend)
The FastAPI server serves endpoints on port 8000.
- **`GET /players`**: Returns list of player summary objects (`id`, `name`, `position`, `cluster_name`, `pca_x`, `pca_y`).
- **`GET /players/{id}`**: Returns full detailed stats for radar chart and centroid comparison.
- **`GET /clusters`**: Returns cluster centroid profiles and list of archetypes.
- **`GET /similar/{id}?n=5`**: Returns top `n` similar players in scaled feature space.

> [!CAUTION]
> Do NOT alter response JSON key names without notifying the Frontend Lead.
