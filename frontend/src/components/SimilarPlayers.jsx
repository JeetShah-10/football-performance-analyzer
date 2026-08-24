import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchSimilar } from '../lib/api';
import { MOCK_SIMILAR, MOCK_SIMILAR_U21 } from '../lib/mockData';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import ShimmeringText from './ui/shimmering-text';

export default function SimilarPlayers({ playerId, leagueConfig = null }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [u21Only, setU21Only] = useState(false);

  const themeColor = leagueConfig?.color || '#FF3C00';
  const secondaryColor = leagueConfig?.secondaryColor || '#FF7733';
  const primaryBadge = leagueConfig?.badge || 'bg-[#FF3C00]/15 text-[#FF7733] border-[#FF3C00]/30';

  useEffect(() => {
    let isMounted = true;
    async function load(isU21) {
      setLoading(true);
      setError(null);

      const { data, error: apiError } = await fetchSimilar(playerId, 5, isU21);

      if (!isMounted) return;

      if (apiError) {
        setSimilar(isU21 ? MOCK_SIMILAR_U21 : MOCK_SIMILAR);
      } else {
        setSimilar(data || []);
      }
      setLoading(false);
    }

    if (playerId) {
      load(u21Only);
    }

    return () => {
      isMounted = false;
    };
  }, [playerId, u21Only]);

  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-lg">
      {/* Header & Minimalist U21 Toggle */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
        <ShimmeringText
          text="Top-5 Tactical Twins"
          className="text-[11px] font-bold font-mono uppercase tracking-wider text-white"
        />

        {/* U21 Scouting Toggle with Dynamic Active Color */}
        <label className="flex items-center gap-2 cursor-pointer select-none group">
          <div
            className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300"
            style={{
              backgroundColor: u21Only ? themeColor : 'rgba(255,255,255,0.12)',
            }}
          >
            <span
              className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                u21Only ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span
            className="text-[10px] font-mono font-bold transition-colors duration-300"
            style={{
              color: u21Only ? (secondaryColor || themeColor) : '#94A3B8',
            }}
          >
            U21 Only
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={u21Only}
            onChange={(e) => setU21Only(e.target.checked)}
          />
        </label>
      </div>

      {loading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setU21Only((prev) => !prev)} />
      ) : similar.length === 0 ? (
        <div className="text-xs text-[#94A3B8] font-mono text-center py-5">
          No tactical matches found for this filter.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {similar.map((player, index) => {
              const score = typeof player.similarity_score === 'number' ? player.similarity_score : 85.0;
              const isTop = index === 0;

              return (
                <motion.div
                  key={player.player_id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Link to={`/player/${player.player_id}`}>
                    <div
                      className="group relative flex items-center justify-between p-2.5 rounded-xl bg-[#000910]/80 border border-white/[0.06] hover:bg-[#020D14] hover:border-white/15 transition-all cursor-pointer"
                      style={{
                        borderColor: isTop ? `${themeColor}40` : undefined,
                      }}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#F8FAFC] group-hover:text-white transition-colors truncate">
                            {player.player_name}
                          </span>
                          {isTop && (
                            <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded border shrink-0 ${primaryBadge}`}>
                              Best Fit
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] truncate">
                          <span>{player.squad || 'Squad'}</span>
                          {player.league && (
                            <>
                              <span>•</span>
                              <span className="truncate">{player.league}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-end">
                          <span
                            className="text-xs font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#000407]/90 border border-white/10 transition-colors duration-300"
                            style={{ color: secondaryColor || themeColor }}
                          >
                            {score.toFixed(1)}%
                          </span>
                          <span className="text-[8px] font-mono text-[#64748B] mt-0.5">
                            Cosine Match
                          </span>
                        </div>
                        <span className="text-xs text-[#64748B] group-hover:text-white group-hover:translate-x-0.5 transition-all font-mono">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
