import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { fetchPlayers, fetchPlayerDetail, fetchSimilar } from '../lib/api';
import { MOCK_PLAYERS, MOCK_PLAYER_DETAILS, MOCK_SIMILAR_U21 } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { formatLeagueName } from '../components/LeagueLogo';
import PositionBadge from '../components/PositionBadge';
import ClusterTag from '../components/ClusterTag';
import ShimmeringText from '../components/ui/shimmering-text';

const RADAR_METRICS = [
  { key: 'npxG_per90', label: 'Goal Threat', short: 'Goal Threat' },
  { key: 'xAG_per90', label: 'Assist Creation', short: 'Assists' },
  { key: 'KP_per90', label: 'Chances Created', short: 'Chances' },
  { key: 'PrgP_per90', label: 'Pass Progression', short: 'Pass Prog' },
  { key: 'PrgC_per90', label: 'Ball Progression', short: 'Carries' },
  { key: 'Succ_per90', label: 'Dribble Take-Ons', short: 'Take-Ons' },
  { key: 'Tkl_per90', label: 'Defensive Tackles', short: 'Tackles' },
  { key: 'Int_per90', label: 'Pass Interceptions', short: 'Intercepts' },
];

const VETERAN_QUICK_PICKS = [
  { id: 'mohamed_salah_eg_eng_1992_0', name: 'M. Salah', squad: 'Liverpool' },
  { id: 'kevin_de_bruyne_be_eng_1991_0', name: 'K. De Bruyne', squad: 'Man City' },
  { id: 'virgil_van_dijk_nl_eng_1991_0', name: 'V. van Dijk', squad: 'Liverpool' },
  { id: 'bukayo_saka_eng_eng_2001_0', name: 'B. Saka', squad: 'Arsenal' },
  { id: 'rodrigo_hernandez_cascante_esp_eng_1996_0', name: 'Rodri', squad: 'Man City' },
  { id: 'harry_kane_eng_ger_1993_0', name: 'H. Kane', squad: 'Bayern Munich' },
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
    return '';
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
        const fallback = MOCK_PLAYER_DETAILS[targetId] || MOCK_PLAYERS.find(p => p.player_id === targetId);
        setTargetPlayer(fallback || null);
        setTargetStats(fallback?.stats || {});
      }

      // Fetch U21 Matches
      const simRes = await fetchSimilar(targetId, 6, true);
      if (!isMounted) return;

      if (!simRes.error && simRes.data && simRes.data.length > 0) {
        setU21Matches(simRes.data);
        // Auto-select first match if none chosen or previous not in results
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
        const fallback = MOCK_PLAYER_DETAILS[selectedProspectId] || MOCK_PLAYERS.find(p => p.player_id === selectedProspectId);
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
        const filtered = MOCK_PLAYERS.filter(p =>
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
    const match = u21Matches.find(m => m.player_id === selectedProspectId);
    return match ? match.similarity_score : null;
  }, [u21Matches, selectedProspectId]);

  // Radar Chart Math
  const size = 380;
  const center = size / 2;
  const radius = 118;
  const numAxes = RADAR_METRICS.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const pointsTarget = RADAR_METRICS.map((m, idx) => {
    const pct = targetStats?.[m.key]?.percentile ?? 0;
    const r = targetPlayer ? Math.max(0.12, Math.min(1.0, pct / 100)) * radius : 0;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), pct, label: m.label };
  });

  const pointsProspect = RADAR_METRICS.map((m, idx) => {
    const pct = prospectStats?.[m.key]?.percentile ?? 0;
    const r = prospectPlayer ? Math.max(0.12, Math.min(1.0, pct / 100)) * radius : 0;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), pct, label: m.label };
  });

  const polyTarget = targetPlayer
    ? pointsTarget.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    : null;

  const polyProspect = prospectPlayer
    ? pointsProspect.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
    : null;

  const targetImg = targetPlayer ? getPlayerImage(targetPlayer) : null;
  const prospectImg = prospectPlayer ? getPlayerImage(prospectPlayer) : null;

  // Automated Technical Scouting Appraisal Generator
  const scoutingAppraisal = useMemo(() => {
    if (!targetPlayer || !prospectPlayer || !targetStats || !prospectStats) return null;

    const highProspectMetrics = RADAR_METRICS.filter(m => {
      const pVal = prospectStats[m.key]?.value ?? 0;
      const tVal = targetStats[m.key]?.value ?? 0;
      return pVal >= tVal * 0.9;
    });

    const leadMetric = RADAR_METRICS.reduce((best, m) => {
      const pVal = prospectStats[m.key]?.value ?? 0;
      const tVal = targetStats[m.key]?.value ?? 0;
      const diff = tVal > 0 ? (pVal - tVal) / tVal : 0;
      return diff > best.diff ? { metric: m.label, diff } : best;
    }, { metric: '', diff: -999 });

    return {
      matchCount: highProspectMetrics.length,
      leadMetric: leadMetric.diff > 0.05 ? leadMetric.metric : null,
      leadPct: Math.round(leadMetric.diff * 100),
    };
  }, [targetPlayer, prospectPlayer, targetStats, prospectStats]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] max-w-[1536px] mx-auto px-4 sm:px-6 pt-28 pb-12 flex flex-col gap-6 select-none">
      
      {/* 1. TOP HERO & TARGET SEARCH DECK */}
      <div className="relative rounded-3xl p-5 sm:p-6 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col gap-5">
        
        {/* Title & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFB800] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Replacement Engine
            </span>
            <ShimmeringText
              text="U21 Tactical Twin Prospect Radar"
              className="text-xl sm:text-2xl font-extrabold text-white font-heading tracking-tight"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#8FA3AD]">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              Age Filter: ≤ 21
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              8D Cosine Vector
            </span>
          </div>
        </div>

        {/* Search Bar + Quick Pick Chips */}
        <div className="flex flex-col gap-3">
          <div ref={searchRef} className="relative w-full">
            <input
              type="text"
              placeholder={targetPlayer ? `Target: ${targetPlayer.player_name} (Search new benchmark...)` : 'Search an established star to find U21 successors (e.g. Salah, De Bruyne, Van Dijk)...'}
              value={search}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              className="w-full pl-5 pr-14 py-3.5 bg-[#080C12]/85 backdrop-blur-2xl border border-[#FFB800]/40 focus:border-[#FFB800] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.6)] focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_24px_rgba(255,184,0,0.25)] transition-all"
            />

            {/* Subtle Search Icon Action Button */}
            <button
              onClick={() => setShowDropdown(true)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#FFB800]/20 hover:bg-[#FFB800] text-[#FFD066] hover:text-[#000C12] border border-[#FFB800]/40 hover:border-[#FFB800] transition-all flex items-center justify-center active:scale-90 cursor-pointer shadow-sm"
              title="Search Target Benchmark"
            >
              <Search className="w-4 h-4" />
            </button>

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
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
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

          {/* Quick Select Veteran Star Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-mono uppercase text-[#8FA3AD] tracking-wider font-bold">Quick Select:</span>
            {VETERAN_QUICK_PICKS.map((star) => (
              <button
                key={star.id}
                onClick={() => setTargetId(star.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-mono transition-all cursor-pointer border ${
                  targetId === star.id
                    ? 'bg-[#FFB800]/20 text-[#FFD066] border-[#FFB800]/60 shadow-[0_0_12px_rgba(255,184,0,0.3)]'
                    : 'bg-white/[0.04] text-white hover:bg-[#FFB800]/10 border-white/10 hover:border-[#FFB800]/30'
                }`}
              >
                {star.name} <span className="text-[9.5px] text-[#8FA3AD]">({star.squad})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN 3-ZONE BENTO SCOUTING WORKSPACE */}
      {targetPlayer ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          
          {/* LEFT ZONE: Target Benchmark Card + Ranked U21 Tactical Twins (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Target Benchmark Card */}
            <div className="rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-[#FFB800]/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#FFB800]/15 blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFD066] font-mono text-[10.5px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#FFB800]" /> Target Star
                  </span>
                  <LeagueLogo leagueName={targetPlayer.league} size="md" />
                </div>

                <div className="flex items-center gap-3.5 my-1">
                  <div className="relative w-16 h-16 rounded-2xl bg-[#000C12] border-2 border-[#FFB800]/40 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,184,0,0.25)]">
                    <img src={targetImg} alt={targetPlayer.player_name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link to={`/player/${targetPlayer.player_id}`} className="text-base font-extrabold text-white font-heading hover:text-[#FFB800] truncate transition-colors">
                      {targetPlayer.player_name}
                    </Link>
                    <span className="text-xs text-[#8FA3AD] font-medium truncate mt-0.5">{targetPlayer.squad}</span>
                    <span className="text-[10px] text-[#5A7280] font-mono mt-0.5">{formatLeagueName(targetPlayer.league)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <PositionBadge positionGroup={targetPlayer.position_group} />
                  <span className="px-2 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    Age {targetPlayer.age || '—'}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    {(targetPlayer.minutes_played || 0).toLocaleString()} mins
                  </span>
                </div>

                <div className="pt-0.5">
                  <ClusterTag clusterName={targetPlayer.cluster_name} />
                </div>
              </div>
            </div>

            {/* Ranked U21 Tactical Twins List */}
            <div className="rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl flex flex-col flex-1 gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#38B6FF]" /> Ranked U21 Matches
                </span>
                <span className="text-[10px] font-mono text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded-lg border border-[#38B6FF]/20">
                  {u21Matches.length} Prospects
                </span>
              </div>

              {loadingMatches ? (
                <div className="flex flex-col items-center justify-center p-8 text-xs font-mono text-[#8FA3AD] gap-2">
                  <div className="w-6 h-6 border-2 border-[#38B6FF] border-t-transparent rounded-full animate-spin" />
                  <span>Computing 8D Tactical Matches...</span>
                </div>
              ) : u21Matches.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#8FA3AD]">
                  No U21 matches found for this tactical profile.
                </div>
              ) : (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
                  {u21Matches.map((prospect, idx) => {
                    const isSelected = selectedProspectId === prospect.player_id;
                    const pImg = getPlayerImage(prospect);

                    return (
                      <button
                        key={prospect.player_id || idx}
                        onClick={() => setSelectedProspectId(prospect.player_id)}
                        className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer group ${
                          isSelected
                            ? 'bg-[#38B6FF]/15 border-[#38B6FF]/60 shadow-[0_0_15px_rgba(56,182,255,0.2)]'
                            : 'bg-[#000910]/70 hover:bg-[#000910] border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-10 h-10 rounded-xl bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
                            <img src={pImg} alt={prospect.player_name} className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#38B6FF]' : 'text-white group-hover:text-[#38B6FF]'}`}>
                              {prospect.player_name}
                            </span>
                            <span className="text-[10px] text-[#8FA3AD] truncate">
                              {prospect.squad} • {prospect.position_group}
                            </span>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] font-mono font-extrabold text-[#38B6FF]">
                              {prospect.similarity_score?.toFixed(1)}%
                            </span>
                            <span className="text-[8.5px] font-mono text-[#5A7280] uppercase">Match</span>
                          </div>
                          <LeagueLogo leagueName={prospect.league} size="sm" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT MAIN STUDIO: Dual Radar Showdown + Technical Appraisal + Delta Strip (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Studio Bento: Dual Radar & Active Prospect Dossier Header */}
            <div className="rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col gap-4 relative overflow-hidden flex-1 justify-between">
              
              {/* Studio Header & Cosine DNA Similarity Overlap Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06] relative z-10">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
                    <span className="text-white font-bold truncate max-w-[130px]">{targetPlayer.player_name}</span>
                  </div>
                  <span className="text-[#5A7280]">vs</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38B6FF] shadow-[0_0_8px_rgba(56,182,255,0.8)]" />
                    {prospectImg && (
                      <div className="w-5 h-5 rounded-full bg-[#000C12] border border-[#38B6FF]/50 overflow-hidden shrink-0">
                        <img src={prospectImg} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                    )}
                    <span className="text-white font-bold truncate max-w-[130px]">
                      {prospectPlayer ? prospectPlayer.player_name : 'Selected Prospect'}
                    </span>
                  </div>
                </div>

                {activeMatchScore && (
                  <div className="px-3.5 py-1.5 rounded-xl bg-[#38B6FF]/15 border border-[#38B6FF]/40 text-xs font-mono font-bold text-[#68C5F2] flex items-center gap-2 shadow-[0_0_12px_rgba(56,182,255,0.2)]">
                    <span>8D Tactical Match:</span>
                    <span className="text-white font-extrabold">{activeMatchScore.toFixed(1)}%</span>
                  </div>
                )}
              </div>

              {/* Center Backlit Studio Radar */}
              <div className="w-full max-w-[380px] aspect-square flex items-center justify-center mx-auto my-auto relative z-10">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible select-none">
                  <defs>
                    <filter id="u21GlowTarget" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FFB800" floodOpacity="0.75" />
                    </filter>
                    <filter id="u21GlowProspect" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38B6FF" floodOpacity="0.75" />
                    </filter>

                    <linearGradient id="gradU21Target" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFB800" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#FF7733" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="gradU21Prospect" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#68C5F2" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                  {/* Concentric Stadium Web Rings */}
                  {levels.map((lvl, lIdx) => (
                    <polygon
                      key={lIdx}
                      points={Array.from({ length: numAxes })
                        .map((_, aIdx) => {
                          const angle = angleSlice * aIdx - Math.PI / 2;
                          const x = center + radius * lvl * Math.cos(angle);
                          const y = center + radius * lvl * Math.sin(angle);
                          return `${x},${y}`;
                        })
                        .join(' ')}
                      fill={lIdx === 3 ? 'rgba(3, 21, 31, 0.4)' : 'none'}
                      stroke={lIdx === 3 ? 'rgba(56, 182, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={lIdx === 3 ? '1.5' : '1'}
                      strokeDasharray={lvl === 0.5 ? '4,4' : 'none'}
                    />
                  ))}

                  {/* Radial Spokes */}
                  {Array.from({ length: numAxes }).map((_, idx) => {
                    const angle = angleSlice * idx - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                      <line
                        key={idx}
                        x1={center}
                        y1={center}
                        x2={x}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.12)"
                        strokeDasharray="2,2"
                      />
                    );
                  })}

                  {/* Target Star Polygon (Amber) */}
                  {polyTarget && (
                    <motion.path
                      d={polyTarget}
                      fill="url(#gradU21Target)"
                      stroke="#FFB800"
                      strokeWidth="2.8"
                      strokeLinejoin="round"
                      filter="url(#u21GlowTarget)"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Prospect Polygon (Cyber Cyan) */}
                  {polyProspect && (
                    <motion.path
                      d={polyProspect}
                      fill="url(#gradU21Prospect)"
                      stroke="#38B6FF"
                      strokeWidth="2.8"
                      strokeLinejoin="round"
                      filter="url(#u21GlowProspect)"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  )}

                  {/* Target Vertex Beacons */}
                  {pointsTarget.map((p, idx) => (
                    <circle
                      key={`vT-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#FFB800"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="filter drop-shadow-[0_0_6px_rgba(255,184,0,1)]"
                    />
                  ))}

                  {/* Prospect Vertex Beacons */}
                  {pointsProspect.map((p, idx) => (
                    <circle
                      key={`vP-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="3.5"
                      fill="#38B6FF"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="filter drop-shadow-[0_0_6px_rgba(56,182,255,1)]"
                    />
                  ))}

                  {/* Metric Labels */}
                  {RADAR_METRICS.map((m, idx) => {
                    const angle = angleSlice * idx - Math.PI / 2;
                    const cosA = Math.cos(angle);
                    const sinA = Math.sin(angle);

                    let textAnchor = 'middle';
                    let labelX = center + (radius + 17) * cosA;
                    let labelY = center + (radius + 17) * sinA;

                    if (cosA > 0.25) {
                      textAnchor = 'start';
                      labelX = center + (radius + 13) * cosA;
                    } else if (cosA < -0.25) {
                      textAnchor = 'end';
                      labelX = center + (radius + 13) * cosA;
                    }

                    if (sinA > 0.7) labelY += 4;
                    else if (sinA < -0.7) labelY -= 4;

                    return (
                      <text
                        key={idx}
                        x={labelX}
                        y={labelY}
                        textAnchor={textAnchor}
                        dominantBaseline="central"
                        fill="#94A3B8"
                        className="text-[10.5px] sm:text-[11px] font-mono font-extrabold"
                      >
                        {m.label}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* Automated Technical Appraisal Card */}
              {prospectPlayer && scoutingAppraisal && (
                <div className="p-4 rounded-2xl bg-[#000910]/85 border border-white/10 flex flex-col gap-1.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38B6FF] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> Automated Technical Appraisal
                    </span>
                    <span className="text-[10px] font-mono text-[#8FA3AD]">
                      Age {prospectPlayer.age} • {prospectPlayer.position_group}
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">
                    <strong className="text-[#38B6FF]">{prospectPlayer.player_name}</strong> replicates{' '}
                    <strong>{scoutingAppraisal.matchCount} of 8 core technical dimensions</strong> of{' '}
                    <strong className="text-[#FFB800]">{targetPlayer.player_name}</strong>.
                    {scoutingAppraisal.leadMetric && (
                      <span>
                        {' '}Holds a standout statistical edge in <strong>{scoutingAppraisal.leadMetric}</strong> (+{scoutingAppraisal.leadPct}% output advantage).
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* 8-Metric Horizontal Delta Strip */}
            <div className="rounded-3xl p-3.5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl overflow-x-auto">
              <div className="flex items-center justify-between gap-3 min-w-[760px] font-mono text-xs">
                {RADAR_METRICS.map((m) => {
                  const valT = targetStats?.[m.key]?.value ?? null;
                  const valP = prospectStats?.[m.key]?.value ?? null;
                  const hasBoth = valT !== null && valP !== null;
                  const isTie = hasBoth && valT === valP;
                  const targetWins = hasBoth && valT > valP;

                  let leadPct = 0;
                  if (hasBoth && !isTie) {
                    const higher = Math.max(valT, valP);
                    const lower = Math.min(valT, valP);
                    leadPct = lower > 0 ? Math.round(((higher - lower) / lower) * 100) : (higher > 0 ? 100 : 0);
                  }

                  return (
                    <div key={m.key} className="flex-1 p-2.5 rounded-2xl bg-[#000407]/90 border border-white/[0.06] flex flex-col items-center gap-1.5 shadow-inner">
                      <span className="text-[10px] text-[#8FA3AD] font-extrabold uppercase tracking-wider">{m.short}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white font-bold">{valT !== null ? valT.toFixed(2) : '—'}</span>
                        <span className="text-[10px] text-[#5A7280]">vs</span>
                        <span className="text-white font-bold">{valP !== null ? valP.toFixed(2) : '—'}</span>
                      </div>
                      {hasBoth ? (
                        isTie ? (
                          <span className="text-[10px] text-[#5A7280] font-bold">Tied</span>
                        ) : targetWins ? (
                          <span className="text-[10px] font-bold text-[#FFB800] bg-[#FFB800]/15 px-2 py-0.5 rounded-md border border-[#FFB800]/30">
                            +{leadPct}% (Target)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#38B6FF] bg-[#38B6FF]/15 px-2 py-0.5 rounded-md border border-[#38B6FF]/30">
                            +{leadPct}% (U21)
                          </span>
                        )
                      ) : (
                        <span className="text-[10px] text-[#5A7280] font-mono">Standby</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Executive CTAs */}
            {prospectPlayer && (
              <div className="flex items-center justify-end gap-3 pt-1">
                <Link
                  to={`/player/${prospectPlayer.player_id}`}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>📄 Full Prospect Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/compare?p1=${targetPlayer.player_id}&p2=${prospectPlayer.player_id}`}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFB800] to-[#38B6FF] hover:opacity-90 text-[#000C12] font-mono font-bold text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(56,182,255,0.3)] active:scale-95"
                >
                  <span>⚔ Open Head-to-Head Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

          </div>
        </div>
      ) : (
        /* STANDBY CANVAS: When no target is selected yet */
        <div className="rounded-3xl p-10 bg-[#03151F]/90 backdrop-blur-2xl border border-dashed border-white/15 flex flex-col items-center justify-center text-center gap-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
            <Compass className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h2 className="text-lg font-extrabold text-white font-heading">
              Select a Target Benchmark Star
            </h2>
            <p className="text-xs text-[#8FA3AD] leading-relaxed font-sans">
              Choose an established star from Europe’s Big-5 leagues using the search bar above or one of the quick picks to uncover under-21 tactical successors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-xl mt-2">
            {VETERAN_QUICK_PICKS.map((star) => (
              <button
                key={star.id}
                onClick={() => setTargetId(star.id)}
                className="p-3 rounded-2xl bg-[#000910]/80 hover:bg-[#FFB800]/15 border border-white/10 hover:border-[#FFB800]/40 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-bold text-white group-hover:text-[#FFB800] truncate">{star.name}</div>
                <div className="text-[10px] text-[#8FA3AD]">{star.squad}</div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
