import { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// 6 distinct vibrant colors for all 6 playing style archetypes
const DISTINCT_COLORS = [
  '#a855f7', // violet
  '#ec4899', // pink
  '#10b981', // emerald
  '#ef4444', // red
  '#22d3ee', // cyan
  '#f59e0b', // amber
]

export default function ClusterMap2D({ players, onSelectPlayer, limit = 'all', height = 360 }) {
  const navigate = useNavigate()

  // Format data for Recharts, slicing by limit if specified, and assigning 6 distinct cluster colors
  const { data, legend } = useMemo(() => {
    if (!players || players.length === 0) return { data: [], legend: [] }

    let sliced = players
    if (limit !== 'all') {
      const num = parseInt(limit, 10)
      if (!isNaN(num) && num > 0) {
        sliced = players.slice(0, num)
      }
    }

    const clusterMap = new Map()
    
    const formattedData = sliced.map((p) => {
      const clusterKey = p.cluster_name || `Cluster ${p.cluster_id ?? 0}`
      if (!clusterMap.has(clusterKey)) {
        const colorIdx = clusterMap.size % DISTINCT_COLORS.length
        clusterMap.set(clusterKey, DISTINCT_COLORS[colorIdx])
      }

      return {
        ...p,
        x: +(p.pca_x ?? 0).toFixed(2),
        y: +(p.pca_y ?? 0).toFixed(2),
        fill: clusterMap.get(clusterKey)
      }
    })

    const legendItems = Array.from(clusterMap.entries()).map(([name, color]) => ({ name, color }))

    return { data: formattedData, legend: legendItems }
  }, [players, limit])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload
      return (
        <div className="bg-[#120e26] border border-purple-500/40 p-3 rounded-xl shadow-2xl text-xs flex flex-col gap-1 min-w-[180px]">
          <div className="font-extrabold text-white text-sm">{p.player_name}</div>
          <div className="text-[11px] text-purple-300 font-semibold">{p.squad} • {p.league}</div>
          <div className="text-[10px] text-slate-400">Pos: {p.position || p.position_group} ({p.age ? `${p.age} yrs` : 'N/A'})</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.fill }} />
            <span className="text-[11px] font-bold" style={{ color: p.fill }}>{p.cluster_name}</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">PCA: ({p.x}, {p.y})</div>
          <div className="text-[9px] text-pink-400 font-bold mt-1">Click dot to inspect player →</div>
        </div>
      )
    }
    return null
  }

  const handlePointClick = (dataPoint) => {
    if (!dataPoint || !dataPoint.player_id) return
    if (onSelectPlayer) {
      onSelectPlayer(dataPoint.player_id)
    } else {
      navigate(`/player/${dataPoint.player_id}`)
    }
  }

  return (
    <motion.div 
      className="w-full flex flex-col justify-between"
      style={{ height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="PCA 1" 
              tick={{ fill: '#5b6478', fontSize: 10 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              domain={['auto', 'auto']}
              label={{ value: 'Principal Component 1', position: 'insideBottom', offset: -3, fill: '#5b6478', fontSize: 10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="PCA 2" 
              tick={{ fill: '#5b6478', fontSize: 10 }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              domain={['auto', 'auto']}
              label={{ value: 'Principal Component 2', angle: -90, position: 'insideLeft', fill: '#5b6478', fontSize: 10 }}
            />
            {/* Small crisp scatter dot size range */}
            <ZAxis type="number" range={[10, 10]} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} 
            />
            
            <Scatter 
              name="Players" 
              data={data} 
              onClick={handlePointClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  fillOpacity={0.85}
                  className="hover:opacity-100 hover:stroke-white hover:stroke-2 transition-all duration-200"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      {legend.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 justify-center px-2">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-300">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}


