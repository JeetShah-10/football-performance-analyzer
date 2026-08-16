# TacticIQ Full Frontend Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the Football Player Style Dashboard into **TacticIQ**, an Opta-grade analytics suite with EA Ultimate card aesthetics, custom logo, dark design system tokens, 6 dedicated navigation tabs, dual-radar player comparison, dedicated 2D pitch scatter map, and GMM archetype matrix.

**Architecture:** Contract-first, component-driven React architecture using Tailwind CSS v4, Framer Motion, GSAP, and Lucide React. The frontend interfaces with the live FastAPI backend for player queries, clustering, similarity search, image streaming, and AI scouting.

**Tech Stack:** React 19, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React, Recharts, Axios/Fetch API, FastAPI backend.

---

### Task 1: Design System Tokens, Fonts & Global Base CSS Setup

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/src/index.css`

**Step 1: Update index.html for TacticIQ Branding & Google Fonts**
- Add Space Grotesk, Inter, and JetBrains Mono Google Fonts.
- Update page title to `TacticIQ — Opta-Grade Football Tactical Analytics`.
- Update meta description and favicon.

**Step 2: Define Design System CSS Variables in index.css**
- Background `#060812`, Card surface `#0e1322`, Border `#1e293b`.
- Cyber Cyan `#06b6d4`, Tactical Emerald `#10b981`, Ultimate Gold `#f59e0b`.
- JetBrains Mono font-mono styling for all numbers and tabular metrics.

**Step 3: Verify Build**
- Run: `npm run build` inside `frontend/`
- Expected: Build succeeds.

---

### Task 2: Custom TacticIQ Logo & Glassmorphic 6-Tab Navbar

**Files:**
- Create: `frontend/src/components/TacticIQLogo.jsx`
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/App.jsx`

**Step 1: Build TacticIQ Logo Component**
- Precision SVG logo with tactical shield, pitch grid lines, and glowing cyan core dot.
- Text brand mark with `Tactic` (Inter Bold) and `IQ` (JetBrains Mono Cyan).

**Step 2: Redesign Navigation Header with 6 Dedicated Tabs**
- Glassmorphic backdrop blur container.
- Navigation links (`Home`, `Player Explorer & Compare`, `Tactical Pitch Map`, `GMM Archetypes`, `U21 Scouting Hub`, `AI Scout Assistant`).
- Live API Health Ping badge (`FastAPI Live • 24ms`).
- Quick Search trigger (`⌘K`).

---

### Task 3: Minimalist Home Tab (Brand Landing View)

**Files:**
- Create: `frontend/src/pages/HomeTab.jsx`
- Modify: `frontend/src/App.jsx`

**Step 1: Build Minimalist Hero Section**
- Headline: *"Precision Football Analytics & AI Scouting Engine"*
- Global Quick Search bar + Action buttons (*"Explore 1,800+ Players"*, *"Launch AI Scout"*).
- 3 Feature showcase cards (*GMM Soft-Clustering*, *Per-90 Percentile Profiling*, *AI Natural Language Scout*).
- Metric counters bar (`1,802` Players, `5` Top Leagues, `8` Per-90 Metrics, `100%` Real Data).

---

### Task 4: Player Explorer & Dual Radar Compare Tab

**Files:**
- Create: `frontend/src/components/DualRadarCompare.jsx`
- Modify: `frontend/src/pages/DirectoryTab.jsx`

**Step 1: Build Dual Radar Compare Tool**
- Search inputs to select any 2 players (e.g. *Bukayo Saka vs Phil Foden*).
- Overlapping Recharts Radar Chart with Cyan vs Amber fills.
- Metric-by-metric comparison table with advantage badges (+14.2% higher KP/90).

---

### Task 5: Dedicated 2D Pitch Scatter Map Tab

**Files:**
- Create: `frontend/src/pages/PitchMapTab.jsx`
- Modify: `frontend/src/components/ClusterMap2D.jsx`

**Step 1: Give Pitch Scatter Map Breathing Space**
- Dedicated full-screen tab layout for 2D PCA Scatter Pitch Plot.
- Draw SVG pitch lines (center circle, penalty boxes, half-line).
- Position-coded node colors (Blue Defenders, Green Midfielders, Gold Forwards).
- Hover tooltips + Click node details.

---

### Task 6: Dedicated GMM Archetypes Matrix Tab

**Files:**
- Create: `frontend/src/pages/GMMTab.jsx`
- Modify: `frontend/src/App.jsx`

**Step 1: Build GMM Archetypes Exploration View**
- Cards for the 7 GMM tactical clusters.
- Interactive GMM soft-clustering probability breakdown.
- Position group distributions and model evaluation metrics.

---

### Task 7: U21 Scouting Hub & AI Scout Tabs

**Files:**
- Modify: `frontend/src/pages/U21ScoutingTab.jsx`
- Modify: `frontend/src/pages/ScoutChatTab.jsx`

**Step 1: Refine U21 Scouting Hub**
- Archetype filter pills + prospect cards with star similarity matching.

**Step 2: Refine AI Scout Chat Experience**
- Fast prompt pills + rich structured response cards.

---

### Task 8: Player Profile Page Enhancements

**Files:**
- Modify: `frontend/src/pages/PlayerDetailPage.jsx`

**Step 1: EA FC Ultimate Star Header + 3-Column Layout**
- Player photo with `onError` initials fallback.
- EA Ultimate 3D Tilt Card OVR badge.
- Left: GMM Archetype breakdown, Center: Radar Chart & Metrics, Right: Similar Players.

---

### Task 9: Full System Verification & Build Gate

**Step 1: Run Pytest Test Suite**
- Run: `python -m pytest backend/tests/ -v`
- Expected: 18 passed.

**Step 2: Run Production Build**
- Run: `npm run build` inside `frontend/`
- Expected: 0 errors.

**Step 3: Capture Verification Screenshots**
- Capture viewport screenshots across all 6 dedicated tabs and player detail view.
