import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getPlayerImage } from '../lib/playerImages'

export default function FeaturedPlayerCard({ player }) {
  if (!player) return null
  const imageSrc = getPlayerImage(player) || player.imageUrl

  return (
    <div className="bg-[#0d121f] border border-pink-500/30 rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_0_25px_rgba(236,72,153,0.15)]">
      
      {/* Background Neon Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: OVR Rating Badge */}
      <div className="flex justify-between items-start z-10">
        <div>
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">FEATURED STAR</span>
        </div>
        
        {/* 91 OVR Badge matching screenshot */}
        <div className="w-12 h-14 bg-gradient-to-b from-purple-600 to-indigo-900 border border-pink-400/50 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.4)]">
          <span className="font-mono text-lg font-black text-white leading-none">91</span>
          <span className="text-[9px] font-bold text-pink-300 tracking-wider leading-none mt-0.5">OVR</span>
        </div>
      </div>

      {/* Image / Avatar Placeholder Frame */}
      <div className="my-4 relative w-full h-44 bg-[#141b2b] rounded-xl border border-zinc-800 flex flex-col items-center justify-center overflow-hidden group">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={player.player_name} 
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-full bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-2xl font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              {player.player_name?.charAt(0)}
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Image Placeholder</span>
          </div>
        )}
      </div>

      {/* Player Meta Details */}
      <div className="z-10 flex flex-col gap-1">
        <h3 className="text-xl font-black text-white tracking-tight">
          {player.player_name}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-300 font-medium">{player.squad}</span>
          <span className="text-zinc-600">•</span>
          <span>{player.league}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
          <span className="font-semibold text-purple-400">{player.position}</span>
          <span className="text-zinc-600">•</span>
          <span>Age {player.age}</span>
        </div>
      </div>

      {/* VIEW FULL PROFILE → Button */}
      <Link 
        to={`/player/${player.player_id}`}
        className="mt-5 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/40 border border-purple-500/40 hover:bg-purple-900/60 hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] group"
      >
        VIEW FULL PROFILE
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-pink-400" />
      </Link>

    </div>
  )
}
