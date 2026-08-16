import React from 'react';
import { Compass } from 'lucide-react';
import ClusterMap2D from '../components/ClusterMap2D';

export default function PitchMapTab() {
  return (
    <div className="flex flex-col gap-6 max-w-[1536px] mx-auto px-4 sm:px-6 pt-6 pb-16">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>PCA Dimensionality Reduction Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            2D Tactical Pitch Scatter Map
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Visualizing 1,802 players across Europe's Top 5 Leagues projected onto 2 principal components with pitch markings. Hover over any node to inspect player stats or click to view full profile.
          </p>
        </div>

        {/* Position Group Legends */}
        <div className="flex items-center gap-4 bg-[#090d18] p-3 rounded-xl border border-zinc-800/80 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span className="text-zinc-300">Defenders</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-zinc-300">Midfielders</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="text-zinc-300">Forwards</span>
          </div>
        </div>
      </div>

      {/* Main 2D Scatter Pitch Canvas Container */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border-zinc-800 min-h-[600px] flex flex-col justify-center">
        <ClusterMap2D />
      </div>

    </div>
  );
}
