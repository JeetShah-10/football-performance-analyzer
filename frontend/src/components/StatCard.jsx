import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, value, label, subtext }) {
  return (
    <motion.div 
      className="bg-card border border-zinc-800 rounded-xl p-4 flex items-center gap-4 hover:border-zinc-700 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
        <Icon className="w-6 h-6 text-emerald" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight">{value}</span>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
        {subtext && <span className="text-[10px] text-zinc-500 mt-0.5">{subtext}</span>}
      </div>
    </motion.div>
  )
}
