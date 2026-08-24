import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import {
  PitchQuadrantIcon,
  WonderkidReticleIcon,
  TacticalTwinsIcon,
  GMMCurveIcon,
  TerminalPromptIcon,
} from '../components/icons/TacticalIcons';
import MetricCorrelationCanvas from '../components/MetricCorrelationCanvas';
import CorrelationSideDeck from '../components/CorrelationSideDeck';
import PCAHoverHUD from '../components/PCAHoverHUD';
import { METRIC_DEFINITIONS, ANALYTICAL_PRESETS } from '../lib/metricConfigs';
import { fetchPlayers } from '../lib/api';
import { MOCK_PLAYERS } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import elevenLogo from '../assets/Eleven-logo-2.webp';

const LEAGUES = [
  { id: 'All Leagues', label: 'All Leagues' },
  { id: 'Premier League', label: 'Premier League' },
  { id: 'La Liga', label: 'La Liga' },
  { id: 'Bundesliga', label: 'Bundesliga' },
  { id: 'Serie A', label: 'Serie A' },
  { id: 'Ligue 1', label: 'Ligue 1' },
];

const POSITIONS = [
  { id: 'ALL', label: 'All' },
  { id: 'FW', label: 'FW' },
  { id: 'MF', label: 'MF' },
  { id: 'DF', label: 'DF' },
];

