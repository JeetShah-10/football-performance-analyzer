import { useState, useMemo, memo } from 'react';
import ConstellationCanvas from './ConstellationCanvas';
import { generateConstellationConfig } from '../utils/constellationThemes';
import { resolvePlayerImage, getPlayerInitials } from '../utils/imageResolver';
import './PlayerCard.css';

/**
 * PlayerCard — A premium football player card with live constellation background.
 *
 * Layer stack (z-index order):
 * 0: Dark card background
 * 1: ConstellationCanvas
 * 2: Player image
 * 3: Bottom gradient fade
 * 4: Rating + Position badge
 * 5: Player name + Club
 * 6: Border glow (via box-shadow)
 *
 * @param {Object} props
 * @param {Object} props.player - Player data object
 * @param {string} props.player.name
 * @param {string} props.player.club
 * @param {number} props.player.rating
 * @param {string} props.player.position
 * @param {string} [props.player.archetype]
 */
const PlayerCard = memo(function PlayerCard({ player }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate constellation config deterministically from player name
  const constellationConfig = useMemo(
    () => generateConstellationConfig(player.name),
    [player.name]
  );

  // Resolve player image
  const imageUrl = useMemo(() => resolvePlayerImage(player.name), [player.name]);

  const theme = constellationConfig.theme;
  const themeColor = theme.primary;
  const glowColor = theme.glow;

  // Dynamic border glow style
  const cardStyle = {
    '--card-theme': themeColor,
    '--card-glow': glowColor,
    '--card-theme-rgb': hexToRgbStr(themeColor),
  };

  return (
    <div
      className={`player-card ${isHovered ? 'player-card--hovered' : ''}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Player card for ${player.name}`}
    >
      {/* Layer 1-3: Constellation Background */}
      <div className="player-card__bg">
        <ConstellationCanvas config={constellationConfig} isHovered={isHovered} />
      </div>

      {/* Layer 4: Player Image */}
      <div className="player-card__image-container">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={player.name}
            className="player-card__image"
            loading="lazy"
            draggable="false"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="player-card__image-fallback" style={{ color: themeColor }}>
            {getPlayerInitials(player.name)}
          </div>
        )}
      </div>

      {/* Layer 5: Bottom gradient overlay for text readability */}
      <div className="player-card__gradient" />



      {/* Layer 6: Position Badge (top-right) */}
      <div className="player-card__position" style={{ borderColor: `${themeColor}80` }}>
        <span
          className="player-card__position-text"
          style={{ color: themeColor }}
        >
          {player.position}
        </span>
      </div>

      {/* Layer 6: Player Info (bottom) */}
      <div className="player-card__info">
        <h3 className="player-card__name">{player.name}</h3>
        <p className="player-card__club">{player.club}</p>
      </div>

      {/* Layer 7: Border glow overlay */}
      <div className="player-card__border-glow" />
    </div>
  );
});

/**
 * Convert hex to "r, g, b" string for CSS custom property use.
 */
function hexToRgbStr(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export default PlayerCard;
