import React from 'react';

/**
 * Bespoke Geometric Hairline Micro-SVGs for Eleven Sports Intelligence.
 * Strictly 0 AI-slop generic icons. Handcrafted 14x14 football telemetry glyphs.
 */

// 1. Goal Threat & Box Presence (Net target & ball vector)
export function GoalVectorIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" strokeOpacity="0.8" />
      <path d="M1.5 6h11M1.5 9h11M5 2.5v9M9 2.5v9" strokeOpacity="0.3" strokeDasharray="1 1" />
      <circle cx="10" cy="5" r="1.5" fill="currentColor" fillOpacity="0.9" stroke="none" />
    </svg>
  );
}

// 2. Progression & Creation (Pitch line breaking vector)
export function PitchProgressionIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 11.5L6.5 7L9 9.5L12 3.5" />
      <path d="M9 3.5h3v3" />
      <circle cx="2" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

// 3. Defensive Disruption (Backline barrier & interception vector)
export function DefensiveBarrierIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 1.5L2 3.8v4.2c0 3.2 2.8 5.4 5 6 2.2-.6 5-2.8 5-6V3.8L7 1.5z" />
      <path d="M7 4.5v5M4.5 7h5" strokeOpacity="0.6" />
    </svg>
  );
}

// 4. Tactical Radar / Polygon Footprint
export function RadarFootprintIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="7 1.5, 12 4.5, 10.5 11, 3.5 11, 2 4.5" strokeOpacity="0.4" />
      <polygon points="7 3.5, 10 5.5, 9 9.5, 5 9.5, 4 5.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

// 5. GMM Soft-Clustering DNA (Gaussian bell curve distribution)
export function GMMCurveIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 11.5h12" strokeOpacity="0.4" />
      <path d="M2 11.5c1.5 0 2.5-8 5-8s3.5 8 5 8" />
      <line x1="7" y1="3.5" x2="7" y2="11.5" strokeOpacity="0.5" strokeDasharray="1 1" />
    </svg>
  );
}

// 6. Tactical Twins / Cosine Similarity (Dual linked player centroids)
export function TacticalTwinsIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="4" cy="7" r="2.5" />
      <circle cx="10" cy="7" r="2.5" strokeOpacity="0.7" />
      <path d="M6.5 7h1" strokeDasharray="1 1" />
    </svg>
  );
}

// 7. Attacker / Forward Position (Aiming vector)
export function PosAttackerIcon({ className = 'w-3 h-3', ...props }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="4.5" strokeOpacity="0.5" />
      <path d="M6 3v6M3 6h6" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 8. Midfielder Position (Distribution hub)
export function PosMidfielderIcon({ className = 'w-3 h-3', ...props }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="6 1.5, 10.5 6, 6 10.5, 1.5 6" strokeOpacity="0.6" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 9. Defender Position (Tactical barrier)
export function PosDefenderIcon({ className = 'w-3 h-3', ...props }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2.5" width="8" height="7" rx="1.5" />
      <line x1="2" y1="6" x2="10" y2="6" strokeOpacity="0.6" />
    </svg>
  );
}

// 10. Wonderkid / U21 Discovery (Targeting diamond)
export function WonderkidReticleIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="8" height="8" rx="2" transform="rotate(45 7 7)" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 11. AI Scout Terminal (Command-line chevron prompt)
export function TerminalPromptIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 4.5L6.5 7L3 9.5" />
      <path d="M8 10h3" strokeWidth="1.5" />
    </svg>
  );
}

// 12. Pitch Coordinates (2D pitch quadrant)
export function PitchQuadrantIcon({ className = 'w-3.5 h-3.5', ...props }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1.5" y="2" width="11" height="10" rx="1.5" />
      <line x1="7" y1="2" x2="7" y2="12" strokeOpacity="0.4" />
      <circle cx="7" cy="7" r="2" strokeOpacity="0.4" />
      <circle cx="9.5" cy="5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

// 13. Match Time / Season Minutes (Stopwatch dial)
export function MatchStopwatchIcon({ className = 'w-3 h-3', ...props }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6.5" r="4.5" />
      <path d="M6 4v2.5l1.5 1" />
      <path d="M5 1h2" strokeWidth="1.2" />
    </svg>
  );
}
