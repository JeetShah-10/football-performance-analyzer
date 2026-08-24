# Eleven — Full-Platform Functional Architecture & Redesign Plan

> **Goal**: Transform Eleven into an Opta-grade, deeply functional football player intelligence platform by fully integrating the backend ML pipeline (GMM Soft-Clustering, 8D Cosine Similarity, PCA Projection, AI Intent Classification) into production-grade interactive views across all 5 secondary pages.
> **Philosophy**: Ponytail Mode (Lean, Standard-first, High ROI) × Luxury Sports Intelligence × Zero AI Slop.

---

## 1. Executive Summary & Current Architecture Audit

Eleven currently possesses a complete offline data science pipeline and trained models:
1. **Dataset**: 1,802 players from Europe''s Top 5 Leagues (2024-2025 season) with 8 core per-90 metrics, positional percentiles, and PCA coordinates.
2. **Unsupervised Clustering**: Gaussian Mixture Models (GMM) with soft probability distributions across positional archetypes, PCA 2D coordinates (67.23% variance explained), and NearestNeighbors cosine distance.
3. **Supervised Position Classifier**: `LogisticRegression` classifier (81.16% accuracy) trained on 8 per-90 metrics.
4. **AI Scout Intent Classifier**: TF-IDF + `LogisticRegression` (88.24% accuracy) routing queries to 4 core analytics routines.

While the **Landing Page** and **Player Detail Profile (`/player/:id`)** are fully modernized, the remaining 5 secondary pages require deep functional and visual upgrades to realize the full power of our machine learning backend.

---

## 2. Page-by-Page Functional Blueprint

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ELEVEN APP SHELL                                       │
│  [Logo: ELEVEN]  │ [1. Explorer] [2. Pitch Map] [3. GMM Matrix] [4. U21 Hub] [5. AI Scout]│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Page 1: Player Directory & Head-to-Head Compare (`/explorer` — `DirectoryTab.jsx`)
**Core Functionality**:
- **Dual Mode View**: Toggle between a **Pro Scouting Telemetry Table** (sortable by any metric: npxG, xAG, KP, PrgP, PrgC, Succ, Tkl, Int, percentile, age, squad) and a **Tactical Cards Grid**.
- **Interactive Head-to-Head Compare Drawer / Matrix**:
  - Select any 2 players directly from table or cards.
  - Interactive Dual Overlapping Radar with metric delta badges (`+14% Key Passes (Saka)`).
  - Real-time **Tactical DNA Overlap Score (Cosine Similarity & Archetype Distance)**.
- **Fast Filter Bar**: Quick League filter pills (with 56px circular league badges), Position pills (`DEF`, `MID`, `ATT`), U21 filter toggle, and minimum minutes slider.

---

### Page 2: Next-Gen U21 Scouting Hub (`/u21-scouting` — `U21ScoutingTab.jsx`)
**Core Functionality**:
- **Target Star Search & Selector**: Search any established world-class star (e.g., *Kevin De Bruyne, Virgil van Dijk, Bukayo Saka, Rodri*).
- **Instant U21 Tactical Twin Ranking**:
  - Queries the 8D Cosine Similarity engine filtering strictly `Age <= 21`.
  - Displays top 5-6 wonderkid replacement candidates with **Match %**, **Archetype**, **League badge**, and **Standout Advantage Metrics**.
- **Side-by-Side Veteran vs Wonderkid Dual Radar & Progression Comparison**:
  - Compare the U21 prospect against the established star in an interactive dual radar.
  - "Scout''s Tactical Verdict": Auto-generated telemetry breakdown highlighting where the wonderkid matches or outperforms the veteran.

---

### Page 3: 2D Tactical Pitch Scatter Map (`/pitch-map` — `PitchMapTab.jsx`)
**Core Functionality**:
- **Interactive High-Performance Pitch Canvas**:
  - 1,802 player nodes rendered on a full tactical pitch grid with pitch thirds (Defensive Third, Middle Third, Attacking Third).
  - Color-coded by Positional Archetype with instant filter toggles for Defenders, Midfielders, and Forwards.
