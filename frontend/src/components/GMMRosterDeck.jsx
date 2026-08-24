import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  ExternalLink,
  ArrowLeft,
  Search,
} from 'lucide-react';
import {
  WonderkidReticleIcon,
} from './icons/TacticalIcons';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { formatLeagueName } from './LeagueLogo';
import PositionBadge from './PositionBadge';
import RadarChart, { RadarGrid, RadarLabels, RadarArea } from './RadarChart';
import {
  GMM_METRICS,
  getClusterTheme,
  calculateEntropy,
} from '../lib/gmmUtils';

export default function GMMRosterDeck({
  players = [],
  selectedClusterName = '',
  selectedPlayer = null,
  onSelectPlayer = () => {},
  onClearSelection = () => {},
  className = '',
}) {
  const [activeTab, setActiveTab] = useState('exemplars'); // 'exemplars' | 'chameleons' | 'u21'
  const [searchQuery, setSearchQuery] = useState('');

  const clusterTheme = useMemo(() => {
    return getClusterTheme(selectedClusterName);
  }, [selectedClusterName]);

  // Process and sort player rosters
  const { exemplars, chameleons, u21List } = useMemo(() => {
    const list = players.map((p) => {
      let probs = {};
      try {
        if (typeof p.gmm_probabilities === 'object' && p.gmm_probabilities) {
          probs = p.gmm_probabilities;
        } else if (p.gmm_probabilities_json) {
          probs = JSON.parse(p.gmm_probabilities_json);
        }
      } catch {
        probs = {};
      }

      const clusterProb = probs[selectedClusterName] ?? (p.cluster_name === selectedClusterName ? 0.85 : 0.1);
      const entropy = calculateEntropy(probs);

      return {
        ...p,
        probs,
        clusterProb: Number(clusterProb),
        entropy,
      };
    });

    // 1. Pure Exemplars (highest probability in selected cluster)
    const sortedExemplars = [...list]
      .filter((p) => p.cluster_name === selectedClusterName || p.clusterProb >= 0.4)
      .sort((a, b) => b.clusterProb - a.clusterProb);

    // 2. Chameleons (highest entropy / split probabilities)
    const sortedChameleons = [...list]
      .filter((p) => p.cluster_name === selectedClusterName || p.clusterProb >= 0.25)
      .sort((a, b) => b.entropy - a.entropy);

    // 3. U21 Wonderkids
    const sortedU21 = sortedExemplars.filter((p) => Number(p.age || 99) <= 21);

    return {
      exemplars: sortedExemplars,
      chameleons: sortedChameleons,
      u21List: sortedU21,
    };
  }, [players, selectedClusterName]);

  const displayedList = useMemo(() => {
    let source = exemplars;
    if (activeTab === 'chameleons') source = chameleons;
    if (activeTab === 'u21') source = u21List;

    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter((p) => p.player_name.toLowerCase().includes(q) || p.squad?.toLowerCase().includes(q));
  }, [activeTab, exemplars, chameleons, u21List, searchQuery]);

  // Selected player detail radar
  const selectedRadarData = useMemo(() => {
    if (!selectedPlayer) return [];
    const statsObj = {};
    GMM_METRICS.forEach((m) => {
      const val = Number(selectedPlayer[m.key] ?? 0);
      const pct = Math.min(99, Math.max(5, Math.round(val * 20)));
      statsObj[m.key] = {
        percentile: pct,
        value: val,
      };
    });

    return [
      {
        label: selectedPlayer.player_name,
        color: clusterTheme.color,
        stats: statsObj,
      },
    ];
  }, [selectedPlayer, clusterTheme]);

  return (
    <div className={`p-4 rounded-3xl bg-[#000810] border border-white/[0.08] shadow-2xl flex flex-col h-full min-h-0 gap-3 overflow-hidden ${className}`}>
      
      <AnimatePresence mode="wait">
        {selectedPlayer ? (
          /* --- MODE 2: ACTIVE PLAYER PROSPECT DOSSIER --- */
          <motion.div
            key="player-dossier"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 gap-2.5 overflow-hidden"
          >
            {/* Header: Back to List + Player Bio */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
              <button
                type="button"
                onClick={onClearSelection}
                className="flex items-center gap-1 text-xs font-mono font-bold text-[#8FA3AD] hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Roster List</span>
              </button>
              <div className="p-1 rounded-lg bg-[#000C12] border border-white/10 shrink-0">
                <LeagueLogo leagueName={selectedPlayer.league} size="xs" />
              </div>
            </div>

            {/* Player Bio Hero Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#03151F]/90 border border-white/10 shrink-0">
              <div
                className="relative w-12 h-12 rounded-xl bg-[#000C12] border-2 overflow-hidden shrink-0 shadow-md"
                style={{ borderColor: clusterTheme.color }}
              >
                <img
                  src={getPlayerImage(selectedPlayer)}
                  alt={selectedPlayer.player_name}
                  className="w-full h-full object-cover object-top scale-105"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-extrabold text-white font-heading truncate leading-tight">
                  {selectedPlayer.player_name}
                </span>
                <span className="text-[11px] text-[#8FA3AD] truncate font-medium">
                  {selectedPlayer.squad} • {formatLeagueName(selectedPlayer.league)}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <PositionBadge positionGroup={selectedPlayer.position_group} />
                  <span className="px-1.5 py-0.5 rounded bg-[#000407] border border-white/10 text-[9px] font-mono text-[#8FA3AD]">
                    Age {selectedPlayer.age || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Soft GMM Probability Breakdown */}
            <div className="p-3 rounded-2xl bg-[#03151F]/80 border border-white/[0.06] flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8FA3AD]">
                <span>GMM Posterior Probabilities</span>
                <span className="font-bold text-white">P(Cluster | X)</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {Object.entries(selectedPlayer.probs || {}).map(([cName, prob]) => {
                  const pVal = Number(prob);
                  const isMain = cName === selectedClusterName;
                  const cTheme = getClusterTheme(cName);
                  const pct = Math.round(pVal * 100);

                  return (
                    <div key={cName} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={`truncate ${isMain ? 'font-bold text-white' : 'text-[#8FA3AD]'}`}>
                          {cName}
                        </span>
                        <span className="font-mono font-bold" style={{ color: isMain ? cTheme.color : '#8FA3AD' }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#000407] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cTheme.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BKLit Radar Chart Snapshot */}
            <div className="flex-1 min-h-[160px] p-2 rounded-2xl bg-[#03151F]/50 border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-full flex items-center justify-center scale-90">
                <RadarChart
                  data={selectedRadarData}
                  metrics={GMM_METRICS}
                  levels={3}
                  size={190}
                >
                  <RadarGrid showLabels={false} />
                  <RadarLabels />
                  <RadarArea index={0} showPoints={false} />
                </RadarChart>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-1.5 shrink-0 pt-1">
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  to={`/compare?p1=${selectedPlayer.player_id}`}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-95"
                >
                  <Swords className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Compare</span>
                </Link>
                <Link
                  to={`/u21-scouting?target=${selectedPlayer.player_id}`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FFB800]/15 hover:bg-[#FFB800]/25 text-[#FFD066] border border-[#FFB800]/30 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-95"
                >
                  <WonderkidReticleIcon className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>U21 Twins</span>
                </Link>
              </div>

              <Link
                to={`/player/${selectedPlayer.player_id}`}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#38B6FF] to-[#0088CC] hover:opacity-90 text-[#000C12] font-mono font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(56,182,255,0.3)] cursor-pointer active:scale-95"
              >
                <span>Full Prospect Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* --- MODE 1: ROSTER & CHAMELEON SCANNER LIST --- */
          <motion.div
            key="roster-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 gap-2.5 overflow-hidden"
          >
            {/* Header: Segment Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[#03151F] border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('exemplars')}
                className={`py-1.5 px-2 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'exemplars'
                    ? 'bg-[#38B6FF] text-[#000C12] shadow-sm'
                    : 'text-[#8FA3AD] hover:text-white'
                }`}
              >
                Pure ({exemplars.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chameleons')}
                className={`py-1.5 px-2 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'chameleons'
                    ? 'bg-[#A855F7] text-white shadow-sm'
                    : 'text-[#8FA3AD] hover:text-white'
                }`}
              >
                Chameleons
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('u21')}
                className={`py-1.5 px-2 rounded-xl text-[10.5px] font-mono font-bold transition-all cursor-pointer text-center ${
                  activeTab === 'u21'
                    ? 'bg-[#FFB800] text-[#000C12] shadow-sm'
                    : 'text-[#8FA3AD] hover:text-white'
                }`}
              >
                U21 ({u21List.length})
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Filter cohort..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#03151F]/90 text-xs font-medium text-white placeholder-white/40 px-3 py-1.5 pl-8 rounded-xl border border-white/10 focus:outline-none focus:border-[#38B6FF]/50"
              />
              <Search className="w-3.5 h-3.5 text-[#8FA3AD] absolute left-2.5 top-2.5" />
            </div>

            {/* Scrollable Player List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2">
              {displayedList.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#8FA3AD]">
                  No players found in this segment.
                </div>
              ) : (
                displayedList.map((player, idx) => {
                  const img = getPlayerImage(player);
                  const mainPct = Math.round(player.clusterProb * 100);

                  return (
                    <button
                      key={player.player_id}
                      onClick={() => onSelectPlayer(player)}
                      className="w-full p-2.5 rounded-2xl bg-[#03151F]/90 hover:bg-[#03151F] border border-white/10 hover:border-[#38B6FF]/50 text-left transition-all active:scale-[0.98] group cursor-pointer flex items-center justify-between gap-2.5 shadow-md"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="text-xs font-mono font-extrabold text-[#5A7280] w-4 text-center">
                          #{idx + 1}
                        </div>
                        <div
                          className="relative w-10 h-10 rounded-xl bg-[#000C12] border overflow-hidden shrink-0"
                          style={{ borderColor: clusterTheme.color }}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-[#38B6FF] truncate">
                            {player.player_name}
                          </span>
                          <span className="text-[10px] text-[#8FA3AD] truncate">
                            {player.squad} • Age {player.age || '—'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 font-mono text-[10px]">
                        <span className="font-extrabold" style={{ color: clusterTheme.color }}>
                          {mainPct}% Fit
                        </span>
                        <span className="text-[9px] text-[#5A7280]">
                          H = {player.entropy.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-2 rounded-2xl bg-[#03151F]/80 border border-white/[0.06] text-center text-[10px] font-mono text-[#8FA3AD] shrink-0">
              Click any player to inspect multi-archetype breakdown →
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
