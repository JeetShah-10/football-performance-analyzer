import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { fetchPlayerDetail, fetchPlayers } from '../lib/api';
import { MOCK_PLAYER_DETAILS, MOCK_PLAYERS } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { getLeagueConfig, formatLeagueName } from '../components/LeagueLogo';
import PositionBadge from '../components/PositionBadge';
import ClusterTag from '../components/ClusterTag';

const RADAR_METRICS = [
  { key: 'npxG_per90', label: 'Goal Threat', full: 'Goal Threat (npxG)', desc: 'Non-Penalty Expected Goals' },
  { key: 'xAG_per90', label: 'Assist xAG', full: 'Assist Creation (xAG)', desc: 'Expected Assisted Goals' },
  { key: 'KP_per90', label: 'Key Chances', full: 'Chances Created (KP)', desc: 'Key Passes per 90' },
  { key: 'PrgP_per90', label: 'Pass Prog.', full: 'Pass Progression', desc: 'Progressive Passes per 90' },
  { key: 'PrgC_per90', label: 'Carry Prog.', full: 'Ball Progression (Carries)', desc: 'Progressive Carries per 90' },
  { key: 'Succ_per90', label: 'Take-Ons', full: 'Dribble Take-Ons', desc: 'Successful Dribbles per 90' },
  { key: 'Tkl_per90', label: 'Tackles', full: 'Defensive Tackles', desc: 'Tackles Won per 90' },
  { key: 'Int_per90', label: 'Intercepts', full: 'Pass Interceptions', desc: 'Passes Intercepted per 90' },
];

const QUICK_PICKS_A = [
  { id: 'bukayo_saka_eng_eng_2001_0', name: 'Saka', squad: 'Arsenal' },
  { id: 'erling_haaland_nor_eng_2000_0', name: 'Haaland', squad: 'Man City' },
  { id: 'jude_bellingham_eng_esp_2003_0', name: 'Bellingham', squad: 'Real Madrid' },
  { id: 'jamal_musiala_de_ger_2003_0', name: 'Musiala', squad: 'Bayern Munich' },
];

