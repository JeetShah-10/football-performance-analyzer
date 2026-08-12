import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { STAT_KEYS, STAT_LABELS } from '../lib/constants'

/**
 * Recharts RadarChart for percentile stats (0-100).
 * Supports optional compare overlay for a second player.
 */
export default function RadarChart({ stats, compareStats = null, compareColor = '#f59e0b', height = 300 }) {
  if (!stats) return null

  const data = STAT_KEYS.map((key) => {
    const dataPoint = {
      subject: STAT_LABELS[key],
      A: stats[key]?.percentile || 0,
      fullMark: 100,
    }
    if (compareStats) {
      dataPoint.B = compareStats[key]?.percentile || 0
    }
    return dataPoint
  })

  return (
    <motion.div 
      className="w-full"
      style={{ height }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false}
          />
          <Radar
            name="Player"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          {compareStats && (
            <Radar
              name="Compare"
              dataKey="B"
              stroke={compareColor}
              fill={compareColor}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#111827', 
              borderColor: '#27272a',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value.toFixed(1)}%`, 'Percentile']}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
