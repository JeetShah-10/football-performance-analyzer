import React from 'react';
import { motion } from 'framer-motion';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { formatLeagueName } from './LeagueLogo';
import PositionBadge from './PositionBadge';
import ClusterTag from './ClusterTag';
import { CLUSTER_THEMES } from '../lib/metricConfigs';

export default function PCAHoverHUD({ player, position, canvasRect }) {
  if (!player || !position) return null;

  const playerImg = getPlayerImage(player);
  const theme = CLUSTER_THEMES[player.cluster_name] || { color: '#38B6FF' };

  // Calculate Euclidean Distance to cluster centroid
  const pcaX = Number(player.pca_x ?? 0);
  const pcaY = Number(player.pca_y ?? 0);
  const centroid = theme.centroid || { x: 0, y: 0 };
  const distToCentroid = Math.hypot(pcaX - centroid.x, pcaY - centroid.y).toFixed(2);

  // Position calculation to prevent screen clipping
  const left = Math.min(Math.max(16, position.x + 18), (canvasRect?.width || 800) - 270);
  const top = Math.min(Math.max(16, position.y - 45), (canvasRect?.height || 500) - 200);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ left, top }}
      className="absolute pointer-events-none z-40 w-68 p-3 rounded-2xl bg-[#03151F]/98 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-2"
    >
      {/* Top Header: Player Avatar + Bio + League Logo */}
      <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="relative w-11 h-11 rounded-xl bg-[#000C12] border-2 overflow-hidden shrink-0 shadow-md"
            style={{ borderColor: theme.color }}
          >
            <img
              src={playerImg}
              alt={player.player_name}
              className="w-full h-full object-cover object-top scale-105"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-white font-heading truncate leading-tight">
              {player.player_name}
            </span>
            <span className="text-[10px] text-[#8FA3AD] truncate font-medium mt-0.5">
              {player.squad}
            </span>
            <span className="text-[9px] text-[#5A7280] font-mono">
              {formatLeagueName(player.league)}
            </span>
          </div>
        </div>

        <div className="p-1 rounded-lg bg-[#000910]/90 border border-white/10 shadow-sm shrink-0">
          <LeagueLogo leagueName={player.league} size="xs" />
        </div>
      </div>

      {/* Position & Archetype Cluster */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <PositionBadge positionGroup={player.position_group} />
          <span className="px-1.5 py-0.5 rounded bg-[#000407]/90 border border-white/10 text-[9px] font-mono text-[#8FA3AD]">
            Age {player.age || '—'}
          </span>
        </div>
        <ClusterTag clusterName={player.cluster_name} />
      </div>

      {/* Scientific Telemetry Box */}
      <div className="p-1.5 rounded-xl bg-[#000407]/90 border border-white/[0.06] flex items-center justify-between text-[9px] font-mono">
        <div>
          <span className="text-[#8FA3AD]">PCA: </span>
          <span className="text-white font-bold">({pcaX.toFixed(2)}, {pcaY.toFixed(2)})</span>
        </div>
        <div>
          <span className="text-[#8FA3AD]">Centroid: </span>
          <span className="text-[#38B6FF] font-bold">{distToCentroid}σ</span>
        </div>
      </div>

      {/* 3 Core Stats Snapshot with clean human-understandable labels */}
      <div className="grid grid-cols-3 gap-1 text-center font-mono">
        <div className="p-1 rounded-lg bg-[#000407]/80 border border-white/[0.04]">
          <div className="text-[8px] text-[#8FA3AD] uppercase font-bold">Goals (xG)</div>
          <div className="text-[11px] font-extrabold text-[#FF5252]">
            {player.npxG_per90 ? Number(player.npxG_per90).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="p-1 rounded-lg bg-[#000407]/80 border border-white/[0.04]">
          <div className="text-[8px] text-[#8FA3AD] uppercase font-bold">Assists (xAG)</div>
          <div className="text-[11px] font-extrabold text-[#38B6FF]">
            {player.xAG_per90 ? Number(player.xAG_per90).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="p-1 rounded-lg bg-[#000407]/80 border border-white/[0.04]">
          <div className="text-[8px] text-[#8FA3AD] uppercase font-bold">Prog Passes</div>
          <div className="text-[11px] font-extrabold text-[#10B981]">
            {player.PrgP_per90 ? Number(player.PrgP_per90).toFixed(1) : '0.0'}
          </div>
        </div>
      </div>

      <div className="text-[8.5px] font-mono text-[#5A7280] text-center">
        Click to inspect dossier
      </div>
    </motion.div>
  );
}
