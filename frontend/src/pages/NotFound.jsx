import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="bg-zinc-900/50 p-4 rounded-full border border-zinc-800 mb-6">
          <AlertCircle className="w-12 h-12 text-zinc-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-50 mb-3">
          404: Page Not Found
        </h1>
        
        <p className="text-zinc-400 mb-8">
          The tactical analysis or player profile you're looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        
        <Link 
          to="/"
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Directory
        </Link>
      </motion.div>
    </div>
  )
}
