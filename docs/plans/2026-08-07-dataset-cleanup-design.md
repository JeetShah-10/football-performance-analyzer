# RAW DATASET CLEANUP & RETENTION SPECIFICATION
**Project**: Football Player Style Dashboard
**Date**: 2026-08-07

---

## 1. Retained Core Dataset Files (Powering 100% of ML & UI Features)

| File Name | Size | Purpose & ML/UI Feature Integration |
| :--- | :--- | :--- |
| **`players.csv`** | ~17 MB | Primary player metadata (name, sub-position, age, height, foot, current market value). |
| **`appearances.csv`** | ~149 MB | 1,894,350 match appearances for calculating per-90 goals, assists, minutes, cards. |
| **`clubs.csv`** | ~183 KB | Official club names (e.g. Real Madrid, Arsenal, Manchester City). |
| **`competitions.csv`** | ~10 KB | Official league names (Premier League, La Liga, Serie A, Bundesliga, Ligue 1). |
| **`player_valuations.csv`** | ~31 MB | Historical market value progression over time for player detail views. |
| **`transfermarkt_players.csv`** | ~3.4 MB | Formatted aggregated output of 29,530 real players. |

---

## 2. Removed Unused Files (>550 MB Freed)

The following files were removed as they contain minute-by-minute event logs or match lineups that are unnecessary for per-90 tactical style clustering:
- `game_events.csv` (156 MB)
- `games.csv` (25 MB)
- `transfers.csv` (14 MB)
- `club_games.csv` (11 MB)
- `countries.csv` (13 KB)
- `national_teams.csv` (29 KB)

---

## 3. Pipeline Verification
Running `python -m backend.data.process_raw_kaggle` and `python -m backend.clustering.train_model` operates with zero errors, loading 29,530 real player profiles into `backend/data/processed/players_processed.csv` and `model.pkl`.
