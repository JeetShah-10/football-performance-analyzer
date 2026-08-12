import { motion } from 'framer-motion'
import ClusterTag from './ClusterTag'

/**
 * Renders the GMM Soft-Clustering probabilities as a series of progress bars.
 */
export default function GMMWidget({ probabilities }) {
  if (!probabilities) return null

  // Convert object { "Cluster Name": 0.85 } to sorted array
  const sortedProbs = Object.entries(probabilities)
    .map(([name, prob]) => ({ name, prob }))
    .sort((a, b) => b.prob - a.prob)

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
        Tactical DNA Breakdown
      </h3>
      
      <div className="flex flex-col gap-3">
        {sortedProbs.map((item, index) => {
          const percent = (item.prob * 100).toFixed(1)
          
          // Color intensity scales with probability
          const isDominant = item.prob > 0.5
          const isSecondary = item.prob > 0.1 && !isDominant
          
          let barColor = 'bg-zinc-700'
          if (isDominant) barColor = 'bg-emerald'
          if (isSecondary) barColor = 'bg-teal'

          return (
            <div key={item.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <ClusterTag clusterName={item.name} />
                <span className="font-mono text-zinc-300">{percent}%</span>
              </div>
              
              {/* Track */}
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                {/* Fill */}
                <motion.div 
                  className={`h-full rounded-full ${barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, item.prob * 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
