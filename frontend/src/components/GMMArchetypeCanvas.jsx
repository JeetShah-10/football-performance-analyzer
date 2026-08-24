import React, { useState, useMemo } from 'react';
import {
  GMMCurveIcon,
  PitchProgressionIcon,
} from './icons/TacticalIcons';
import RadarChart, { RadarGrid, RadarLabels, RadarArea } from './RadarChart';
import {
  GMM_METRICS,
  GMM_METRIC_MAP,
  getClusterTheme,
  generateGaussianCurvePoints,
} from '../lib/gmmUtils';

export default function GMMArchetypeCanvas({
  selectedCluster = null,
  clusterPlayers = [],
  positionPlayers = [],
  className = '',
}) {
  const [activeCurveMetric, setActiveCurveMetric] = useState('PrgP_per90');
  const [hoveredCurveX, setHoveredCurveX] = useState(null);

  const theme = useMemo(() => {
    return getClusterTheme(selectedCluster?.cluster_name);
  }, [selectedCluster]);

  const populationPct = useMemo(() => {
    if (!positionPlayers.length) return '0.0';
    return ((clusterPlayers.length / positionPlayers.length) * 100).toFixed(1);
  }, [clusterPlayers, positionPlayers]);

  // Compute live sample statistics for all 8 metrics dynamically
  const liveStats = useMemo(() => {
    if (!positionPlayers.length) return [];

    return GMM_METRICS.map((metric) => {
      const posVals = positionPlayers.map((p) => Number(p[metric.key] ?? 0)).filter((v) => !isNaN(v));
      const clusterVals = clusterPlayers.map((p) => Number(p[metric.key] ?? 0)).filter((v) => !isNaN(v));

      const posMean = posVals.length ? posVals.reduce((a, b) => a + b, 0) / posVals.length : 1.0;
      const clusterMean = clusterVals.length ? clusterVals.reduce((a, b) => a + b, 0) / clusterVals.length : posMean;

      // Sample standard deviation
      const posVar = posVals.length > 1
        ? posVals.reduce((acc, val) => acc + Math.pow(val - posMean, 2), 0) / (posVals.length - 1)
        : 1.0;
      const posStd = Math.max(0.05, Math.sqrt(posVar));

      const zScoreDiff = (clusterMean - posMean) / posStd;

      return {
        feature: metric.key,
        short: metric.short,
        label: metric.label,
        cluster_mean: clusterMean,
        pos_mean: posMean,
        pos_std: posStd,
        z_score_diff: zScoreDiff,
      };
    }).sort((a, b) => b.z_score_diff - a.z_score_diff);
  }, [positionPlayers, clusterPlayers]);

  // Radar metrics dataset
  const radarData = useMemo(() => {
    if (!liveStats.length) return [];
    const statsObj = {};
    liveStats.forEach((s) => {
      // Map z-score (-2.5 to +2.5) into 0-100 percentile approximation
      const normPct = Math.min(99, Math.max(5, Math.round(50 + s.z_score_diff * 20)));
      statsObj[s.feature] = {
        percentile: normPct,
        value: s.cluster_mean,
      };
    });

    return [
      {
        label: selectedCluster?.cluster_name || 'Archetype',
        color: theme.color,
        stats: statsObj,
      },
    ];
  }, [liveStats, selectedCluster, theme]);

  // Active metric curve calculation for the Expanded Gaussian Studio
  const curveData = useMemo(() => {
    const stat = liveStats.find((s) => s.feature === activeCurveMetric) || liveStats[0] || {
      cluster_mean: 2.0,
      pos_mean: 1.5,
      pos_std: 0.8,
      z_score_diff: 0.6,
    };

    const cMean = stat.cluster_mean;
    const pMean = stat.pos_mean;
    const stdDev = Math.max(0.15, stat.pos_std);

    const minX = Math.max(0, Math.min(cMean, pMean) - 2.8 * stdDev);
    const maxX = Math.max(cMean, pMean) + 2.8 * stdDev;

    const basePoints = generateGaussianCurvePoints(pMean, stdDev, minX, maxX, 70);
    const clusterPoints = generateGaussianCurvePoints(cMean, stdDev * 0.92, minX, maxX, 70);

    const maxY = Math.max(...clusterPoints.map((p) => p.y), ...basePoints.map((p) => p.y)) * 1.15;

    return {
      stat,
      cMean,
      pMean,
      stdDev,
      minX,
      maxX,
      maxY: maxY || 1,
      basePoints,
      clusterPoints,
    };
  }, [liveStats, activeCurveMetric]);

  if (!selectedCluster) {
    return (
      <div className={`p-6 rounded-3xl bg-[#000810] border border-white/[0.08] flex items-center justify-center text-xs font-mono text-[#8FA3AD] ${className}`}>
        Select an archetype to inspect tactical DNA...
      </div>
    );
  }

  // SVG Geometry for Expanded Bell Curve
  const svgWidth = 800;
  const svgHeight = 220;
  const svgPadLeft = 45;
  const svgPadRight = 35;
  const svgPadTop = 25;
  const svgPadBottom = 35;

  const plotW = svgWidth - svgPadLeft - svgPadRight;
  const plotH = svgHeight - svgPadTop - svgPadBottom;

  const scaleCurveX = (x) => svgPadLeft + ((x - curveData.minX) / (curveData.maxX - curveData.minX || 1)) * plotW;
  const scaleCurveY = (y) => svgHeight - svgPadBottom - (y / curveData.maxY) * plotH;

  const baseCurvePath = curveData.basePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleCurveX(p.x)} ${scaleCurveY(p.y)}`).join(' ');
  const clusterCurvePath = curveData.clusterPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleCurveX(p.x)} ${scaleCurveY(p.y)}`).join(' ');
  const clusterAreaPath = `${clusterCurvePath} L ${scaleCurveX(curveData.clusterPoints[curveData.clusterPoints.length - 1].x)} ${svgHeight - svgPadBottom} L ${scaleCurveX(curveData.clusterPoints[0].x)} ${svgHeight - svgPadBottom} Z`;

  return (
    <div className={`flex flex-col h-full min-h-0 gap-2.5 overflow-hidden ${className}`}>
      
      {/* 1. TOP HERO: ARCHETYPE IDENTITY & RADAR PROFILE */}
      <div className="p-3.5 rounded-3xl bg-[#03151F]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border-2 shrink-0 shadow-lg"
            style={{
              borderColor: theme.color,
              backgroundColor: theme.bg,
              boxShadow: `0 0 20px ${theme.glow}`,
            }}
          >
            <GMMCurveIcon className="w-5 h-5" style={{ color: theme.color }} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: theme.color }}>
                Archetype #{selectedCluster.cluster_id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[9.5px] font-mono text-white/80 border border-white/10">
                {clusterPlayers.length} Players ({populationPct}%)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white font-heading truncate leading-tight mt-0.5">
              {selectedCluster.cluster_name}
            </h2>
          </div>
        </div>

        <p className="text-[11px] text-[#8FA3AD] max-w-sm font-sans line-clamp-2 leading-relaxed text-right hidden sm:block">
          {selectedCluster.description}
        </p>
      </div>

      {/* 2. MIDDLE SPLIT: 8D RADAR FOOTPRINT + STATISTICAL DIVERGENCE MATRIX */}
      <div className="h-[210px] shrink-0 grid grid-cols-1 md:grid-cols-12 gap-2.5 overflow-hidden">
        
        {/* Left (4 cols): 8D Tactical Radar Centroid */}
        <div className="md:col-span-4 h-full p-2.5 rounded-3xl bg-[#000810] border border-white/[0.08] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-2.5 left-3 text-[9.5px] font-mono uppercase tracking-wider text-[#8FA3AD] font-bold">
            Tactical Footprint
          </div>

          <div className="w-full h-full flex items-center justify-center scale-90 pt-2">
            <RadarChart
              data={radarData}
              metrics={GMM_METRICS}
              levels={3}
              size={185}
            >
              <RadarGrid showLabels={false} />
              <RadarLabels />
              <RadarArea index={0} showPoints={false} fillOpacity={0.4} />
            </RadarChart>
          </div>
        </div>

        {/* Right (8 cols): z-Score Divergence Matrix Grid */}
        <div className="md:col-span-8 h-full p-3 rounded-3xl bg-[#000810] border border-white/[0.08] shadow-2xl flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white">
              <PitchProgressionIcon className="w-3.5 h-3.5 text-[#38B6FF]" />
              <span>Statistical Divergence Matrix (z-Score Δ)</span>
            </div>
            <span className="text-[9.5px] font-mono text-[#8FA3AD]">
              Click metric to inspect Gaussian curve
            </span>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-1.5 overflow-y-auto custom-scrollbar pr-1">
            {liveStats.map((stat) => {
              const zVal = Number(stat.z_score_diff || 0);
              const isPositive = zVal >= 0;
              const barPct = Math.min(100, Math.abs(zVal) / 2.2 * 100);
              const isSelected = activeCurveMetric === stat.feature;

              return (
                <button
                  key={stat.feature}
                  type="button"
                  onClick={() => setActiveCurveMetric(stat.feature)}
                  className={`p-1.5 px-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#03151F] border-[#38B6FF]/60 shadow-sm'
                      : 'bg-[#000C12]/80 hover:bg-[#000C12] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className={`font-bold truncate ${isSelected ? 'text-[#38B6FF]' : 'text-white'}`}>
                      {stat.short}
                    </span>
                    <span
                      className="text-[10px] font-extrabold font-mono"
                      style={{ color: isPositive ? theme.color : '#8FA3AD' }}
                    >
                      {isPositive ? `+${zVal.toFixed(2)}σ` : `${zVal.toFixed(2)}σ`}
                    </span>
                  </div>

                  {/* Dual-Direction z-Score Bar */}
                  <div className="h-1.5 w-full bg-[#000407] rounded-full overflow-hidden relative flex mt-1">
                    <div className="w-1/2 h-full flex justify-end relative">
                      {!isPositive && (
                        <div
                          className="h-full bg-[#5A7280]/80 rounded-l-full"
                          style={{ width: `${barPct}%` }}
                        />
                      )}
                    </div>
                    <div className="w-[1px] h-full bg-white/30 z-10" />
                    <div className="w-1/2 h-full flex justify-start relative">
                      {isPositive && (
                        <div
                          className="h-full rounded-r-full"
                          style={{
                            width: `${barPct}%`,
                            backgroundColor: theme.color,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. EXPANDED GAUSSIAN PROBABILITY DENSITY STUDIO (Large, Prominent Canvas) */}
      <div className="flex-1 min-h-0 p-3.5 rounded-3xl bg-[#000810] border border-white/[0.08] shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Studio Header & Metric Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 shrink-0 pb-1.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <GMMCurveIcon className="w-4 h-4" style={{ color: theme.color }} />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Gaussian Probability Density Studio
            </span>
            <span className="text-[10px] font-mono text-[#38B6FF] bg-[#38B6FF]/10 px-2 py-0.5 rounded border border-[#38B6FF]/20">
              {GMM_METRIC_MAP[activeCurveMetric]?.short}
            </span>
          </div>

          {/* Metric Switcher Pills */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full">
            {GMM_METRICS.map((m) => {
              const isSelected = activeCurveMetric === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveCurveMetric(m.key)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#38B6FF] text-[#000C12] shadow-sm'
                      : 'bg-white/[0.04] text-[#8FA3AD] hover:text-white'
                  }`}
                >
                  {m.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big High-Resolution SVG Bell Curve Plot */}
        <div className="flex-1 w-full flex items-center justify-center min-h-0 my-1">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full max-h-full overflow-visible select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const svgX = ((e.clientX - rect.left) / rect.width) * svgWidth;
              const val = curveData.minX + ((svgX - svgPadLeft) / plotW) * (curveData.maxX - curveData.minX);
              setHoveredCurveX(Math.max(curveData.minX, Math.min(curveData.maxX, val)));
            }}
            onMouseLeave={() => setHoveredCurveX(null)}
          >
            <defs>
              <linearGradient id="gmmStudioGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={theme.color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={theme.color} stopOpacity="0.0" />
              </linearGradient>

              <filter id="gmmGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={theme.color} floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Grid & Axis Lines */}
            <line x1={svgPadLeft} y1={svgHeight - svgPadBottom} x2={svgWidth - svgPadRight} y2={svgHeight - svgPadBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1={svgPadLeft} y1={svgPadTop} x2={svgPadLeft} y2={svgHeight - svgPadBottom} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* X-Axis Ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const val = curveData.minX + pct * (curveData.maxX - curveData.minX);
              const tx = svgPadLeft + pct * plotW;
              return (
                <g key={pct} transform={`translate(${tx}, ${svgHeight - svgPadBottom})`}>
                  <line y1="0" y2="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <text y="14" fill="rgba(255,255,255,0.4)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Base Positional Distribution Curve (Dashed) */}
            <path
              d={baseCurvePath}
              fill="none"
              stroke="#5A7280"
              strokeWidth="2"
              strokeDasharray="5,4"
              opacity="0.65"
            />

            {/* Archetype Continuous Area & Curve */}
            <path d={clusterAreaPath} fill="url(#gmmStudioGrad)" />
            <path d={clusterCurvePath} fill="none" stroke={theme.color} strokeWidth="3" filter="url(#gmmGlow)" />

            {/* Vertical Mean Indicators */}
            {/* Positional Mean */}
            <g transform={`translate(${scaleCurveX(curveData.pMean)}, 0)`}>
              <line y1={svgPadTop} y2={svgHeight - svgPadBottom} stroke="#5A7280" strokeWidth="1.5" strokeDasharray="3,3" />
              <rect x="-35" y={svgPadTop - 14} width="70" height="13" rx="3" fill="#000C12" stroke="#5A7280" strokeWidth="1" />
              <text x="0" y={svgPadTop - 4} fill="#8FA3AD" fontSize="7.5" fontFamily="monospace" textAnchor="middle">
                Pos μ: {curveData.pMean.toFixed(2)}
              </text>
            </g>

            {/* Archetype Centroid Mean */}
            <g transform={`translate(${scaleCurveX(curveData.cMean)}, 0)`}>
              <line y1={svgPadTop} y2={svgHeight - svgPadBottom} stroke={theme.color} strokeWidth="2" />
              <rect x="-42" y={svgPadTop - 14} width="84" height="13" rx="3" fill="#000C12" stroke={theme.color} strokeWidth="1" />
              <text x="0" y={svgPadTop - 4} fill={theme.color} fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Archetype μ: {curveData.cMean.toFixed(2)}
              </text>
            </g>

            {/* Interactive Hover Crosshair */}
            {hoveredCurveX !== null && (
              <g transform={`translate(${scaleCurveX(hoveredCurveX)}, 0)`}>
                <line y1={svgPadTop} y2={svgHeight - svgPadBottom} stroke="#38B6FF" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="0" cy={scaleCurveY(curveData.clusterPoints.find((p) => Math.abs(p.x - hoveredCurveX) < 0.2)?.y || 0)} r="4" fill="#38B6FF" />
              </g>
            )}
          </svg>
        </div>

        {/* Mathematical Telemetry Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8FA3AD] pt-1 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <span>Archetype μ = <strong className="text-white">{curveData.cMean.toFixed(2)}</strong></span>
            <span>Positional μ = <strong className="text-white">{curveData.pMean.toFixed(2)}</strong></span>
            <span>σ = <strong className="text-white">{curveData.stdDev.toFixed(2)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#38B6FF]">f(x) = (1 / σ√(2π)) e^(-½((x-μ)/σ)²)</span>
            <span className="font-bold px-2 py-0.5 rounded bg-white/[0.06] text-white">
              Δz = {curveData.stat.z_score_diff >= 0 ? `+${curveData.stat.z_score_diff.toFixed(2)}` : curveData.stat.z_score_diff.toFixed(2)}σ
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
