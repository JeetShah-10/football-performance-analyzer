# Player Detail Profile Redesign Design Document

**Date:** 2026-08-24  
**Surface:** Player Detail Page (`/player/:playerId` — `frontend/src/pages/PlayerDetailPage.jsx`)  
**Mode:** Operate / Experience  
**Philosophy:** Ponytail Mode (Lean, 0 Bloat, Native React + GSAP 3 + Bklit/shadcn)

---

## 1. Executive Summary & Goals
Transform the Player Detail page from a legacy plain layout into a high-agency Tactical Bento Grid dashboard.
The page gives coaches, analysts, and scouts a comprehensive 360° tactical breakdown of any of the 1,802 players across Europe'\''s Top 5 Leagues.

---

## 2. Visual Identity & League Theming

### 2.1 Dynamic League Theming & Ambient Halos
The page dynamically adjusts ambient lighting and border hues based on the player'\''s league:
- **Premier League**: Sky Blue (`#38B6FF`)
- **La Liga**: Warm Terracotta Orange-Red (`#D63A2B`)
- **Bundesliga**: Vibrant Red (`#D20515`)
- **Serie A**: Crisp Silver-White (`#FFFFFF`)
- **Ligue 1**: Electric Lime-Green (`#B6F029`)

### 2.2 Player Header Card
- High-resolution player photo with smooth fallback to monogram initials.
- SVG League Logo badge, Squad name, Nationality flag code, Age, and Matches/Minutes played.
- Position Badge (Defender Cyan `#3AA6D9`, Midfielder Gold `#E8B33D`, Forward Pink `#E8437A`).
- Primary Tactical Archetype badge from GMM model.
- Quick Action CTAs:
  - *Compare Head-to-Head*
  - *Scout U21 Replacements*
  - *Ask AI Scout Agent*

---

## 3. Tactical Bento Grid Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       DYNAMIC LEAGUE HERO BANNER                                                 │
│ [Photo] Player Name • League Logo • Squad • Position • Age • Minutes Played • Primary Tactical Archetype         │
│ Actions: [⚔️ Compare Head-to-Head]   [✨ Find U21 Twins]   [🤖 Ask Scout Agent]                                  │
├───────────────────────────────────┬───────────────────────────────────┬──────────────────────────────────────────┤
│ 1. 8-METRIC PERCENTILE BARS       │ 2. TACTICAL RADAR VISUALIZER      │ 3. GMM SPECTRUM & SIMILARITY             │
│ • npxG / xAG (Goal Threat)        │ • 8-Axis Percentile Polygon       │ • GMM Soft-Clustering Probability Spread │
│ • KP / PrgP / PrgC (Creation)     │ • Benchmark Centroid Comparison   │ • Dominant & Secondary Archetype Tags    │
│ • Tkl / Int / Succ (Defense)      │ • Bklit Shimmering Stat Badges    │ • Top 5 Tactical Twins (Cosine %)        │
│ • Performance Tiers (Elite/Strong)│ • Interactive Vertex Inspection   │ • Direct Click-to-Profile Navigation     │
└───────────────────────────────────┴───────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 4. Components & Motion

1. **`ShimmeringText.jsx`**: Bklit UI per-character shimmering text animation for live tactical status and radar titles.
2. **`PlayerRadarChart.jsx`**: Upgraded 8-metric SVG radar chart with animated polygon morphing, grid rings, and vertex tooltips.
3. **`MetricPercentileBars.jsx`**: Animated percentile bars with performance tier color coding (Elite >80%, Strong >60%, Average >40%, Developing <40%).
4. **`GMMProbabilityCard.jsx`**: Soft-clustering distribution spectrum across positional archetypes.
5. **`SimilarPlayersBento.jsx`**: Top-5 similarity candidates with match percentage rings and club badges.
6. **GSAP 3 Motion Optimization**:
   - Hardware-accelerated entrance stagger using `gsap.fromTo` on container refs.
   - Zero layout thrashing, 60fps smooth render, strict cleanup in `useEffect`.

---

## 5. Data Flow & Zero-Regression Safety
- Reuses existing backend endpoints: `GET /players/{player_id}` and `GET /similar/{player_id}`.
- Full fallback to `MOCK_PLAYER_DETAILS` and `MOCK_SIMILAR` if backend is offline.
