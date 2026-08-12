import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getPlayerImage } from '../lib/playerImages'

// Top performers static dataset matching reference screenshot
const TOP_PERFORMERS = [
  { id: 'erling_haaland_no_nor_2000_0', name: 'Erling Haaland', squad: 'Man City', pos: 'ST', rating: '91.2', borderGlow: 'border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
  { id: 'kylian_mbappe', name: 'Kylian Mbappé', squad: 'PSG', pos: 'ST', rating: '90.1', borderGlow: 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]' },
  { id: 'kevin_de_bruyne', name: 'Kevin De Bruyne', squad: 'Man City', pos: 'CAM', rating: '88.7', borderGlow: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
  { id: 'jude_bellingham_eng_eng_2003_0', name: 'Jude Bellingham', squad: 'Real Madrid', pos: 'CM', rating: '87.9', borderGlow: 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  { id: 'harry_kane', name: 'Harry Kane', squad: 'Bayern Munich', pos: 'ST', rating: '87.3', borderGlow: 'border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.2)]' },
]

export default function TopPerformersRow() {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-zinc-100 uppercase tracking-widest">
          TOP PERFORMERS
        </h2>
        <Link to="#" className="text-xs text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-1">
          VIEW ALL <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Grid of 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {TOP_PERFORMERS.map((player, idx) => {
          const imageSrc = getPlayerImage(player)
          return (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`relative bg-[#0d121f] rounded-2xl p-4 border ${player.borderGlow} flex flex-col items-center justify-between text-center overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}
            >
              {/* Top Rating Badge */}
              <div className="w-full flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                  {player.pos}
                </span>
                <span className="font-mono font-extrabold text-sm text-cyan-400">
                  {player.rating}
                </span>
              </div>

              {/* Avatar Frame */}
              <div className="w-20 h-20 rounded-full bg-[#161d2e] border border-zinc-700 overflow-hidden flex items-center justify-center text-xl font-bold text-zinc-400 group-hover:text-purple-400 transition-colors my-2 relative">
                {imageSrc ? (
                  <img src={imageSrc} alt={player.name} className="w-full h-full object-cover object-center" />
                ) : (
                  player.name.charAt(0)
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
              </div>

              {/* Player Info */}
              <div className="mt-2">
                <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate max-w-[130px]">
                  {player.name}
                </h3>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  {player.squad}
                </span>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
