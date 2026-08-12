import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchSimilar } from '../lib/api'
import { MOCK_SIMILAR, MOCK_SIMILAR_U21 } from '../lib/mockData'
import { getSimilarityColor } from '../lib/constants'
import ClusterTag from './ClusterTag'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorState from './ErrorState'
import { Sparkles } from 'lucide-react'

export default function SimilarPlayers({ playerId }) {
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [u21Only, setU21Only] = useState(false)

  const loadSimilar = async (isU21) => {
    setLoading(true)
    setError(null)
    
    const { data, error: apiError } = await fetchSimilar(playerId, 5, isU21)
    
    if (apiError) {
      // Fallback to mock data
      setSimilar(isU21 ? MOCK_SIMILAR_U21 : MOCK_SIMILAR)
    } else {
      setSimilar(data || [])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    if (playerId) {
      loadSimilar(u21Only)
    }
  }, [playerId, u21Only])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
          Tactical Matches
        </h3>
        
        {/* U21 Scouting Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${u21Only ? 'bg-emerald' : 'bg-zinc-700'}`}>
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${u21Only ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className={`text-xs font-medium transition-colors flex items-center gap-1 ${u21Only ? 'text-emerald' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
            <Sparkles className="w-3 h-3" />
            U21 Prospects
          </span>
          {/* hidden checkbox */}
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={u21Only}
            onChange={(e) => setU21Only(e.target.checked)}
          />
        </label>
      </div>

      {loading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadSimilar(u21Only)} />
      ) : similar.length === 0 ? (
        <div className="text-sm text-zinc-500 text-center py-4">No similar players found.</div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {similar.map((player, index) => {
              const scoreColor = getSimilarityColor(player.similarity_score)
              
              return (
                <motion.div
                  key={player.player_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link to={`/player/${player.player_id}`}>
                    <div className="card card-hover flex items-center justify-between p-3 cursor-pointer group">
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-100 group-hover:text-emerald transition-colors">
                          {player.player_name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-zinc-400">{player.squad}</span>
                          <span className="text-xs text-zinc-600">•</span>
                          <ClusterTag clusterName={player.cluster_name} />
                        </div>
                      </div>

                      <div 
                        className="flex items-center justify-center font-mono text-sm font-semibold px-2.5 py-1 rounded-md"
                        style={{ backgroundColor: `${scoreColor}15`, color: scoreColor }}
                      >
                        {player.similarity_score.toFixed(1)}%
                      </div>

                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
