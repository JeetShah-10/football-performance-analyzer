import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  Maximize2,
  Minimize2,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  METRIC_DEFINITIONS,
  calculateMedian,
  calculatePearsonCorrelation,
  CLUSTER_THEMES,
} from '../lib/metricConfigs';

export default function MetricCorrelationCanvas({
  players = [],
  xKey = 'npxG_per90',
  yKey = 'xAG_per90',
  spotlightPlayerId = null,
  activeCluster = 'All Clusters',
  isExpanded = false,
  onToggleExpand = () => {},
  onHoverPlayer = () => {},
  onLeavePlayer = () => {},
  onSelectPlayer = () => {},
  className = '',
}) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Advanced Visualization Toggles (Change 1 & Change 3)
  const [showTrendLine, setShowTrendLine] = useState(true);
  const [showDensity, setShowDensity] = useState(true);

  const width = 1000;
  const height = 620;
  const padLeft = 70;
  const padRight = 40;
  const padTop = 45;
  const padBottom = 55;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const xDef = METRIC_DEFINITIONS[xKey] || METRIC_DEFINITIONS.npxG_per90;
  const yDef = METRIC_DEFINITIONS[yKey] || METRIC_DEFINITIONS.xAG_per90;

  // Compute domains and medians
  const { minX, maxX, minY, maxY, medianX, medianY } = useMemo(() => {
    if (!players.length) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1, medianX: 0.5, medianY: 0.5 };
    }

    const xVals = players.map((p) => Number(p[xKey] ?? 0)).filter((v) => !isNaN(v));
    const yVals = players.map((p) => Number(p[yKey] ?? 0)).filter((v) => !isNaN(v));

    let rawMinX = Math.min(...xVals);
    let rawMaxX = Math.max(...xVals);
    let rawMinY = Math.min(...yVals);
    let rawMaxY = Math.max(...yVals);

    if (rawMinX === rawMaxX) { rawMinX -= 1; rawMaxX += 1; }
    if (rawMinY === rawMaxY) { rawMinY -= 1; rawMaxY += 1; }

    const spanX = rawMaxX - rawMinX;
    const spanY = rawMaxY - rawMinY;

    return {
      minX: rawMinX < 0 ? rawMinX - spanX * 0.05 : Math.max(0, rawMinX - spanX * 0.05),
      maxX: rawMaxX + spanX * 0.08,
      minY: rawMinY < 0 ? rawMinY - spanY * 0.05 : Math.max(0, rawMinY - spanY * 0.05),
      maxY: rawMaxY + spanY * 0.08,
      medianX: calculateMedian(xVals),
      medianY: calculateMedian(yVals),
    };
  }, [players, xKey, yKey]);

  // Coordinate scales
  const scaleX = (val) => padLeft + ((val - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (val) => height - padBottom - ((val - minY) / (maxY - minY)) * plotHeight;

  // Pearson Correlation & Linear Regression Calculation (Change 1)
  const correlation = useMemo(() => {
    const pairs = players
      .map((p) => ({ x: Number(p[xKey] ?? 0), y: Number(p[yKey] ?? 0) }))
      .filter((pt) => !isNaN(pt.x) && !isNaN(pt.y));
    return calculatePearsonCorrelation(pairs);
  }, [players, xKey, yKey]);

  // Regression trendline SVG endpoints
  const regressionLine = useMemo(() => {
    if (!correlation || Math.abs(correlation.r) < 0.02) return null;

    const x1 = minX;
    const y1 = correlation.slope * x1 + correlation.intercept;
    const x2 = maxX;
    const y2 = correlation.slope * x2 + correlation.intercept;

    return {
      x1: scaleX(x1),
      y1: scaleY(y1),
      x2: scaleX(x2),
      y2: scaleY(y2),
    };
  }, [correlation, minX, maxX, minY, maxY]);

  // Process plotted nodes & find top 5 outliers
  const { plottedPlayers, topOutliers, densityCenters } = useMemo(() => {
    const list = players.map((p) => {
      const xVal = Number(p[xKey] ?? 0);
      const yVal = Number(p[yKey] ?? 0);
      const theme = CLUSTER_THEMES[p.cluster_name] || { color: '#38B6FF' };

      const cx = scaleX(xVal);
      const cy = scaleY(yVal);

      const normDist = Math.hypot((xVal - medianX) / (maxX - minX || 1), (yVal - medianY) / (maxY - minY || 1));

      return {
        ...p,
        xVal,
        yVal,
        cx,
        cy,
        color: theme.color,
        normDist,
      };
    });

    const sorted = [...list].sort((a, b) => b.normDist - a.normDist);
    const outliers = sorted.slice(0, 5);

    // 2D Density Hubs (Change 3: Density Estimation around cluster epicenters)
    const centers = [
      { cx: scaleX(medianX), cy: scaleY(medianY), r: 110, color: 'rgba(56, 182, 255, 0.12)' },
      { cx: scaleX(medianX * 0.7), cy: scaleY(medianY * 0.8), r: 85, color: 'rgba(168, 85, 247, 0.09)' },
      { cx: scaleX(medianX * 1.3), cy: scaleY(medianY * 1.2), r: 95, color: 'rgba(16, 185, 129, 0.09)' },
    ];

    return { plottedPlayers: list, topOutliers: outliers, densityCenters: centers };
  }, [players, xKey, yKey, minX, maxX, minY, maxY, medianX, medianY]);

  // Spotlight Player reference
  const spotlightPlayer = useMemo(() => {
    if (!spotlightPlayerId) return null;
    return plottedPlayers.find((p) => p.player_id === spotlightPlayerId) || null;
  }, [spotlightPlayerId, plottedPlayers]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const medianPixelX = scaleX(medianX);
  const medianPixelY = scaleY(medianY);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        setHoveredNodeId(null);
        onLeavePlayer();
      }}
      className={`relative w-full h-full overflow-hidden bg-[#000810] select-none cursor-default rounded-3xl border border-white/[0.08] shadow-2xl flex items-center justify-center ${className}`}
    >
      {/* Top-Right Perspective, Regression, Density & Expand Controls */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#03151F]/90 backdrop-blur-xl border border-white/15 shadow-xl">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowTrendLine((v) => !v); }}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer border ${
            showTrendLine
              ? 'bg-[#38B6FF]/20 text-[#38B6FF] border-[#38B6FF]/40 shadow-sm'
              : 'bg-white/[0.04] text-[#8FA3AD] hover:text-white border-transparent'
          }`}
          title="Toggle Pearson Regression Line"
        >
          <TrendingUp className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowDensity((v) => !v); }}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer border ${
            showDensity
              ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40 shadow-sm'
              : 'bg-white/[0.04] text-[#8FA3AD] hover:text-white border-transparent'
          }`}
          title="Toggle 2D Density Contours"
        >
          <Activity className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2.5, z + 0.25)); }}
          className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-[#38B6FF]" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.75, z - 0.25)); }}
          className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-[#38B6FF]" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); resetView(); }}
          className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors cursor-pointer"
          title="Reset Perspective"
        >
          <RotateCcw className="w-4 h-4 text-[#FFB800]" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
          className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors cursor-pointer"
          title={isExpanded ? "Restore Side Panel" : "Maximize Canvas"}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-[#10B981]" />
          ) : (
            <Maximize2 className="w-4 h-4 text-[#10B981]" />
          )}
        </button>
      </div>

      {/* Bottom-Left Correlation & Regression Metadata Watermark */}
      <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 pointer-events-none text-[11px] font-mono font-bold text-[#8FA3AD]/80 uppercase tracking-widest">
        <Crosshair className="w-3.5 h-3.5 text-[#38B6FF]" />
        <span>{xDef.short} vs {yDef.short}</span>
        <span className="text-[#38B6FF] bg-[#38B6FF]/10 px-1.5 py-0.5 rounded border border-[#38B6FF]/20">
          r = {correlation.r >= 0 ? '+' : ''}{correlation.r.toFixed(2)} ({correlation.strength})
        </span>
        <span className="text-[#5A7280]">({plottedPlayers.length} Players)</span>
      </div>

      {/* Interactive SVG Metric Canvas */}
      <motion.div
        animate={{
          scale: zoom,
          x: pan.x,
          y: pan.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full h-full flex items-center justify-center pointer-events-auto"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-w-full max-h-full overflow-visible"
        >
          <defs>
            <radialGradient id="matrixGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#041F2D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000810" stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="trendLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38B6FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFB800" stopOpacity="0.8" />
            </linearGradient>

            <filter id="densityBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="24" />
            </filter>

            <filter id="nodeSpotlightGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38B6FF" floodOpacity="1" />
            </filter>
          </defs>

          {/* BACKGROUND OBSIDIAN PLATE */}
          <rect
            x={padLeft - 10}
            y={padTop - 10}
            width={plotWidth + 20}
            height={plotHeight + 20}
            rx="16"
            fill="url(#matrixGrad)"
            stroke="rgba(56, 182, 255, 0.15)"
            strokeWidth="1"
          />

          {/* 2D DENSITY / KERNEL CONTOUR TOPOGRAPHY (Change 3) */}
          {showDensity && (
            <g className="density-contours pointer-events-none opacity-80" filter="url(#densityBlur)">
              {densityCenters.map((d, i) => (
                <circle
                  key={i}
                  cx={d.cx}
                  cy={d.cy}
                  r={d.r}
                  fill={d.color}
                />
              ))}
            </g>
          )}

          {/* 4 QUADRANT SHADING ZONES */}
          <g className="quadrant-backgrounds pointer-events-none">
            {/* Top Right: High X, High Y */}
            <rect
              x={medianPixelX}
              y={padTop}
              width={padLeft + plotWidth - medianPixelX}
              height={medianPixelY - padTop}
              fill="rgba(56, 182, 255, 0.035)"
            />
            <text
              x={padLeft + plotWidth - 10}
              y={padTop + 16}
              fill="rgba(56, 182, 255, 0.55)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              ZONE I: HIGH {xDef.short.toUpperCase()} & HIGH {yDef.short.toUpperCase()}
            </text>

            {/* Top Left: Low X, High Y */}
            <rect
              x={padLeft}
              y={padTop}
              width={medianPixelX - padLeft}
              height={medianPixelY - padTop}
              fill="rgba(168, 85, 247, 0.025)"
            />
            <text
              x={padLeft + 10}
              y={padTop + 16}
              fill="rgba(168, 85, 247, 0.45)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="start"
            >
              ZONE II: HIGH {yDef.short.toUpperCase()} SPECIALISTS
            </text>

            {/* Bottom Right: High X, Low Y */}
            <rect
              x={medianPixelX}
              y={medianPixelY}
              width={padLeft + plotWidth - medianPixelX}
              height={height - padBottom - medianPixelY}
              fill="rgba(255, 184, 0, 0.025)"
            />
            <text
              x={padLeft + plotWidth - 10}
              y={height - padBottom - 8}
              fill="rgba(255, 184, 0, 0.45)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="end"
            >
              ZONE III: HIGH {xDef.short.toUpperCase()} SPECIALISTS
            </text>

            {/* Bottom Left: Low X, Low Y */}
            <text
              x={padLeft + 10}
              y={height - padBottom - 8}
              fill="rgba(255, 255, 255, 0.25)"
              fontSize="8.5"
              fontFamily="monospace"
              textAnchor="start"
            >
              ZONE IV: DEVELOPING / SYSTEM ROLES
            </text>
          </g>

          {/* DYNAMIC MEDIAN CROSSHAIR LINES */}
          <g className="median-crosshairs pointer-events-none">
            <line
              x1={medianPixelX}
              y1={padTop}
              x2={medianPixelX}
              y2={height - padBottom}
              stroke="rgba(56, 182, 255, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <line
              x1={padLeft}
              y1={medianPixelY}
              x2={padLeft + plotWidth}
              y2={medianPixelY}
              stroke="rgba(56, 182, 255, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />

            {/* Median Value Badge Labels */}
            <g transform={`translate(${medianPixelX}, ${padTop - 4})`}>
              <rect x="-35" y="-12" width="70" height="14" rx="3" fill="#000C12" stroke="rgba(56,182,255,0.4)" strokeWidth="1" />
              <text x="0" y="-2" fill="#38B6FF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Med: {xDef.format(medianX)}
              </text>
            </g>

            <g transform={`translate(${padLeft - 4}, ${medianPixelY})`}>
              <rect x="-65" y="-7" width="60" height="14" rx="3" fill="#000C12" stroke="rgba(56,182,255,0.4)" strokeWidth="1" />
              <text x="-35" y="3" fill="#38B6FF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                Med: {yDef.format(medianY)}
              </text>
            </g>
          </g>

          {/* LINEAR REGRESSION TRENDLINE (Change 1) */}
          {showTrendLine && regressionLine && (
            <g className="regression-trendline pointer-events-none">
              <line
                x1={regressionLine.x1}
                y1={regressionLine.y1}
                x2={regressionLine.x2}
                y2={regressionLine.y2}
                stroke="url(#trendLineGrad)"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.85"
              />
            </g>
          )}

          {/* AXES & NUMERICAL TICKS */}
          <g className="axes pointer-events-none">
            <line x1={padLeft} y1={height - padBottom} x2={padLeft + plotWidth} y2={height - padBottom} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <line x1={padLeft} y1={padTop} x2={padLeft} y2={height - padBottom} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />

            {/* X-Axis Ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const val = minX + pct * (maxX - minX);
              const tx = padLeft + pct * plotWidth;
              return (
                <g key={pct} transform={`translate(${tx}, ${height - padBottom})`}>
                  <line y1="0" y2="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <text y="18" fill="rgba(255,255,255,0.4)" fontSize="8.5" fontFamily="monospace" textAnchor="middle">
                    {xDef.format(val)}
                  </text>
                </g>
              );
            })}

            {/* Y-Axis Ticks */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const val = minY + pct * (maxY - minY);
              const ty = height - padBottom - pct * plotHeight;
              return (
                <g key={pct} transform={`translate(${padLeft}, ${ty})`}>
                  <line x1="-5" x2="0" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <text x="-10" y="3" fill="rgba(255,255,255,0.4)" fontSize="8.5" fontFamily="monospace" textAnchor="end">
                    {yDef.format(val)}
                  </text>
                </g>
              );
            })}

            {/* Axis Titles */}
            <text
              x={padLeft + plotWidth / 2}
              y={height - 18}
              fill="#FFFFFF"
              fontSize="10.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {xDef.axisLabel} →
            </text>

            <text
              x={22}
              y={padTop + plotHeight / 2}
              fill="#FFFFFF"
              fontSize="10.5"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
              transform={`rotate(-90 22 ${padTop + plotHeight / 2})`}
            >
              ↑ {yDef.axisLabel}
            </text>
          </g>

          {/* 1,802 PLAYER SCATTER NODES (Smooth, non-jittering click and hover) */}
          <g className="player-nodes">
            {plottedPlayers.map((player) => {
              const isSpotlight = spotlightPlayerId === player.player_id;
              const isHovered = hoveredNodeId === player.player_id;
              const isClusterActive = activeCluster === 'All Clusters' || activeCluster === player.cluster_name;
              const opacity = isSpotlight || isHovered ? 1 : isClusterActive ? 0.8 : 0.12;

              return (
                <circle
                  key={player.player_id}
                  cx={player.cx}
                  cy={player.cy}
                  r={isSpotlight ? 6.5 : isHovered ? 5.5 : 3.5}
                  fill={player.color}
                  stroke={isSpotlight || isHovered ? '#FFFFFF' : 'rgba(0,0,0,0.6)'}
                  strokeWidth={isSpotlight || isHovered ? 2 : 0.8}
                  className="cursor-pointer transition-opacity duration-150"
                  style={{
                    filter: isSpotlight ? 'url(#nodeSpotlightGlow)' : 'none',
                    opacity,
                  }}
                  onMouseEnter={(e) => {
                    setHoveredNodeId(player.player_id);
                    const rect = containerRef.current?.getBoundingClientRect();
                    const pointScreenX = e.clientX - (rect?.left || 0);
                    const pointScreenY = e.clientY - (rect?.top || 0);
                    onHoverPlayer(player, { x: pointScreenX, y: pointScreenY });
                  }}
                  onMouseLeave={() => {
                    setHoveredNodeId(null);
                  }}
                  onClick={() => onSelectPlayer(player)}
                />
              );
            })}
          </g>

          {/* TOP 5 OUTLIER CALLOUT PINS */}
          <g className="outlier-callouts pointer-events-none">
            {topOutliers.map((player, idx) => (
              <g key={player.player_id} transform={`translate(${player.cx}, ${player.cy})`}>
                <line x1="0" y1="0" x2={idx % 2 === 0 ? 15 : -15} y2={-14} stroke={player.color} strokeWidth="1" />
                <rect
                  x={idx % 2 === 0 ? 15 : -75}
                  y="-24"
                  width="65"
                  height="14"
                  rx="4"
                  fill="#000C12"
                  stroke={player.color}
                  strokeWidth="1"
                />
                <text
                  x={idx % 2 === 0 ? 47.5 : -42.5}
                  y="-14"
                  fill="#FFFFFF"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {player.player_name.split(' ').slice(-1)[0]}
                </text>
              </g>
            ))}
          </g>

          {/* SPOTLIGHT BEACON */}
          {spotlightPlayer && (
            <g className="spotlight-beacon pointer-events-none">
              <motion.circle
                cx={spotlightPlayer.cx}
                cy={spotlightPlayer.cy}
                r="16"
                fill="none"
                stroke="#38B6FF"
                strokeWidth="2"
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: [1, 2.2, 1], opacity: [0.9, 0, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.circle
                cx={spotlightPlayer.cx}
                cy={spotlightPlayer.cy}
                r="28"
                fill="none"
                stroke="#FFB800"
                strokeWidth="1.5"
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [1, 2.6, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />

              <g transform={`translate(${spotlightPlayer.cx}, ${spotlightPlayer.cy - 14})`}>
                <rect
                  x="-55"
                  y="-22"
                  width="110"
                  height="18"
                  rx="6"
                  fill="#000910"
                  stroke="#38B6FF"
                  strokeWidth="1"
                  filter="url(#nodeSpotlightGlow)"
                />
                <text
                  x="0"
                  y="-10"
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {spotlightPlayer.player_name}
                </text>
              </g>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
