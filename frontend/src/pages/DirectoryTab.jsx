import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Users } from 'lucide-react';
import { fetchPlayers } from '../lib/api';
import { MOCK_PLAYERS } from '../lib/mockData';
import PlayerCard from '../components/PlayerCard';
import DualRadarCompare from '../components/DualRadarCompare';
import ErrorState from '../components/ErrorState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function DirectoryTab() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [positionGroup, setPositionGroup] = useState('');
  const [league, setLeague] = useState('');
  const [u21Only, setU21Only] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await fetchPlayers({
      search: debouncedSearch,
      position_group: positionGroup,
      league: league,
      u21_only: u21Only,
      limit: 100
    });

    if (apiError) {
      setPlayers(MOCK_PLAYERS);
    } else {
      setPlayers(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch, positionGroup, league, u21Only]);

  return (
    <div className="flex flex-col gap-8 max-w-[1536px] mx-auto px-4 sm:px-6 pt-6 pb-16">
      
      {/* Top Filter & Search Header Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-center border-zinc-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search 1,802 players or squads..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#090d18] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select 
            value={positionGroup} 
            onChange={(e) => setPositionGroup(e.target.value)}
            className="bg-[#090d18] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Positions</option>
            <option value="Defender">Defenders</option>
            <option value="Midfielder">Midfielders</option>
            <option value="Forward">Forwards</option>
          </select>

          <select 
            value={league} 
            onChange={(e) => setLeague(e.target.value)}
            className="bg-[#090d18] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Leagues</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Serie A">Serie A</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="Ligue 1">Ligue 1</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 bg-[#090d18] border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-colors whitespace-nowrap">
            <input 
              type="checkbox" 
              checked={u21Only} 
              onChange={(e) => setU21Only(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-700 text-cyan-400 focus:ring-cyan-500 bg-zinc-900"
            />
            <span className="text-xs text-zinc-300 font-semibold">U21 Only</span>
          </label>
        </div>
      </div>

      {/* Side-by-Side Dual Radar Comparison Tool */}
      <DualRadarCompare defaultPlayerId1="bukayo_saka_eng_eng_2001_0" defaultPlayerId2="phil_foden_eng_eng_2000_0" />

      {/* Player Directory Grid */}
      <div className="glass-card rounded-2xl p-6 border-zinc-800">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-800">
          <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Player Directory ({players.length})</span>
          </h2>
          {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
        </div>
        
        {error && !loading ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : loading && players.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <LoadingSkeleton variant="card" count={8} />
          </div>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-2">
            <Search className="w-8 h-8 opacity-50 text-cyan-400" />
            <p className="text-xs">No players found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
}
