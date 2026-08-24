import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import {
  GoalVectorIcon,
  PitchProgressionIcon,
  DefensiveBarrierIcon,
  RadarFootprintIcon,
  GMMCurveIcon,
  TacticalTwinsIcon,
  WonderkidReticleIcon,
  TerminalPromptIcon,
  PitchQuadrantIcon,
} from '../components/icons/TacticalIcons';
import { fetchPlayers, fetchPlayerDetail, fetchSimilar } from '../lib/api';
import { MOCK_PLAYERS, MOCK_PLAYER_DETAILS, MOCK_SIMILAR_U21 } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { formatLeagueName } from '../components/LeagueLogo';
import PositionBadge from '../components/PositionBadge';
import ClusterTag from '../components/ClusterTag';
import RadarChart, { RadarGrid, RadarLabels, RadarArea } from '../components/RadarChart';
import elevenLogo from '../assets/Eleven-logo-2.webp';

const RADAR_METRICS = [
  { key: 'npxG_per90', label: 'Goal Threat', short: 'Goal Threat', icon: GoalVectorIcon },
  { key: 'xAG_per90', label: 'Assist Creation', short: 'Assists', icon: PitchProgressionIcon },
  { key: 'KP_per90', label: 'Chances Created', short: 'Chances', icon: PitchProgressionIcon },
  { key: 'PrgP_per90', label: 'Pass Progression', short: 'Pass Prog', icon: PitchProgressionIcon },
  { key: 'PrgC_per90', label: 'Ball Progression', short: 'Carries', icon: PitchProgressionIcon },
  { key: 'Succ_per90', label: 'Dribble Take-Ons', short: 'Take-Ons', icon: GoalVectorIcon },
  { key: 'Tkl_per90', label: 'Defensive Tackles', short: 'Tackles', icon: DefensiveBarrierIcon },
  { key: 'Int_per90', label: 'Pass Interceptions', short: 'Intercepts', icon: DefensiveBarrierIcon },
];

const VETERAN_QUICK_PICKS = [
  { id: 'mohamed_salah_eg_egy_1992_0', name: 'M. Salah', squad: 'Liverpool' },
  { id: 'kevin_de_bruyne_be_bel_1991_0', name: 'K. De Bruyne', squad: 'Man City' },
  { id: 'virgil_van_dijk_nl_ned_1991_0', name: 'V. van Dijk', squad: 'Liverpool' },
  { id: 'bukayo_saka_eng_eng_2001_0', name: 'B. Saka', squad: 'Arsenal' },
  { id: 'harry_kane_eng_eng_1993_0', name: 'H. Kane', squad: 'Bayern Munich' },
  { id: 'erling_haaland_no_nor_2000_0', name: 'E. Haaland', squad: 'Man City' },
];

