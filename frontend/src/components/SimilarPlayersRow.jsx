import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fetchSimilar } from '../lib/api'
import { MOCK_SIMILAR } from '../lib/mockData'
import { getSimilarityColor } from '../lib/constants'
import { getPlayerImage } from '../lib/playerImages'

/**
 * Horizontal row of similar players with circular avatar placeholders
 * and circular similarity score rings. Matches the reference image layout.
 */
export default function SimilarPlayersRow({ playerId, playerName }) {
  const [similar, setSimilar] = useState([])
  const [u21Only, setU21Only] = useState(false)

  useEffect(() => {
    if (!playerId) return
    const load = async () => {
      const { data, error } = await fetchSimilar(playerId, 5, u21Only)
      setSimilar(error ? MOCK_SIMILAR : (data || []))
    }
    load()
  }, [playerId, u21Only])

  if (!playerId || similar.length === 0) return null

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
            Similar Players to <span className="text-emerald">{playerName}</span>
          </h2>
          
          {/* U21 Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">U21 only</span>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${u21Only ? 'bg-emerald' : 'bg-zinc-700'}`}>
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${u21Only ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <input 
              type="checkbox"
              className="sr-only"
              checked={u21Only}
              onChange={(e) => setU21Only(e.target.checked)}
            />
          </label>
        </div>

        <Link to={`/player/${playerId}`} className="text-xs text-zinc-400 hover:text-emerald transition-colors flex items-center gap-1">
          View All Similar <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Horizontal Scroll Row */}
      <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar">
        {similar.map((player, index) => {
          const scoreColor = getSimilarityColor(player.similarity_score)
          const circumference = 2 * Math.PI * 28
          const offset = circumference - (player.similarity_score / 100) * circumference
          const imageSrc = getPlayerImage(player)

          return (
            <motion.div
              key={player.player_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/player/${player.player_id}`}
                className="flex flex-col items-center gap-3 group min-w-[120px]"
              >
                {/* Circular Avatar with Score Ring */}
                <div className="relative w-[72px] h-[72px]">
                  {/* SVG Progress Ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="#27272a"
                      strokeWidth="3"
                    />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  {/* Avatar Center */}
                  <div className="absolute inset-[6px] rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center text-lg font-bold text-zinc-400 group-hover:text-emerald transition-colors">
                    {imageSrc ? (
                      <img src={imageSrc} alt={player.player_name} className="w-full h-full object-cover object-center" />
                    ) : (
                      player.player_name?.charAt(0)
                    )}
                  </div>
                </div>

                {/* Player Info */}
                <div className="text-center">
                  <div className="text-xs font-semibold text-zinc-200 group-hover:text-emerald transition-colors truncate max-w-[110px]">
                    {player.player_name}
                  </div>
                  <div className="text-[10px] text-zinc-500">{player.squad}</div>
                  <div className="mt-1 text-xs font-mono font-bold" style={{ color: scoreColor }}>
                    {player.similarity_score.toFixed(0)}%
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
