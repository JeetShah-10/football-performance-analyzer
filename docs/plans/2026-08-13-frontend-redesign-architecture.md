# 🎨 TacticIQ — Full Frontend Redesign & Brand Architecture Document

> **Project**: Football Player Style Dashboard & Scouting Suite  
> **Brand**: **TacticIQ** *(Opta Vision Precision Analytics × EA Ultimate Card Aesthetics)*  
> **Date**: 2026-08-13  
> **Status**: APPROVED RESEARCH & DESIGN ARCHITECTURE  

---

## 1. Brand Identity & Visual Philosophy

### Brand Essence
**TacticIQ** combines the mathematical precision of Opta/StatsBomb tactical analytics with the high-energy visual flair of EA FC Ultimate Team. 

### Logo Design Concept
- **Icon Mark**: A precision SVG geometric emblem featuring:
  - An outer glowing tactical shield outline.
  - A stylized pitch field line grid.
  - A central radar pentagon node with a vibrant cyan-to-emerald core dot.
- **Typography Mark**: **Tactic** (Inter Bold, White `#F8FAFC`) + **IQ** (JetBrains Mono Bold, Cyber Cyan `#06B6D4`).

### Design Tokens & Color Palette
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Canvas Dark Background** | `#060812` | Main page background |
| **Card Surface** | `#0e1322` | Card & panel background |
| **Card Border** | `#1e293b` | High-contrast borders |
| **Cyber Cyan (Primary)** | `#06b6d4` | Primary brand accent & focus states |
| **Tactical Emerald (Secondary)**| `#10b981` | Positive metric highlights & Midfield group |
| **Ultimate Gold (Highlight)** | `#f59e0b` | Top performers & Forward group |
| **Defender Blue** | `#0284c7` | Defender position group |
| **Text Primary** | `#f8fafc` | Headings & high-contrast titles |
| **Text Secondary** | `#94a3b8` | Subtitles, labels, and secondary details |
| **Text Muted** | `#64748b` | Muted captions & borders |

### Typography Scale
- **Display Headings**: Inter / Space Grotesk (`font-bold`, `tracking-tight`).
- **Body & Controls**: Inter (`font-normal` / `font-medium`).
- **Data & Percentiles**: JetBrains Mono (`font-mono`, `tabular-nums`).

---

## 2. Complete Application Structure & User Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TACTICIQ NAVIGATION HEADER                       │
│  [Logo] TacticIQ   Dashboard   Explorer & Compare   U21 Hub   AI Scout   │
└────────────────────────────────────────────────────────────────────────┘
                                    │
 ┌──────────────────────────────────┼──────────────────────────────────┐
 │                                  │                                  │
 ▼                                  ▼                                  ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│ 1. EXECUTIVE DASHBOARD  │  │ 2. PLAYER EXPLORER &    │  │ 3. U21 SCOUTING HUB    │
│                         │  │    DUAL RADAR COMPARE   │  │                         │
│ • KPI Summary Counters  │  │                         │  │ • Under-21 Filter      │
│ • 2D Tactical Scatter   │  │ • Interactive Table     │  │ • Archetype Selectors   │
│   Pitch Map (PCA)       │  │ • Metric Heatmaps       │  │ • Value Prospect Cards  │
│ • Featured Star Card    │  │ • Side-by-Side Dual     │  │ • Star Similarity Engine│
│ • Top Performers Row    │  │   Radar Comparison      │  │                         │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────────┐
                         │ 4. AI SCOUT BOT DRAWER  │
                         │                         │
                         │ • Natural Language Query│
                         │ • Fast Prompt Pills     │
                         │ • Rich Formatted Cards  │
                         └─────────────────────────┘
```

---

## 3. Detailed Component Architecture

### Component 1: Navbar & Header
- SVG Logo with animated cyan glow on hover.
- Glassmorphic backdrop blur (`backdrop-blur-md bg-[#060812]/80`).
- Active route indicator pill with smooth Framer Motion layout transition.
- Keyboard shortcut `⌘K` Quick Search trigger.
- Live API Health Ping badge (`FastAPI Live • 24ms`).

### Component 2: 2D Tactical Scatter Pitch Map (`ClusterMap2D`)
- Interactive canvas rendering 1,802 player nodes projected onto PCA space.
- Overlay SVG tactical football pitch lines (center circle, penalty box, half-line).
- Position-colored nodes (Blue Defenders, Green Midfielders, Gold Forwards).
- Hover tooltip showing player photo, squad, archetype, and key stats.
- Click node to trigger instant player detail drawer/modal.

### Component 3: EA Ultimate Featured Player Card (`PlayerCard`)
- 3D mouse tilt effect using GSAP/Framer Motion.
- Live animated constellation background.
- Top OVR rating badge with gold foil border.
- Image resolution with automatic fallback to font-mono SVG initials.
- Quick stats grid (`KP/90`, `npxG/90`, `PrgP/90`, `Tkl/90`).

### Component 4: Dual-Player Radar Comparison (`DualRadarCompare`)
- Select two players from search dropdowns (e.g. *Bukayo Saka vs Phil Foden*).
- Overlapping dual-polygon SVG/Recharts Radar Chart with Cyan vs Amber fill.
- Metric-by-metric comparison table with winner highlights (+12.4% advantage badges).

### Component 5: AI Scout Drawer (`ScoutChatDrawer`)
- Slide-over drawer accessible from any page.
- Suggested prompt pills (*"Find U21 alternatives to Rodri"*, *"Compare Haaland and Kane"*).
- Structured response cards with clickable player profile links.

---

## 4. Animation & Motion Design Guidelines (GSAP + Framer Motion)

1. **Page Transitions**: Smooth staggered entrance (`opacity: 0, y: 20` to `opacity: 1, y: 0` with `duration: 0.4s`).
2. **Card Hover Effects**: Subtly scaling `scale(1.02)` with dynamic box-shadow glow increase.
3. **Radar Chart Reveal**: Polygon paths animate from 0 radius to full percentiles upon page mount.
4. **Counter Animations**: Numbers count up smoothly from 0 to final stat using GSAP text/counter plugins.

---

## 5. Verification & Quality Gates
- **Zero Console Errors**: Clean console execution.
- **Image Fallback Safety**: 100% of broken images fall back to initials avatar badge.
- **Production Build**: `npm run build` must compile clean.
- **Backend Sync**: 100% of endpoints (`/players`, `/clusters`, `/similar`, `/scout-agent/query`) connected.
