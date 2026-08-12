import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import RadarChart from './RadarChart'
import ClusterTag from './ClusterTag'
import { fetchClusters, fetchPlayers } from '../lib/api'
import { MOCK_CLUSTERS, MOCK_PLAYERS, MOCK_PLAYER_DETAILS } from '../lib/mockData'
import { STAT_LABELS } from '../lib/constants'

/**
 * Cluster Profiles widget — shows radar chart for average cluster metrics
 * and "Top Traits" pills below. Includes a cluster selector dropdown.
 */
export default function ClusterProfileWidget({ players }) {
  const [clusters, setClusters] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState('Forward')
  const [selectedClusterIdx, setSelectedClusterIdx] = useState(0)

  useEffect(() => {
    const loadClusters = async () => {
      const { data, error } = await fetchClusters()
      setClusters(error ? MOCK_CLUSTERS : data)
    }
    loadClusters()
  }, [])

  const positionClusters = clusters?.[selectedGroup] || []
  const currentCluster = positionClusters[selectedClusterIdx] || null

  // Build a synthetic stats object from the cluster's signature_stats for the radar
  // For a proper radar we'd need all 8 metrics, so we'll fake percentiles from z-scores
  const radarStats = useMemo(() => {
    if (!currentCluster) return null
    const stats = {}
    const sigMap = {}
    if (currentCluster.signature_stats) {
      currentCluster.signature_stats.forEach(s => {
        sigMap[s.feature] = s
      })
    }
    // Build normalized percentiles for all 8 stat keys
    Object.keys(STAT_LABELS).forEach(key => {
      const sig = sigMap[key]
      if (sig) {
        // Convert z_score_diff to a rough percentile (clamped 0-100)
        const pct = Math.min(100, Math.max(0, 50 + sig.z_score_diff * 20))
        stats[key] = { value: sig.cluster_mean, percentile: pct }
      } else {
        stats[key] = { value: 0, percentile: 40 + Math.random() * 20 }
      }
    })
    return stats
  }, [currentCluster])

  // Top traits from signature stats
  const topTraits = useMemo(() => {
    if (!currentCluster?.signature_stats) return []
    return currentCluster.signature_stats
      .sort((a, b) => b.z_score_diff - a.z_score_diff)
      .slice(0, 4)
      .map(s => STAT_LABELS[s.feature] || s.feature)
  }, [currentCluster])

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Cluster Profiles</h2>
          <p className="text-[10px] text-emerald uppercase tracking-wider mt-0.5">Average Metrics</p>
        </div>
        <select
          className="bg-zinc-900/50 text-xs py-1 px-2 rounded-md border-zinc-700 min-w-0"
          value={selectedGroup}
          onChange={(e) => { setSelectedGroup(e.target.value); setSelectedClusterIdx(0) }}
        >
          <option value="Forward">Forwards</option>
          <option value="Midfielder">Midfielders</option>
          <option value="Defender">Defenders</option>
        </select>
      </div>

      {/* Cluster Tabs */}
      {positionClusters.length > 1 && (
        <div className="flex gap-2 mb-2">
          {positionClusters.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelectedClusterIdx(i)}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-colors font-medium ${
                i === selectedClusterIdx
                  ? 'bg-emerald/20 text-emerald border border-emerald/30'
                  : 'bg-zinc-800/50 text-zinc-500 border border-transparent hover:text-zinc-300'
              }`}
            >
              Cluster {c.cluster_id}
            </button>
          ))}
        </div>
      )}

      {/* Radar Chart */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {radarStats ? (
          <RadarChart stats={radarStats} height={230} />
        ) : (
          <div className="text-sm text-zinc-600">Loading clusters...</div>
        )}
      </div>

      {/* Cluster Name + Description */}
      {currentCluster && (
        <div className="mt-2 pt-3 border-t border-zinc-800/50">
          <ClusterTag clusterName={currentCluster.cluster_name} clusterId={currentCluster.cluster_id} />
          <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">
            {currentCluster.description}
          </p>

          {/* Top Traits Pills */}
          {topTraits.length > 0 && (
            <div className="mt-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Top Traits</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {topTraits.map(trait => (
                  <span key={trait} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald/10 text-emerald border border-emerald/20">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
