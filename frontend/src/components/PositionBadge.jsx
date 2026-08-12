import { POSITION_COLORS, POSITION_ABBR } from '../lib/constants'

/**
 * Small colored pill badge displaying position group.
 * Defender = teal, Midfielder = amber, Forward = emerald.
 */
export default function PositionBadge({ positionGroup }) {
  const color = POSITION_COLORS[positionGroup] || '#71717a'
  const abbr = POSITION_ABBR[positionGroup] || positionGroup

  return (
    <span
      className="badge"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {abbr}
    </span>
  )
}
