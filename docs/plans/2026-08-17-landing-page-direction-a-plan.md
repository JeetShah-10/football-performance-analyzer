# Eleven Landing Page Direction A — Full Architecture Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build the complete post-hero landing page journey on `HomeTab.jsx` according to **Direction A (The Tactician's Playbook)**, integrating the refined **Tactical Orange Canvas (`#FF3C00`)**, the **`StickyCard002` GSAP ScrollTrigger 5-Module Stacked Deck**, the **Data Integrity Bento Grid**, and the **Pre-Footer Launch Callout**.

**Architecture:**
- **Section 1**: Hero Section (Already complete & verified with non-F11 100dvh lock).
- **Section 2**: Tactical Orange Canvas (`#FF3C00` full-width SVG geometric background with telemetry metric counters and platform value statement).
- **Section 3**: `StickyCard002` Stacked Card Showcase (GSAP ScrollTrigger card stack pinning 5 rich tactical module cards with scaling, rotation, and deep-link CTAs).
- **Section 4**: Data Integrity & Methodology Bento Grid (High-density dark glassmorphism explaining per-90 metrics, K-Means/PCA, and zero-synthetic data policy).
- **Section 5**: "Step Onto the Pitch" Launch Callout (High-contrast obsidian terminal card with instant exploration CTAs).

**Tech Stack:**
- React 19, Tailwind CSS v4, GSAP 3 + ScrollTrigger (`gsap/ScrollTrigger`), Framer Motion, Lucide React icons, React Router DOM.

---

### Task 1: Build the `StickyCard002` GSAP Component
**Files:**
- Create: `frontend/src/components/StickyCard002.jsx`
- Implement the GSAP ScrollTrigger timeline pinning the `.sticky-cards` container for `(totalCards - 1) * 100vh`, animating `scale: 0.7`, `rotation: 5`, and `y: 0%` transitions smoothly with `scrub: 0.5`.
- Ensure proper cleanup with `ResizeObserver`, `scrollTimeline.kill()`, and `ScrollTrigger.getAll().forEach(t => t.kill())`.
- Support rich card payloads (custom titles, badges, metrics, icons, preview graphics, and action links) rather than just static images.

---

### Task 2: Refine the Tactical Orange Canvas (`#FF3C00`) in `HomeTab.jsx`
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx` (lines 140–215)
- Retain the full-width `#FF3C00` orange canvas and tactical pitch SVG grid.
- Replace dummy copy with high-impact Opta-grade intelligence messaging.
- Add a 4-column live telemetry metric strip:
  1. `1,802` Outfield Players (Top 5 European Leagues)
  2. `67.2%` PCA Variance Explained (2D Dimension Reduction)
  3. `7` GMM Style Archetypes (Unsupervised Soft-Clustering)
  4. `0%` Synthetic Data (100% Real FBref Event Metrics)

---

### Task 3: Integrate the 5-Card Tactical Stack into `HomeTab.jsx`
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Define the 5 high-impact tactical cards:
  1. **Dual-Player Radar Engine (Cyan `#3AA6D9`)**: 8D per-90 percentile polygon comparison (`/explorer`).
  2. **2D PCA Tactical Pitch Map (Gold `#E8B33D`)**: 1,802 player cluster coordinates and spatial zone bias (`/pitch-map`).
  3. **7 GMM Playing Style Archetypes (Orange `#FF4E32`)**: Probabilistic tactical DNA distributions (`/gmm-matrix`).
  4. **U21 Wonderkid Scouting Radar (Pink `#E8437A`)**: Cosine nearest-neighbor under-21 replacement scouting (`/u21-scouting`).
  5. **Scout AI Natural Language Terminal (Emerald `#10B981`)**: Intent-classified conversational scouting queries (`/scout-chat`).

---

### Task 4: Build the Data Integrity Bento Grid & Launch Callout
**Files:**
- Modify: `frontend/src/pages/HomeTab.jsx`
- Add Bento Grid section (`bg-[#05080C] text-white py-20 px-4 sm:px-6 lg:px-8`):
  - **Bento 1 (Wide)**: Opta Per-90 Normalization & Positional Group Percentiles ($0-100\%$).
  - **Bento 2**: Weighted Fuzzy Player Search (`⌘K` instant navigation).
  - **Bento 3**: Unsupervised ML Rigor (K-Means silhouette sweeps $k \in [2..6]$, Cosine similarity in 8D scaled feature space).
- Add "Step Onto the Pitch" terminal callout with direct exploration CTAs.

---

### Task 5: Quality Assurance, Responsive Testing & Verification
- Run `npm run lint` in `frontend/` (ensure 0 errors).
- Run `npm run build` in `frontend/` (ensure exit 0).
- Run Playwright route test at Desktop (1920px), Tablet (768px), and Mobile (375px) to verify smooth ScrollTrigger pinning, zero horizontal overflow, and pristine 60fps scrolling.

---

## Definition of Done:
- [ ] `StickyCard002.jsx` created and integrated with GSAP ScrollTrigger.
- [ ] Orange section `#FF3C00` updated with real telemetry counters and crisp copy.
- [ ] 5 tactical superpower cards animate smoothly on scroll.
- [ ] Data Integrity Bento grid and Launch callout rendered cleanly.
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
