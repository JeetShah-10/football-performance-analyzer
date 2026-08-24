import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ShimmeringText from './ui/shimmering-text';

const RADAR_METRICS = [
  { key: 'npxG_per90', label: 'Goal Threat', full: 'Goal Threat (Non-Penalty xG)', desc: 'Non-penalty expected goals per 90' },
  { key: 'xAG_per90', label: 'Assist xAG', full: 'Assist Creation (xAG)', desc: 'Expected assisted goals created' },
  { key: 'KP_per90', label: 'Key Chances', full: 'Chances Created (Key Passes)', desc: 'Key passes leading to shots' },
  { key: 'PrgP_per90', label: 'Pass Prog.', full: 'Pass Progression (PrgP)', desc: 'Completed forward passes >= 10 yards' },
  { key: 'PrgC_per90', label: 'Carry Prog.', full: 'Ball Progression (Carries)', desc: 'Forward ball carries >= 10 yards' },
  { key: 'Succ_per90', label: 'Take-Ons', full: 'Dribble Take-Ons (Succ)', desc: 'Successful 1v1 take-ons past opponents' },
  { key: 'Tkl_per90', label: 'Tackles', full: 'Defensive Tackles Won', desc: 'Tackles won in all pitch zones' },
  { key: 'Int_per90', label: 'Intercepts', full: 'Pass Interceptions', desc: 'Clean opponent passes intercepted' },
];

export default function TacticalRadar({
  stats = {},
  activeMetric = null,
  onHoverMetric = () => {},
  leagueConfig = null,
  className = '',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const themeColor = leagueConfig?.color || '#FF3C00';
  const secondaryColor = leagueConfig?.secondaryColor || '#FF7733';
  const ambientGlow = leagueConfig?.glow || 'rgba(255, 60, 0, 0.25)';

  const size = 360;
  const center = size / 2;
  const radius = 95;
  const numAxes = RADAR_METRICS.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  // Grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Calculate polygon points
  const points = RADAR_METRICS.map((m, idx) => {
    const statObj = stats[m.key] || { value: 0, percentile: 50 };
    const pct = typeof statObj.percentile === 'number' ? statObj.percentile : 50;
    const valRatio = Math.max(0.12, Math.min(1.0, pct / 100));
    const r = valRatio * radius;
    const angle = angleSlice * idx - Math.PI / 2;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    return {
      ...m,
      x,
      y,
      r,
      angle,
      pct: Math.round(pct),
      raw: typeof statObj.value === 'number' ? statObj.value.toFixed(2) : '0.00',
    };
  });

  const polygonPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className={`relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl overflow-hidden ${className}`}>
      {/* Background Ambient Spotlight with Controlled Soft Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700 opacity-60"
        style={{
          background: `radial-gradient(ellipse 65% 65% at 50% 50%, ${ambientGlow} 0%, transparent 75%)`,
        }}
      />

      {/* Header with Shimmering Text */}
      <div className="relative z-10 flex items-center justify-between w-full pb-2.5 border-b border-white/[0.06]">
        <div className="flex flex-col">
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-widest transition-colors duration-500"
            style={{ color: themeColor }}
          >
            Tactical Fingerprint
          </span>
          <ShimmeringText
            text="8D Positional Percentile Radar"
            className="text-xs sm:text-sm font-extrabold text-white font-heading"
          />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#000910]/90 border border-white/10 text-[10px] font-mono text-[#94A3B8]">
          <span>Centroid:</span>
          <span className="text-white font-bold">Pos Group</span>
        </div>
      </div>

      {/* Radar SVG Canvas */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center my-1">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full select-none overflow-visible"
        >
          <defs>
            <linearGradient id="dynamicRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.1" />
            </linearGradient>
            <filter id="radarDynamicGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={themeColor} floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Radar Background Polygons (Concentric Web) */}
          {levels.map((level, lIdx) => {
            const levelPoints = Array.from({ length: numAxes }).map((_, aIdx) => {
              const angle = angleSlice * aIdx - Math.PI / 2;
              const x = center + radius * level * Math.cos(angle);
              const y = center + radius * level * Math.sin(angle);
              return `${x},${y}`;
            });
            const is100 = level === 1.0;
            const is50 = level === 0.5;

            return (
              <polygon
                key={lIdx}
                points={levelPoints.join(' ')}
                fill={is100 ? 'rgba(3, 21, 31, 0.4)' : 'none'}
                stroke={is100 ? 'rgba(255, 255, 255, 0.2)' : is50 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)'}
                strokeWidth={is100 ? '1.5' : '1'}
                strokeDasharray={is50 ? '3,3' : 'none'}
              />
            );
          })}

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

          {/* Player Radar Polygon */}
          <motion.path
            d={polygonPath}
            fill="url(#dynamicRadarGrad)"
            stroke={themeColor}
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#radarDynamicGlow)"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Vertex Points & Labels with Unclipped Anchoring */}
          {points.map((p, idx) => {
            const cosA = Math.cos(p.angle);
            const sinA = Math.sin(p.angle);
            
            // Smart anchor calculation to prevent text from overlapping the radar
            let textAnchor = 'middle';
            let labelX = center + (radius + 18) * cosA;
            let labelY = center + (radius + 18) * sinA;

            if (cosA > 0.25) {
              textAnchor = 'start';
              labelX = center + (radius + 14) * cosA;
            } else if (cosA < -0.25) {
              textAnchor = 'end';
              labelX = center + (radius + 14) * cosA;
            }

            if (sinA > 0.7) {
              labelY += 4;
            } else if (sinA < -0.7) {
              labelY -= 4;
            }

            const isHighlight = activeMetric === p.key || hoveredPoint === p.key;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setHoveredPoint(p.key);
                  onHoverMetric(p.key);
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  onHoverMetric(null);
                }}
              >
                {/* Vertex Circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHighlight ? 6 : 4}
                  fill={isHighlight ? '#FFFFFF' : themeColor}
                  stroke="#000910"
                  strokeWidth="2"
                  className="transition-all duration-200 shadow-md"
                />

                {/* Metric Label with Crisp Legibility */}
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dominantBaseline="central"
                  fill={isHighlight ? '#FFFFFF' : '#94A3B8'}
                  className={`text-[10px] font-mono font-bold transition-colors ${
                    isHighlight ? 'font-extrabold fill-white' : ''
                  }`}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Hover Tooltip Footer with Solid Dark Contrast Shield */}
      <div className="relative z-10 w-full min-h-[44px] flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#000910]/95 border border-white/10 shadow-inner">
        {hoveredPoint || activeMetric ? (
          (() => {
            const targetKey = hoveredPoint || activeMetric;
            const p = points.find((pt) => pt.key === targetKey);
            if (!p) return null;
            return (
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-extrabold text-white font-heading truncate">
                    {p.full}
                  </span>
                  <span className="text-[10px] text-[#8FA3AD] truncate">
                    {p.desc}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="px-2 py-0.5 rounded-lg bg-[#000407]/90 border border-white/10 text-xs font-mono font-bold text-white shadow-sm">
                    {p.raw}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold border shadow-sm"
                    style={{
                      color: themeColor,
                      backgroundColor: `${themeColor}15`,
                      borderColor: `${themeColor}40`,
                    }}
                  >
                    {p.pct}th %
                  </span>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#8FA3AD]">
            <span>Hover any vertex to inspect per-90 values</span>
            <span className="text-white/60">0–100th %</span>
          </div>
        )}
      </div>
    </div>
  );
}
