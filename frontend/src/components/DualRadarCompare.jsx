import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPlayerDetail } from '../lib/api';
import { MOCK_PLAYER_DETAILS } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo from './LeagueLogo';
import PositionBadge from './PositionBadge';
import ClusterTag from './ClusterTag';
import ShimmeringText from './ui/shimmering-text';

const RADAR_METRICS = [
  { key: 'npxG_per90', label: 'npxG', full: 'Non-Penalty xG' },
  { key: 'xAG_per90', label: 'xAG', full: 'Expected Assists' },
  { key: 'KP_per90', label: 'KP', full: 'Key Passes' },
  { key: 'PrgP_per90', label: 'PrgP', full: 'Prog. Passes' },
  { key: 'PrgC_per90', label: 'PrgC', full: 'Prog. Carries' },
  { key: 'Succ_per90', label: 'Succ', full: 'Take-ons Won' },
  { key: 'Tkl_per90', label: 'Tkl', full: 'Tackles Won' },
  { key: 'Int_per90', label: 'Int', full: 'Interceptions' },
];

export default function DualRadarCompare({
  player1Id = 'bukayo_saka_eng_eng_2001_0',
  player2Id = 'phil_foden_eng_eng_2000_0',
  onClose = null,
}) {
  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [res1, res2] = await Promise.all([
        fetchPlayerDetail(player1Id),
        fetchPlayerDetail(player2Id),
      ]);

      setP1(res1.data || MOCK_PLAYER_DETAILS[player1Id] || Object.values(MOCK_PLAYER_DETAILS)[0]);
      setP2(res2.data || MOCK_PLAYER_DETAILS[player2Id] || Object.values(MOCK_PLAYER_DETAILS)[1]);
      setLoading(false);
    }
    if (player1Id && player2Id) {
      loadData();
    }
  }, [player1Id, player2Id]);

  // Compute Tactical DNA Overlap (Cosine Similarity on 8D Percentiles)
  const cosineOverlap = useMemo(() => {
    if (!p1?.stats || !p2?.stats) return 85;
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

    if (normA === 0 || normB === 0) return 85;
    const sim = dot / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.min(99.9, Math.max(10, Math.round(sim * 1000) / 10));
  }, [p1, p2]);

  // Radar SVG Math
  const size = 320;
  const center = size / 2;
  const radius = 105;
  const numAxes = RADAR_METRICS.length;
  const angleSlice = (Math.PI * 2) / numAxes;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const pointsA = RADAR_METRICS.map((m, idx) => {
    const pct = p1?.stats?.[m.key]?.percentile ?? 50;
    const r = Math.max(0.1, Math.min(1.0, pct / 100)) * radius;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const pointsB = RADAR_METRICS.map((m, idx) => {
    const pct = p2?.stats?.[m.key]?.percentile ?? 50;
    const r = Math.max(0.1, Math.min(1.0, pct / 100)) * radius;
    const angle = angleSlice * idx - Math.PI / 2;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const polyA = pointsA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const polyB = pointsB.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  if (loading || !p1 || !p2) {
    return (
      <div className="p-8 rounded-2xl bg-[#03151F]/90 backdrop-blur-2xl border border-white/[0.08] text-center font-mono text-xs text-[#8FA3AD]">
        Loading Head-to-Head Tactical Compare Matrix...
      </div>
    );
  }

  const p1Img = getPlayerImage(p1);
  const p2Img = getPlayerImage(p2);

  return (
    <div className="relative rounded-3xl p-5 sm:p-7 bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF3C00]">
            Tactical Matrix Analysis
          </span>
          <ShimmeringText
            text="Head-to-Head Player Comparison"
            className="text-base sm:text-lg font-extrabold text-white font-heading"
          />
        </div>

        {/* Tactical DNA Overlap Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#000910]/90 border border-white/10 font-mono text-xs shadow-inner">
            <span className="text-[#8FA3AD]">DNA Overlap:</span>
            <span className="text-[#38B6FF] font-extrabold">{cosineOverlap}%</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8FA3AD] hover:text-white transition-colors text-xs font-mono"
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Main Comparison Section: Slot A vs Slot B Cards & Dual Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Player A Card (Crimson) */}
        <div className="lg:col-span-3 flex flex-col gap-3 p-4 rounded-2xl bg-[#000910]/80 border border-[#FF3C00]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#FF3C00]/20 text-[#FF7733] border border-[#FF3C00]/40">
              Slot A
            </span>
            <LeagueLogo leagueName={p1.league} size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#03151F] border border-[#FF3C00]/40 overflow-hidden shrink-0">
              <img src={p1Img} alt={p1.player_name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex flex-col min-w-0">
              <Link to={`/player/${p1.player_id}`} className="font-bold text-sm text-white hover:text-[#FF7733] truncate font-heading transition-colors">
                {p1.player_name}
              </Link>
              <span className="text-xs text-[#8FA3AD] truncate">{p1.squad}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <PositionBadge positionGroup={p1.position_group} />
            <span className="text-[#8FA3AD]">Age: <strong className="text-white">{p1.age || '—'}</strong></span>
          </div>
          <ClusterTag clusterName={p1.cluster_name} />
        </div>

        {/* Center: Overlapping Dual Radar Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible select-none">
              <defs>
                <linearGradient id="gradP1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF3C00" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FF7733" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="gradP2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#68C5F2" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Grid concentric rings */}
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
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray={lvl === 0.5 ? '3,3' : 'none'}
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
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Player 1 Polygon (Crimson) */}
              <motion.path
                d={polyA}
                fill="url(#gradP1)"
                stroke="#FF3C00"
                strokeWidth="2.5"
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Player 2 Polygon (Sky Blue) */}
              <motion.path
                d={polyB}
                fill="url(#gradP2)"
                stroke="#38B6FF"
                strokeWidth="2.5"
                strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />

              {/* Labels */}
              {RADAR_METRICS.map((m, idx) => {
                const angle = angleSlice * idx - Math.PI / 2;
                const lx = center + (radius + 20) * Math.cos(angle);
                const ly = center + (radius + 20) * Math.sin(angle);
                return (
                  <text
                    key={idx}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#94A3B8"
                    className="text-[10px] font-mono font-bold"
                  >
                    {m.label}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF3C00] shadow-[0_0_8px_rgba(255,60,0,0.6)]" />
              <span className="text-white font-bold">{p1.player_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#38B6FF] shadow-[0_0_8px_rgba(56,182,255,0.6)]" />
              <span className="text-white font-bold">{p2.player_name}</span>
            </div>
          </div>
        </div>

        {/* Right: Player B Card (Sky Blue) */}
        <div className="lg:col-span-3 flex flex-col gap-3 p-4 rounded-2xl bg-[#000910]/80 border border-[#38B6FF]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#38B6FF]/20 text-[#68C5F2] border border-[#38B6FF]/40">
              Slot B
            </span>
            <LeagueLogo leagueName={p2.league} size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#03151F] border border-[#38B6FF]/40 overflow-hidden shrink-0">
              <img src={p2Img} alt={p2.player_name} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex flex-col min-w-0">
              <Link to={`/player/${p2.player_id}`} className="font-bold text-sm text-white hover:text-[#38B6FF] truncate font-heading transition-colors">
                {p2.player_name}
              </Link>
              <span className="text-xs text-[#8FA3AD] truncate">{p2.squad}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
            <PositionBadge positionGroup={p2.position_group} />
            <span className="text-[#8FA3AD]">Age: <strong className="text-white">{p2.age || '—'}</strong></span>
          </div>
          <ClusterTag clusterName={p2.cluster_name} />
        </div>
      </div>

      {/* Delta Matrix Table */}
      <div className="overflow-x-auto rounded-2xl bg-[#000910]/70 border border-white/[0.06]">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-white/[0.06] text-[#8FA3AD] text-[10px] uppercase">
              <th className="p-3 text-left">Metric</th>
              <th className="p-3 text-center text-[#FF7733]">{p1.player_name}</th>
              <th className="p-3 text-center text-[#68C5F2]">{p2.player_name}</th>
              <th className="p-3 text-right">Advantage Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {RADAR_METRICS.map((m) => {
              const statA = p1.stats?.[m.key] || { value: 0, percentile: 50 };
              const statB = p2.stats?.[m.key] || { value: 0, percentile: 50 };
              const diffPct = Math.round(statA.percentile - statB.percentile);
              const p1Wins = diffPct > 0;
              const isTie = diffPct === 0;

              return (
                <tr key={m.key} className="hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-bold">{m.full} ({m.label})</td>
                  <td className="p-3 text-center">
                    <span className="text-white font-bold">{statA.value?.toFixed(2)}</span>
                    <span className="text-[10px] text-[#8FA3AD] ml-1">({statA.percentile}th)</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-white font-bold">{statB.value?.toFixed(2)}</span>
                    <span className="text-[10px] text-[#8FA3AD] ml-1">({statB.percentile}th)</span>
                  </td>
                  <td className="p-3 text-right">
                    {isTie ? (
                      <span className="text-[#8FA3AD]">Tied</span>
                    ) : p1Wins ? (
                      <span className="text-[#FF7733] font-bold">
                        +{diffPct}% ({p1.player_name.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="text-[#38B6FF] font-bold">
                        +{Math.abs(diffPct)}% ({p2.player_name.split(' ')[0]})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
