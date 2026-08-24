import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink,
  Swords,
  Trophy,
  ArrowLeft,
} from 'lucide-react';
import {
  WonderkidReticleIcon,
  GoalVectorIcon,
  PitchProgressionIcon,
  DefensiveBarrierIcon,
} from './icons/TacticalIcons';
import { getPlayerImage } from '../lib/playerImages';
import { fetchPlayerDetail } from '../lib/api';
import { MOCK_PLAYER_DETAILS } from '../lib/mockData';
import { METRIC_DEFINITIONS, CLUSTER_THEMES } from '../lib/metricConfigs';
import LeagueLogo, { formatLeagueName } from './LeagueLogo';
import PositionBadge from './PositionBadge';
import ClusterTag from './ClusterTag';
import RadarChart, { RadarGrid, RadarLabels, RadarArea } from './RadarChart';

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

export default function CorrelationSideDeck({
  players = [],
  selectedPlayer = null,
  xKey = 'npxG_per90',
  yKey = 'xAG_per90',
  onSelectPlayer = () => {},
  onClearSelection = () => {},
  className = '',
}) {
  const [playerDetails, setPlayerDetails] = useState(null);

  const xDef = METRIC_DEFINITIONS[xKey] || METRIC_DEFINITIONS.npxG_per90;
  const yDef = METRIC_DEFINITIONS[yKey] || METRIC_DEFINITIONS.xAG_per90;

  // Fetch full details when player is selected
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!selectedPlayer?.player_id) {
        setPlayerDetails(null);
        return;
      }
      const { data, error } = await fetchPlayerDetail(selectedPlayer.player_id);
      if (!isMounted) return;

      if (!error && data) {
        setPlayerDetails(data);
      } else {
        const fallback = MOCK_PLAYER_DETAILS[selectedPlayer.player_id] || selectedPlayer;
        setPlayerDetails(fallback);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [selectedPlayer?.player_id]);

  const activePlayer = playerDetails || selectedPlayer;
  const stats = activePlayer?.stats || {};
  const playerImg = activePlayer ? getPlayerImage(activePlayer) : null;
  const theme = CLUSTER_THEMES[activePlayer?.cluster_name] || { color: '#38B6FF' };

  // Calculate Top Outliers in current view
  const topOutliers = useMemo(() => {
    if (!players.length) return [];
    const scored = players.map((p) => {
      const x = Number(p[xKey] ?? 0);
      const y = Number(p[yKey] ?? 0);
      return {
        ...p,
        xVal: x,
        yVal: y,
        combinedScore: x * 1.2 + y * 1.5,
      };
    });

    return scored.sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 5);
  }, [players, xKey, yKey]);

  const radarData = useMemo(() => {
    if (!activePlayer) return [];
    return [
      {
        label: activePlayer.player_name,
        values: RADAR_METRICS.map((m) => {
          if (stats[m.key]?.percentile !== undefined) {
            return stats[m.key].percentile;
          }
          const val = Number(activePlayer[m.key] || 0);
          return Math.min(99, Math.max(10, Math.round(val * 25)));
        }),
        color: theme.color || '#38B6FF',
      },
    ];
  }, [activePlayer, stats, theme]);

  return (
    <div
      className={`h-full flex flex-col rounded-3xl bg-[#020D14]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden p-3.5 gap-3 ${className}`}
    >
      <AnimatePresence mode="wait">
        {activePlayer ? (
          /* --- MODE 2: ACTIVE PLAYER TACTICAL DOSSIER --- */
          <motion.div
            key="player-dossier"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 gap-2.5 overflow-hidden"
          >
            {/* Header: Back to Leaderboard */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
              <button
                onClick={onClearSelection}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-[#8FA3AD] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Outlier Leaderboard</span>
              </button>
              <span className="text-[10px] font-mono font-bold text-[#38B6FF] uppercase">
                Active Telemetry
              </span>
            </div>

            {/* Scrollable Player Dossier Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 pr-1">
              
              {/* Player Hero Card */}
              <div className="p-3 rounded-2xl bg-[#03151F]/90 border border-white/10 shadow-lg flex flex-col gap-2.5 relative overflow-hidden">
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20"
                  style={{ backgroundColor: theme.color }}
                />

                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded-lg border font-mono text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${theme.color}20`,
                      borderColor: `${theme.color}50`,
                      color: theme.color,
                    }}
                  >
                    {activePlayer.position_group} • Active Roster
                  </span>
                  <div className="p-1 rounded-lg bg-[#000910]/90 border border-white/10 shadow-sm">
                    <LeagueLogo leagueName={activePlayer.league} size="xs" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="relative w-14 h-14 rounded-2xl bg-[#000C12] border-2 overflow-hidden shrink-0 shadow-md"
                    style={{ borderColor: theme.color }}
                  >
                    <img
                      src={playerImg}
                      alt={activePlayer.player_name}
                      className="w-full h-full object-cover object-top scale-105"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-black text-white font-heading truncate leading-tight">
                      {activePlayer.player_name}
                    </h3>
                    <span className="text-[11px] text-[#8FA3AD] font-semibold truncate mt-0.5">
                      {activePlayer.squad}
                    </span>
                    <span className="text-[9.5px] text-[#5A7280] font-mono">
                      {formatLeagueName(activePlayer.league)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <PositionBadge positionGroup={activePlayer.position_group} />
                    <span className="px-1.5 py-0.5 rounded bg-[#000407]/90 border border-white/10 text-[9px] font-mono text-[#8FA3AD]">
                      Age {activePlayer.age || '—'}
                    </span>
                  </div>
                  <ClusterTag clusterName={activePlayer.cluster_name} />
                </div>
              </div>

              {/* Active Metric Correlation Comparison */}
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                <div className="p-2 rounded-xl bg-[#000407]/80 border border-white/[0.06] flex flex-col gap-0.5">
                  <span className="text-[8.5px] text-[#8FA3AD] truncate">{xDef.short}</span>
                  <span className="text-sm font-extrabold text-[#38B6FF]">
                    {xDef.format(activePlayer[xKey])}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#000407]/80 border border-white/[0.06] flex flex-col gap-0.5">
                  <span className="text-[8.5px] text-[#8FA3AD] truncate">{yDef.short}</span>
                  <span className="text-sm font-extrabold text-[#FFB800]">
                    {yDef.format(activePlayer[yKey])}
                  </span>
                </div>
              </div>

              {/* BKLit Radar Chart */}
              <div className="p-2.5 rounded-2xl bg-[#03151F]/90 border border-white/10 shadow-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#8FA3AD]">
                    8D Tactical Radar
                  </span>
                  <span className="text-[9px] font-mono text-[#38B6FF]">
                    Percentiles
                  </span>
                </div>

                <div className="w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center my-1">
                  <RadarChart
                    data={radarData}
                    levels={3}
                    metrics={RADAR_METRICS}
                    size={210}
                    className="w-full h-full"
                  >
                    <RadarGrid _showLabels={false} />
                    <RadarLabels />
                    {radarData.map((item, i) => (
                      <RadarArea index={i} key={item.label} showPoints={false} />
                    ))}
                  </RadarChart>
                </div>
              </div>

            </div>

            {/* Bottom Action CTAs */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/[0.08] shrink-0">
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  to={`/compare?p1=${activePlayer.player_id}`}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
                >
                  <Swords className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Compare</span>
                </Link>
                <Link
                  to={`/u21-scouting?target=${activePlayer.player_id}`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FFB800]/15 hover:bg-[#FFB800]/25 text-[#FFD066] border border-[#FFB800]/30 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer text-center"
                >
                  <WonderkidReticleIcon className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>U21 Twins</span>
                </Link>
              </div>

              <Link
                to={`/player/${activePlayer.player_id}`}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#38B6FF] to-[#0088CC] hover:opacity-90 text-[#000C12] font-mono font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(56,182,255,0.3)] active:scale-95 cursor-pointer"
              >
                <span>Full Prospect Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* --- MODE 1: TOP OUTLIER LEADERBOARD --- */
          <motion.div
            key="outlier-leaderboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 gap-2.5 overflow-hidden"
          >
            {/* Header: Title + Tagline */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#38B6FF]">
                <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Top Outlier Leaders</span>
              </div>
              <span className="text-[10px] font-mono text-[#8FA3AD]">
                Top 5
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#03151F]/80 border border-white/[0.06] text-[10px] font-mono text-[#8FA3AD]">
              Ranked by combined output in <span className="text-[#38B6FF] font-bold">{xDef.short}</span> + <span className="text-[#FFB800] font-bold">{yDef.short}</span>.
            </div>

            {/* Scrollable Leaderboard List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
              {topOutliers.map((player, idx) => {
                const img = getPlayerImage(player);
                const themeColor = CLUSTER_THEMES[player.cluster_name]?.color || '#38B6FF';

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
                        style={{ borderColor: themeColor }}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white group-hover:text-[#38B6FF] truncate">
                          {player.player_name}
                        </span>
                        <span className="text-[10px] text-[#8FA3AD] truncate">
                          {player.squad} • {player.position_group}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 font-mono text-[10px]">
                      <span className="font-extrabold text-[#38B6FF]">
                        {xDef.format(player.xVal)}
                      </span>
                      <span className="text-[#FFB800] font-semibold">
                        {yDef.format(player.yVal)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-2.5 rounded-2xl bg-[#03151F]/80 border border-white/[0.06] text-center text-[10px] font-mono text-[#8FA3AD] shrink-0">
              Click any dot or player card to inspect 8D Radar Dossier →
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
