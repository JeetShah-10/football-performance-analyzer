# Next-Gen U21 Scouting Engine Design Document

**Date**: 2026-08-25  
**Topic**: Phase 2 — Next-Gen U21 Tactical Twin Scouting Engine (`/u21-scouting` — `frontend/src/pages/U21ScoutingTab.jsx`)  
**Status**: APPROVED DESIGN

---

## 1. Executive Summary & Problem Definition

In modern European recruitment, technical directors and recruitment analysts do not scout youth prospects in a vacuum. They seek **tactical replacement profiles**—e.g. *"Who is an under-21 prospect in the Big-5 European leagues that matches Kevin De Bruyne's progressive passing and chance creation footprint?"*

The **U21 Scouting Engine** connects a selected veteran target star to our live **8D Cosine NearestNeighbors Similarity Engine** with strict `Age <= 21` filtering, rendering:
1. An executive 3-zone bento workspace.
2. A ranked list of U21 tactical twins with similarity matching badges.
3. An illuminated Backlit (BKLit) Dual Tactical Radar showdown (Target Star vs Wonderkid Prospect).
4. An automated scouting appraisal verdict and direct raw metric advantage delta strip.
5. Instant one-click action handoffs into the **Compare Arena** (`/compare`) and **Player Detail Dossiers** (`/player/:id`).

---

## 2. Security & Backend Insulation Contract

Per strict **SECURITY.md** and user instruction (*"Do not leak any backend into frontend"*):
- **Zero Raw Server Traces**: All API interactions use strict typed DTOs (`PlayerSummary`, `PlayerDetail`, `SimilarPlayerResponse`).
- **No Leaked Stack Traces**: 500 exceptions remain masked by `custom_500_handler` in `main.py`.
- **Client-Side Data Sanitization**: Frontend interacts solely via client-side API facade (`lib/api.js`), handling errors gracefully with zero internal path exposure.
- **Strict Input Constraints**: `limit` and `n` capped at `[1..20]`, rate-limited at 60 req/min.

---

## 3. UI/UX Architecture & Bento Layout

The `/u21-scouting` view is structured into a responsive 3-zone executive bento grid:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. TOP HERO & TARGET SELECTOR DECK (Liquid Glass Header + Quick-Select Veteran Chips)       │
├──────────────────────────────────────────┬──────────────────────────────────────────────────┤
│ 2. LEFT COLUMN (4 cols):                 │ 3. RIGHT MAIN STUDIO (8 cols):                   │
│    A. Target Benchmark Star Card         │    A. BKLit Dual Tactical Radar Showdown         │
│       - Photo, Squad, League Crest,      │       - Target Star (Amber/Gold Polygon)         │
│         Position Group, Archetype        │       - U21 Prospect (Cyber Cyan Polygon)        │
│                                          │       - 8D Cosine Tactical Overlap Badge         │
│    B. Ranked U21 Prospect Matches        │                                                  │
│       - Match Score % (e.g. 94.8%)       │    B. Automated Scouting Verdict Dossier         │
│       - Player Card, Squad, Age, League  │       - Contextual tactical comparison           │
│       - Interactive Click to Inspect     │                                                  │
│                                          │    C. 8-Metric Direct Output Delta Strip         │
│                                          │       - Raw output & percentage lead badges      │
│                                          │                                                  │
│                                          │    D. Executive Action CTAs                      │
│                                          │       - "⚔ Open in Compare Arena"                │
│                                          │       - "📄 Full Prospect Dossier"               │
└──────────────────────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 4. State Management & Persistence

- **URL Parameter & Session Sync**:
  - Target player synced via `?target=:player_id` and `sessionStorage.getItem('u21_target')`.
  - Selected U21 prospect synced via `?prospect=:player_id` and `sessionStorage.getItem('u21_prospect')`.
- **Soft Refresh Resiliency**: F5 / browser reload preserves active scouting workbench without resetting.
- **Standby Canvas**: Visiting `/u21-scouting` with no parameters shows an inviting standby workspace with Quick Select veteran chips (*Mohamed Salah, Kevin De Bruyne, Virgil van Dijk, Bukayo Saka, Rodri, Harry Kane*).

---

## 5. Technical Stack & Anti-Slop Visual Taste

- **Design Aesthetic**: Deep Obsidian Glass (`#03151F` / `#060A10`), Top Specular Reflection (`border-t-white/[0.2]`), Zero Purple Gradients.
- **Color Coding**:
  - Target Star: Warm Amber / Sunset Orange (`#FFB800` / `#FF7733`).
  - U21 Wonderkid: Cyber Sky Blue / Electric Cyan (`#38B6FF` / `#68C5F2`).
- **Typography**: Google Fonts (`Plus Jakarta Sans` / `Outfit` / `JetBrains Mono`).
- **Icons & Visuals**: `lucide-react` minimal hairline icons, real studio league logos (`LeagueLogo`), real player portraits (`getPlayerImage`).
