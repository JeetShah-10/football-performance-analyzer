import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { fetchPlayerDetail } from '../lib/api'
import { MOCK_PLAYER_DETAILS } from '../lib/mockData'
import PositionBadge from '../components/PositionBadge'
import ClusterTag from '../components/ClusterTag'
import RadarChart from '../components/RadarChart'
import GMMWidget from '../components/GMMWidget'
import SimilarPlayers from '../components/SimilarPlayers'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

import { getPlayerImage } from '../lib/playerImages'

export default function PlayerDetailPage() {
  const { playerId } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const playerImg = player ? getPlayerImage(player) : null

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: apiError } = await fetchPlayerDetail(playerId)
    
    if (apiError) {
      // Fallback to mock data
      const mockPlayer = MOCK_PLAYER_DETAILS[playerId] || Object.values(MOCK_PLAYER_DETAILS)[0]
      setPlayer(mockPlayer)
    } else {
      setPlayer(data)
    }
    
    setLoading(false)
  }

  useEffect(() => {
    if (playerId) {
      loadProfile()
    }
  }, [playerId])

  if (loading && !player) {
    return (
      <div className="page-container flex flex-col gap-6 pt-6">
        <LoadingSkeleton variant="card" count={1} />
        <div className="flex gap-6">
          <div className="w-1/3"><LoadingSkeleton variant="card" count={1} /></div>
          <div className="w-1/3"><LoadingSkeleton variant="radar" count={1} /></div>
          <div className="w-1/3"><LoadingSkeleton variant="card" count={2} /></div>
        </div>
      </div>
    )
  }

  if (error && !player) {
    return (
      <div className="page-container pt-12">
        <ErrorState message={error} onRetry={loadProfile} />
      </div>
    )
  }

  if (!player) return null

  return (
    <div className="page-container flex flex-col gap-6 pt-6 pb-12">
      
      {/* Back navigation */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      {/* Header Banner */}
      <div className="card bg-gradient-to-br from-card to-zinc-900/50 border-zinc-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            {playerImg && (
              <div className="w-16 h-16 rounded-full border-2 border-purple-500/50 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-[#17132c]">
                <img src={playerImg} alt={player.player_name} className="w-full h-full object-cover object-center" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-50 tracking-tight">
                {player.player_name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                <span className="text-lg text-zinc-300">{player.squad}</span>
                <span className="text-zinc-500 hidden sm:block">•</span>
                <span className="text-zinc-400">{player.league}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Position</span>
              <PositionBadge positionGroup={player.position_group} />
            </div>
            <div className="w-px h-10 bg-zinc-800 hidden md:block" />
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Age</span>
              <span className="font-mono text-zinc-200">{player.age} yrs</span>
            </div>
            <div className="w-px h-10 bg-zinc-800 hidden md:block" />
            <div className="flex flex-col items-start md:items-end">
              <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Minutes</span>
              <span className="font-mono text-zinc-200">{player.minutes_played}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: GMM & Primary Info */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Primary Archetype</h2>
              <div className="mt-1">
                <ClusterTag clusterName={player.cluster_name} clusterId={player.cluster_id} />
              </div>
            </div>
            <GMMWidget probabilities={player.gmm_probabilities} />
          </div>
        </div>

        {/* Center Col: Radar Chart */}
        <div className="card flex flex-col items-center justify-center">
          <div className="w-full mb-2 text-center">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Tactical Profile (Per 90)</h2>
            <p className="text-xs text-zinc-500 mt-1">Percentile rank against positional peers (0-100)</p>
          </div>
          <RadarChart stats={player.stats} />
        </div>

        {/* Right Col: Similar Players */}
        <div className="card bg-zinc-900/30">
          <SimilarPlayers playerId={player.player_id} />
        </div>

      </div>
    </div>
  )
}
