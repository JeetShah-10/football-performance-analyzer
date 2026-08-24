// Comprehensive Telemetry Metric Definitions & Presets (Clean, Professional, Anti-Slop)

export const METRIC_DEFINITIONS = {
  npxG_per90: {
    key: 'npxG_per90',
    label: 'Expected Goals (xG)',
    short: 'Goals (xG)',
    axisLabel: 'Expected Goals (xG / 90)',
    category: 'Attacking',
    unit: 'goals',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Non-penalty expected goals per 90 minutes',
    min: 0,
    max: 1.0,
  },
  xAG_per90: {
    key: 'xAG_per90',
    label: 'Expected Assists (xAG)',
    short: 'Assists (xAG)',
    axisLabel: 'Expected Assists (xAG / 90)',
    category: 'Creation',
    unit: 'assists',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Expected assisted goals per 90 minutes',
    min: 0,
    max: 0.6,
  },
  KP_per90: {
    key: 'KP_per90',
    label: 'Key Passes',
    short: 'Key Passes',
    axisLabel: 'Key Passes / 90',
    category: 'Creation',
    unit: 'passes',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Key passes leading directly to a shot per 90',
    min: 0,
    max: 3.5,
  },
  PrgP_per90: {
    key: 'PrgP_per90',
    label: 'Forward Passes',
    short: 'Forward Passes',
    axisLabel: 'Progressive Passes / 90',
    category: 'Progression',
    unit: 'passes',
    format: (v) => Number(v || 0).toFixed(1),
    description: 'Completed forward passes moving ball ≥10m forward',
    min: 0,
    max: 11.0,
  },
  PrgC_per90: {
    key: 'PrgC_per90',
    label: 'Progressive Carries',
    short: 'Ball Carries',
    axisLabel: 'Progressive Carries / 90',
    category: 'Progression',
    unit: 'carries',
    format: (v) => Number(v || 0).toFixed(1),
    description: 'Completed carries moving ball ≥10m forward',
    min: 0,
    max: 6.5,
  },
  Succ_per90: {
    key: 'Succ_per90',
    label: 'Take-Ons (1v1)',
    short: 'Dribbles',
    axisLabel: 'Successful Take-Ons / 90',
    category: 'Dribbling',
    unit: 'take-ons',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Successful 1v1 dribbles past an opponent per 90',
    min: 0,
    max: 4.5,
  },
  Tkl_per90: {
    key: 'Tkl_per90',
    label: 'Tackles Won',
    short: 'Tackles',
    axisLabel: 'Tackles Won / 90',
    category: 'Defending',
    unit: 'tackles',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Tackles won against an opponent per 90',
    min: 0,
    max: 4.0,
  },
  Int_per90: {
    key: 'Int_per90',
    label: 'Interceptions',
    short: 'Interceptions',
    axisLabel: 'Interceptions / 90',
    category: 'Defending',
    unit: 'intercepts',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Opponent passes intercepted per 90',
    min: 0,
    max: 2.5,
  },
  pca_x: {
    key: 'pca_x',
    label: 'Attack Impact (PCA 1)',
    short: 'PCA Attack',
    axisLabel: 'PCA Component 1 (Creation & Threat)',
    category: 'Machine Learning',
    unit: 'std dev',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Principal Component 1 (41.8% explained variance)',
    min: -3.5,
    max: 3.5,
  },
  pca_y: {
    key: 'pca_y',
    label: 'Build-up Impact (PCA 2)',
    short: 'PCA Build-up',
    axisLabel: 'PCA Component 2 (Progression & Defense)',
    category: 'Machine Learning',
    unit: 'std dev',
    format: (v) => Number(v || 0).toFixed(2),
    description: 'Principal Component 2 (25.4% explained variance)',
    min: -3.5,
    max: 3.5,
  },
};

