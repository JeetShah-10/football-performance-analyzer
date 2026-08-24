import React, { createContext, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';

const RadarContext = createContext(null);

export function RadarChart({
  data = [],
  levels = 3,
  metrics = [],
  size = 280,
  children,
  className = '',
}) {
  const center = size / 2;
  // Expand radius to maximize graph size within the given box without clipping labels
  const radius = (size / 2) * 0.76;
  const numAxes = metrics.length;
  const angleSlice = numAxes > 0 ? (Math.PI * 2) / numAxes : 0;

  const levelRatios = useMemo(() => {
    return Array.from({ length: levels }, (_, i) => (i + 1) / levels);
  }, [levels]);

  const value = {
    data,
    levels: levelRatios,
    metrics,
    size,
    center,
    radius,
    numAxes,
    angleSlice,
  };

  return (
    <RadarContext.Provider value={value}>
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        {/* Soft Ambient Backlit Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(56,182,255,0.25) 0%, rgba(255,184,0,0.15) 50%, transparent 80%)',
          }}
        />
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible relative z-10"
        >
          <defs>
            {data.map((item, idx) => {
              const color = item.color || (idx === 0 ? '#FFB800' : '#38B6FF');
              const filterId = `bklit-glow-${idx}`;
              const gradId = `bklit-grad-${idx}`;
              return (
                <React.Fragment key={filterId}>
                  <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={color} floodOpacity="0.75" />
                  </filter>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                  </linearGradient>
                </React.Fragment>
              );
            })}
          </defs>
          {children}
        </svg>
      </div>
    </RadarContext.Provider>
  );
}

export function RadarGrid({ _showLabels = false, className = '' }) {
  const { center, radius, numAxes, angleSlice, levels } = useContext(RadarContext);

  if (!numAxes) return null;

  return (
    <g className={`bklit-radar-grid ${className}`}>
      {/* Concentric Stadium Web Polygons */}
      {levels.map((lvl, lIdx) => {
        const isOuter = lIdx === levels.length - 1;
        const points = Array.from({ length: numAxes })
          .map((_, aIdx) => {
            const angle = angleSlice * aIdx - Math.PI / 2;
            const x = center + radius * lvl * Math.cos(angle);
            const y = center + radius * lvl * Math.sin(angle);
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <polygon
            key={lIdx}
            points={points}
            fill={isOuter ? 'rgba(3, 21, 31, 0.45)' : 'none'}
            stroke={isOuter ? 'rgba(56, 182, 255, 0.35)' : 'rgba(255, 255, 255, 0.09)'}
            strokeWidth={isOuter ? '1.5' : '1'}
            strokeDasharray={lIdx === 0 ? '3,3' : 'none'}
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
            stroke="rgba(255, 255, 255, 0.12)"
            strokeDasharray="2,2"
          />
        );
      })}
    </g>
  );
}

export function RadarLabels({ className = '' }) {
  const { center, radius, angleSlice, metrics } = useContext(RadarContext);

  if (!metrics || !metrics.length) return null;

  return (
    <g className={`bklit-radar-labels ${className}`}>
      {metrics.map((m, idx) => {
        const labelText = typeof m === 'object' ? (m.label || m.short || m.name) : m;
        const angle = angleSlice * idx - Math.PI / 2;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        let textAnchor = 'middle';
        let labelX = center + (radius + 15) * cosA;
        let labelY = center + (radius + 15) * sinA;

        if (cosA > 0.25) {
          textAnchor = 'start';
          labelX = center + (radius + 10) * cosA;
        } else if (cosA < -0.25) {
          textAnchor = 'end';
          labelX = center + (radius + 10) * cosA;
        }

        if (sinA > 0.7) labelY += 3;
        else if (sinA < -0.7) labelY -= 3;

        return (
          <text
            key={idx}
            x={labelX}
            y={labelY}
            textAnchor={textAnchor}
            dominantBaseline="central"
            fill="#94A3B8"
            className="text-[9.5px] font-mono font-extrabold"
          >
            {labelText}
          </text>
        );
      })}
    </g>
  );
}

export function RadarArea({ index = 0, showPoints = false, className = '' }) {
  const { data, center, radius, numAxes, angleSlice } = useContext(RadarContext);
  const item = data[index];

  if (!item || !item.values || !numAxes) return null;

  const color = item.color || (index === 0 ? '#FFB800' : '#38B6FF');
  const filterId = `url(#bklit-glow-${index})`;
  const gradId = `url(#bklit-grad-${index})`;

  const points = item.values.map((val, idx) => {
    const pct = typeof val === 'number' ? val : 50;
    const r = Math.max(0.12, Math.min(1.0, pct / 100)) * radius;
    const angle = angleSlice * idx - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <g className={`bklit-radar-area ${className}`}>
      <motion.path
        d={pathString}
        fill={gradId}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter={filterId}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
      />
      {showPoints &&
        points.map((p, pIdx) => (
          <circle
            key={pIdx}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            className="filter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          />
        ))}
    </g>
  );
}

export default RadarChart;