- **Search Spotlight & Convex Hull Clusters**:
  - Search any player to instantly zoom and spotlight their coordinate on the pitch with a pulsing beacon.
  - Optional archetype centroid boundary hulls.
- **Hover Telemetry HUD & Click-to-Drawer**:
  - Hovering a node displays an instant mini player HUD card (photo, squad, league crest, top percentiles).
  - Clicking opens a slide-over tactical quick-inspect drawer with direct links to full profile or comparison.

---

### Page 4: GMM Soft-Clustering Matrix (`/gmm-matrix` — `GMMTab.jsx`)
**Core Functionality**:
- **Dynamic Cluster Centroid Inspection**:
  - Queries `GET /clusters` to fetch real cluster signatures, member counts, and $z$-score deviations per feature.
- **Archetype Signature Radar & Feature Deviation Visualizer**:
  - Interactive radar showing what makes each archetype unique (e.g., *Deep-Lying Playmaker* vs *Aggressive Ball-Winner*).
- **Archetype Benchmark Roster**:
  - Clicking any archetype instantly lists the top benchmark players belonging to that cluster (e.g. *Rodri, Kroos, Jorginho* for Deep-Lying Playmaker) with direct profile links.

---

### Page 5: AI Scout Intelligence Terminal (`/scout-chat` — `ScoutChatTab.jsx`)
**Core Functionality**:
- **Direct Backend ML Integration**:
  - Connects to `POST /scout-agent/query` with async processing.
  - Extracts entities (fuzzy matching 1,802 player names, age filters, positions, leagues) and classifies intent.
- **Rich Interactive Structured Response Cards**:
  - Instead of plain markdown text, render **interactive UI player cards**, **mini radar widgets**, and **one-click comparison buttons** directly inside the chat stream.
- **Suggested Query Quick-Prompts**:
  - Dynamic query chips (*"Find young La Liga wingers similar to Saka"*, *"Compare Rodri vs Barella"*, *"Break down Musiala''s tactical profile"*).

---

## 3. Phased Execution Roadmap

| Phase | Target Page | Key Deliverables | Dependencies |
|---|---|---|---|
| **Phase 1** | **Player Directory & Compare Hub (`/explorer`)** | Pro Telemetry Table, Cards Grid, Head-to-Head Compare Matrix, League Badges | `DirectoryTab.jsx`, `DualRadarCompare.jsx` |
| **Phase 2** | **Next-Gen U21 Scouting Engine (`/u21-scouting`)** | Target Star Search, Top-6 Wonderkid Cosine Twins, Dual Radar Overlays | `U21ScoutingTab.jsx`, `similarity.py` |
| **Phase 3** | **2D PCA Tactical Pitch Scatter Map (`/pitch-map`)** | 1,802-Node Pitch Scatter, Search Spotlight, Hover HUD, Slide-over Drawer | `PitchMapTab.jsx`, `ClusterMap2D.jsx` |
| **Phase 4** | **GMM Soft-Clustering Matrix (`/gmm-matrix`)** | Live Cluster Signatures, Feature $z$-Score Bars, Archetype Roster Inspector | `GMMTab.jsx`, `clusters.py` |
| **Phase 5** | **AI Scout Intelligence Terminal (`/scout-chat`)** | Live Intent Model Routing, Interactive Chat Cards, Mini Radars, Comparison CTAs | `ScoutChatTab.jsx`, `ai_agent_service.py` |

---

## 4. Verification & Quality Gates

- **Zero AI Slop**: Strict compliance with `DESIGN.md` (no purple gradients, no fake copy, clean telemetry typography).
- **Automated Tests**: Maintain 100% passing Pytest suite (`pytest backend/tests/`).
- **Build & Lint**: Zero errors in Vite build (`npm run build`) and Oxlint (`npm run lint`).
