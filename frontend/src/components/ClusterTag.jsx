import { CLUSTER_COLORS } from '../lib/constants'

/**
 * Display a cluster name with a matching color dot.
 * Uses a stable hash to assign one of the 6 palette colors consistently.
 */
export default function ClusterTag({ clusterName, clusterId }) {
  // Use cluster_id if available, fallback to a stable string hash of the name
  let colorIndex = 0
  if (clusterId !== undefined) {
    colorIndex = clusterId % CLUSTER_COLORS.length
  } else if (clusterName) {
    let hash = 0
    for (let i = 0; i < clusterName.length; i++) {
      hash = clusterName.charCodeAt(i) + ((hash << 5) - hash)
    }
    colorIndex = Math.abs(hash) % CLUSTER_COLORS.length
  }

  const color = CLUSTER_COLORS[colorIndex]

  return (
    <div className="flex items-center gap-2 text-sm text-zinc-300">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
      />
      <span className="truncate">{clusterName}</span>
    </div>
  )
}
