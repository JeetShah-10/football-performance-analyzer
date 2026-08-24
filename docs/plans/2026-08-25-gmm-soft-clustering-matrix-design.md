# GMM Soft-Clustering Matrix & Tactical Archetype Studio Design

**Date**: 2026-08-25  
**Topic**: Gaussian Mixture Model (GMM) Soft-Clustering Matrix (`/gmm-matrix`)  
**Lead**: Jeet Shah (Lead & ML Spec) & Pooja (Frontend Lead)  
**Status**: APPROVED (Approach A)

---

## 1. Executive Summary & Vision

The **GMM Soft-Clustering Matrix** is the scientific machine learning epicenter of the Eleven platform. While traditional K-Means assigns each player to a single hard cluster, the **Gaussian Mixture Model (GMM)** calculates continuous posterior probabilities $P(\text{Cluster}_k \mid \mathbf{x})$, quantifying how much a player embodies multiple tactical styles.

This module surfaces:
1. **Archetype Centroid Signatures**: Standard deviation deviations ($\Delta z$) against positional baselines.
2. **Gaussian Density Distribution Curves**: Continuous probability density functions ($N(\mu, \sigma^2)$) comparing archetypes to the general European population.
3. **Pure Exemplars & Hybrid "Chameleons"**: Identifying pure archetype prototypes vs. multi-dimensional tactical chameleons (e.g. 55% Winger / 45% Playmaker).
4. **U21 Next-Gen Pipeline**: Discovering young prospects developing into specific tactical roles.

---

## 2. Design System & Anti-Slop Guidelines (Zero Emojis, 34 Rules)

- **Zero Emojis**: Use clean typography, bespoke hairline SVG icons from `TacticalIcons.jsx`, or standard Lucide icons.
- **Palette**: Obsidian deep base (`#01080E`, `#03151F`), Cyan (`#38B6FF`), Amber (`#FFB800`), Emerald (`#10B981`), Coral (`#FF5252`), Violet (`#A855F7`), Pink (`#EC4899`). Zero purple gradient slop.
- **Layout**: `100dvh` zero-scroll fluid cockpit matching `/pitch-map` and `/u21-scouting`.
- **Top Cockpit Bar**: Floating brand back pill with hover navigation dropdown menu, position pills (`Midfielders`, `Forwards`, `Defenders`), and cluster selector chips.

---

## 3. Component Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GMMTab.jsx (100dvh Shell)                       │
│  - Top Cockpit Bar (Brand pill, Position Pills, Cluster Chips)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ GMMArchetypeCanvas.jsx (Left 60%)│  │ GMMRosterDeck.jsx (Right 40%)    │
│ - Archetype Bio & Summary Badge  │  │ - Segment Tab: Pure vs Chameleon │
│ - z-Score Deviation Matrix Bars  │  │ - U21 Wonderkid Filter Toggle    │
│ - Interactive Gaussian Bell Curve│  │ - Roster List with Soft % Bars   │
│ - 8D Radar Archetype Centroid    │  │ - Active Player BKLit Radar View │
└──────────────────────────────────┘  └──────────────────────────────────┘
```

---

## 4. Feature Specifications

### 4.1 Statistical Archetype Canvas (`GMMArchetypeCanvas.jsx`)
- **$z$-Score Deviation Matrix**: Visualizes how the selected cluster diverges from European positional averages across all 8 features:
  $$\Delta z = \frac{\mu_{\text{cluster}} - \mu_{\text{pos}}}{\sigma_{\text{pos}}}$$
  Positive deviations highlighted in archetype color, negative deviations in muted slate.
- **Gaussian Probability Bell Curves**: Dynamic SVG curve visualizer showing normal distribution $f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$ comparing the archetype against European average.
- **Archetype Radar Footprint**: Integrated modular BKLit `<RadarChart />` illustrating 8-dimensional tactical identity.

### 4.2 Roster & Chameleon Scanner Deck (`GMMRosterDeck.jsx`)
- **Dual Segmentation Tabs**:
  - `Pure Exemplars`: Ranked by single-cluster confidence ($P(\text{Cluster}) \ge 75\%$).
  - `Dual Chameleons`: Ranked by multi-role entropy (players with $P_1 \approx P_2$, e.g. 50/50 hybrids).
  - `U21 Prospects`: Young talent under 22 belonging to this archetype.
- **Interactive Player Rows**: Shows player portrait, squad, league logo, age, and soft membership probability bars (`92% Playmaker`, `8% Engine`).
- **Player Tactical Dossier**: Clicking a player smoothly opens a side-inspection pane with their full statistical breakdown and links to Compare / U21 Scouting.

---

## 5. Verification & Testing

- **Backend Integration**: Validate `/clusters` and `/players` API response models.
- **Unit & Integration Tests**: Verify zero lint warnings with `oxlint` and successful build with `npm run build`.
- **Responsive Fluidity**: Zero viewport scrolling at 1080p, 1440p, and 4K viewports.
