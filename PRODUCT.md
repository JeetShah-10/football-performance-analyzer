# Product — Eleven

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
- Primary Users: Football Scouts, Analysts, Technical Directors, and Tactical Enthusiasts.
- Primary Situation: Performing pre-match player comparisons, identifying under-21 value prospects, analyzing positional soft-clustering archetypes, and querying player profile metrics.

## Product Purpose
- **Eleven** delivers Opta-grade football player tactical analytics and Apple liquid glassmorphic visuals.
- Solves the problem of evaluating players beyond raw traditional goals/assists by using GMM soft-clustering, per-90 percentile ranking (0-100), NearestNeighbors similarity matching, and natural language AI scouting across 1,802 players from Europe's Top 5 Leagues.

## Positioning
- Unlike generic stats databases (Transfermarkt, FBref), Eleven provides interactive 2D PCA Pitch Scatter Plot visualizations, dual-player overlapping radar chart comparisons, Gaussian Mixture Model archetype probability distributions, and an intent-classified AI scout chatbot (`POST /scout-agent/query`).

## Operating Context
- Web application interface used during scouting meetings, player evaluation sessions, and viva/portfolio demonstrations. Requires zero latency, fast navigation, responsive liquid glassmorphic UI, and 100% resilient image fallback handling.

## Capabilities and Constraints
- **Data Universe**: 1,802 players from Premier League, La Liga, Serie A, Bundesliga, and Ligue 1.
- **Backend Tech**: FastAPI, Scikit-Learn, Pandas, SlowAPI rate-limiting (60/min general, 120/min images).
- **Frontend Tech**: React 19, Vite, Tailwind CSS, Framer Motion spring physics, Recharts, Lucide React icons, Oxlint.
- **Image Serving**: Dedicated backend zip stream (`GET /players/{id}/image`) serving compressed 12-18KB Wikidata photos, with automatic SVG initials avatar fallback.

## Brand Commitments
- **Name**: **Eleven**
- **Logo Mark**: Precision bold italic "11" monogram with cut-glass chamfered edges.
- **Visual Aesthetic**: Opta Vision Precision Analytics × Apple Liquid Glassmorphism.
- **Color Palette**: Deep Obsidian (`#05080C`), Glass Obsidian (`#060A10`), Tactical Orange (`#FF4E32`), Cyber Cyan (`#3AA6D9`), Gold (`#E8B33D`), Wonderkid Pink (`#E8437A`).
- **Typography**: Baftiva / Space Grotesk (Headings) + JetBrains Mono (`tabular-nums` for all metrics).

## Evidence on Hand
- Processed Dataset: `backend/data/processed/players_processed.csv` (1,802 rows, 52 columns).
- Machine Learning Models: GMM soft-clustering (`position_classifier.pkl`), Intent Classifier (`intent_classifier.pkl`).
- Test Suite: 18 unit/integration tests passing in Pytest (`pytest backend/tests/ -v`).

## Product Principles
1. **Precision First**: Every metric is grounded in per-90 statistics and positional percentile rankings against peers.
2. **Zero AI Slop**: No purple gradients, no fake visitor counters, no broken image icons, clean console execution.
3. **Frictionless Discovery**: Instant global search (`⌘K`), 5 dedicated navigation tabs, slide-over AI Scout Assistant.
4. **Resilient Craft**: 100% fallbacks for images, error masking, fast page load, and responsive liquid glassmorphic styling.
