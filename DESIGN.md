# Design System & Visual Architecture — Eleven

<!-- impeccable:design-schema 1 -->

## Visual World
- **Theme**: Opta Vision Precision Sports Analytics × Apple Liquid Glassmorphism × EA FC Ultimate Tactical Visuals
- **Mode**: Persuade, Operate & Experience (High-density sports analytics with tactile glassmorphic UI and 60fps micro-interactions)

## Color Palette
```css
:root {
  /* Obsidian Base Canvas */
  --bg-obsidian: #05080C;
  --surface-glass: #060A10;
  --surface-card: #080C14;
  --surface-border: rgba(255, 255, 255, 0.12);
  --surface-border-highlight: rgba(255, 255, 255, 0.22);
  
  /* Primary Accent & Signal Light */
  --accent-orange: #FF4E32;
  --accent-orange-glow: rgba(255, 78, 50, 0.35);
  --accent-orange-block: #FF3C00;
  
  /* Positional & Metric Hues */
  --pos-defender: #3AA6D9;
  --pos-midfielder: #10b981;
  --pos-forward: #E8B33D;
  --pos-wonderkid: #E8437A;

  /* High-Contrast Typography */
  --text-primary: #FFFFFF;
  --text-secondary: #9BB1BC;
  --text-muted: #64748b;
}
```

## Typography Scale
- **Display Headings**: Baftiva / Space Grotesk (`font-display font-black italic tracking-tighter`).
- **Body & Controls**: Inter (`font-sans font-medium font-semibold`).
- **Data & Telemetry**: JetBrains Mono (`font-mono tabular-nums tracking-widest`).

## Layout & Spatial Architecture
- **Floating Liquid Glass Navbar**: Fixed capsule (`top-3.5 sm:top-4 w-full max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8`), `backdrop-blur-2xl backdrop-saturate-[180%] bg-[#060A10]/60 border border-white/[0.12] border-t-white/[0.22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.7)]`.
- **Strict 100dvh Non-F11 Hero Lock**: Form-fitted for standard windowed laptop (1440x780) and desktop (1920x920) browser viewports with zero initial scroll bars.
- **Monumental Centered Player Cutout**: `hero-player.webp` scaled (`max-w-[1950px]`, `max-h-[98vh]`), grounded flush at `bottom-0` with atmospheric base fade mask.
- **Edge-to-Edge Stadium Atmosphere**: `hero-bg.jpg` full-bleed `object-cover object-center` (`brightness-78 contrast-112`) with pitch details visible in the bottom-left quadrant.

## Micro-Interactions & Design Spells
- **Design Spell 4 (Kickoff Scroll Cue)**: Spring magnetic cursor tracking (`useSpring` damping: 18, stiffness: 300) with animated pulsing orange kickoff beacon (`animate-ping`).
- **Design Spell 5 (Terminal HUD Search Badge)**: Real-time dynamic Opta scouting HUD badge (`[● 10 NODES]`) pulsing during active query resolution.
- **Weighted Relevance Search**: Sub-millisecond diacritic-insensitive fuzzy search ranking star players (Haaland, Kane, Yamal, Pedri) above club name collisions.

## Quality Floor & Anti-Slop Bans
- ❌ No generic purple gradients (`from-purple-600 to-indigo-600`).
- ❌ No broken image icon boxes (`onError` initials fallback required on all player cards).
- ❌ No unstyled text logo (custom SVG "11" monogram required).
- ❌ Zero browser console errors or unhandled warnings across all routes.
