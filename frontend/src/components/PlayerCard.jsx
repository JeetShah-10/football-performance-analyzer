import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { getLeagueConfig, formatLeagueName } from './LeagueLogo';
import PositionBadge from './PositionBadge';
import ClusterTag from './ClusterTag';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function PlayerCard({ player }) {
  const [imgError, setImgError] = useState(false);

  const name = player.player_name || player.name || 'Unknown Player';
  const squad = player.squad || player.club || 'Club';
  const posGroup = player.position_group || player.position || 'Midfielder';
  const playerId = player.player_id || player.id;
  const leagueName = player.league || player.comp || 'Premier League';
  const archetype = player.cluster_name || player.archetype || 'Tactical Performer';
  const age = player.age || player.Age;
  const minutes = player.minutes_played || player.Min;

  const leagueConfig = getLeagueConfig(leagueName);
  const playerImg = getPlayerImage(player);

  return (
    <div className="group relative rounded-2xl bg-[#03151F]/90 backdrop-blur-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Top Dynamic League Border Rim */}
      <div
        className="absolute top-0 inset-x-0 h-1 transition-colors duration-500"
        style={{ backgroundColor: leagueConfig.borderColor }}
      />

      {/* Ambient League Glow Pod */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: leagueConfig.glow }}
      />

      {/* Card Content Top Section */}
      <div className="p-4 sm:p-5 flex flex-col gap-3.5 relative z-10">
        {/* Header Row: League Crest + Position Badge + Quick Compare CTA */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LeagueLogo leagueName={leagueName} size="md" />
            <PositionBadge positionGroup={posGroup} />
          </div>

          <Link
            to={`/compare?p1=${playerId}`}
            className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-white/[0.05] hover:bg-[#FF3C00] text-[#8FA3AD] hover:text-white border border-white/10 hover:border-[#FF3C00] transition-all shadow-sm"
            title="Compare in Split Tactical Arena"
          >
            VS Compare ↗
          </Link>
        </div>

        {/* Player Profile Center Section: Photo + Identity */}
        <Link to={`/player/${playerId}`} className="flex items-center gap-3.5 group/link">
          {/* Portrait Thumbnail */}
          <div className="relative w-14 h-14 rounded-2xl bg-[#000C12] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-inner group-hover/link:border-white/30 transition-colors">
            {playerImg && !imgError ? (
              <img
                src={playerImg}
                alt={name}
                className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-[1.02] group-hover/link:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono font-extrabold text-sm text-white/90 bg-[#000C12]">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Identity Stack */}
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-extrabold text-white font-heading truncate group-hover/link:text-[#38B6FF] transition-colors">
              {name}
            </h3>
            <p className="text-xs text-[#8FA3AD] font-medium truncate mt-0.5">
              {squad}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#5A7280] font-mono mt-1">
              <span>{formatLeagueName(leagueName)}</span>
              {age && (
                <>
                  <span>•</span>
                  <span>Age {age}</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Tactical Archetype Badge */}
        <div className="pt-2">
          <ClusterTag clusterName={archetype} />
        </div>
      </div>

      {/* Card Footer: Quick Metric Telemetry + Full Profile CTA */}
      <Link
        to={`/player/${playerId}`}
        className="px-4 py-2.5 bg-[#000C12]/80 border-t border-white/[0.06] flex items-center justify-between group-hover:bg-[#000C12] transition-colors relative z-10"
      >
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8FA3AD]">
          {minutes && <span>{minutes.toLocaleString()} mins</span>}
        </div>

        <span className="text-xs font-mono font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>View Profile</span>
          <span className="text-[#38B6FF]">→</span>
        </span>
      </Link>
    </div>
  );
}
