# Hero Search Unclipped Dropdown — Design Document

## Goal
Ensure the search autocomplete dropdown (`HeroSearch.jsx`) in the landing page hero section can freely float at `z-50` without being clipped by the bottom boundary of the hero section, while keeping the background image and player cutout strictly contained.

## Architecture

### 1. Hero Container (`HomeTab.jsx`)
- Set root hero container to `relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] flex flex-col justify-between pt-12 sm:pt-14 pb-2 overflow-visible z-20`.
- Outer wrapper remains `overflow-visible` so any absolute element at `z-50` floats seamlessly over the boundary.

### 2. Isolated Image Clipping Layers
- **Background Layer (`hero-bg.jpg`)**: `absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden` (contained).
- **Player Cutout Layer (`hero-player.webp`)**: `lg:col-span-7 relative z-10 flex items-end justify-center lg:justify-center self-end h-full overflow-hidden pointer-events-none` (contained).

### 3. Elevated Search Dropdown (`HeroSearch.jsx`)
- Left Column: `lg:col-span-5 relative z-30 flex flex-col justify-center overflow-visible`.
- Dropdown Container: `absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden max-h-[280px] sm:max-h-[340px] overflow-y-auto`.
- Allows 6–8 results to be visible without clipping, with smooth internal scroll for further results.

## Verification
- Lint check: `npm run lint`
- Build check: `npm run build`
- Playwright verification: Type `"Ha"` into search bar, verify dropdown extends smoothly over the fold at `z-50` with zero clipping and zero visual regression.
