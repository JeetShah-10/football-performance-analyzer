import React from 'react';
import { motion } from 'framer-motion';
import ClusterTag from './ClusterTag';
import ShimmeringText from './ui/shimmering-text';

/**
 * GMMWidget — Tactical Archetype Soft-Clustering Distribution
 * Visualizes Gaussian Mixture Model membership probabilities across positional archetypes.
 */
export default function GMMWidget({ probabilities = {}, leagueConfig = null }) {
  if (!probabilities || Object.keys(probabilities).length === 0) return null;

  const themeColor = leagueConfig?.color || '#FF3C00';
  const primaryGradient = leagueConfig?.barGradient || 'bg-gradient-to-r from-[#FF3C00] to-[#FF7733]';
  const primaryGlow = leagueConfig?.barShadow || 'shadow-[0_0_10px_rgba(255,60,0,0.35)]';
  const primaryBadge = leagueConfig?.badge || 'bg-[#FF3C00]/15 text-[#FF7733] border-[#FF3C00]/30';

  // Convert object { "Cluster Name": 0.85 } to sorted array
  const sortedProbs = Object.entries(probabilities)
    .map(([name, prob]) => ({ name, prob: Number(prob) || 0 }))
    .sort((a, b) => b.prob - a.prob);

  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-lg">
      {/* Clean Minimalist Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
        <ShimmeringText
          text="GMM Soft-Clustering DNA"
          className="text-[11px] font-bold font-mono uppercase tracking-wider text-white"
        />
        <span className="text-[9px] font-mono text-[#94A3B8] bg-[#000910]/90 px-1.5 py-0.5 rounded border border-white/10">
          Soft Mixture
        </span>
      </div>

      {/* Probabilities Spectrum with Studio Contrast Shielding */}
      <div className="flex flex-col gap-3">
        {sortedProbs.map((item, index) => {
          const percent = (item.prob * 100).toFixed(1);
          const isDominant = index === 0;
          const isSecondary = index === 1 && item.prob > 0.15;

          const barGradient = isDominant
            ? `${primaryGradient} ${primaryGlow}`
            : isSecondary
            ? 'bg-gradient-to-r from-[#E8B33D] to-[#FFC84D]'
            : 'bg-gradient-to-r from-[#3AA6D9]/80 to-[#5A7280]';

          return (
            <div key={item.name} className="flex flex-col gap-1.5 group p-2 rounded-xl bg-[#000910]/70 border border-white/[0.05]">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 truncate max-w-[190px] sm:max-w-[230px]">
                  <ClusterTag clusterName={item.name} />
                  {isDominant && (
                    <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded border shrink-0 ${primaryBadge}`}>
                      Primary
                    </span>
                  )}
                </div>
                <span
                  className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#000407]/90 border border-white/10 transition-colors duration-300"
                  style={{ color: isDominant ? themeColor : '#94A3B8' }}
                >
                  {percent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="h-1.5 w-full bg-[#000407] rounded-full overflow-hidden border border-white/[0.04]">
                <motion.div
                  className={`h-full rounded-full ${barGradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(3, item.prob * 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