export default function PitchMapTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data & State
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Metric Dimensions
  const [xKey, setXKey] = useState('npxG_per90');
  const [yKey, setYKey] = useState('xAG_per90');
  const [activePresetId, setActivePresetId] = useState('threat_vs_creation');

  // Filters
  const [selectedLeague, setSelectedLeague] = useState('All Leagues');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [u21Only, setU21Only] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Spotlight & Selection
  const [search, setSearch] = useState('');
  const [spotlightId, setSpotlightId] = useState(searchParams.get('spotlight') || '');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // Hover HUD with graceful fade out timer
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const hoverLeaveTimerRef = useRef(null);

  const handleHoverPlayer = (player, pos) => {
    if (hoverLeaveTimerRef.current) {
      clearTimeout(hoverLeaveTimerRef.current);
      hoverLeaveTimerRef.current = null;
    }
    setHoveredPlayer(player);
    setHoverPos(pos);
  };

  const handleLeavePlayer = () => {
    if (hoverLeaveTimerRef.current) clearTimeout(hoverLeaveTimerRef.current);
    hoverLeaveTimerRef.current = setTimeout(() => {
      setHoveredPlayer(null);
      setHoverPos(null);
    }, 400);
  };

  // Tactical Nav Dropdown Menu State
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navTimerRef = useRef(null);

  const handleNavEnter = () => {
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    setNavMenuOpen(true);
  };

  const handleNavLeave = () => {
    navTimerRef.current = setTimeout(() => {
      setNavMenuOpen(false);
    }, 300);
  };

  // Fetch Players on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const { data, error } = await fetchPlayers({ limit: 2000 });
      if (!isMounted) return;

      if (!error && data && data.length > 0) {
        setAllPlayers(data);
      } else {
        setAllPlayers(MOCK_PLAYERS);
      }
      setLoading(false);
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Update spotlight in URL
  useEffect(() => {
    if (spotlightId) {
      setSearchParams({ spotlight: spotlightId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [spotlightId, setSearchParams]);

  // Autocomplete search
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allPlayers
      .filter((p) => p.player_name.toLowerCase().includes(q) || p.squad?.toLowerCase().includes(q))
      .slice(0, 6);
  }, [search, allPlayers]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Preset Switch
  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setXKey(preset.xKey);
    setYKey(preset.yKey);
  };

  // Filtered dataset
  const filteredPlayers = useMemo(() => {
    return allPlayers.filter((p) => {
      if (selectedLeague !== 'All Leagues' && !p.league?.toLowerCase().includes(selectedLeague.toLowerCase())) {
        return false;
      }
      if (selectedPosition !== 'ALL') {
        const group = (p.position_group || '').toLowerCase();
        const pos = (p.position || '').toLowerCase();

        if (selectedPosition === 'FW') {
          if (!group.includes('forward') && !pos.includes('fw')) return false;
        } else if (selectedPosition === 'MF') {
          if (!group.includes('midfield') && !pos.includes('mf')) return false;
        } else if (selectedPosition === 'DF') {
          if (!group.includes('defend') && !pos.includes('df')) return false;
        }
      }
      if (u21Only && Number(p.age || 99) > 21) {
        return false;
      }
      return true;
    });
  }, [allPlayers, selectedLeague, selectedPosition, u21Only]);

  const handleSelectNode = (player) => {
    setSpotlightId(player.player_id);
    setSelectedPlayer(player);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col p-3 sm:p-4 gap-2.5 bg-[#01080E] text-slate-100 select-none">
      
      {/* 1. TOP COMPACT COCKPIT BAR */}
      <header className="flex flex-wrap items-center justify-between gap-2 shrink-0 z-40">
        
        {/* Left: Floating Brand Back Pill with Hover Navigation Dropdown Menu */}
        <div
          className="relative z-50 shrink-0"
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
        >
          <div className="flex items-center gap-1.5">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-[#03151F]/90 hover:bg-[#03151F] border border-white/15 hover:border-[#38B6FF]/50 text-white shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-xl group/btn"
              title="Return to Overview"
            >
              <ArrowLeft className="w-4 h-4 text-[#38B6FF] group-hover/btn:-translate-x-0.5 transition-transform" />
              <img
                src={elevenLogo}
                alt="Eleven Logo"
                className="h-7 w-auto object-contain brightness-110 drop-shadow-[0_0_14px_rgba(255,78,50,0.35)]"
              />
              <span className="font-heading font-extrabold tracking-[0.22em] text-xs sm:text-sm text-white hidden sm:inline">
                ELEVEN
              </span>
              <span className="text-[9.5px] font-mono text-[#38B6FF] bg-[#38B6FF]/20 px-2 py-0.5 rounded-lg border border-[#38B6FF]/40 font-bold">
                METRIC STUDIO
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setNavMenuOpen((prev) => !prev)}
              className="p-2 rounded-2xl bg-[#03151F]/90 hover:bg-[#03151F] border border-white/15 hover:border-[#38B6FF]/50 text-white shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-xl"
              title="Toggle Tactical Navigation"
            >
              <ChevronDown className={`w-3.5 h-3.5 text-[#8FA3AD] transition-transform duration-300 ${navMenuOpen ? 'rotate-180 text-[#38B6FF]' : ''}`} />
            </button>
          </div>

          {/* Hover Menu */}
          <div
            className={`absolute top-full left-0 pt-2 w-60 transition-all duration-300 z-50 ${
              navMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="p-1.5 rounded-2xl bg-[#03151F]/98 backdrop-blur-2xl border border-white/15 shadow-2xl divide-y divide-white/[0.06] relative before:absolute before:-top-3 before:inset-x-0 before:h-4 before:content-['']">
              <div className="p-2 text-[10px] font-mono uppercase text-[#8FA3AD] tracking-widest font-bold">
                Tactical Navigation
              </div>
              <div className="flex flex-col gap-0.5 pt-1">
                {[
                  { path: '/', label: 'Overview Home', icon: PitchQuadrantIcon },
                  { path: '/explorer', label: 'Player Explorer', icon: WonderkidReticleIcon },
                  { path: '/compare', label: 'Compare Arena', icon: TacticalTwinsIcon },
                  { path: '/u21-scouting', label: 'U21 Tactical Scouting', icon: WonderkidReticleIcon },
                  { path: '/gmm-matrix', label: 'GMM Matrix', icon: GMMCurveIcon },
                  { path: '/scout-chat', label: 'AI Scout Intelligence', icon: TerminalPromptIcon },
                ].map((tab) => (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setNavMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors"
                  >
                    <tab.icon className="w-3.5 h-3.5 text-[#38B6FF]" />
                    <span>{tab.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Analytical Presets Chips */}
        <div className="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-[#03151F]/90 border border-white/15 shadow-xl shrink-0">
          {ANALYTICAL_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#38B6FF] to-[#0088CC] text-[#000C12] shadow-[0_0_12px_rgba(56,182,255,0.4)]'
                    : 'text-[#8FA3AD] hover:text-white'
                }`}
              >
                <span>{preset.short}</span>
              </button>
            );
          })}
        </div>

        {/* Center-Right: Gemini Glowing Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xs min-w-[180px]">
          <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_0_20px_rgba(56,182,255,0.15)] focus-within:shadow-[0_0_30px_rgba(56,182,255,0.35)] transition-shadow">
            <div
              className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg 240deg, #38B6FF 290deg, #FFB800 340deg, #38B6FF 360deg)',
              }}
            />
            <div className="relative bg-[#040E17]/95 rounded-2xl flex items-center px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#38B6FF] shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Spotlight player..."
                value={search}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full bg-transparent text-xs font-medium text-white placeholder-white/40 focus:outline-none"
              />
              {spotlightId && (
                <button
                  type="button"
                  onClick={() => {
                    setSpotlightId('');
                    setSelectedPlayer(null);
                  }}
                  className="text-[9.5px] font-mono text-[#FFB800] bg-[#FFB800]/15 hover:bg-[#FFB800]/25 px-1.5 py-0.5 rounded border border-[#FFB800]/30 shrink-0 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showSearchDropdown && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-2 inset-x-0 bg-[#000910]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.06]"
              >
                {searchResults.map((item) => (
                  <button
                    key={item.player_id}
                    type="button"
                    onClick={() => {
                      setSpotlightId(item.player_id);
                      setSelectedPlayer(item);
                      setSearch('');
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
                        <img src={getPlayerImage(item)} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#38B6FF] truncate">{item.player_name}</span>
                        <span className="text-[9.5px] text-[#8FA3AD] truncate">{item.squad} • {item.position_group}</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-mono text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded border border-[#38B6FF]/20">
                      Spotlight
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Clean Sleek Filter Deck & Metric Selectors */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
          
          {/* Custom X Axis Metric Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#03151F]/90 border border-white/15 text-xs font-mono">
            <span className="text-[#38B6FF] font-bold text-[10px]">X:</span>
            <select
              value={xKey}
              onChange={(e) => {
                setXKey(e.target.value);
                setActivePresetId('custom');
              }}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(METRIC_DEFINITIONS).map((m) => (
                <option key={m.key} value={m.key} className="bg-[#000910] text-white">
                  {m.short}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Y Axis Metric Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#03151F]/90 border border-white/15 text-xs font-mono">
            <span className="text-[#FFB800] font-bold text-[10px]">Y:</span>
            <select
              value={yKey}
              onChange={(e) => {
                setYKey(e.target.value);
                setActivePresetId('custom');
              }}
              className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(METRIC_DEFINITIONS).map((m) => (
                <option key={m.key} value={m.key} className="bg-[#000910] text-white">
                  {m.short}
                </option>
              ))}
            </select>
          </div>

          {/* League Filter */}
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-[#03151F]/90 border border-white/15 text-xs font-mono text-white focus:outline-none cursor-pointer hidden md:inline-block"
          >
            {LEAGUES.map((l) => (
              <option key={l.id} value={l.id} className="bg-[#000910] text-white">
                {l.label}
              </option>
            ))}
          </select>

          {/* Position Pills (All, FW, MF, DF) */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#03151F]/90 border border-white/15">
            {POSITIONS.map((p) => {
              const isSelected = selectedPosition === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPosition(p.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#38B6FF]/20 text-[#38B6FF] border border-[#38B6FF]/40 shadow-sm'
                      : 'text-[#8FA3AD] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* U21 Age Toggle */}
          <button
            type="button"
            onClick={() => setU21Only((v) => !v)}
            className={`px-2 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1 ${
              u21Only
                ? 'bg-[#FFB800]/20 text-[#FFD066] border-[#FFB800]/60 shadow-[0_0_10px_rgba(255,184,0,0.3)]'
                : 'bg-white/[0.04] text-[#8FA3AD] hover:text-white border-white/10'
            }`}
          >
            <WonderkidReticleIcon className="w-3 h-3 text-[#FFB800]" />
            <span>≤21</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN SPLIT ANALYTICAL WORKBENCH (Fluid Left Canvas + Collapsible Right Deck) */}
      <div className="flex-1 min-h-0 flex gap-3 overflow-hidden">
        
        {/* Left Column: Metric Correlation Scatter Canvas (Expands dynamically) */}
        <div className="flex-1 h-full min-h-0 min-w-0 relative flex flex-col justify-center">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-xs font-mono text-[#8FA3AD] gap-2 rounded-3xl bg-[#000810] border border-white/[0.08]">
              <div className="w-6 h-6 border-2 border-[#38B6FF] border-t-transparent rounded-full animate-spin" />
              <span>Calibrating 1,802 Player Performance Dimensions...</span>
            </div>
          ) : (
            <MetricCorrelationCanvas
              players={filteredPlayers}
              xKey={xKey}
              yKey={yKey}
              spotlightPlayerId={spotlightId}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded((v) => !v)}
              onHoverPlayer={handleHoverPlayer}
              onLeavePlayer={handleLeavePlayer}
              onSelectPlayer={handleSelectNode}
              className="w-full h-full"
            />
          )}

          {/* Hover HUD Tooltip */}
          <AnimatePresence>
            {hoveredPlayer && hoverPos && (
              <PCAHoverHUD
                player={hoveredPlayer}
                position={hoverPos}
                canvasRect={{ width: window.innerWidth, height: window.innerHeight }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Outlier Leaderboard & Player Dossier Deck (Collapsible to let graph expand) */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 310, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-[310px] 2xl:w-[340px] shrink-0 h-full min-h-0 hidden lg:block overflow-hidden"
            >
              <CorrelationSideDeck
                players={filteredPlayers}
                selectedPlayer={selectedPlayer}
                xKey={xKey}
                yKey={yKey}
                onSelectPlayer={handleSelectNode}
                onClearSelection={() => {
                  setSelectedPlayer(null);
                  setSpotlightId('');
                }}
                className="w-full h-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
