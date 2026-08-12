/**
 * Image resolver for player images.
 * Maps player names to their corresponding image files using a pre-built index.
 */

import imageIndex from '../data/imageIndex.json';

/**
 * Normalize a player name for lookup.
 * - Lowercases
 * - Replaces underscores and hyphens with spaces
 * - Strips diacritics via Unicode NFD decomposition
 * - Trims and collapses whitespace
 *
 * @param {string} name - The player name (e.g., "Lamine Yamal")
 * @returns {string} Normalized name (e.g., "lamine yamal")
 */
export function normalizeName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve a player name to an image URL.
 *
 * @param {string} playerName - The player's display name.
 * @returns {string|null} The URL path to the player image, or null if not found.
 */
export function resolvePlayerImage(playerName) {
  if (!playerName) return null;
  return `http://localhost:8000/players/${encodeURIComponent(playerName)}/image`;
}

/**
 * Get the player's initials for fallback display.
 * @param {string} name - Player name.
 * @returns {string} Initials (e.g., "LY" for "Lamine Yamal")
 */
export function getPlayerInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
