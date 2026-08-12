import { Activity, Home, Users, Network, BarChart2, FileText, Info, Filter, Database, CheckCircle2, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchHealth } from '../lib/api'
import { MOCK_HEALTH } from '../lib/mockData'

const NAV_LINKS = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Players', path: '#' },
  { icon: Network, label: 'Clusters', path: '#' },
  { icon: BarChart2, label: 'Comparisons', path: '#' },
  { icon: Award, label: 'Top Performers', path: '#' },
  { icon: FileText, label: 'Reports', path: '#' },
  { icon: Info, label: 'About', path: '#' },
]

export default function Sidebar({ filters, setFilters, onApplyFilters }) {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    let mounted = true
    const loadHealth = async () => {
      const { data, error } = await fetchHealth()
      if (!mounted) return
      setHealth(error ? MOCK_HEALTH : data)
    }
    loadHealth()
    return () => { mounted = false }
  }, [])

  return (
    <aside className="w-64 h-screen flex flex-col bg-[#0b0f19] border-r border-[#1a2336] shrink-0 sticky top-0 overflow-y-auto custom-scrollbar">
      {/* Branding */}
      <div className="p-6 pb-4 border-b border-[#1a2336]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-pink-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white tracking-wider text-sm">FOOTBALL</span>
            <span className="text-xs text-purple-400 font-semibold tracking-widest">ANALYTICS</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">DISCOVER. ANALYZE. DOMINATE.</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="p-4 flex flex-col gap-1 border-b border-[#1a2336]">
        {NAV_LINKS.map((link, idx) => {
          const isActive = idx === 0
          return (
            <Link
              key={link.label}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-900/60 via-purple-600/40 to-indigo-900/40 border border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141c2e]'
              }`}
            >
              <link.icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : ''}`} />
              {link.label}
            </Link>
          )
        })}
      </div>

      {/* Filters Section */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            FILTERS
          </h3>
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
        </div>

        {/* Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-400">Search Player / Team</label>
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-[#121826] border-[#1f293d] rounded-lg text-xs"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* League */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-400">League</label>
          <select 
            className="w-full bg-[#121826] border-[#1f293d] rounded-lg text-xs"
            value={filters.league}
            onChange={(e) => setFilters({ ...filters, league: e.target.value })}
          >
            <option value="">All Leagues</option>
            <option value="Premier League">Premier League</option>
            <option value="La Liga">La Liga</option>
            <option value="Serie A">Serie A</option>
            <option value="Bundesliga">Bundesliga</option>
            <option value="Ligue 1">Ligue 1</option>
          </select>
        </div>

        {/* Position */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-400">Position</label>
          <select 
            className="w-full bg-[#121826] border-[#1f293d] rounded-lg text-xs"
            value={filters.position_group}
            onChange={(e) => setFilters({ ...filters, position_group: e.target.value })}
          >
            <option value="">All Positions</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>
        </div>

        {/* Age Range Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-medium text-zinc-400">
            <span>Age Range</span>
            <span className="font-mono text-purple-400">16 - 35</span>
          </div>
          <input 
            type="range" 
            min="16" 
            max="35" 
            className="accent-purple-500 cursor-pointer h-1 bg-[#1a2336] rounded-lg" 
          />
        </div>

        {/* Minutes Played Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-medium text-zinc-400">
            <span>Minutes Played</span>
            <span className="font-mono text-purple-400">0 - 5000</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="5000" 
            className="accent-purple-500 cursor-pointer h-1 bg-[#1a2336] rounded-lg" 
          />
        </div>

        {/* Apply Filters Button */}
        <button 
          onClick={onApplyFilters}
          className="mt-2 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center gap-2"
        >
          <Filter className="w-3.5 h-3.5" />
          APPLY FILTERS
        </button>
      </div>

      {/* Data Source Info */}
      <div className="p-4 mt-auto">
        <div className="relative bg-[#0e1422] rounded-xl p-4 border border-[#1b253b] overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />
          
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">DATA SOURCE</span>
          <h4 className="text-xs font-bold text-zinc-200 mb-2">FBref & Transfermarkt</h4>
          
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Data Updated
          </div>
          <span className="text-[10px] text-zinc-500 block mt-0.5">May 18, 2024</span>
        </div>
      </div>

    </aside>
  )
}
