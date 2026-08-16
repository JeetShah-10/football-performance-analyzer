import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
import { Search, ArrowRight, Shield } from 'lucide-react';
import { fetchPlayers } from '../lib/api';

const POS_COLORS = {
  Forward: { bg: 'bg-[#E8437A]/20', text: 'text-[#E8437A]', border: 'border-[#E8437A]/40' },
  Midfielder: { bg: 'bg-[#E8B33D]/20', text: 'text-[#E8B33D]', border: 'border-[#E8B33D]/40' },
  Defender: { bg: 'bg-[#3AA6D9]/20', text: 'text-[#3AA6D9]', border: 'border-[#3AA6D9]/40' },
};

/** Normalize string: lowercase, remove accents/diacritics, trim */
function normalize(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Football Mononyms & Nicknames Map */
const PLAYER_ALIASES = {
  pedri: ['pedro gonzalez lopez', 'pedri'],
  gavi: ['pablo martin paez gavira', 'pablo gavira', 'gavi'],
  rodri: ['rodrigo hernandez cascante', 'rodrigo'],
  vini: ['vinicius junior', 'vinicius jr', 'vinicius'],
  vinicius: ['vinicius junior', 'vinicius jr'],
  raphinha: ['raphael dias belloli', 'raphinha'],
  casemiro: ['carlos henrique casimiro', 'casemiro'],
  alisson: ['alisson ramses becker', 'alisson'],
  ederson: ['ederson santana de moraes', 'ederson'],
  vitinha: ['vitor machado ferreira', 'vitinha'],
  kaka: ['ricardo izecson dos santos leite'],
  neymar: ['neymar da silva santos junior'],
  beto: ['norberto bercique gomes betuncal'],
};

/** Compute Weighted Relevance Score for a Player given a Query */
function computePlayerRelevance(player, rawQuery) {
  const q = normalize(rawQuery);
  if (!q) return 0;

  const name = normalize(player.player_name);
  const squad = normalize(player.squad);
  const cluster = normalize(player.cluster_name);
  const nameWords = name.split(/\s+/);

  let score = 0;

  // 1. Exact Full Name Match (1,000 pts)
  if (name === q) {
    score += 1000;
  }
  // 2. Full Name Starts With Query (600 pts) (e.g. "ha" -> "harry kane")
  else if (name.startsWith(q)) {
    score += 600;
  }
  // 3. Any Word (Last Name / Middle Name) Starts With Query (550 pts) (e.g. "ha" -> "erling haaland", "kai havertz")
  else if (nameWords.some((w) => w.startsWith(q))) {
    score += 550;
  }
  // 4. Nickname / Mononym Alias Match (500 pts) (e.g. "pedri", "gavi", "vini")
  else {
    for (const [aliasKey, aliasList] of Object.entries(PLAYER_ALIASES)) {
      if (
        (aliasKey.startsWith(q) || q.startsWith(aliasKey)) &&
        aliasList.some((a) => name.includes(a) || a.includes(name))
      ) {
        score += 500;
        break;
      }
    }
  }

  // 5. Substring In Player Name (200 pts) (e.g. "dia" -> "brahim diaz")
  if (score === 0 && name.includes(q)) {
    score += 200;
  }

  // 6. Club / Squad Matches (Prioritized strictly BELOW Player Names)
  if (squad.startsWith(q)) {
    score += 60;
  } else if (squad.includes(q)) {
    score += 20; // Low weight so "West Ham" never beats "Haaland"
  }

  // 7. Tactical Archetype / Cluster Match
  if (cluster.includes(q)) {
    score += 10;
  }

  // 8. Prominence Tie-Breaker (Minutes played + contribution)
  if (score > 0) {
    const minutesBonus = Math.min(player.minutes_played || 0, 3500) / 100;
    const goalContribBonus = ((player.npxG_per90 || 0) + (player.xAG_per90 || 0)) * 5;
    score += minutesBonus + goalContribBonus;
  }

  return score;
}

export default function HeroSearch({ className = '' }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [dynamicResults, setDynamicResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isHaloActive, setIsHaloActive] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Spell: Magnetic Button Spring Physics
  const springConfig = { damping: 20, stiffness: 350 };
  const buttonX = useSpring(0, springConfig);
  const buttonY = useSpring(0, springConfig);

  const handleButtonMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    buttonX.set((e.clientX - centerX) * 0.35);
    buttonY.set((e.clientY - centerY) * 0.35);
  };

  const handleButtonMouseLeave = () => {
    buttonX.set(0);
    buttonY.set(0);
  };

  // Spell: Global ⌘K / Ctrl+K Quick Summon
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsHaloActive(true);
        setTimeout(() => setIsHaloActive(false), 1200);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Preload players on mount for instant zero-latency autocomplete
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      setLoading(true);
      const res = await fetchPlayers({ limit: 1802 });
      if (isMounted && res?.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.players || []);
        setAllPlayers(list);
      }
      setLoading(false);
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fallback dynamic API fetch if preloaded dataset is empty
  useEffect(() => {
    if (!query.trim() || allPlayers.length > 0) return;
    let active = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetchPlayers({ search: query.trim(), limit: 12 });
      if (active && res?.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.players || []);
        setDynamicResults(list);
        setLoading(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, allPlayers.length]);

  // Intelligent Weighted Relevance Filter & Ranking
  const filteredPlayers = React.useMemo(() => {
    if (!query.trim()) return [];
    const sourceList = allPlayers.length > 0 ? allPlayers : dynamicResults;

    // Calculate score for each player and filter matching ones
    const scored = [];
    for (let i = 0; i < sourceList.length; i++) {
      const p = sourceList[i];
      const score = computePlayerRelevance(p, query);
      if (score > 0) {
        scored.push({ player: p, score });
      }
    }

    // Sort descending by relevance score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 10).map((item) => item.player);
  }, [allPlayers, dynamicResults, query]);

  // Group by team/squad while preserving top-relevance order
  const groupedByTeam = React.useMemo(() => {
    const groups = {};
    filteredPlayers.forEach((player) => {
      const team = player.squad || 'Unknown Club';
      if (!groups[team]) groups[team] = [];
      groups[team].push(player);
    });
    return groups;
  }, [filteredPlayers]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredPlayers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredPlayers.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredPlayers.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredPlayers.length) {
        handleSelectPlayer(filteredPlayers[selectedIndex]);
      } else if (filteredPlayers.length > 0) {
        handleSelectPlayer(filteredPlayers[0]);
      } else if (query.trim()) {
        navigate(`/explorer?search=${encodeURIComponent(query.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectPlayer = (player) => {
    setIsOpen(false);
    navigate(`/player/${player.player_id}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (filteredPlayers.length > 0) {
      handleSelectPlayer(filteredPlayers[0]);
    } else if (query.trim()) {
      navigate(`/explorer?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Prominent Apple Liquid Glass Search Bar with ⌘K Halo Spell */}
      <form onSubmit={handleFormSubmit} className="relative flex items-center group">
        <div className="absolute left-5 pointer-events-none text-[#FF4E32] transition-transform group-focus-within:scale-110">
          <Search className="w-6 h-6" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search any player (e.g. Haaland, Pedri, Yamal, Kane)..."
          aria-label="Search football players"
          className={`w-full pl-14 pr-24 py-4 sm:py-4.5 rounded-2xl bg-[#080C12]/85 backdrop-blur-2xl border text-white placeholder:text-white/45 text-base sm:text-lg font-medium outline-none transition-all ${
            isHaloActive
              ? 'border-[#FF4E32] shadow-[0_0_36px_rgba(255,78,50,0.5),inset_0_1px_2px_rgba(255,255,255,0.3)]'
              : 'border-white/20 focus:border-[#FF4E32]/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_20px_45px_rgba(0,0,0,0.65)] focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_32px_rgba(255,78,50,0.3)]'
          }`}
        />

        {/* Spell 5: Tactical Terminal HUD Telemetry Badge / ⌘K Badge */}
        {query.trim() ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-14 hidden sm:flex items-center gap-1.5 pointer-events-none px-2.5 py-1 rounded-md bg-[#FF4E32]/15 border border-[#FF4E32]/40 text-[10px] font-mono font-bold text-[#FF4E32] shadow-[0_0_12px_rgba(255,78,50,0.25)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E32] animate-pulse" />
            <span>{filteredPlayers.length} NODES</span>
          </motion.div>
        ) : (
          <div className="absolute right-14 hidden sm:flex items-center gap-1 pointer-events-none px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-mono text-white/50">
            <span>⌘K</span>
          </div>
        )}

        {/* Magnetic Submit Button */}
        <motion.button
          ref={buttonRef}
          type="submit"
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
          style={{ x: buttonX, y: buttonY }}
          className="absolute right-3 p-2.5 rounded-xl text-[#FF4E32] hover:text-white hover:bg-[#FF4E32]/25 transition-colors cursor-pointer"
          title="Search player"
          aria-label="Search player"
        >
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      </form>

      {/* Autocomplete Dropdown Calibrated to Never Exceed Hero Limits */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#080C12]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] z-50 overflow-hidden max-h-[340px] sm:max-h-[380px] overflow-y-auto divide-y divide-white/5">
          {filteredPlayers.length === 0 ? (
            <div className="p-5 text-center text-sm text-white/50">
              {loading ? 'Searching 1,802 players...' : `No players found for "${query}"`}
            </div>
          ) : (
            Object.entries(groupedByTeam).map(([teamName, players]) => (
              <div key={teamName} className="py-2">
                {/* Team Group Header */}
                <div className="px-4 py-1.5 flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-white/60 uppercase bg-black/40">
                  <Shield className="w-3.5 h-3.5 text-[#FF4E32]" />
                  <span>{teamName}</span>
                </div>

                {/* Team Players */}
                {players.map((player) => {
                  const globalIdx = filteredPlayers.findIndex((p) => p.player_id === player.player_id);
                  const isSelected = globalIdx === selectedIndex;
                  const posStyle = POS_COLORS[player.position_group] || POS_COLORS.Midfielder;

                  return (
                    <div
                      key={player.player_id}
                      onClick={() => handleSelectPlayer(player)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm font-semibold truncate">{player.player_name}</span>
                        {player.age && (
                          <span className="text-[11px] font-mono text-white/40">
                            {player.age}y
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {player.cluster_name && (
                          <span className="hidden sm:inline-block text-[11px] font-mono text-white/70 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                            {player.cluster_name}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
                        >
                          {player.position_group === 'Forward'
                            ? 'FW'
                            : player.position_group === 'Midfielder'
                            ? 'MF'
                            : 'DF'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Quick Explorer Jump */}
          <div
            onClick={() => navigate(`/explorer?search=${encodeURIComponent(query.trim())}`)}
            className="p-3 bg-black/60 text-center text-xs font-mono font-bold text-[#FF4E32] hover:text-[#FF735E] cursor-pointer border-t border-white/10 flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
          >
            <span>View all matching players in Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}
