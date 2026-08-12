/**
 * Player image resolution utility.
 * Dynamically resolves player images added in `frontend/src/players/` and `frontend/public/images/players/`.
 */

// Import all images in src/players via Vite glob import
const srcPlayerImages = import.meta.glob('../players/*.png', { eager: true, import: 'default' });

/**
 * Normalizes a player name or string for fuzzy matching.
 * e.g., "Vinícius Júnior" -> "viniciusjunior", "Joško Gvardiol" -> "joskogvardiol"
 */
export function normalizePlayerName(name) {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Build exact and normalized lookup maps
const exactImageMap = {};
const normalizedImageMap = {};

Object.entries(srcPlayerImages).forEach(([path, url]) => {
  const fileName = path.split('/').pop().replace(/\.png$/i, '');
  exactImageMap[fileName] = url;
  const norm = normalizePlayerName(fileName);
  if (norm) {
    normalizedImageMap[norm] = url;
  }
});

/**
 * Get resolved image URL for a given player object or player name / ID.
 * Now points to the FastAPI backend which serves images directly from the ZIP file.
 * @param {object|string} player - Player object or string name/ID
 * @returns {string|null} Resolved image URL or fallback static path
 */
export function getPlayerImage(player) {
  if (!player) return null;

  let playerId = '';
  if (typeof player === 'string') {
    playerId = player;
  } else {
    playerId = player.player_name || player.name || player.player_id || player.id || '';
  }

  if (!playerId) return null;
  
  // Use absolute URL to point to the FastAPI backend directly
  return `http://localhost:8000/players/${encodeURIComponent(playerId)}/image`;
}
