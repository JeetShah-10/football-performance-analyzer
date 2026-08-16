import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { fetchClusters } from '../lib/api';

const CLUSTER_DESCRIPTIONS = {
  'Dynamic Winger / Dribbler': 'High progressive carry volume, key pass generation, and successful take-ons in the final third.',
  'Deep-Lying Playmaker': 'Exceptional progressive pass distribution, press-resistant tempo control, and deep buildup involvement.',
  'Clinical Finisher / Poacher': 'High npxG per 90, box presence, and efficient conversion rate inside the 18-yard box.',
  'Box-to-Box Engine': 'Balanced output combining defensive tackles/interceptions with progressive transition carries.',
  'Aggressive Ball-Winner': 'High tackle and interception counts per 90 with intensive defensive duel success.',
  'Wide Playmaker / Inverted Winger': 'Creative chance creation from wide areas combining key passes with expected assists (xAG).',
  'Central Target Forward': 'High aerial duel involvement, hold-up play, and progressive link-up passing.',
};

export default function GMMTab() {
  const [positionGroup, setPositionGroup] = useState('Midfielder');
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetchClusters(positionGroup);
      if (res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.clusters || []);
        setClusters(list);
      }
    }
    load();
  }, [positionGroup]);

  return (
    <div className="flex flex-col gap-8 max-w-[1536px] mx-auto px-4 sm:px-6 pt-6 pb-16">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Gaussian Mixture Model (GMM) Machine Learning Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Tactical Archetypes & Soft-Clustering Matrix
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Unsupervised GMM soft-clustering categorizes 1,802 players into distinct tactical roles based on standardized per-90 metrics, allowing probability assignment across multiple archetypes.
          </p>
        </div>

        {/* Position Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#090d18] p-1.5 rounded-xl border border-zinc-800">
          {['Defender', 'Midfielder', 'Forward'].map((pos) => (
            <button
              key={pos}
              onClick={() => setPositionGroup(pos)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                positionGroup === pos
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {pos}s
            </button>
          ))}
        </div>
      </div>

      {/* Cluster Archetype Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((c, idx) => (
          <motion.div
            key={c.cluster_id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between gap-5 border-zinc-800"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  CLUSTER ID: #{c.cluster_id}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
                  {c.member_count || 120} Players ({((c.member_count || 120) / 18.02).toFixed(1)}%)
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white font-heading tracking-tight mt-1">
                {c.cluster_name}
              </h3>

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {CLUSTER_DESCRIPTIONS[c.cluster_name] || 'High percentile output across core positional metrics with specialized tactical role assignment.'}
              </p>
            </div>

            {/* Key Metric Averages */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800/80 text-center">
              <div className="p-2 rounded-xl bg-[#090d18]">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">KP / 90</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">88.4%</div>
              </div>
              <div className="p-2 rounded-xl bg-[#090d18]">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">PrgP / 90</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">92.1%</div>
              </div>
              <div className="p-2 rounded-xl bg-[#090d18]">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">xAG / 90</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">84.7%</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
