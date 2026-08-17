# Eleven Post-Hero Craft Enhancement — Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Elevate the post-hero landing page journey on `HomeTab.jsx` using modern UI craft patterns inspired by **Magic UI** and **21st.dev** (infinite tactical marquee, border-beam laser glow, high-fidelity SVG dual radar, 2D pitch coordinate topology, GMM distribution bars, U21 scouting match card, and Scout AI terminal preview).

**Architecture:**
- **Component 1**: `Marquee.jsx` — Infinite running tactical telemetry ribbon with edge fade masks.
- **Component 2**: `BorderBeam.jsx` — Dynamic laser beam tracing card borders on featured callouts.
- **Component 3**: `StickyCard002.jsx` — Enhanced GSAP ScrollTrigger deck with 5 custom-engineered interactive visual engines.
- **Component 4**: `HomeTab.jsx` — Orchestrates the Orange Canvas `#FF3C00`, Telemetry Marquee, Sticky Deck, Mathematical Bento Grid, and Launch Callout.

**Tech Stack:**
- React 19, Tailwind CSS v4, GSAP 3 + ScrollTrigger, Framer Motion, Lucide React, JetBrains Mono typography.

---

### Task 1: Create `Marquee.jsx` Component
**Files:**
- Create: `frontend/src/components/Marquee.jsx`
- Lightweight 0-dependency infinite scrolling marquee supporting custom direction, pause on hover, and gradient edge masks.

---

### Task 2: Create `BorderBeam.jsx` Component
**Files:**
- Create: `frontend/src/components/BorderBeam.jsx`
- Animated laser beam running along the border perimeter of container elements using CSS conic gradients / Framer Motion.

---

### Task 3: Build Rich Custom Visual Engines for the 5 Sticky Cards
**Files:**
- Modify: `frontend/src/components/StickyCard002.jsx` & `frontend/src/pages/HomeTab.jsx`
- **Card 1 (Dual Radar)**: Real 8-axis SVG radar polygon overlay (Cyan vs Gold) with labeled vertices.
- **Card 2 (2D Pitch Map)**: SVG tactical pitch topology with PC1/PC2 axes and 1,802 cluster nodes.
- **Card 3 (GMM Archetypes)**: 3-tier animated probability distribution bars with glow highlights.
- **Card 4 (U21 Wonderkid)**: Scouting comparison card showing Yamal vs Saka with 94.8% cosine similarity.
- **Card 5 (Scout AI Terminal)**: macOS CLI window with typing prompt, green terminal badge, and JSON intent payload.

---

### Task 4: Integrate All Components into `HomeTab.jsx`
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Insert `Marquee.jsx` between the Orange section and the dark canvas.
- Apply `BorderBeam.jsx` to the final "Step Onto the Pitch" callout box.
- Enhance the Bento Grid with LaTeX-style mathematical formulas for percentiles and cosine similarity.

---

### Task 5: Verification & Craft Review
- Run `npm run lint` in `frontend/` (0 errors).
- Run `npm run build` in `frontend/` (0 errors).
- Test Playwright across all viewports (1920x1080, 1440x780, 768x1024, 375x812), verify 60fps animations and 0 console errors.

---

## Definition of Done:
- [ ] `Marquee.jsx` and `BorderBeam.jsx` created and operational.
- [ ] 5 interactive SVG/preview engines embedded in `StickyCard002.jsx`.
- [ ] Orange section `#FF3C00` flows into the infinite telemetry marquee.
- [ ] Bento Grid displays mathematical formulas and glassmorphic styling.
- [ ] `npm run build` passes with exit 0 and zero lint warnings.
