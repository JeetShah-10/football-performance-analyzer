# Eleven Splash Animation & Logo Reveal Sequence Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a cinematic Skiper10-inspired Double Stairs splash loading screen with an outlined "11." logo reveal sequence using the settled Dark-Navy and #FF3C00 Orange-Red palette.

**Architecture:** A standalone Framer Motion preloader component (`SplashLoader.jsx`) rendering 5-7 vertical ink-navy columns that execute a staggered dual-direction staircase exit reveal after the vector "11." logo sequence completes. Managed via `sessionStorage` in `App.jsx` with skip on click/ESC.

**Tech Stack:** React 19, Tailwind CSS v4, Framer Motion (`framer-motion`), Lucide React.

---

### Task 1: Create the Double Stairs Splash Loader Component (`SplashLoader.jsx`)

**Files:**
- Create: `frontend/src/components/SplashLoader.jsx`

**Step 1: Write the component with Framer Motion variants**
- Create 5 vertical column panels covering full viewport (`fixed inset-0 z-50`).
- Implement dual-direction staircase animation (odd indices exit up, even indices exit down with staggered delays and easing `[0.76, 0, 0.24, 1]`).
- Implement center "11." vector monogram with `#FF3C00` accent dot, shadow-pop (`box-shadow: 0 0 24px rgba(255, 60, 0, 0.35)`), and "ELEVEN" wordmark in Space Grotesk.
- Add keyboard (ESC) and click listeners to allow instant skipping.

**Step 2: Verify component exports and syntax**
- Run `npm run lint` in `frontend/` to verify zero linting or JSX errors.

---

### Task 2: Integrate `SplashLoader` into `App.jsx` with Session Persistence

**Files:**
- Modify: `frontend/src/App.jsx`

**Step 1: Wire up SplashLoader with AnimatePresence and sessionStorage**
- Import `SplashLoader` and `AnimatePresence` in `App.jsx`.
- Check `sessionStorage.getItem('eleven_splash_shown')` on initial mount.
- Render `<SplashLoader onComplete={handleSplashComplete} />` when active.
- Mark session storage when complete so navigation across tabs remains instantaneous.

**Step 2: Verify app bundling and types**
- Run `npm run build` in `frontend/`.
- Ensure zero Vite / TypeScript bundling errors.

---

### Task 3: Visual & Responsive Verification with Playwright

**Step 1: Test in real browser at 1440px, 768px, and 375px**
- Clear session storage or pass prop to force splash animation.
- Capture screenshots of both the logo reveal state and the double stairs exit transition.
- Verify browser devtools console has zero errors.

---

## Definition of Done:
- [ ] `SplashLoader.jsx` renders 5-column double stairs preloader with outlined "11." logo reveal.
- [ ] Uses exclusively settled design tokens (`#000C12`, `#03151F`, `#0A222E`, `#FF3C00`, `#F5F1EB`, `#8FA3AD`).
- [ ] No new dependencies added (uses existing `framer-motion` and Tailwind).
- [ ] `npm run build` and `npm run lint` pass with 0 errors.
- [ ] Zero console errors during loading sequence.
- [ ] Visual verification screenshots captured at multiple viewports.
