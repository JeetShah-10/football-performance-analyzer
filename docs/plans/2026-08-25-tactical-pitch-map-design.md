# Phase 3: 2D Tactical Pitch Scatter Map Design Specification

**Date**: 2026-08-25  
**Feature**: 2D Tactical Pitch Scatter Map (`/pitch-map`)  
**Design Philosophy**: Ponytail Mode 💈 + Zero AI Slop 🚫 + Security First 🔒

---

## 1. Executive Summary & Goals

The **2D Tactical Pitch Scatter Map** projects Europe's Top 5 League players (1,802 dataset entries) onto an interactive, high-performance tactical canvas. It bridges physical football geometry (pitch thirds, channels, penalty zones) with unsupervised statistical dimensionality reduction (PCA 2D Cluster Space).

### Key Directives:
- **Ultra-Compact Header**: Zero bloated hero banners. Streamlined top bar featuring the brand pill, Gemini glowing spotlight searchbar, and compact filter chips.
- **Dual-Mode Visualization**:
  - **Tactical Pitch Mode**: Simulates real match spatial distribution across Defensive, Middle, and Attacking Thirds based on position group and player progression/threat telemetry ($PrgP$, $PrgC$, $xAG$, $npxG$).
  - **PCA-2D Cluster Mode**: Mathematical $PCA_1$ vs $PCA_2$ space displaying the 6 playing style archetypes and cluster centroid anchors.
- **Spotlight Beacon**: Searching or selecting a player triggers a pulsating cyber beacon directly on their pitch coordinate.
- **Obsidian Glass Hover HUD**: High-fidelity micro tooltip showing player face, league crest, cluster DNA, and top 3 percentile bars.
- **Slide-Over Tactical Drawer**: Clicking any player node slides open a right-hand tactical dossier with their BKLit RadarChart, stats breakdown, and comparison CTAs.

---

## 2. Component Architecture & File Layout

```
frontend/src/
├── pages/
│   └── PitchMapTab.jsx              # Main 100dvh full-screen cockpit page
├── components/
│   ├── TacticalPitchCanvas.jsx       # Custom SVG tactical pitch & 1,802-node scatter engine
│   ├── TacticalHoverHUD.jsx          # Obsidian glass hover card with portrait & league crest
│   ├── TacticalQuickDrawer.jsx       # Slide-over dossier drawer with BKLit RadarChart
│   └── RadarChart.jsx                # Reusable BKLit RadarChart component suite
```

---

## 3. Data Processing & Pitch Coordinate Mathematics

### Mode A: Tactical Pitch Coordinate Mapping
For each player $i$:
- **Base X (Pitch Length $0 \to 100$)**:
  - Goalkeepers / Center Backs: $X_{base} \approx 8 - 22\%$
  - Fullbacks / Wingbacks: $X_{base} \approx 20 - 55\%$
  - Defensive / Central Midfielders: $X_{base} \approx 35 - 65\%$
  - Attacking Midfielders / Wingers: $X_{base} \approx 55 - 85\%$
  - Center Forwards / Strikers: $X_{base} \approx 72 - 94\%$
  - **Telemetry Offset**: $X = X_{base} + \alpha \cdot \frac{PrgP_{pct} + PrgC_{pct} + npxG_{pct}}{300}$
- **Base Y (Pitch Width $0 \to 100$)**:
  - Left flank / Left Wingers / Left Backs: $Y \approx 10 - 32\%$
  - Central hubs / Strikers / CBs / CMs: $Y \approx 36 - 64\%$
  - Right flank / Right Wingers / Right Backs: $Y \approx 68 - 90\%$
  - **Telemetry Offset**: Natural tactical jitter based on assist creation ($xAG$) and take-on width ($Succ$).

### Mode B: PCA-2D Coordinates
Directly utilizes normalized $pca\_x$ and $pca\_y$ precomputed by the scikit-learn pipeline, normalized to canvas viewport $[-3.5, 3.5] \to [5\%, 95\%]$.

---

## 4. UI & Interaction Flow

1. **Top Bar**:
   - Floating brand crest pill with tactical hover navigation menu.
   - Dual-Mode Switcher (`[ 🏟 Pitch Projection ]` / `[ 🔬 PCA Cluster Space ]`).
   - Gemini rotating glowing searchbar with instant spotlight autocomplete.
   - Filter chips: League select, Position group toggles (FW, MF, DF), Cluster tags, U21 toggle.
2. **Main Canvas**:
   - Full tactical football pitch with crisp hairline markings (obsidian grass texture, penalty boxes, center circle, penalty spots, pitch thirds).
   - 1,802 animated player nodes with cluster color coding and subtle glow halo.
   - Smooth zoom & pan controls (+ / - / Reset view).
3. **Hover HUD**:
   - Follows cursor or anchors to hovered node with glass blur, player photo, league badge, and key percentiles.
4. **Slide-Over Tactical Drawer**:
   - Slides from right (`w-80 sm:w-96`) displaying full player photo, squad, league, position badge, BKLit RadarChart, percentiles, and CTAs:
     - `⚔ Compare with Player`
     - `✨ Find U21 Successors`
     - `📄 Full Dossier`

---

## 5. Security & Verification Strategy

- **Zero Data Leakage**: All coordinates and metadata consume frontend DTOs from `lib/api.js`.
- **Performance**: High-performance SVG/Canvas rendering supporting 60fps interaction on 1,802 nodes.
- **Verification**: `python -m pytest` passes, `npm run build` passes with zero errors, `oxlint` passes with zero warnings.