const QUICK_PICKS_B = [
  { id: 'phil_foden_eng_eng_2000_0', name: 'Foden', squad: 'Man City' },
  { id: 'cole_palmer_eng_eng_2002_0', name: 'Palmer', squad: 'Chelsea' },
  { id: 'rodrigo_hernandez_cascante_esp_eng_1996_0', name: 'Rodri', squad: 'Man City' },
  { id: 'vinicius_jose_paixao_de_oliveira_junior_bra_esp_2000_0', name: 'Vinicius Jr', squad: 'Real Madrid' },
];

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Initial State: Read from URL query params -> sessionStorage -> empty string (no hardcoded preloading)
  const getInitialSlot = (key) => {
    const fromUrl = searchParams.get(key);
    if (fromUrl) return fromUrl;
    try {
      const fromSession = sessionStorage.getItem(`compare_${key}`);
      if (fromSession) return fromSession;
    } catch {
      // sessionStorage blocked or unavailable
    }
    return '';
  };

  const [p1Id, setP1Id] = useState(() => getInitialSlot('p1'));
  const [p2Id, setP2Id] = useState(() => getInitialSlot('p2'));

  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);

  // Search autocompletes for Slot A and Slot B
  const [searchA, setSearchA] = useState('');
  const [resultsA, setResultsA] = useState([]);
  const [showDropdownA, setShowDropdownA] = useState(false);

  const [searchB, setSearchB] = useState('');
  const [resultsB, setResultsB] = useState([]);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const searchARef = useRef(null);
  const searchBRef = useRef(null);

  // Sync state to URL and sessionStorage so soft refreshes retain state
  useEffect(() => {
    const params = {};
    if (p1Id) {
      params.p1 = p1Id;
      try { sessionStorage.setItem('compare_p1', p1Id); } catch {}
    } else {
      try { sessionStorage.removeItem('compare_p1'); } catch {}
    }

    if (p2Id) {
      params.p2 = p2Id;
      try { sessionStorage.setItem('compare_p2', p2Id); } catch {}
    } else {
      try { sessionStorage.removeItem('compare_p2'); } catch {}
    }

    setSearchParams(params, { replace: true });
  }, [p1Id, p2Id, setSearchParams]);

  // Load Player 1 & Player 2 details
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!p1Id && !p2Id) {
        setP1(null);
        setP2(null);
        return;
      }

      const promises = [
        p1Id ? fetchPlayerDetail(p1Id) : Promise.resolve({ data: null }),
        p2Id ? fetchPlayerDetail(p2Id) : Promise.resolve({ data: null }),
      ];

      const [res1, res2] = await Promise.all(promises);
      if (!isMounted) return;

      setP1(res1?.data || (p1Id ? MOCK_PLAYER_DETAILS[p1Id] : null));
      setP2(res2?.data || (p2Id ? MOCK_PLAYER_DETAILS[p2Id] : null));
    }
    loadData();
    return () => { isMounted = false; };
  }, [p1Id, p2Id]);

  // Search debounces for Slot A
  useEffect(() => {
    if (!searchA.trim()) {
      setResultsA([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetchPlayers({ search: searchA, limit: 6 });
      if (res.data && res.data.length > 0) {
        setResultsA(res.data);
      } else {
        const filtered = MOCK_PLAYERS.filter(p =>
          p.player_name.toLowerCase().includes(searchA.toLowerCase())
        );
        setResultsA(filtered.slice(0, 6));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchA]);

  // Search debounces for Slot B
  useEffect(() => {
    if (!searchB.trim()) {
      setResultsB([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetchPlayers({ search: searchB, limit: 6 });
      if (res.data && res.data.length > 0) {
        setResultsB(res.data);
      } else {
        const filtered = MOCK_PLAYERS.filter(p =>
          p.player_name.toLowerCase().includes(searchB.toLowerCase())
        );
        setResultsB(filtered.slice(0, 6));
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchB]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchARef.current && !searchARef.current.contains(e.target)) {
        setShowDropdownA(false);
      }
      if (searchBRef.current && !searchBRef.current.contains(e.target)) {
        setShowDropdownB(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Tactical DNA Overlap (Cosine Similarity on 8D Percentiles)
  const cosineOverlap = useMemo(() => {
    if (!p1?.stats || !p2?.stats) return null;
    let dot = 0;
    let normA = 0;
    let normB = 0;

    RADAR_METRICS.forEach((m) => {
      const vA = p1.stats[m.key]?.percentile ?? 50;
      const vB = p2.stats[m.key]?.percentile ?? 50;
      dot += vA * vB;
      normA += vA * vA;
      normB += vB * vB;
    });

    if (normA === 0 || normB === 0) return 86.4;
    const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.min(99.9, Math.max(10, Math.round(sim * 1000) / 10));
  }, [p1, p2]);

  // Swap Slot A and Slot B
  const handleSwap = () => {
    const temp = p1Id;
    setP1Id(p2Id);
    setP2Id(temp);
  };

  // Radar SVG Geometry & BKLit Math (Balanced Studio Scale: size 400, radius 122)
  const size = 400;
  const center = size / 2;
  const radius = 122;
  const numAxes = RADAR_METRICS.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const pointsA = RADAR_METRICS.map((m, idx) => {
    const pct = p1?.stats?.[m.key]?.percentile ?? 0;
    const r = p1 ? Math.max(0.12, Math.min(1.0, pct / 100)) * radius : 0;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), pct, label: m.label };
  });

  const pointsB = RADAR_METRICS.map((m, idx) => {
    const pct = p2?.stats?.[m.key]?.percentile ?? 0;
    const r = p2 ? Math.max(0.12, Math.min(1.0, pct / 100)) * radius : 0;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), pct, label: m.label };
  });

  const polyA = p1 ? pointsA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z' : null;
  const polyB = p2 ? pointsB.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z' : null;

  const p1Img = p1 ? getPlayerImage(p1) : null;
  const p2Img = p2 ? getPlayerImage(p2) : null;

  const leagueConfig1 = p1 ? getLeagueConfig(p1.league) : { glow: 'rgba(255, 60, 0, 0.2)' };
  const leagueConfig2 = p2 ? getLeagueConfig(p2.league) : { glow: 'rgba(56, 182, 255, 0.2)' };

  return (
    <div className="min-h-[calc(100dvh-5rem)] max-w-[1536px] mx-auto px-4 sm:px-6 pt-28 pb-8 flex flex-col justify-between gap-5 select-none">
      
      {/* 1. TOP DUAL SEARCH DECK WITH SUBTLE ICONS & ZERO CLUTTER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center relative z-40">
        {/* Search Slot A (Crimson) */}
        <div ref={searchARef} className="md:col-span-5 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={p1 ? `Slot A: ${p1.player_name} (Search new...)` : 'Search Player A (e.g. Saka, Haaland, Musiala)...'}
              value={searchA}
              onFocus={() => setShowDropdownA(true)}
              onChange={(e) => {
                setSearchA(e.target.value);
                setShowDropdownA(true);
              }}
              className="w-full pl-5 pr-14 py-3.5 bg-[#080C12]/85 backdrop-blur-2xl border border-[#FF3C00]/40 focus:border-[#FF3C00] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.6)] focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_24px_rgba(255,60,0,0.25)] transition-all"
            />

            {/* Subtle Search Icon Action Button */}
            <button
              onClick={() => setShowDropdownA(true)}
              className="absolute right-2.5 w-9 h-9 rounded-xl bg-[#FF3C00]/20 hover:bg-[#FF3C00] text-[#FF7733] hover:text-white border border-[#FF3C00]/40 hover:border-[#FF3C00] transition-all flex items-center justify-center active:scale-90 cursor-pointer shadow-sm"
              title="Search Player A"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Unclipped Autocomplete Dropdown A */}
          <AnimatePresence>
            {showDropdownA && resultsA.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-2 inset-x-0 bg-[#000910]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.06]"
              >
                {resultsA.map((item) => (
                  <button
                    key={item.player_id || item.id}
                    onClick={() => {
                      setP1Id(item.player_id || item.id);
                      setSearchA('');
                      setShowDropdownA(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
                        <img src={getPlayerImage(item)} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#FF7733] truncate">{item.player_name}</span>
                        <span className="text-[10px] text-[#8FA3AD] truncate">{item.squad} • {item.position_group}</span>
                      </div>
                    </div>
                    <LeagueLogo leagueName={item.league} size="sm" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: DNA Overlap Floating Capsule & Swap Button */}
        <div className="md:col-span-2 flex items-center justify-center gap-2.5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#060A10]/90 backdrop-blur-2xl border border-white/15 shadow-[0_0_20px_rgba(56,182,255,0.25)]">
            <span className="text-[10px] font-mono text-[#8FA3AD] uppercase font-bold">DNA</span>
            <span className="text-xs font-mono font-extrabold text-[#38B6FF]">
              {cosineOverlap !== null ? `${cosineOverlap}%` : '—'}
            </span>
          </div>

          <button
            onClick={handleSwap}
            disabled={!p1Id && !p2Id}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 flex items-center justify-center text-sm font-bold text-white transition-all active:scale-90 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:rotate-180 duration-300 disabled:opacity-40 disabled:pointer-events-none"
            title="Swap Player A and Player B"
          >
            ⇄
          </button>
        </div>

        {/* Search Slot B (Sky Blue) */}
        <div ref={searchBRef} className="md:col-span-5 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={p2 ? `Slot B: ${p2.player_name} (Search new...)` : 'Search Player B (e.g. Foden, Palmer, Rodri)...'}
              value={searchB}
              onFocus={() => setShowDropdownB(true)}
              onChange={(e) => {
                setSearchB(e.target.value);
                setShowDropdownB(true);
              }}
              className="w-full pl-5 pr-14 py-3.5 bg-[#080C12]/85 backdrop-blur-2xl border border-[#38B6FF]/40 focus:border-[#38B6FF] rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-white/40 focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_15px_30px_rgba(0,0,0,0.6)] focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_24px_rgba(56,182,255,0.25)] transition-all"
            />

            {/* Subtle Search Icon Action Button */}
            <button
              onClick={() => setShowDropdownB(true)}
              className="absolute right-2.5 w-9 h-9 rounded-xl bg-[#38B6FF]/20 hover:bg-[#38B6FF] text-[#68C5F2] hover:text-white border border-[#38B6FF]/40 hover:border-[#38B6FF] transition-all flex items-center justify-center active:scale-90 cursor-pointer shadow-sm"
              title="Search Player B"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Unclipped Autocomplete Dropdown B */}
          <AnimatePresence>
            {showDropdownB && resultsB.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute top-full mt-2 inset-x-0 bg-[#000910]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/[0.06]"
              >
                {resultsB.map((item) => (
                  <button
                    key={item.player_id || item.id}
                    onClick={() => {
                      setP2Id(item.player_id || item.id);
                      setSearchB('');
                      setShowDropdownB(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.08] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0">
                        <img src={getPlayerImage(item)} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#38B6FF] truncate">{item.player_name}</span>
                        <span className="text-[10px] text-[#8FA3AD] truncate">{item.squad} • {item.position_group}</span>
                      </div>
                    </div>
                    <LeagueLogo leagueName={item.league} size="sm" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. SPLIT TACTICAL ARENA BENTO (BKLIT STUDIO ARENA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1">
        
        {/* LEFT: Player A Identity Pod (3.5 cols) */}
        <div className="lg:col-span-3 rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-[#FF3C00]/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Dynamic League Backlit Glow */}
          <div
            className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ background: leagueConfig1.glow }}
          />

          {p1 ? (
            <>
              <div className="flex flex-col gap-3.5 relative z-10">
                {/* Header: Slot Badge + Prominent Studio League Crest (56px) */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#FF3C00]/20 border border-[#FF3C00]/40 text-[#FF7733] font-mono text-[11px] font-extrabold uppercase tracking-wider">
                    Slot A
                  </span>
                  <LeagueLogo leagueName={p1.league} size="studio" />
                </div>

                {/* Profile Photo & Identity */}
                <div className="flex items-center gap-3.5 my-1">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#000C12] border-2 border-[#FF3C00]/40 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,60,0,0.3)]">
                    <img src={p1Img} alt={p1.player_name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link to={`/player/${p1.player_id}`} className="text-base sm:text-lg font-extrabold text-white font-heading hover:text-[#FF7733] truncate transition-colors">
                      {p1.player_name}
                    </Link>
                    <span className="text-xs text-[#8FA3AD] font-medium truncate mt-0.5">{p1.squad}</span>
                    <span className="text-[10px] text-[#5A7280] font-mono mt-0.5">{formatLeagueName(p1.league)}</span>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PositionBadge positionGroup={p1.position_group} />
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    Age {p1.age || '—'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    {(p1.minutes_played || 0).toLocaleString()} mins
                  </span>
                </div>

                {/* Archetype Tag */}
                <div className="pt-1">
                  <ClusterTag clusterName={p1.cluster_name} />
                </div>
              </div>

              {/* Profile CTA */}
              <Link
                to={`/player/${p1.player_id}`}
                className="mt-3 px-4 py-2.5 rounded-2xl bg-[#FF3C00]/10 hover:bg-gradient-to-r hover:from-[#FF3C00] hover:to-[#FF6A33] border border-[#FF3C00]/30 hover:border-[#FF3C00] text-xs font-mono font-bold text-white flex items-center justify-between transition-all shadow-[0_0_15px_rgba(255,60,0,0.15)] hover:shadow-[0_0_20px_rgba(255,60,0,0.4)] group active:scale-[0.98]"
              >
                <span>Full Profile Dossier</span>
                <span className="text-[#FF7733] group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </>
          ) : (
            /* Empty State for Slot A */
            <div className="flex flex-col justify-between h-full relative z-10 gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#FF3C00]/20 border border-[#FF3C00]/40 text-[#FF7733] font-mono text-[11px] font-extrabold uppercase tracking-wider">
                    Slot A
                  </span>
                  <span className="text-xs font-mono text-[#8FA3AD]">Waiting</span>
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-[#FF3C00]/30 bg-[#000910]/40 text-center gap-2 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF3C00]/10 border border-[#FF3C00]/30 flex items-center justify-center text-[#FF7733]">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-extrabold text-white font-heading">Select Player A</span>
                  <span className="text-xs text-[#8FA3AD]">Search above or pick a star below</span>
                </div>
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase text-[#8FA3AD] tracking-wider font-bold">Quick Select:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PICKS_A.map(star => (
                    <button
                      key={star.id}
                      onClick={() => setP1Id(star.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#FF3C00]/20 border border-white/10 hover:border-[#FF3C00]/40 text-[11px] font-mono text-left truncate transition-all cursor-pointer text-white"
                    >
                      {star.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER: BKLit (Backlit) Tactical Studio Radar (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between relative overflow-hidden">
          
          {/* Subtle Stadium Pitch Grid Motif */}
          <div className="absolute inset-0 bg-[radial-gradient(#0A222E_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Header Legend */}
          <div className="w-full flex items-center justify-center sm:justify-end border-b border-white/[0.06] pb-2 text-xs font-mono relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3C00] shadow-[0_0_8px_rgba(255,60,0,0.8)]" />
                <span className="text-white font-bold text-xs truncate max-w-[130px]">
                  {p1 ? p1.player_name : 'Player A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38B6FF] shadow-[0_0_8px_rgba(56,182,255,0.8)]" />
                <span className="text-white font-bold text-xs truncate max-w-[130px]">
                  {p2 ? p2.player_name : 'Player B'}
                </span>
              </div>
            </div>
          </div>

          {/* BKLit Back-Illuminated SVG Radar Chart (Optimized Studio Scale) */}
          <div className="w-full max-w-[390px] aspect-square flex items-center justify-center my-auto relative z-10">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Glowing drop shadow filter for Player A */}
                <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#FF3C00" floodOpacity="0.75" />
                </filter>

                {/* Glowing drop shadow filter for Player B */}
                <filter id="glowB" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38B6FF" floodOpacity="0.75" />
                </filter>

                <linearGradient id="gradBKLitA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF3C00" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#FF7733" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="gradBKLitB" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#68C5F2" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Backlit Radar Rings */}
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

              {/* Player 1 Polygon (Crimson BKLit) */}
              {polyA && (
                <motion.path
                  d={polyA}
                  fill="url(#gradBKLitA)"
                  stroke="#FF3C00"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  filter="url(#glowA)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* Player 2 Polygon (Cyber Sky Blue BKLit) */}
              {polyB && (
                <motion.path
                  d={polyB}
                  fill="url(#gradBKLitB)"
                  stroke="#38B6FF"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                  filter="url(#glowB)"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              )}

              {/* Glowing Vertex Beacons for Player A */}
              {p1 && pointsA.map((p, idx) => (
                <circle
                  key={`vA-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#FF3C00"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_0_6px_rgba(255,60,0,1)]"
                />
              ))}

              {/* Glowing Vertex Beacons for Player B */}
              {p2 && pointsB.map((p, idx) => (
                <circle
                  key={`vB-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#38B6FF"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  className="filter drop-shadow-[0_0_6px_rgba(56,182,255,1)]"
                />
              ))}

              {/* Metric Labels with Smart Anchoring */}
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

                if (sinA > 0.7) {
                  labelY += 4;
                } else if (sinA < -0.7) {
                  labelY -= 4;
                }

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
        </div>

        {/* RIGHT: Player B Identity Pod (3.5 cols) */}
        <div className="lg:col-span-3 rounded-3xl p-5 bg-[#03151F]/95 backdrop-blur-2xl border border-[#38B6FF]/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Dynamic League Backlit Glow */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ background: leagueConfig2.glow }}
          />

          {p2 ? (
            <>
              <div className="flex flex-col gap-3.5 relative z-10">
                {/* Header: Slot Badge + Prominent Studio League Crest (56px) */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#38B6FF]/20 border border-[#38B6FF]/40 text-[#68C5F2] font-mono text-[11px] font-extrabold uppercase tracking-wider">
                    Slot B
                  </span>
                  <LeagueLogo leagueName={p2.league} size="studio" />
                </div>

                {/* Profile Photo & Identity */}
                <div className="flex items-center gap-3.5 my-1">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#000C12] border-2 border-[#38B6FF]/40 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(56,182,255,0.3)]">
                    <img src={p2Img} alt={p2.player_name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <Link to={`/player/${p2.player_id}`} className="text-base sm:text-lg font-extrabold text-white font-heading hover:text-[#38B6FF] truncate transition-colors">
                      {p2.player_name}
                    </Link>
                    <span className="text-xs text-[#8FA3AD] font-medium truncate mt-0.5">{p2.squad}</span>
                    <span className="text-[10px] text-[#5A7280] font-mono mt-0.5">{formatLeagueName(p2.league)}</span>
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <PositionBadge positionGroup={p2.position_group} />
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    Age {p2.age || '—'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-[10px] font-mono text-[#8FA3AD]">
                    {(p2.minutes_played || 0).toLocaleString()} mins
                  </span>
                </div>

                {/* Archetype Tag */}
                <div className="pt-1">
                  <ClusterTag clusterName={p2.cluster_name} />
                </div>
              </div>

              {/* Profile CTA */}
              <Link
                to={`/player/${p2.player_id}`}
                className="mt-3 px-4 py-2.5 rounded-2xl bg-[#38B6FF]/10 hover:bg-gradient-to-r hover:from-[#38B6FF] hover:to-[#68C5F2] border border-[#38B6FF]/30 hover:border-[#38B6FF] text-xs font-mono font-bold text-white flex items-center justify-between transition-all shadow-[0_0_15px_rgba(56,182,255,0.15)] hover:shadow-[0_0_20px_rgba(56,182,255,0.4)] group active:scale-[0.98]"
              >
                <span>Full Profile Dossier</span>
                <span className="text-[#38B6FF] group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
              </Link>
            </>
          ) : (
            /* Empty State for Slot B */
            <div className="flex flex-col justify-between h-full relative z-10 gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#38B6FF]/20 border border-[#38B6FF]/40 text-[#68C5F2] font-mono text-[11px] font-extrabold uppercase tracking-wider">
                    Slot B
                  </span>
                  <span className="text-xs font-mono text-[#8FA3AD]">Waiting</span>
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-[#38B6FF]/30 bg-[#000910]/40 text-center gap-2 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#38B6FF]/10 border border-[#38B6FF]/30 flex items-center justify-center text-[#38B6FF]">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-extrabold text-white font-heading">Select Player B</span>
                  <span className="text-xs text-[#8FA3AD]">Search above or pick a star below</span>
                </div>
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase text-[#8FA3AD] tracking-wider font-bold">Quick Select:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_PICKS_B.map(star => (
                    <button
                      key={star.id}
                      onClick={() => setP2Id(star.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#38B6FF]/20 border border-white/10 hover:border-[#38B6FF]/40 text-[11px] font-mono text-left truncate transition-all cursor-pointer text-white"
                    >
                      {star.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. HORIZONTAL 8-METRIC COMPARATIVE DELTA STRIP (BOTTOM) */}
      <div className="rounded-3xl p-3.5 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between gap-3 min-w-[760px] font-mono text-xs">
          {RADAR_METRICS.map((m) => {
            const statA = p1?.stats?.[m.key] || null;
            const statB = p2?.stats?.[m.key] || null;
            const pctA = statA?.percentile ?? 50;
            const pctB = statB?.percentile ?? 50;
            const diffPct = Math.round(pctA - pctB);
            const p1Wins = diffPct > 0;
            const isTie = diffPct === 0;

            return (
              <div key={m.key} className="flex-1 p-2.5 rounded-2xl bg-[#000407]/90 border border-white/[0.06] flex flex-col items-center gap-1.5 shadow-inner">
                <span className="text-[10px] text-[#8FA3AD] font-extrabold uppercase tracking-wider">{m.label}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white font-bold">{statA ? statA.value?.toFixed(2) : '—'}</span>
                  <span className="text-[10px] text-[#5A7280]">vs</span>
                  <span className="text-white font-bold">{statB ? statB.value?.toFixed(2) : '—'}</span>
                </div>
                {p1 && p2 ? (
                  isTie ? (
                    <span className="text-[10px] text-[#5A7280] font-bold">Tied</span>
                  ) : p1Wins ? (
                    <span className="text-[10px] font-bold text-[#FF7733] bg-[#FF3C00]/15 px-2 py-0.5 rounded-md border border-[#FF3C00]/30 shadow-[0_0_6px_rgba(255,60,0,0.3)]">
                      +{diffPct}% (A)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#38B6FF] bg-[#38B6FF]/15 px-2 py-0.5 rounded-md border border-[#38B6FF]/30 shadow-[0_0_6px_rgba(56,182,255,0.3)]">
                      +{Math.abs(diffPct)}% (B)
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

    </div>
  );
}
