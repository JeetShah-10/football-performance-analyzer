# 🎨 TacticIQ — Application Flow & UX Architecture Specification

> **Project**: Football Player Style Dashboard & Scouting Suite  
> **Brand**: **TacticIQ** *(Opta Vision Precision Analytics × EA Ultimate Card Aesthetics)*  
> **Date**: 2026-08-13  
> **Status**: VALIDATED DESIGN DOC  

---

## 1. Brand Identity & Design System Tokens

### Brand Essence
**TacticIQ** combines Opta-grade tactical data analytics with EA FC Ultimate Team visual aesthetics.

### Brand Mark (Logo)
- **SVG Icon**: Tactical shield outline + pitch field grid lines + glowing cyan center node.
- **Typography Mark**: `Tactic` (Inter Bold, White `#F8FAFC`) + `IQ` (JetBrains Mono Bold, Cyber Cyan `#06B6D4`).

### Design Tokens & Color Palette
- **Canvas Background**: Deep Obsidian (`#060812`)
- **Card Surface**: High-Contrast Slate (`#0e1322`) & Border (`#1e293b`)
- **Primary Accent**: Cyber Cyan (`#06b6d4` / `#22d3ee`)
- **Secondary Accent**: Tactical Emerald (`#10b981` / `#34d399`)
- **Highlight Accent**: Ultimate Gold (`#f59e0b` / `#fbbf24`)
- **Position Colors**: Defenders (`#0284c7`), Midfielders (`#059669`), Forwards (`#d97706`)
- **Typography**: Space Grotesk / Inter (Headings) + JetBrains Mono (`tabular-nums` for all stats)

---

## 2. Navigation Architecture & Top Header Layout

Fixed glassmorphic top navbar (`backdrop-blur-md bg-[#060812]/80 border-b border-zinc-800`):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] TacticIQ │ Home  Explorer&Compare  PitchMap  GMM  U21Hub  AIScout │ Live 24ms ⌘K│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6 Dedicated Navigation Tabs:
1. 🏠 **Home**: Minimalist brand hero + app value proposition + quick search + feature showcase + tech stack credentials.
2. ⚽ **Player Explorer & Compare**: 1,802 player directory table + side-by-side Dual Radar Comparison tool (*Bukayo Saka vs Phil Foden*).
3. 🗺️ **Tactical Pitch Map**: Full-screen 2D PCA Scatter Pitch Plot with SVG pitch markings, cluster filters, node inspection, and position overlays.
4. 🧠 **GMM Archetypes**: Machine learning tab showcasing 7 GMM soft-clustering archetypes, probability distributions, position group breakdown, and evaluation metrics.
5. 🌟 **U21 Scouting Hub**: Targeted U21 talent finder (`age <= 21`) with archetype filters and similarity star matching.
6. 🤖 **AI Scout Assistant**: Interactive chat interface powered by FastAPI `POST /scout-agent/query` (`find_similar`, `compare_players`, `explain_player`, `find_by_criteria`).

---

## 3. Screen Specifications & Layouts

### Screen 1: Home Tab (Minimalist Brand Hero)
- Clean hero title: *"Precision Football Analytics & AI Scouting Engine"*
- Global Quick Search Bar (`⌘K`)
- 3 Feature Showcase Cards:
  1. *GMM Soft-Clustering & Archetypes*
  2. *Per-90 Percentile Profiling*
  3. *AI Natural Language Scout*
- Key Metric Counters Bar (`1,802` Players, `5` Top Leagues, `8` Per-90 Metrics, `100%` Real Data)

### Screen 2: Player Explorer & Dual Compare Tab
- Filter Controls: League, Position Group, Age U21 Toggle, Name Search
- Searchable Player Data Table with percentile heatmaps
- **Dual Radar Comparison Tool**: Compare any two players side-by-side with overlapping SVG radar charts and metric advantage badges (+14.2% KP/90)

### Screen 3: Tactical Pitch Map Tab (PCA Scatter Plot)
- Dedicated 2D PCA Scatter Canvas with SVG pitch lines (center circle, half-line, penalty boxes)
- Node colors matching position groups (Blue Defenders, Green Midfielders, Gold Forwards)
- Hover tooltips showing player photo, squad, archetype, and key metrics
- Click node to view player detail drawer

### Screen 4: GMM Archetype Matrix Tab
- Deep dive into the 7 Gaussian Mixture Model clusters
- Interactive GMM soft-clustering probability breakdown (primary vs secondary cluster probabilities)
- Position group distributions (Defenders $k=3$, Midfielders $k=2$, Forwards $k=2$)
- Silhouette scores and evaluation metrics

### Screen 5: U21 Scouting Hub Tab
- Filtered view strictly for under-21 prospects (`age <= 21`)
- Archetype selector pills (*Dynamic Winger*, *Deep-Lying Playmaker*, etc.)
- Prospect cards showing similarity match to top senior stars

### Screen 6: AI Scout Assistant Tab
- Full natural language scouting interface (`POST /scout-agent/query`)
- Fast prompt pills (*"Find U21 alternative to Rodri"*, *"Compare Haaland and Kane"*)
- Formatted response cards with clickable player profile links

### Screen 7: Individual Player Profile Page (`/player/:id`)
- **Top Header**: Player photo (with `onError` initials fallback), EA Ultimate 3D Tilt Card OVR badge, squad, league, position badge, age, and minutes played
- **Left Column**: GMM Archetype Widget (Primary archetype tag + interactive probability breakdown)
- **Center Column**: Tactical Profile Radar Chart & Per-90 Metrics Grid
- **Right Column**: Similar Players Widget (Top 5 similar players with similarity score rings & U21 filter toggle)

---

## 4. Execution Roadmap (Writing-Plans Handoff)

1. **Task 1: Design Tokens, Fonts & Global Styling** (`index.css`, `index.html`)
2. **Task 2: TacticIQ Logo & Glassmorphic Header** (`TacticIQLogo.jsx`, `Navbar.jsx`)
3. **Task 3: Minimalist Home Tab** (`HomeTab.jsx`)
4. **Task 4: Player Explorer & Dual Radar Compare** (`ExplorerTab.jsx`, `DualRadarCompare.jsx`)
5. **Task 5: Dedicated 2D Pitch Scatter Map Tab** (`PitchMapTab.jsx`, `ClusterMap2D.jsx`)
6. **Task 6: Dedicated GMM Archetypes Tab** (`GMMTab.jsx`)
7. **Task 7: U21 Scouting Hub Tab** (`U21ScoutingTab.jsx`)
8. **Task 8: AI Scout Assistant Tab** (`ScoutChatTab.jsx`)
9. **Task 9: Player Profile Page Enhancements** (`PlayerDetailPage.jsx`)
10. **Task 10: Full System Automated Verification & Build Gate** (`pytest`, `npm run build`)
