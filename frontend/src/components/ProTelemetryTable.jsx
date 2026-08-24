import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPlayerImage } from '../lib/playerImages';
import LeagueLogo, { formatLeagueName } from './LeagueLogo';
import PositionBadge from './PositionBadge';
import ClusterTag from './ClusterTag';

const COLUMNS = [
  { key: 'player_name', label: 'Player & Club', sortable: true, align: 'left' },
  { key: 'league', label: 'League', sortable: true, align: 'center' },
  { key: 'position_group', label: 'Pos', sortable: true, align: 'center' },
  { key: 'cluster_name', label: 'Tactical Role', sortable: true, align: 'left' },
  { key: 'age', label: 'Age', sortable: true, align: 'center' },
  { key: 'minutes_played', label: 'Mins', sortable: true, align: 'right' },
  { key: 'npxG_per90', label: 'Goal Threat', sortable: true, align: 'right' },
  { key: 'xAG_per90', label: 'Assists', sortable: true, align: 'right' },
  { key: 'KP_per90', label: 'Chances', sortable: true, align: 'right' },
  { key: 'PrgP_per90', label: 'Pass Prog.', sortable: true, align: 'right' },
  { key: 'PrgC_per90', label: 'Carry Prog.', sortable: true, align: 'right' },
  { key: 'Succ_per90', label: 'Dribbles', sortable: true, align: 'right' },
  { key: 'Tkl_per90', label: 'Tackles', sortable: true, align: 'right' },
  { key: 'Int_per90', label: 'Intercepts', sortable: true, align: 'right' },
];

export default function ProTelemetryTable({ players = [] }) {
  const [sortKey, setSortKey] = useState('minutes_played');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      let valA = a[sortKey] ?? a.stats?.[sortKey]?.value ?? a.Age ?? a.Min ?? 0;
      let valB = b[sortKey] ?? b.stats?.[sortKey]?.value ?? b.Age ?? b.Min ?? 0;

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [players, sortKey, sortOrder]);

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-[#03151F]/90 backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
      <table className="w-full text-left text-xs border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-white/[0.08] bg-[#000910]/80 text-[#8FA3AD] font-mono text-[11px] uppercase tracking-wider select-none">
            <th className="p-3.5 text-center w-14">
              <span>ARENA</span>
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`p-3.5 ${
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left'
                } ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
              >
                <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  <span>{col.label}</span>
                  {sortKey === col.key && (
                    <span className="text-[#38B6FF] font-bold">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-white/[0.04] font-mono">
          {sortedPlayers.map((player) => {
            const playerId = player.player_id || player.id;
            const isCompared = comparedPlayerIds.includes(playerId);
            const playerImg = getPlayerImage(player);

            const npxG = player.npxG_per90 ?? player.stats?.npxG_per90?.value ?? 0;
            const xAG = player.xAG_per90 ?? player.stats?.xAG_per90?.value ?? 0;
            const KP = player.KP_per90 ?? player.stats?.KP_per90?.value ?? 0;
            const PrgP = player.PrgP_per90 ?? player.stats?.PrgP_per90?.value ?? 0;
            const PrgC = player.PrgC_per90 ?? player.stats?.PrgC_per90?.value ?? 0;
            const Succ = player.Succ_per90 ?? player.stats?.Succ_per90?.value ?? 0;
            const Tkl = player.Tkl_per90 ?? player.stats?.Tkl_per90?.value ?? 0;
            const Int = player.Int_per90 ?? player.stats?.Int_per90?.value ?? 0;

            return (
              <tr
                key={playerId}
                className={`hover:bg-white/[0.03] transition-colors group ${
                  isCompared ? 'bg-white/[0.05]' : ''
                }`}
              >
                {/* Compare In Arena Link */}
                <td className="p-3 text-center">
                  <Link
                    to={`/compare?p1=${playerId}`}
                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#FF3C00] text-[#8FA3AD] hover:text-white border border-white/10 hover:border-[#FF3C00] text-[10px] font-mono font-bold transition-all inline-block shadow-sm"
                    title="Compare in Arena"
                  >
                    VS ↗
                  </Link>
                </td>

                {/* Player & Squad */}
                <td className="p-3 min-w-[200px]">
                  <Link
                    to={`/player/${playerId}`}
                    className="flex items-center gap-3 group-hover:text-[#38B6FF] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#000C12] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={playerImg}
                        alt={player.player_name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs text-white font-sans truncate group-hover:text-[#38B6FF] transition-colors">
                        {player.player_name}
                      </span>
                      <span className="text-[10px] text-[#8FA3AD] truncate">
                        {player.squad || player.club || 'Club'}
                      </span>
                    </div>
                  </Link>
                </td>

                {/* League */}
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center" title={formatLeagueName(player.league)}>
                    <LeagueLogo leagueName={player.league} size="sm" />
                  </div>
                </td>

                {/* Position Group */}
                <td className="p-3 text-center">
                  <PositionBadge positionGroup={player.position_group} />
                </td>

                {/* Archetype */}
                <td className="p-3 min-w-[170px]">
                  <ClusterTag clusterName={player.cluster_name} />
                </td>

                {/* Age */}
                <td className="p-3 text-center text-xs text-white/90">
                  {player.age || player.Age || '—'}
                </td>

                {/* Minutes */}
                <td className="p-3 text-right text-xs text-[#8FA3AD]">
                  {(player.minutes_played || player.Min || 0).toLocaleString()}
                </td>

                {/* Per-90 Telemetry Metrics */}
                <td className="p-3 text-right text-xs font-bold text-white">
                  {Number(npxG).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-white">
                  {Number(xAG).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#E8B33D]">
                  {Number(KP).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#E8B33D]">
                  {Number(PrgP).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#E8B33D]">
                  {Number(PrgC).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#38B6FF]">
                  {Number(Succ).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#3AA6D9]">
                  {Number(Tkl).toFixed(2)}
                </td>
                <td className="p-3 text-right text-xs font-bold text-[#3AA6D9]">
                  {Number(Int).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