export const ANALYTICAL_PRESETS = [
  {
    id: 'threat_vs_creation',
    label: 'Goal Threat vs Creation',
    short: 'Threat vs Creation',
    xKey: 'npxG_per90',
    yKey: 'xAG_per90',
    tagline: 'Isolate dual-threat forwards and lethal box creators',
  },
  {
    id: 'progression_matrix',
    label: 'Pass vs Carry Progression',
    short: 'Progression Matrix',
    xKey: 'PrgP_per90',
    yKey: 'PrgC_per90',
    tagline: 'Identify elite midfield conductors and dynamic line-breakers',
  },
  {
    id: 'defensive_action',
    label: 'Tackles vs Interceptions',
    short: 'Defensive Disruption',
    xKey: 'Tkl_per90',
    yKey: 'Int_per90',
    tagline: 'Compare aggressive ball-winners with positional interceptors',
  },
  {
    id: 'dribble_creation',
    label: 'Chances vs Dribbles',
    short: 'Playmaking vs 1v1',
    xKey: 'Succ_per90',
    yKey: 'KP_per90',
    tagline: 'Uncover explosive wingers and 1v1 chance generators',
  },
  {
    id: 'pca_space',
    label: 'PCA Feature Space',
    short: 'PCA Space',
    xKey: 'pca_x',
    yKey: 'pca_y',
    tagline: 'Full dimensional reduction across all 8 scaled dimensions',
  },
];

export const CLUSTER_THEMES = {
  'Target Men / Poachers': {
    name: 'Target Men / Poachers',
    color: '#FF5252',
    glow: 'rgba(255, 82, 82, 0.45)',
    bg: 'rgba(255, 82, 82, 0.12)',
    border: 'rgba(255, 82, 82, 0.4)',
    short: 'Poachers',
    centroid: { x: 1.65, y: -1.25 },
  },
  'Creators / Playmakers': {
    name: 'Creators / Playmakers',
    color: '#38B6FF',
    glow: 'rgba(56, 182, 255, 0.45)',
    bg: 'rgba(56, 182, 255, 0.12)',
    border: 'rgba(56, 182, 255, 0.4)',
    short: 'Playmakers',
    centroid: { x: 1.45, y: 1.35 },
  },
  'Box-to-Box Engines': {
    name: 'Box-to-Box Engines',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.45)',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    short: 'Engines',
    centroid: { x: 0.15, y: 0.85 },
  },
  'Ball-Playing Defenders': {
    name: 'Ball-Playing Defenders',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.45)',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.4)',
    short: 'Ball-Playing DF',
    centroid: { x: -1.45, y: 0.95 },
  },
  'Dynamic Ball Carriers': {
    name: 'Dynamic Ball Carriers',
    color: '#FFB800',
    glow: 'rgba(255, 184, 0, 0.45)',
    bg: 'rgba(255, 184, 0, 0.12)',
    border: 'rgba(255, 184, 0, 0.4)',
    short: 'Ball Carriers',
    centroid: { x: 1.15, y: -0.15 },
  },
  'Defensive Destroyers': {
    name: 'Defensive Destroyers',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    bg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.4)',
    short: 'Destroyers',
    centroid: { x: -1.65, y: -1.05 },
  },
};

// Helper to compute sample median
export function calculateMedian(values = []) {
  if (!values.length) return 0;
  const sorted = [...values].filter((v) => !isNaN(v)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Helper to compute Pearson Correlation (r) & Linear Regression Slope
export function calculatePearsonCorrelation(pairs = []) {
  if (pairs.length < 2) {
    return { r: 0, slope: 0, intercept: 0, strength: 'Independent' };
  }

  let sumX = 0;
  let sumY = 0;
  const n = pairs.length;

  for (let i = 0; i < n; i++) {
    sumX += pairs[i].x;
    sumY += pairs[i].y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = pairs[i].x - meanX;
    const dy = pairs[i].y - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const denom = Math.sqrt(denX * denY);
  const r = denom === 0 ? 0 : num / denom;
  const slope = denX === 0 ? 0 : num / denX;
  const intercept = meanY - slope * meanX;

  let strength = 'Independent';
  const absR = Math.abs(r);
  if (absR >= 0.65) strength = r > 0 ? 'Strong Positive' : 'Strong Inverse';
  else if (absR >= 0.35) strength = r > 0 ? 'Moderate Positive' : 'Moderate Inverse';
  else if (absR >= 0.15) strength = r > 0 ? 'Weak Correlation' : 'Weak Inverse';

  return { r, slope, intercept, strength };
}
