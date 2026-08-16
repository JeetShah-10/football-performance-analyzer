import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ShieldCheck } from 'lucide-react';
import { fetchPlayerDetail } from '../lib/api';

const METRIC_LABELS = {
  npxG_per90_pct: 'npxG / 90',
  xAG_per90_pct: 'xAG / 90',
  KP_per90_pct: 'Key Passes',
  PrgP_per90_pct: 'Prog Passes',
  PrgC_per90_pct: 'Prog Carries',
  Tkl_per90_pct: 'Tackles',
  Int_per90_pct: 'Interceptions',
  Succ_per90_pct: 'Take-Ons',
};

export default function DualRadarCompare({ defaultPlayerId1 = 'bukayo_saka_eng_eng_2001_0', defaultPlayerId2 = 'phil_foden_eng_eng_2000_0' }) {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  useEffect(() => {
    async function loadBoth() {
      const res1 = await fetchPlayerDetail(defaultPlayerId1);
      const res2 = await fetchPlayerDetail(defaultPlayerId2);
      
      if (res1.data) setPlayer1(res1.data);
      if (res2.data) setPlayer2(res2.data);
    }
    loadBoth();
  }, [defaultPlayerId1, defaultPlayerId2]);

  if (!player1 || !player2) {
    return (
      <div className="glass-card rounded-2xl p-8 flex items-center justify-center text-zinc-400 text-xs">
        Loading Dual Radar Comparison...
      </div>
    );
  }

  // Format Recharts data
  const chartData = Object.keys(METRIC_LABELS).map((key) => {
    return {
      metric: METRIC_LABELS[key],
      [player1.player_name]: player1.stats?.[key] || 50,
      [player2.player_name]: player2.stats?.[key] || 50,
    };
  });

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border-zinc-800">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Dual Tactical Radar Comparison</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Overlapping per-90 percentile rank comparison against positional peers
          </p>
        </div>

        {/* Player Selection Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{player1.player_name}</span>
          </div>

          <span className="text-xs text-zinc-500 font-mono font-bold">VS</span>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{player2.player_name}</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Area: Chart Left (60%) + Metric Table Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Recharts Overlapping Radar */}
        <div className="lg:col-span-7 h-[360px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
              
              {/* Player 1: Cyan */}
              <Radar
                name={player1.player_name}
                dataKey={player1.player_name}
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.35}
                strokeWidth={2}
              />

              {/* Player 2: Amber */}
              <Radar
                name={player2.player_name}
                dataKey={player2.player_name}
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Side-by-Side Metric Comparison Table */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
            Percentile Advantage Breakdown
          </h3>

          <div className="flex flex-col gap-2">
            {Object.keys(METRIC_LABELS).map((key) => {
              const val1 = player1.stats?.[key] || 0;
              const val2 = player2.stats?.[key] || 0;
              const diff = val1 - val2;
              const p1Wins = diff > 0;
              const p2Wins = diff < 0;

              return (
                <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090d18] border border-zinc-800/80 text-xs">
                  <span className="text-zinc-400 font-medium w-28 truncate">{METRIC_LABELS[key]}</span>
                  
                  {/* Player 1 Metric */}
                  <span className={`font-mono font-bold w-12 text-right ${p1Wins ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {val1.toFixed(1)}
                  </span>

                  {/* Difference Pill */}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${p1Wins ? 'bg-cyan-500/10 text-cyan-400' : p2Wins ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {diff > 0 ? `+${diff.toFixed(1)}` : diff < 0 ? `${diff.toFixed(1)}` : '='}
                  </span>

                  {/* Player 2 Metric */}
                  <span className={`font-mono font-bold w-12 text-left ${p2Wins ? 'text-amber-400' : 'text-zinc-400'}`}>
                    {val2.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
