import React from 'react';
import { motion } from 'framer-motion';

export const METRIC_DEFINITIONS = [
  {
    category: 'Goal Threat & Box Presence',
    metrics: [
      { key: 'npxG_per90', label: 'Goal Threat (npxG)', short: 'Goal Threat', unit: '/90', desc: 'Non-penalty expected goals from open play and set pieces' },
      { key: 'xAG_per90', label: 'Assist Creation (xAG)', short: 'Assist Creation', unit: '/90', desc: 'Expected assisted goals created for teammates' },
    ],
  },
  {
    category: 'Progression & Creation',
    metrics: [
      { key: 'KP_per90', label: 'Chances Created (KP)', short: 'Chances Created', unit: '/90', desc: 'Key passes directly leading to team goalscoring attempts' },
      { key: 'PrgP_per90', label: 'Pass Progression', short: 'Pass Progression', unit: '/90', desc: 'Completed passes moving the ball >= 10 yards toward goal' },
      { key: 'PrgC_per90', label: 'Ball Progression (Carries)', short: 'Ball Progression', unit: '/90', desc: 'Forward ball carries moving >= 10 yards toward goal' },
      { key: 'Succ_per90', label: 'Dribble Take-Ons', short: 'Dribble Take-Ons', unit: '/90', desc: 'Successful 1v1 take-ons past defending opponents' },
    ],
  },
  {
    category: 'Defensive Disruption',
    metrics: [
      { key: 'Tkl_per90', label: 'Defensive Tackles', short: 'Defensive Tackles', unit: '/90', desc: 'Tackles won in all pitch zones per 90 mins' },
      { key: 'Int_per90', label: 'Pass Interceptions', short: 'Interceptions', unit: '/90', desc: 'Opponent passes cleanly intercepted per 90 mins' },
    ],
  },
];

function getTierStyle(pct, leagueConfig) {
  const eliteGradient = leagueConfig?.barGradient || 'bg-gradient-to-r from-[#FF3C00] to-[#FF7733]';
  const eliteGlow = leagueConfig?.barShadow || 'shadow-[0_0_10px_rgba(255,60,0,0.35)]';
  const eliteBadge = leagueConfig?.badge || 'bg-[#FF3C00]/15 text-[#FF7733] border-[#FF3C00]/40';
  const eliteText = leagueConfig?.textColor || 'text-[#FF3C00]';

  if (pct >= 85) {
    return {
      bar: eliteGradient,
      text: eliteText,
      badge: eliteBadge,
      label: 'Elite',
      glow: eliteGlow,
    };
  }
  if (pct >= 65) {
    return {
      bar: 'bg-gradient-to-r from-[#E8B33D] to-[#FFD066]',
      text: 'text-[#E8B33D]',
      badge: 'bg-[#E8B33D]/15 text-[#FFD066] border-[#E8B33D]/40',
      label: 'Strong',
      glow: 'shadow-[0_0_8px_rgba(232,179,61,0.3)]',
    };
  }
  if (pct >= 40) {
    return {
      bar: 'bg-gradient-to-r from-[#3AA6D9] to-[#68C5F2]',
      text: 'text-[#3AA6D9]',
      badge: 'bg-[#3AA6D9]/15 text-[#68C5F2] border-[#3AA6D9]/40',
      label: 'Average',
      glow: 'shadow-[0_0_6px_rgba(58,166,217,0.25)]',
    };
  }
  return {
    bar: 'bg-gradient-to-r from-[#5A7280] to-[#8FA3AD]',
    text: 'text-[#8FA3AD]',
    badge: 'bg-white/5 text-[#8FA3AD] border-white/10',
    label: 'Low',
    glow: '',
  };
}

export default function MetricPercentileBars({
  stats = {},
  activeMetric = null,
  onHoverMetric = () => {},
  leagueConfig = null,
}) {
  const themeColor = leagueConfig?.color || '#FF3C00';

  return (
    <div className="flex flex-col gap-4">
      {METRIC_DEFINITIONS.map((group, groupIdx) => {
        return (
          <div key={groupIdx} className="flex flex-col gap-2">
            {/* Category Header with Dynamic League Left-Border Accent */}
            <div
              className="flex items-center justify-between pl-2 border-l-2 pb-0.5 border-b border-white/[0.04] transition-colors duration-500"
              style={{ borderLeftColor: themeColor }}
            >
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#94A3B8] uppercase">
                {group.category}
              </span>
            </div>

            {/* Metrics List */}
            <div className="flex flex-col gap-2">
              {group.metrics.map((m) => {
                const statObj = stats[m.key] || { value: 0, percentile: 50 };
                const rawVal = typeof statObj.value === 'number' ? statObj.value.toFixed(2) : '0.00';
                const pct = typeof statObj.percentile === 'number' ? Math.round(statObj.percentile) : 50;
                const tier = getTierStyle(pct, leagueConfig);
                const isHovered = activeMetric === m.key;

                return (
                  <div
                    key={m.key}
                    onMouseEnter={() => onHoverMetric(m.key)}
                    onMouseLeave={() => onHoverMetric(null)}
                    className={`group relative flex flex-col gap-1.5 py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? 'bg-[#020B10] scale-[1.01]'
                        : 'bg-[#000910]/70 hover:bg-[#020B10] border-white/[0.06]'
                    }`}
                    style={
                      isHovered
                        ? {
                            borderColor: `${themeColor}80`,
                            boxShadow: `0 0 14px ${leagueConfig?.glow || 'rgba(255,60,0,0.15)'}`,
                          }
                        : {}
                    }
                  >
                    {/* Stat Labels with High-Contrast Shielding */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-[#F8FAFC] group-hover:text-white transition-colors font-mono shrink-0">
                          {m.short}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] font-sans truncate max-w-[130px] sm:max-w-[170px]">
                          {m.label}
                        </span>
                      </div>

                      {/* Stat Values with Solid Dark Contrast Pill */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-white bg-[#000407]/90 px-1.5 py-0.5 rounded border border-white/10 shadow-inner">
                          {rawVal}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm ${tier.badge}`}>
                          {pct}th %
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative h-1.5 w-full bg-[#000407] rounded-full overflow-hidden border border-white/[0.05]">
                      {/* 50% Benchmark Line */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/20 z-10" />

                      {/* Animated Fill Bar with Dynamic League Theme */}
                      <motion.div
                        className={`h-full rounded-full ${tier.bar} ${tier.glow}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
