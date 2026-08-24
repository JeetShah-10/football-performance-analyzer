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
import GMMArchetypeCanvas from '../components/GMMArchetypeCanvas';
import GMMRosterDeck from '../components/GMMRosterDeck';
import { fetchClusters, fetchPlayers } from '../lib/api';
import { MOCK_PLAYERS, MOCK_CLUSTERS } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import { getClusterTheme } from '../lib/gmmUtils';
import elevenLogo from '../assets/Eleven-logo-2.webp';

const POSITIONS = [
  { id: 'Midfielder', label: 'Midfielders' },
  { id: 'Forward', label: 'Forwards' },
  { id: 'Defender', label: 'Defenders' },
];

export default function GMMTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [positionGroup, setPositionGroup] = useState(() => searchParams.get('pos') || 'Midfielder');
  const [clustersMap, setClustersMap] = useState({});
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClusterId, setSelectedClusterId] = useState(() => {
    const cParam = searchParams.get('cluster');
    return cParam ? Number(cParam) : null;
  });

  // Keep URL in sync
  useEffect(() => {
    const params = {};
    if (positionGroup) params.pos = positionGroup;
    if (selectedClusterId !== null && selectedClusterId !== undefined) params.cluster = selectedClusterId;
    setSearchParams(params, { replace: true });
  }, [positionGroup, selectedClusterId, setSearchParams]);

  // Spotlight & Selection
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

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

  // Load Clusters & Players
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [clustersRes, playersRes] = await Promise.all([
        fetchClusters(),
        fetchPlayers({ limit: 2000 }),
      ]);

      if (!isMounted) return;

      if (clustersRes.data && Object.keys(clustersRes.data).length > 0) {
        setClustersMap(clustersRes.data);
      } else {
        setClustersMap(MOCK_CLUSTERS);
      }
      if (playersRes.data && playersRes.data.length > 0) {
        setAllPlayers(playersRes.data);
      } else {
        setAllPlayers(MOCK_PLAYERS);
      }

      setLoading(false);
    }

    loadData();
    return () => { isMounted = false; };
  }, []);

  // Clusters for current position group
  const currentClusters = useMemo(() => {
    const list = clustersMap[positionGroup] || [];
    return list;
  }, [clustersMap, positionGroup]);

  // Set default selected cluster when position group changes
  useEffect(() => {
    if (currentClusters.length > 0) {
      setSelectedClusterId(currentClusters[0].cluster_id);
    }
  }, [currentClusters, positionGroup]);

  // Selected Cluster Object
  const selectedCluster = useMemo(() => {
    if (!currentClusters.length) return null;
    return currentClusters.find((c) => c.cluster_id === selectedClusterId) || currentClusters[0];
  }, [currentClusters, selectedClusterId]);

  // Position-filtered players
  const positionPlayers = useMemo(() => {
    return allPlayers.filter((p) => {
      const g = (p.position_group || '').toLowerCase();
      return g.includes(positionGroup.toLowerCase());
    });
  }, [allPlayers, positionGroup]);

  // Players belonging to the active cluster
  const clusterPlayers = useMemo(() => {
    if (!selectedCluster) return [];
    return positionPlayers.filter((p) => p.cluster_name === selectedCluster.cluster_name);
  }, [positionPlayers, selectedCluster]);

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
              <span className="text-[9.5px] font-mono text-[#A855F7] bg-[#A855F7]/20 px-2 py-0.5 rounded-lg border border-[#A855F7]/40 font-bold">
                GMM MATRIX
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
                  { path: '/pitch-map', label: 'Metric Studio', icon: PitchQuadrantIcon },
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

        {/* Center: Position Group Switcher Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#03151F]/90 border border-white/15 shadow-xl shrink-0">
          {POSITIONS.map((pos) => {
            const isSelected = positionGroup === pos.id;
            return (
              <button
                key={pos.id}
                type="button"
                onClick={() => {
                  setPositionGroup(pos.id);
                  setSelectedPlayer(null);
                }}
                className={`px-3.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#38B6FF] to-[#0088CC] text-[#000C12] shadow-[0_0_12px_rgba(56,182,255,0.4)]'
                    : 'text-[#8FA3AD] hover:text-white'
                }`}
              >
                <span>{pos.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center-Right: Glowing Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xs min-w-[180px]">
          <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.15)] focus-within:shadow-[0_0_30px_rgba(168,85,247,0.35)] transition-shadow">
            <div
              className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg 240deg, #A855F7 290deg, #38B6FF 340deg, #A855F7 360deg)',
              }}
            />
            <div className="relative bg-[#040E17]/95 rounded-2xl flex items-center px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#A855F7] shrink-0 mr-2" />
              <input
                type="text"
                placeholder="Inspect player GMM probabilities..."
                value={search}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className="w-full bg-transparent text-xs font-medium text-white placeholder-white/40 focus:outline-none"
              />
              {selectedPlayer && (
                <button
                  type="button"
                  onClick={() => setSelectedPlayer(null)}
                  className="text-[9.5px] font-mono text-[#A855F7] bg-[#A855F7]/15 hover:bg-[#A855F7]/25 px-1.5 py-0.5 rounded border border-[#A855F7]/30 shrink-0 cursor-pointer"
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
                    <span className="text-[9.5px] font-mono text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/20">
                      Inspect
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Archetype Selector Chips */}
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-full">
          {currentClusters.map((cluster) => {
            const isSelected = selectedCluster?.cluster_id === cluster.cluster_id;
            const theme = getClusterTheme(cluster.cluster_name);

            return (
              <button
                key={cluster.cluster_id}
                type="button"
                onClick={() => {
                  setSelectedClusterId(cluster.cluster_id);
                  setSelectedPlayer(null);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? 'shadow-md'
                    : 'bg-[#03151F]/90 text-[#8FA3AD] hover:text-white border-white/10'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.bg : undefined,
                  borderColor: isSelected ? theme.border : undefined,
                  color: isSelected ? theme.color : undefined,
                  boxShadow: isSelected ? `0 0 12px ${theme.glow}` : undefined,
                }}
              >
                <GMMCurveIcon className="w-3 h-3" />
                <span>{cluster.cluster_name.split('/')[0].trim()}</span>
              </button>
            );
          })}
        </div>

      </header>

      {/* 2. MAIN SPLIT ANALYTICAL WORKBENCH */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        
        {/* Left Column (7 cols / ~60%): Archetype DNA, z-Score Matrix & Gaussian Curves */}
        <div className="lg:col-span-7 xl:col-span-8 h-full min-h-0">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-xs font-mono text-[#8FA3AD] gap-2 rounded-3xl bg-[#000810] border border-white/[0.08]">
              <div className="w-6 h-6 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
              <span>Calibrating Gaussian Mixture Models across 1,802 players...</span>
            </div>
          ) : (
            <GMMArchetypeCanvas
              selectedCluster={selectedCluster}
              clusterPlayers={clusterPlayers}
              positionPlayers={positionPlayers}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Right Column (5 cols / ~40%): Roster Scanner & Chameleon Explorer Deck */}
        <div className="lg:col-span-5 xl:col-span-4 h-full min-h-0">
          <GMMRosterDeck
            players={positionPlayers}
            selectedClusterName={selectedCluster?.cluster_name || ''}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={(p) => setSelectedPlayer(p)}
            onClearSelection={() => setSelectedPlayer(null)}
            className="w-full h-full"
          />
        </div>

      </div>

    </div>
  );
}
