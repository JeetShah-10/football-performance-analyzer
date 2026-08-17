# Design System & Visual Architecture — Eleven

<!-- impeccable:design-schema 1 -->

## Visual World
- **Theme**: Luxury Sports Intelligence × Tactical Maroon & Crimson Ember × Apple Liquid Glassmorphism
- **Mode**: Persuade, Operate & Experience (High-density sports analytics with tactile dark glassmorphic surfaces, rich maroon depth, and 60fps micro-interactions)

## Color Palette — Crimson Ember & Luxury Tactical Spectrum
```css
:root {
  /* 1. Base Canvas & Glass Surfaces */
  --bg-obsidian: #04070A;           /* Deep obsidian carbon backdrop */
  --surface-card: #090D14;          /* Dark matte charcoal card container */
  --surface-maroon: #16070B;        /* Deep luxury maroon tinted surface */
  --surface-border: rgba(255, 255, 255, 0.08); /* 1px hairline border */
  --surface-border-highlight: rgba(255, 255, 255, 0.22);
  
  /* 2. Cohesive Warm Tactical Spectrum (Maroon -> Crimson -> Coral Pink -> Tactical Orange) */
  --color-maroon-deep: #2A080F;     /* Deep burgundy shadow & tinted badge backgrounds */
  --color-maroon-rich: #4D0E1A;     /* Rich maroon border & secondary stat pill */
  --color-crimson-core: #C8102E;    /* Championship crimson - bold, regal, sharp */
  --color-bright-red: #E61E38;      /* Searing race-track red for primary signals & highlights */
  --color-ember-coral: #FF4359;     /* Hot coral-pink-orange bridge (vibrant, modern, high contrast) */
  --color-tactical-orange: #FF3C00; /* Opta pitch orange for high-energy transitions & primary CTA */
  --color-warm-amber: #FF7A00;      /* Fiery amber for metric callouts & subtle gradient stops */

  /* 3. High-Contrast Typography & Data Neutrals */
  --text-primary: #F8FAFC;          /* Crisp studio white */
  --text-secondary: #94A3B8;        /* Clean slate grey */
  --text-muted: #64748B;            /* Muted telemetry grey */
}
```

## Module Signature Accents within the Tactical Warm Spectrum:
1. **Module 1 (Dual Radar)**: `#E61E38` (Bright Red / Searing Crimson)
2. **Module 2 (2D Pitch Map)**: `#FF7A00` (Warm Amber / Pitch Gold)
3. **Module 3 (7 GMM Archetypes)**: `#FF3C00` (Tactical Pitch Orange)
4. **Module 4 (U21 Wonderkid)**: `#FF4359` (Ember Coral / Hot Red-Pink)
5. **Module 5 (Scout AI Terminal)**: `#C8102E` (Championship Deep Crimson)

## Typography Scale
- **Display Headings**: Baftiva / Space Grotesk (`font-display font-black italic tracking-tighter`).
- **Body & Controls**: Inter (`font-sans font-medium font-semibold`).
- **Data & Telemetry**: JetBrains Mono (`font-mono tabular-nums tracking-widest`).

## Layout & Spatial Architecture
- **Floating Liquid Glass Navbar**: Fixed capsule (`top-3.5 sm:top-4 w-full max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8`), `backdrop-blur-2xl backdrop-saturate-[180%] bg-[#060A10]/60 border border-white/[0.12] border-t-white/[0.22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.7)]`.
- **Strict 100dvh Non-F11 Hero Lock**: Form-fitted for standard windowed laptop (1440x780) and desktop (1920x920) browser viewports with zero initial scroll bars.
- **Monumental Centered Player Cutout**: `hero-player.webp` scaled (`max-w-[1950px]`, `max-h-[98vh]`), grounded flush at `bottom-0` with atmospheric base fade mask.
- **Edge-to-Edge Stadium Atmosphere**: `hero-bg.jpg` full-bleed `object-cover object-center` (`brightness-78 contrast-112`) with pitch details visible in the bottom-left quadrant.

## Quality Floor & Anti-Slop Bans
- ❌ No generic purple/blue gradients (`from-purple-600 to-indigo-600`).
- ❌ No neon Christmas lights or uncontrolled multi-color glow halos.
- ❌ No broken image icon boxes (`onError` initials fallback required on all player cards).
- ❌ Zero browser console errors or unhandled warnings across all routes.
