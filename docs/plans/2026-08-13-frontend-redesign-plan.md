# TacticIQ Frontend Redesign Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform the Football Player Style Dashboard into **TacticIQ**, an Opta-grade analytics suite with an EA Ultimate card aesthetic, custom logo, dark design system tokens, GSAP/Framer animations, dual-radar player comparison, and interactive 2D pitch scatter map.

**Architecture:** Contract-first, component-driven React architecture using Tailwind CSS v4, Framer Motion, GSAP, and Lucide React. The frontend interfaces with the live FastAPI backend for player queries, clustering, similarity search, image streaming, and AI scouting.

**Tech Stack:** React 19, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React, Recharts, Axios/Fetch API, FastAPI backend.

---

### Task 1: Design System Tokens & Global Base CSS Setup

**Files:**
- Modify: `frontend/src/index.css`
- Modify: `frontend/index.html`

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

### Task 2: Custom TacticIQ Logo & Glassmorphic Navbar Header

**Files:**
- Create: `frontend/src/components/TacticIQLogo.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

**Step 1: Build TacticIQ Logo Component**
- Precision SVG logo with tactical shield, pitch grid lines, and glowing cyan core dot.
- Text brand mark with `Tactic` (Inter Bold) and `IQ` (JetBrains Mono Cyan).

**Step 2: Redesign Navigation Header**
- Glassmorphic backdrop blur container.
- Navigation links (`Overview`, `Explorer & Compare`, `U21 Hub`, `AI Scout`).
- Live API Health Ping badge (`FastAPI Live • 24ms`).
- AI Scout Bot drawer trigger button with glowing indicator pill.

**Step 3: Verify Navbar in Browser**
- Run: `npx vite preview` or verify rendering via browser navigation.

---

### Task 3: 2D Tactical Pitch Scatter Map Component Refinement

**Files:**
- Modify: `frontend/src/components/ClusterMap2D.jsx`
- Create: `frontend/src/components/PitchOverlaySVG.jsx`

**Step 1: Create Tactical Pitch Grid SVG Overlay**
- Draw subtle pitch markings (center circle, half-line, penalty box borders).

**Step 2: Enhance ClusterMap2D Scatter Canvas**
- Position-coded node colors (Blue Defenders, Green Midfielders, Gold Forwards).
- Smooth hover tooltips with player image, squad, archetype, and key metrics.
- Click node to navigate directly to `/player/:id`.

**Step 3: Verify Scatter Map Rendering**
- Verify canvas renders 1,802 players without lag.

---

### Task 4: EA Ultimate Style Featured Player Card with 3D Tilt

**Files:**
- Modify: `frontend/src/components/PlayerCard.jsx`
- Modify: `frontend/src/components/FeaturedPlayerCard.jsx`

**Step 1: Add 3D Tilt Hover Animation**
- Implement smooth 3D tilt effect on mouse hover.
- Gold foil border highlights and OVR rating badge.

**Step 2: Verify Image Fallback Safety**
- 100% of missing images fall back to font-mono SVG initials avatar (`onError`).

---

### Task 5: Dual-Player Radar Comparison Component

**Files:**
- Create: `frontend/src/components/DualRadarCompare.jsx`
- Modify: `frontend/src/pages/DirectoryTab.jsx`

**Step 1: Build Dual Radar Selector & Overlapping Chart**
- Dual player search inputs to compare any 2 players.
- Overlapping Recharts Radar Chart with Cyan vs Amber fills.
- Metric-by-metric comparison table with advantage badges (+14.2% higher KP/90).

---

### Task 6: AI Scout Bot Slide-Over Drawer Experience

**Files:**
- Create: `frontend/src/components/ScoutChatDrawer.jsx`
- Modify: `frontend/src/App.jsx`

**Step 1: Build Slide-Over AI Chatbot Drawer**
- Slide-over overlay accessible from top navbar on any route.
- Fast prompt pills (*"Find U21 alternative to Rodri"*, *"Compare Haaland and Kane"*).
- Structured response cards connected to `POST /scout-agent/query`.

---

### Task 7: Full System Verification & Build Gate

**Step 1: Run Pytest Test Suite**
- Run: `python -m pytest backend/tests/ -v`
- Expected: 18 passed.

**Step 2: Run Production Build**
- Run: `npm run build` inside `frontend/`
- Expected: 0 errors.

**Step 3: Browser Audit Across All Views**
- Capture viewport screenshots across Overview, Player Detail, U21 Hub, and AI Scout Drawer.
