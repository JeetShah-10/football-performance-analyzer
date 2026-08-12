/**
 * Stat label mappings: internal API key → human-readable display name
 */
export const STAT_LABELS = {
  npxG_per90: 'Non-Pen xG',
  xAG_per90: 'xAssist',
  KP_per90: 'Key Passes',
  PrgP_per90: 'Prog. Passes',
  PrgC_per90: 'Prog. Carries',
  Tkl_per90: 'Tackles',
  Int_per90: 'Interceptions',
  Succ_per90: 'Take-Ons',
}

/** Ordered stat keys for consistent radar chart axis ordering */
export const STAT_KEYS = Object.keys(STAT_LABELS)

/**
 * Cluster color palette — 6 distinct colors for scatter plot dots.
 * Avoids purple per DESIGN.md anti-slop rule #1.
 */
export const CLUSTER_COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ef4444', // red
  '#14b8a6', // teal
  '#f97316', // orange
]

/** Position group → color mapping */
export const POSITION_COLORS = {
  Defender: '#14b8a6',  // teal
  Midfielder: '#f59e0b', // amber
  Forward: '#10b981',    // emerald
}

/** Position group → abbreviation */
export const POSITION_ABBR = {
  Defender: 'DEF',
  Midfielder: 'MID',
  Forward: 'FWD',
}

/** Similarity score color thresholds */
export function getSimilarityColor(score) {
  if (score >= 95) return '#10b981' // emerald
  if (score >= 85) return '#f59e0b' // amber
  return '#71717a' // zinc-500
}

/** API base URL — routed through Vite proxy in dev */
export const API_BASE = '/api'
