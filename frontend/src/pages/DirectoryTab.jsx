import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Loader2 } from 'lucide-react'
import { fetchPlayers } from '../lib/api'
import { MOCK_PLAYERS } from '../lib/mockData'
import PlayerCard from '../components/PlayerCard'
import ClusterMap2D from '../components/ClusterMap2D'
import ErrorState from '../components/ErrorState'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function DirectoryTab() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [positionGroup, setPositionGroup] = useState('')
  const [league, setLeague] = useState('')
  const [u21Only, setU21Only] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: apiError } = await fetchPlayers({
      search: debouncedSearch,
      position_group: positionGroup,
      league: league,
      u21_only: u21Only,
      limit: 100
    })

    if (apiError) {
      setPlayers(MOCK_PLAYERS) // Fallback for offline dev
    } else {
      setPlayers(data || [])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [debouncedSearch, positionGroup, league, u21Only])

  return (
    <div className="page-container flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search players or squads..."
            className="w-full pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <select 
            value={positionGroup} 
            onChange={(e) => setPositionGroup(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="">All Positions</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>

          <select 
            value={league} 
            onChange={(e) => setLeague(e.target.value)}
            className="min-w-[160px]"
          >
            <option value="">All Leagues</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Serie A">Serie A</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="Ligue 1">Ligue 1</option>
          </select>

          <label className="flex items-center gap-2 px-4 py-2 bg-card border border-zinc-800 rounded-md cursor-pointer hover:border-zinc-700 transition-colors whitespace-nowrap">
            <input 
              type="checkbox" 
              checked={u21Only} 
              onChange={(e) => setU21Only(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 text-emerald focus:ring-emerald focus:ring-offset-pitch-slate bg-zinc-900"
            />
            <span className="text-sm text-zinc-300">U21 Only</span>
          </label>
        </div>
      </div>

      {/* Main Content Area (Split View on Desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Column: Player Grid (Scrollable) */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col min-h-0 bg-card/30 border border-zinc-800/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-card shrink-0">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Directory ({players.length})
            </h2>
            {loading && <Loader2 className="w-4 h-4 text-emerald animate-spin" />}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {error && !loading ? (
              <ErrorState message={error} onRetry={loadData} />
            ) : loading && players.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LoadingSkeleton variant="card" count={6} />
              </div>
            ) : players.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                <Search className="w-8 h-8 opacity-50" />
                <p>No players found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {players.map((player) => (
                    <motion.div
                      key={player.player_id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <PlayerCard player={player} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: PCA Scatter Plot (Sticky) */}
        <div className="w-full lg:w-1/2 xl:w-7/12 flex flex-col min-h-[400px] lg:min-h-0 card p-6">
          <div className="mb-4 shrink-0">
            <h2 className="text-lg font-semibold text-zinc-100">Tactical Cluster Map (PCA)</h2>
            <p className="text-sm text-zinc-400 mt-1">2D projection of players based on 8 per-90 metrics. Colored by archetype.</p>
          </div>
          
          <div className="flex-1 min-h-0 bg-pitch-slate rounded-lg border border-zinc-800/50 p-4">
            {loading && players.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald animate-spin" />
              </div>
            ) : (
              <ClusterMap2D players={players} />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
