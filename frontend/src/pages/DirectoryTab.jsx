import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Swords, X } from 'lucide-react';
import { fetchPlayers } from '../lib/api';
import { MOCK_PLAYERS } from '../lib/mockData';
import PlayerCard from '../components/PlayerCard';
import LeagueLogo, { LEAGUE_CONFIGS } from '../components/LeagueLogo';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import ShimmeringText from '../components/ui/shimmering-text';
import bgExplorer from '../assets/bg-explorer.jpg';

const LEAGUES = [
  'Premier League',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
];

const POSITIONS = [
  { key: '', label: 'ALL' },
  { key: 'Defender', label: 'DEF' },
  { key: 'Midfielder', label: 'MID' },
  { key: 'Forward', label: 'ATT' },
];

export default function DirectoryTab() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [positionGroup, setPositionGroup] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [u21Only, setU21Only] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: apiError } = await fetchPlayers({
      search: debouncedSearch,
      position_group: positionGroup || undefined,
      league: selectedLeague || undefined,
      u21_only: u21Only,
      limit: 100,
    });

    if (apiError) {
      setPlayers(MOCK_PLAYERS);
    } else {
      setPlayers(data || []);
    }

    setLoading(false);
  }, [debouncedSearch, positionGroup, selectedLeague, u21Only]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="relative min-h-screen flex flex-col select-none">
      
      {/* Ambient Explorer Background Image Layer with Orange Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={bgExplorer}
          alt=""
          className="w-full h-full object-cover object-center opacity-40 filter brightness-90 contrast-105 saturate-120"
        />
        {/* Calibrated dark-to-translucent gradient overlays for optimal card contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000C12]/75 via-[#000C12]/50 to-[#000C12]/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF3C00]/[0.10] via-transparent to-[#FF6A00]/[0.05] mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 max-w-[1536px] w-full mx-auto px-4 sm:px-6 pt-28 pb-12">
        {/* 1. TOP HEADER & FILTER DECK */}
        <div className="relative rounded-3xl p-5 sm:p-6 bg-[#03151F]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col gap-5">
          {/* Title & Compare Arena Link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#38B6FF]">
                1,802-Player Database
              </span>
              <ShimmeringText
                text="Player Explorer & Scouting Telemetry"
                className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight"
              />
            </div>

            <Link
              to="/compare"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-[#FF3C00] text-white border border-white/20 hover:border-[#FF3C00] text-xs font-mono font-bold transition-all shadow-[0_4px_16px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer shrink-0"
            >
              <Swords className="w-3.5 h-3.5 text-[#FFB800]" />
              <span>Compare Arena</span>
            </Link>
          </div>

          {/* Minimalist Search Bar with Subtle Search Icon */}
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Search players, clubs, or archetypes (e.g. Saka, Rodri, Arsenal, Winger)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-14 py-3.5 bg-[#080C12]/85 backdrop-blur-2xl border border-white/15 focus:border-[#FF3C00]/60 rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.6)] focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_24px_rgba(255,60,0,0.25)] transition-all"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-12 text-xs font-mono text-[#8FA3AD] hover:text-white cursor-pointer p-1 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setDebouncedSearch(search)}
              className="absolute right-2.5 w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF3C00] text-white/80 hover:text-white border border-white/15 hover:border-[#FF3C00] transition-all flex items-center justify-center active:scale-90 cursor-pointer shadow-sm"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Badges Row: Prominent Studio League Badges + Position Pills + U21 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.04]">
            {/* League Badges with High-Glow Studio Crests */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setSelectedLeague('')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedLeague === ''
                    ? 'bg-white text-[#000C12] shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                    : 'bg-[#000910]/80 text-[#8FA3AD] hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                All Leagues
              </button>

              {LEAGUES.map((lg) => {
                const active = selectedLeague === lg;
                const config = LEAGUE_CONFIGS[lg];
                return (
                  <button
                    key={lg}
                    onClick={() => setSelectedLeague(active ? '' : lg)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      active
                        ? 'bg-white/20 text-white border-white/40 shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                        : 'bg-[#000910]/80 text-[#8FA3AD] hover:text-white border-white/10 hover:border-white/30'
                    }`}
                    style={active ? { borderColor: config.borderColor, boxShadow: `0 0 16px ${config.glow}` } : {}}
                  >
                    <LeagueLogo leagueName={lg} size="sm" />
                    <span className="truncate hidden sm:inline">{config.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Position Pills & U21 Toggle */}
            <div className="flex items-center gap-3">
              {/* Position Pills */}
              <div className="flex items-center p-1 rounded-full bg-[#000910]/90 border border-white/10 text-xs font-mono">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos.key}
                    onClick={() => setPositionGroup(pos.key)}
                    className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      positionGroup === pos.key
                        ? 'bg-white text-[#000C12] shadow-sm'
                        : 'text-[#8FA3AD] hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {/* U21 Switch */}
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#000910]/90 border border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={u21Only}
                  onChange={(e) => setU21Only(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#FF3C00] bg-[#000C12] border-white/20"
                />
                <span className="text-xs font-mono font-bold text-white">U21 Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. MAIN DATA DISPLAY (CARDS GRID OR PRO TABLE) */}
        <div className="flex flex-col gap-4">
          {/* Results Count & Active Filters Indicator */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-[#8FA3AD]">
            <span>Showing {players.length} matched players</span>
          </div>

          {error && !loading ? (
            <ErrorState message={error} onRetry={loadData} />
          ) : loading && players.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              <LoadingSkeleton variant="card" count={8} />
            </div>
          ) : players.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#03151F]/90 border border-white/[0.08] text-center flex flex-col items-center justify-center gap-2">
              <Search className="w-8 h-8 text-[#8FA3AD]" />
              <p className="text-sm font-bold text-white font-mono">No players match your active filters</p>
              <p className="text-xs text-[#8FA3AD] font-mono">Try adjusting your position, league, or search criteria.</p>
            </div>
          ) : (
            /* TACTICAL CARDS GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {players.map((player) => (
                <PlayerCard
                  key={player.player_id || player.id}
                  player={player}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
