import {
  GoalVectorIcon,
  PitchProgressionIcon,
  DefensiveBarrierIcon,
} from '../components/icons/TacticalIcons';

// Human-understandable metric definitions for GMM
export const GMM_METRICS = [
  { key: 'npxG_per90', label: 'Goals (npxG)', short: 'Goals', icon: GoalVectorIcon },
  { key: 'xAG_per90', label: 'Assists (xAG)', short: 'Assists', icon: PitchProgressionIcon },
  { key: 'KP_per90', label: 'Key Passes', short: 'Key Passes', icon: PitchProgressionIcon },
  { key: 'PrgP_per90', label: 'Forward Passes', short: 'Fwd Passes', icon: PitchProgressionIcon },
  { key: 'PrgC_per90', label: 'Ball Carries', short: 'Carries', icon: PitchProgressionIcon },
  { key: 'Succ_per90', label: 'Dribbles', short: 'Dribbles', icon: GoalVectorIcon },
  { key: 'Tkl_per90', label: 'Tackles', short: 'Tackles', icon: DefensiveBarrierIcon },
  { key: 'Int_per90', label: 'Interceptions', short: 'Intercepts', icon: DefensiveBarrierIcon },
];

export const GMM_METRIC_MAP = Object.fromEntries(GMM_METRICS.map((m) => [m.key, m]));

// Archetype Theme Colors (Obsidian Glass palette - zero purple gradient slop)
export const GMM_CLUSTER_COLORS = {
  'Target Men / Poachers': { color: '#FF5252', bg: 'rgba(255, 82, 82, 0.12)', border: 'rgba(255, 82, 82, 0.4)', glow: 'rgba(255, 82, 82, 0.5)' },
  'Creators / Playmakers': { color: '#38B6FF', bg: 'rgba(56, 182, 255, 0.12)', border: 'rgba(56, 182, 255, 0.4)', glow: 'rgba(56, 182, 255, 0.5)' },
  'Progressive Distributors': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.5)' },
  'Box-to-Box Engines': { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.12)', border: 'rgba(255, 184, 0, 0.4)', glow: 'rgba(255, 184, 0, 0.5)' },
  'Dynamic Dribblers / Wingers': { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.4)', glow: 'rgba(168, 85, 247, 0.5)' },
  'Defensive Destroyers': { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.4)', glow: 'rgba(236, 72, 153, 0.5)' },
  // Additional Named Clusters
  'Dynamic Winger / Dribbler': { color: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.4)', glow: 'rgba(168, 85, 247, 0.5)' },
  'Deep-Lying Playmaker': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.5)' },
  'Clinical Finisher / Poacher': { color: '#FF5252', bg: 'rgba(255, 82, 82, 0.12)', border: 'rgba(255, 82, 82, 0.4)', glow: 'rgba(255, 82, 82, 0.5)' },
  'Box-to-Box Engine': { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.12)', border: 'rgba(255, 184, 0, 0.4)', glow: 'rgba(255, 184, 0, 0.5)' },
  'Aggressive Ball-Winner': { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.4)', glow: 'rgba(236, 72, 153, 0.5)' },
  'Wide Playmaker / Inverted Winger': { color: '#38B6FF', bg: 'rgba(56, 182, 255, 0.12)', border: 'rgba(56, 182, 255, 0.4)', glow: 'rgba(56, 182, 255, 0.5)' },
  'Central Target Forward': { color: '#FF5252', bg: 'rgba(255, 82, 82, 0.12)', border: 'rgba(255, 82, 82, 0.4)', glow: 'rgba(255, 82, 82, 0.5)' },
};

export function getClusterTheme(clusterName) {
  return GMM_CLUSTER_COLORS[clusterName] || {
    color: '#38B6FF',
    bg: 'rgba(56, 182, 255, 0.12)',
    border: 'rgba(56, 182, 255, 0.4)',
    glow: 'rgba(56, 182, 255, 0.5)',
  };
}

// Gaussian Probability Density Function (PDF)
// f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-0.5 * ((x - mu)/sigma)^2)
export function calculateGaussianPDF(x, mean = 0, stdDev = 1) {
  if (stdDev <= 0) return 0;
  const factor = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return factor * Math.exp(exponent);
}

// Generate points for SVG Bell Curve
export function generateGaussianCurvePoints(mean, stdDev, minX, maxX, numPoints = 60) {
  const points = [];
  const step = (maxX - minX) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = minX + i * step;
    const y = calculateGaussianPDF(x, mean, stdDev);
    points.push({ x, y });
  }

  return points;
}

// Compute Shannon Entropy for Chameleon multi-role score
// H = -sum(p_i * log2(p_i))
export function calculateEntropy(probabilities = {}) {
  const values = Object.values(probabilities).filter((p) => p > 0);
  if (values.length <= 1) return 0;

  let sum = 0;
  for (const p of values) {
    sum -= p * Math.log2(p);
  }
  return sum;
}
