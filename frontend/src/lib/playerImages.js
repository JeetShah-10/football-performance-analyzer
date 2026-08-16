/**
 * Player image resolution utility.
 * Dynamically resolves player images added in `frontend/src/players/` and `frontend/public/images/players/`.
 */



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
