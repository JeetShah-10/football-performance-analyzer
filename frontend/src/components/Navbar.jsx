import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import HealthBadge from './HealthBadge'

const TABS = [
  { path: '/', label: 'Directory & 2D Map' },
  { path: '/u21-scouting', label: 'U21 Scouting' },
  { path: '/scout-chat', label: 'AI Scout Chat' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-40 bg-[#0c0a1a]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-purple-500/10 p-2 rounded-xl border border-purple-500/30 group-hover:border-purple-500/60 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-extrabold text-white tracking-wide text-sm hidden sm:block">
            Football Player Style Dashboard
          </span>
        </Link>

        {/* Center Tabs */}
        <div className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => {
            const isActive = location.pathname === tab.path || 
                            (tab.path === '/' && location.pathname.startsWith('/player/'))
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-zinc-800/50 ${
                  isActive ? 'text-zinc-50' : 'text-zinc-400'
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <HealthBadge />
        </div>
      </div>
    </nav>
  )
}