export default function U21ScoutingTab() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTarget = () => {
    const fromUrl = searchParams.get('target');
    if (fromUrl) return fromUrl;
    try {
      const fromSession = sessionStorage.getItem('u21_target_id');
      if (fromSession) return fromSession;
    } catch {}
    return 'mohamed_salah_eg_egy_1992_0'; // Default to Salah for instant immersion
  };

  const getInitialProspect = () => {
    const fromUrl = searchParams.get('prospect');
    if (fromUrl) return fromUrl;
    try {
      const fromSession = sessionStorage.getItem('u21_prospect_id');
      if (fromSession) return fromSession;
    } catch {}
    return '';
  };

  const [targetId, setTargetId] = useState(getInitialTarget);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [targetStats, setTargetStats] = useState(null);

  const [u21Matches, setU21Matches] = useState([]);
  const [selectedProspectId, setSelectedProspectId] = useState(getInitialProspect);
  const [prospectPlayer, setProspectPlayer] = useState(null);
  const [prospectStats, setProspectStats] = useState(null);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Tactical Nav Dropdown Menu State & Hover Timer
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

  // Sync state to URL and session
  useEffect(() => {
    const params = {};
    if (targetId) {
      params.target = targetId;
      try { sessionStorage.setItem('u21_target_id', targetId); } catch {}
    } else {
      try { sessionStorage.removeItem('u21_target_id'); } catch {}
    }

    if (selectedProspectId) {
      params.prospect = selectedProspectId;
      try { sessionStorage.setItem('u21_prospect_id', selectedProspectId); } catch {}
    } else {
      try { sessionStorage.removeItem('u21_prospect_id'); } catch {}
    }

    setSearchParams(params, { replace: true });
  }, [targetId, selectedProspectId, setSearchParams]);

  // Load Target Player details
  useEffect(() => {
    let isMounted = true;
    async function loadTarget() {
      if (!targetId) {
        setTargetPlayer(null);
        setTargetStats(null);
        setU21Matches([]);
        setSelectedProspectId('');
        setProspectPlayer(null);
        setProspectStats(null);
        return;
      }

      setLoadingMatches(true);
      const { data, error } = await fetchPlayerDetail(targetId);
      if (!isMounted) return;

      if (!error && data) {
        setTargetPlayer(data);
        setTargetStats(data.stats || {});
      } else {
        const fallback = MOCK_PLAYER_DETAILS[targetId] || MOCK_PLAYERS.find((p) => p.player_id === targetId);
        setTargetPlayer(fallback || null);
        setTargetStats(fallback?.stats || {});
      }

      // Fetch U21 Matches
      const simRes = await fetchSimilar(targetId, 6, true);
      if (!isMounted) return;

      if (!simRes.error && simRes.data && simRes.data.length > 0) {
        setU21Matches(simRes.data);
        setSelectedProspectId((prev) =>
          !prev || !simRes.data.some((m) => m.player_id === prev)
            ? simRes.data[0].player_id
            : prev
        );
      } else {
        setU21Matches(MOCK_SIMILAR_U21);
        if (MOCK_SIMILAR_U21.length > 0) {
          setSelectedProspectId((prev) => prev || MOCK_SIMILAR_U21[0].player_id);
        }
      }
      setLoadingMatches(false);
    }

    loadTarget();
    return () => { isMounted = false; };
  }, [targetId]);

  // Load Selected Prospect details
  useEffect(() => {
    let isMounted = true;
    async function loadProspect() {
      if (!selectedProspectId) {
        setProspectPlayer(null);
        setProspectStats(null);
        return;
      }

      const { data, error } = await fetchPlayerDetail(selectedProspectId);
      if (!isMounted) return;

      if (!error && data) {
        setProspectPlayer(data);
        setProspectStats(data.stats || {});
      } else {
        const fallback = MOCK_PLAYER_DETAILS[selectedProspectId] || MOCK_PLAYERS.find((p) => p.player_id === selectedProspectId);
        setProspectPlayer(fallback || null);
        setProspectStats(fallback?.stats || {});
      }
    }

    loadProspect();
    return () => { isMounted = false; };
  }, [selectedProspectId]);

  // Search autocomplete for Target Selector
  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const { data, error } = await fetchPlayers({ search: search.trim(), limit: 6 });
      if (!error && data && data.length > 0) {
        setResults(data);
      } else {
        const filtered = MOCK_PLAYERS.filter((p) =>
          p.player_name.toLowerCase().includes(search.toLowerCase())
        );
        setResults(filtered.slice(0, 6));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Tactical Similarity %
  const activeMatchScore = useMemo(() => {
    if (!u21Matches.length || !selectedProspectId) return null;
    const match = u21Matches.find((m) => m.player_id === selectedProspectId);
    return match ? match.similarity_score : null;
  }, [u21Matches, selectedProspectId]);

  // Radar Data for BKLit Dual RadarChart
  const radarData = useMemo(() => {
    const list = [];
    if (targetPlayer) {
      list.push({
        label: targetPlayer.player_name,
        values: RADAR_METRICS.map((m) => targetStats?.[m.key]?.percentile ?? 50),
        color: '#FFB800',
      });
    }
    if (prospectPlayer) {
      list.push({
        label: prospectPlayer.player_name,
        values: RADAR_METRICS.map((m) => prospectStats?.[m.key]?.percentile ?? 50),
        color: '#38B6FF',
      });
    }
    return list;
  }, [targetPlayer, prospectPlayer, targetStats, prospectStats]);

  const targetImg = targetPlayer ? getPlayerImage(targetPlayer) : null;
  const prospectImg = prospectPlayer ? getPlayerImage(prospectPlayer) : null;

  // Automated Technical Scouting Appraisal Generator
  const scoutingAppraisal = useMemo(() => {
    if (!targetPlayer || !prospectPlayer || !targetStats || !prospectStats) return null;

    const highProspectMetrics = RADAR_METRICS.filter((m) => {
      const pVal = prospectStats[m.key]?.value ?? 0;
      const tVal = targetStats[m.key]?.value ?? 0;
      return pVal >= tVal * 0.88;
    });

    const leadMetric = RADAR_METRICS.reduce(
      (best, m) => {
        const pVal = prospectStats[m.key]?.value ?? 0;
        const tVal = targetStats[m.key]?.value ?? 0;
        const diff = tVal > 0 ? (pVal - tVal) / tVal : 0;
        return diff > best.diff ? { metric: m.label, diff } : best;
      },
      { metric: '', diff: -999 }
    );

    return {
      matchCount: highProspectMetrics.length,
      leadMetric: leadMetric.diff > 0.05 ? leadMetric.metric : null,
      leadPct: Math.round(leadMetric.diff * 100),
    };
  }, [targetPlayer, prospectPlayer, targetStats, prospectStats]);

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col p-3 sm:p-4 gap-2.5 bg-[#01080E] text-slate-100 select-none">
      
      {/* 1. TOP COMPACT HEADER BAR (Floating Back Pill + Gemini Glowing Search Bar + Quick Chips) */}
      <header className="flex flex-wrap items-center justify-between gap-2.5 shrink-0 z-40">
        
        {/* Left: Floating Back Pill with Hover Navigation Dropdown Menu */}
        <div
          className="relative z-50"
          onMouseEnter={handleNavEnter}
          onMouseLeave={handleNavLeave}
        >
          <div className="flex items-center gap-1.5">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#03151F]/90 hover:bg-[#03151F] border border-white/15 hover:border-[#38B6FF]/50 text-white shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-xl group/btn"
              title="Return to Overview"
            >
              <ArrowLeft className="w-4 h-4 text-[#38B6FF] group-hover/btn:-translate-x-0.5 transition-transform" />
              <img
                src={elevenLogo}
                alt="Eleven Logo"
                className="h-8 sm:h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_14px_rgba(255,78,50,0.35)]"
              />
              <span className="font-heading font-extrabold tracking-[0.22em] text-sm sm:text-base text-white hidden sm:inline">
                ELEVEN
              </span>
              <span className="text-[10.5px] font-mono text-[#FFB800] bg-[#FFB800]/20 px-2 py-0.5 rounded-lg border border-[#FFB800]/40 font-bold">
                U21 SCOUT
              </span>
            </Link>

            {/* Dropdown Trigger Chevron Button */}
            <button
              type="button"
              onClick={() => setNavMenuOpen((prev) => !prev)}
              className="p-2.5 rounded-2xl bg-[#03151F]/90 hover:bg-[#03151F] border border-white/15 hover:border-[#38B6FF]/50 text-white shadow-xl transition-all active:scale-95 cursor-pointer backdrop-blur-xl"
              title="Toggle Tactical Navigation"
            >
              <ChevronDown className={`w-4 h-4 text-[#8FA3AD] transition-transform duration-300 ${navMenuOpen ? 'rotate-180 text-[#38B6FF]' : ''}`} />
            </button>
          </div>

          {/* Sleek Obsidian Glass Hover Menu with Invisible Hover Bridge */}
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
                  { path: '/pitch-map', label: 'Tactical Pitch Map', icon: PitchQuadrantIcon },
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

        {/* Center / Right: Gemini Glowing Rotating Border Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-xl min-w-[260px]">
          
          {/* Gemini Spinning Glowing Border Beam Container */}
          <div className="relative rounded-2xl p-[1.5px] overflow-hidden group shadow-[0_0_20px_rgba(56,182,255,0.15)] focus-within:shadow-[0_0_30px_rgba(56,182,255,0.35)] transition-shadow">
            
            {/* Rotating Conic Neon Light Beam */}
            <div
              className="absolute -inset-[150%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg 240deg, #38B6FF 290deg, #FFB800 340deg, #38B6FF 360deg)',
              }}
            />

            {/* Inner Input Box */}
            <div className="relative bg-[#040E17]/95 rounded-2xl flex items-center px-3.5 py-1.5">
              <Search className="w-4 h-4 text-[#38B6FF] shrink-0 mr-2" />
              <input
                type="text"
                placeholder={
                  targetPlayer
                    ? `Target: ${targetPlayer.player_name} (Search new benchmark...)`
                    : 'Search established star to find U21 successors (e.g. Salah, De Bruyne)...'
                }
                value={search}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-[#8FA3AD] bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/10 hidden sm:inline shrink-0">
                ≤21 Age
              </span>
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-2 inset-x-0 bg-[#000910]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.06]"
              >
                {results.map((item) => (
                  <button
                    key={item.player_id || item.id}
                    onClick={() => {
                      setTargetId(item.player_id || item.id);
                      setSearch('');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
                        <img src={getPlayerImage(item)} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#FFB800] truncate">{item.player_name}</span>
                        <span className="text-[10px] text-[#8FA3AD] truncate">{item.squad} • {item.position_group}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded-lg border border-[#FFB800]/20">
                        Set Target
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8FA3AD] group-hover:text-[#FFB800] transition-colors" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Pick Veteran Star Chips */}
        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          {VETERAN_QUICK_PICKS.map((star) => (
            <button
              key={star.id}
              onClick={() => setTargetId(star.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all cursor-pointer border ${
                targetId === star.id
                  ? 'bg-[#FFB800]/20 text-[#FFD066] border-[#FFB800]/60 shadow-[0_0_10px_rgba(255,184,0,0.3)]'
                  : 'bg-white/[0.04] text-white hover:bg-[#FFB800]/10 border-white/10 hover:border-[#FFB800]/30'
              }`}
            >
              {star.name}
            </button>
          ))}
        </div>

      </header>

      {/* 2. MAIN 3-ZONE BENTO COCKPIT WORKSPACE (Zero-Scroll 100dvh Fit) */}
      {targetPlayer ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          
          {/* LEFT ZONE: Target Benchmark Card + Ranked U21 Tactical Twins (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 min-h-0">
            
            {/* Compact Target Benchmark Card */}
            <div className="rounded-2xl p-3.5 bg-[#03151F]/95 backdrop-blur-2xl border border-[#FFB800]/30 shadow-xl flex flex-col justify-between relative overflow-hidden shrink-0">
              <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-[#FFB800]/12 blur-2xl pointer-events-none" />

              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFD066] font-mono text-[10.5px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <WonderkidReticleIcon className="w-3.5 h-3.5 text-[#FFB800]" /> Target Star
                  </span>
                  <div className="p-1.5 rounded-xl bg-[#000910]/90 border border-white/10 shadow-md">
                    <LeagueLogo leagueName={targetPlayer.league} size="md" />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 my-0.5">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#000C12] border-2 border-[#FFB800]/60 overflow-hidden shrink-0 shadow-[0_0_20px_rgba(255,184,0,0.35)]">
                    <img src={targetImg} alt={targetPlayer.player_name} className="w-full h-full object-cover object-top scale-105" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link to={`/player/${targetPlayer.player_id}`} className="text-base sm:text-lg font-black text-white font-heading hover:text-[#FFB800] truncate transition-colors leading-tight">
                      {targetPlayer.player_name}
                    </Link>
                    <span className="text-xs text-[#8FA3AD] font-semibold truncate mt-0.5">{targetPlayer.squad}</span>
                    <span className="text-[10px] text-[#5A7280] font-mono mt-0.5">{formatLeagueName(targetPlayer.league)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <PositionBadge positionGroup={targetPlayer.position_group} />
                    <span className="px-1.5 py-0.5 rounded bg-[#000407]/90 border border-white/10 text-[9.5px] font-mono text-[#8FA3AD]">
                      Age {targetPlayer.age || '—'}
                    </span>
                  </div>
                  <ClusterTag clusterName={targetPlayer.cluster_name} />
                </div>
              </div>
            </div>

            {/* Ranked U21 Tactical Twins List (Scrollable inside container) */}
            <div className="rounded-2xl p-3.5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl flex flex-col flex-1 min-h-0 gap-2">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] shrink-0">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TacticalTwinsIcon className="w-3.5 h-3.5 text-[#38B6FF]" /> Ranked U21 Matches
                </span>
                <span className="text-[9.5px] font-mono text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded-lg border border-[#38B6FF]/20">
                  {u21Matches.length} Prospects
                </span>
              </div>

              {loadingMatches ? (
                <div className="flex flex-col items-center justify-center p-6 text-xs font-mono text-[#8FA3AD] gap-2 flex-1">
                  <div className="w-5 h-5 border-2 border-[#38B6FF] border-t-transparent rounded-full animate-spin" />
                  <span>Computing 8D Tactical Twins...</span>
                </div>
              ) : u21Matches.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-[#8FA3AD] flex-1 flex items-center justify-center">
                  No U21 matches found for this tactical profile.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0 custom-scrollbar pr-1">
                  {u21Matches.map((prospect, idx) => {
                    const isSelected = selectedProspectId === prospect.player_id;
                    const pImg = getPlayerImage(prospect);

                    return (
                      <button
                        key={prospect.player_id || idx}
                        onClick={() => setSelectedProspectId(prospect.player_id)}
                        className={`w-full p-2.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer group ${
                          isSelected
                            ? 'bg-[#38B6FF]/15 border-[#38B6FF]/60 shadow-[0_0_12px_rgba(56,182,255,0.2)]'
                            : 'bg-[#000910]/70 hover:bg-[#000910] border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#000C12] border border-[#38B6FF]/40 overflow-hidden shrink-0 shadow-[0_0_12px_rgba(56,182,255,0.2)]">
                            <img src={pImg} alt={prospect.player_name} className="w-full h-full object-cover object-top scale-105" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-[#38B6FF]' : 'text-white group-hover:text-[#38B6FF]'}`}>
                              {prospect.player_name}
                            </span>
                            <span className="text-[10px] text-[#8FA3AD] truncate mt-0.5">
                              {prospect.squad} • {prospect.position_group}
                            </span>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-mono font-extrabold text-[#38B6FF]">
                              {prospect.similarity_score?.toFixed(1)}%
                            </span>
                            <span className="text-[8.5px] font-mono text-[#5A7280] uppercase">Match</span>
                          </div>
                          <div className="p-1 rounded-lg bg-[#000910]/90 border border-white/10 shadow-sm shrink-0">
                            <LeagueLogo leagueName={prospect.league} size="sm" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT MAIN STUDIO: Dual Radar Showdown + Technical Appraisal + Delta Strip (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-2.5 min-h-0 justify-between">
            
            {/* Top Studio Bento: Dual Radar & Active Prospect Dossier Header */}
            <div className="rounded-2xl p-3.5 sm:p-4 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col gap-2.5 relative overflow-hidden flex-1 min-h-0 justify-between">
              
              {/* Studio Header & Cosine DNA Similarity Overlap Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.06] relative z-10 shrink-0">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {targetImg && (
                      <div className="w-7 h-7 rounded-full bg-[#000C12] border-2 border-[#FFB800]/80 overflow-hidden shrink-0 shadow-[0_0_8px_rgba(255,184,0,0.5)]">
                        <img src={targetImg} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                    )}
                    <span className="text-white font-bold truncate max-w-[120px]">{targetPlayer.player_name}</span>
                  </div>
                  <span className="text-[#5A7280]">vs</span>
                  <div className="flex items-center gap-2">
                    {prospectImg && (
                      <div className="w-7 h-7 rounded-full bg-[#000C12] border-2 border-[#38B6FF]/80 overflow-hidden shrink-0 shadow-[0_0_8px_rgba(56,182,255,0.5)]">
                        <img src={prospectImg} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                    )}
                    <span className="text-white font-bold truncate max-w-[120px]">
                      {prospectPlayer ? prospectPlayer.player_name : 'Selected Prospect'}
                    </span>
                  </div>
                </div>

                {activeMatchScore && (
                  <div className="px-3 py-1 rounded-xl bg-[#38B6FF]/15 border border-[#38B6FF]/40 text-xs font-mono font-bold text-[#68C5F2] flex items-center gap-1.5 shadow-[0_0_10px_rgba(56,182,255,0.2)]">
                    <RadarFootprintIcon className="w-3.5 h-3.5 text-[#38B6FF]" />
                    <span className="text-[10px] text-white/70">8D Tactical Overlap:</span>
                    <span className="text-white font-extrabold">{activeMatchScore.toFixed(1)}%</span>
                  </div>
                )}
              </div>

              {/* Center Backlit Studio Radar (BKLit Graph) */}
              <div className="w-full max-w-[340px] aspect-square flex items-center justify-center mx-auto my-auto relative z-10 shrink-1 min-h-0">
                <RadarChart
                  data={radarData}
                  levels={3}
                  metrics={RADAR_METRICS}
                  size={250}
                  className="w-full h-full"
                >
                  <RadarGrid showLabels={false} />
                  <RadarLabels />
                  {radarData.map((item, i) => (
                    <RadarArea index={i} key={item.label} showPoints={false} />
                  ))}
                </RadarChart>
              </div>

              {/* Automated Technical Appraisal Card */}
              {prospectPlayer && scoutingAppraisal && (
                <div className="p-3 rounded-xl bg-[#000910]/85 border border-white/10 flex flex-col gap-1 shadow-inner shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#38B6FF] flex items-center gap-1.5">
                      <TerminalPromptIcon className="w-3.5 h-3.5 text-[#38B6FF]" /> Automated Tactical Verdict
                    </span>
                    <span className="text-[9.5px] font-mono text-[#8FA3AD]">
                      Age {prospectPlayer.age} • {prospectPlayer.position_group}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-white leading-relaxed">
                    <strong className="text-[#38B6FF]">{prospectPlayer.player_name}</strong> replicates{' '}
                    <strong>{scoutingAppraisal.matchCount} of 8 core technical dimensions</strong> of{' '}
                    <strong className="text-[#FFB800]">{targetPlayer.player_name}</strong>.
                    {scoutingAppraisal.leadMetric && (
                      <span>
                        {' '}Holds statistical output lead in <strong>{scoutingAppraisal.leadMetric}</strong> (+{scoutingAppraisal.leadPct}% volume advantage).
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* 8-Metric Horizontal Delta Strip with Micro Icons */}
            <div className="rounded-2xl p-2.5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl overflow-x-auto shrink-0">
              <div className="flex items-center justify-between gap-2 min-w-[700px] font-mono text-xs">
                {RADAR_METRICS.map((m) => {
                  const valT = targetStats?.[m.key]?.value ?? null;
                  const valP = prospectStats?.[m.key]?.value ?? null;
                  const hasBoth = valT !== null && valP !== null;
                  const isTie = hasBoth && valT === valP;
                  const targetWins = hasBoth && valT > valP;
                  const IconComp = m.icon;

                  let leadPct = 0;
                  if (hasBoth && !isTie) {
                    const higher = Math.max(valT, valP);
                    const lower = Math.min(valT, valP);
                    leadPct = lower > 0 ? Math.round(((higher - lower) / lower) * 100) : (higher > 0 ? 100 : 0);
                  }

                  return (
                    <div key={m.key} className="flex-1 p-2 rounded-xl bg-[#000407]/90 border border-white/[0.06] flex flex-col items-center gap-1 shadow-inner">
                      <div className="flex items-center gap-1 text-[9px] text-[#8FA3AD] font-extrabold uppercase tracking-wider">
                        <IconComp className="w-2.5 h-2.5 text-[#38B6FF]" />
                        <span>{m.short}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-white font-bold">{valT !== null ? valT.toFixed(2) : '—'}</span>
                        <span className="text-[9px] text-[#5A7280]">vs</span>
                        <span className="text-white font-bold">{valP !== null ? valP.toFixed(2) : '—'}</span>
                      </div>
                      {hasBoth ? (
                        isTie ? (
                          <span className="text-[9px] text-[#5A7280] font-bold">Tied</span>
                        ) : targetWins ? (
                          <span className="text-[9px] font-bold text-[#FFB800] bg-[#FFB800]/15 px-1.5 py-0.5 rounded border border-[#FFB800]/30">
                            +{leadPct}%
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-[#38B6FF] bg-[#38B6FF]/15 px-1.5 py-0.5 rounded border border-[#38B6FF]/30">
                            +{leadPct}%
                          </span>
                        )
                      ) : (
                        <span className="text-[9px] text-[#5A7280] font-mono">—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Executive CTAs */}
            {prospectPlayer && (
              <div className="flex items-center justify-end gap-2.5 pt-0.5 shrink-0">
                <Link
                  to={`/player/${prospectPlayer.player_id}`}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>📄 Full Prospect Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/compare?p1=${targetPlayer.player_id}&p2=${prospectPlayer.player_id}`}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#38B6FF] hover:opacity-90 text-[#000C12] font-mono font-bold text-xs transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,182,255,0.3)] active:scale-95 cursor-pointer"
                >
                  <span>⚔ Head-to-Head Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* STANDBY CANVAS: When no target is selected yet */
        <div className="flex-1 rounded-2xl p-8 bg-[#03151F]/90 backdrop-blur-2xl border border-dashed border-white/15 flex flex-col items-center justify-center text-center gap-3 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
            <WonderkidReticleIcon className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h2 className="text-base font-extrabold text-white font-heading">
              Select a Target Benchmark Star
            </h2>
            <p className="text-xs text-[#8FA3AD] leading-relaxed font-sans">
              Choose an established star from Europe’s Big-5 leagues using the glowing search bar above or one of the quick picks to uncover under-21 tactical successors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg mt-1">
            {VETERAN_QUICK_PICKS.map((star) => (
              <button
                key={star.id}
                onClick={() => setTargetId(star.id)}
                className="p-2.5 rounded-xl bg-[#000910]/80 hover:bg-[#FFB800]/15 border border-white/10 hover:border-[#FFB800]/40 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#FFB800] truncate">{star.name}</div>
                <div className="text-[9.5px] text-[#8FA3AD]">{star.squad}</div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
