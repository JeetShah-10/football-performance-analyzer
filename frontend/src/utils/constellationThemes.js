/**
 * Constellation color themes and configuration generator.
 * Each player gets a deterministic theme based on their name hash.
 */

import { createSeededRandom, seededRange } from './seededRandom';

/**
 * Available color themes for constellation backgrounds.
 */
export const THEMES = [
  {
    name: 'azure',
    primary: '#00A8FF',
    glow: '#0088FF',
    particle: '#66CCFF',
    bg: '#000814',
  },
  {
    name: 'crimson',
    primary: '#FF304F',
    glow: '#FF003C',
    particle: '#FF6680',
    bg: '#0A0004',
  },
  {
    name: 'emerald',
    primary: '#00FF66',
    glow: '#00CC55',
    particle: '#66FFaa',
    bg: '#000A04',
  },
  {
    name: 'gold',
    primary: '#FFD000',
    glow: '#FFB000',
    particle: '#FFE566',
    bg: '#0A0800',
  },
  {
    name: 'amethyst',
    primary: '#A855F7',
    glow: '#7C3AED',
    particle: '#C084FC',
    bg: '#06000A',
  },
  {
    name: 'electric',
    primary: '#00E5FF',
    glow: '#0099FF',
    particle: '#66F0FF',
    bg: '#000A0E',
  },
];

/**
 * Parse a hex color string into [r, g, b].
 * @param {string} hex - e.g. '#FF304F'
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Generate a full constellation configuration for a player.
 * Deterministic: same player name always produces same config.
 *
 * @param {string} playerName - The player's name used as seed.
 * @returns {Object} Configuration object for the constellation.
 */
export function generateConstellationConfig(playerName) {
  const rng = createSeededRandom(playerName);

  // Pick a theme deterministically
  const themeIndex = Math.floor(rng() * THEMES.length);
  const theme = THEMES[themeIndex];

  // Generate per-card variation parameters
  const config = {
    theme,
    themeIndex,
    nodeCount: Math.floor(seededRange(rng, 10, 18)),
    particleCount: Math.floor(seededRange(rng, 35, 65)),
    starCount: Math.floor(seededRange(rng, 50, 90)),
    connectionDistance: seededRange(rng, 0.2, 0.35), // fraction of canvas size
    animationSpeed: seededRange(rng, 0.15, 0.4),
    glowIntensity: seededRange(rng, 0.5, 0.85),
    brightNodeCount: Math.floor(seededRange(rng, 2, 5)),
    nebulaX: seededRange(rng, 0.3, 0.8), // fraction of canvas
    nebulaY: seededRange(rng, 0.15, 0.5),
    nebulaRadius: seededRange(rng, 0.25, 0.45),
    driftAngle: seededRange(rng, 0, Math.PI * 2),
  };

  // Generate initial node positions and velocities
  config.nodes = [];
  for (let i = 0; i < config.nodeCount; i++) {
    const isBright = i < config.brightNodeCount;
    config.nodes.push({
      x: rng(),
      y: rng(),
      vx: seededRange(rng, -0.0003, 0.0003),
      vy: seededRange(rng, -0.0003, 0.0003),
      radius: isBright ? seededRange(rng, 2.5, 4) : seededRange(rng, 1.2, 2.2),
      pulsePhase: seededRange(rng, 0, Math.PI * 2),
      pulseSpeed: seededRange(rng, 0.005, 0.015),
      isBright,
    });
  }

  // Generate star positions (static twinkling dots)
  config.stars = [];
  for (let i = 0; i < config.starCount; i++) {
    config.stars.push({
      x: rng(),
      y: rng(),
      radius: seededRange(rng, 0.3, 1.0),
      twinklePhase: seededRange(rng, 0, Math.PI * 2),
      twinkleSpeed: seededRange(rng, 0.008, 0.025),
    });
  }

  // Generate floating particles
  config.particles = [];
  for (let i = 0; i < config.particleCount; i++) {
    config.particles.push({
      x: rng(),
      y: rng(),
      vx: seededRange(rng, -0.0002, 0.0002),
      vy: seededRange(rng, -0.0002, 0.0002),
      radius: seededRange(rng, 0.4, 1.2),
      alpha: seededRange(rng, 0.15, 0.5),
    });
  }

  return config;
}
