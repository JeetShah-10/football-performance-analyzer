import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Award } from 'lucide-react';
import { getPlayerImage } from '../lib/playerImages';

const POSITION_COLORS = {
  Defender: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/40', glow: 'rgba(2, 132, 199, 0.2)' },
  Midfielder: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'rgba(16, 185, 129, 0.2)' },
  Forward: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'rgba(245, 158, 11, 0.2)' },
};

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'FC';
}

export default function PlayerCard({ player }) {
  const [imgError, setImgError] = useState(false);

  const name = player.player_name || player.name || 'Unknown Player';
  const squad = player.squad || player.club || 'Top League';
  const posGroup = player.position_group || player.position || 'Midfielder';
  const playerId = player.player_id || player.id || 'bukayo_saka_eng_eng_2001_0';
  const archetype = player.cluster_name || player.archetype || 'Tactical Performer';
  const isU21 = player.is_u21 || (player.age && player.age <= 21);

  const posStyle = POSITION_COLORS[posGroup] || POSITION_COLORS.Midfielder;

  return (
    <Link to={`/player/${playerId}`} className="block group">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between gap-4 border-zinc-800/80 relative overflow-hidden h-full shadow-lg"
      >
        {/* Top Glow Accent */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-80 transition-opacity"
          style={{ background: posStyle.glow }}
        />

        {/* Top Header Row: Positional Badge + U21 Tag */}
        <div className="flex items-center justify-between gap-2 z-10">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${posStyle.bg} border ${posStyle.border} ${posStyle.text} text-[11px] font-bold font-mono uppercase tracking-wider`}>
            <Shield className="w-3 h-3" />
            <span>{posGroup}</span>
          </div>

          {isU21 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest font-mono">
              <Award className="w-3 h-3 text-amber-400" />
              <span>U21</span>
            </span>
          )}
        </div>

        {/* Center Section: Photo + Fallback Initials */}
        <div className="flex items-center gap-3.5 my-1 z-10">
          <div className="relative w-14 h-14 rounded-2xl bg-[#090d18] border border-zinc-700/80 overflow-hidden shrink-0 flex items-center justify-center shadow-inner group-hover:border-cyan-500/60 transition-colors">
            {!imgError ? (
              <img
                src={getPlayerImage(playerId)}
                alt={name}
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center font-mono font-bold text-sm ${posStyle.text} bg-[#0e1322]`}>
                {getInitials(name)}
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-extrabold text-white font-heading truncate group-hover:text-cyan-400 transition-colors">
              {name}
            </h3>
            <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">
              {squad}
            </p>
            <span className="text-[10px] text-zinc-500 font-mono mt-1 truncate">
              {player.comp || 'Top 5 League'}
            </span>
          </div>
        </div>

        {/* Bottom Archetype Tag */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between z-10">
          <span className="text-[10px] text-zinc-400 font-semibold truncate flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="truncate">{archetype}</span>
          </span>

          <span className="text-[11px] font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>

      </motion.div>
    </Link>
  );
}
