import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';

import { fetchPlayerDetail } from '../lib/api';
import { MOCK_PLAYER_DETAILS } from '../lib/mockData';
import { getPlayerImage } from '../lib/playerImages';

import LeagueLogo, { getLeagueConfig, formatLeagueName } from '../components/LeagueLogo';
import PositionBadge from '../components/PositionBadge';
import ClusterTag from '../components/ClusterTag';
import TacticalRadar from '../components/TacticalRadar';
import MetricPercentileBars from '../components/MetricPercentileBars';
import GMMWidget from '../components/GMMWidget';
import SimilarPlayers from '../components/SimilarPlayers';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import ShimmeringText from '../components/ui/shimmering-text';

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const containerRef = useRef(null);

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [activeMetric, setActiveMetric] = useState(null);

  const playerImg = player ? getPlayerImage(player) : null;
  const leagueConfig = getLeagueConfig(player?.league || '');
  const themeColor = leagueConfig.color || '#FF3C00';
  const secondaryColor = leagueConfig.secondaryColor || '#FF7733';

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    setImgError(false);

    const { data, error: apiError } = await fetchPlayerDetail(playerId);

    if (apiError) {
      const mockPlayer = MOCK_PLAYER_DETAILS[playerId] || Object.values(MOCK_PLAYER_DETAILS)[0];
      setPlayer(mockPlayer);
    } else {
      setPlayer(data);
    }

    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (playerId) {
      loadProfile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [playerId, loadProfile]);

  // GSAP 3 Hardware-Accelerated 60fps Entrance Stagger
  useEffect(() => {
    if (!loading && player && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.gsap-bento-card',
          {
            opacity: 0,
            y: 18,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform,willChange',
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, player]);

  if (loading && !player) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 pt-20 pb-8 flex flex-col gap-4">
        <LoadingSkeleton variant="card" count={1} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <LoadingSkeleton variant="card" count={2} />
          <LoadingSkeleton variant="radar" count={1} />
          <LoadingSkeleton variant="card" count={2} />
        </div>
      </div>
    );
  }

  if (error && !player) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 pt-24 pb-8">
        <ErrorState message={error} onRetry={loadProfile} />
      </div>
    );
  }

  if (!player) return null;

  const initials = player.player_name
    ? player.player_name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <div
      ref={containerRef}
      className="relative text-[#F5F1EB] flex flex-col gap-4 sm:gap-5 max-w-[1536px] mx-auto px-4 sm:px-6 pt-18 sm:pt-20 pb-8 select-none"
    >
      {/* Studio Floodlight Atmosphere (Controlled Soft Beam + Field Glow) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[380px] pointer-events-none -z-10 transition-all duration-700 opacity-60"
        style={{
          background: `radial-gradient(ellipse 70% 300px at 50% 0%, ${leagueConfig.glow} 0%, rgba(255, 60, 0, 0.02) 50%, transparent 80%)`,
        }}
      />
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[750px] h-[250px] rounded-full blur-[140px] pointer-events-none -z-10 transition-colors duration-700 opacity-50"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${leagueConfig.glow} 0%, transparent 70%)`,
        }}
      />

      {/* 1. CINEMATIC HERO BANNER (Full-Spectrum Dynamic League Glass Canvas) */}
      <section
        className="gsap-bento-card relative rounded-3xl p-5 sm:p-7 backdrop-blur-2xl border border-white/[0.12] shadow-2xl overflow-hidden transition-all duration-700"
        style={{
          borderTopColor: leagueConfig.borderColor,
          background: player?.league?.toLowerCase()?.includes('ligue') || player?.league?.toLowerCase()?.startsWith('fr')
            ? `linear-gradient(105deg, ${leagueConfig.color}26 0%, ${leagueConfig.color}20 35%, ${leagueConfig.secondaryColor}16 70%, rgba(3, 21, 31, 0.95) 100%)`
            : `linear-gradient(105deg, ${leagueConfig.color}45 0%, ${leagueConfig.color}35 35%, ${leagueConfig.secondaryColor}26 70%, ${leagueConfig.color}18 100%)`,
          boxShadow: player?.league?.toLowerCase()?.includes('ligue') || player?.league?.toLowerCase()?.startsWith('fr')
            ? `0 0 28px ${leagueConfig.glow}, 0 20px 50px rgba(0, 0, 0, 0.85)`
            : `0 0 45px ${leagueConfig.glow}, 0 20px 50px rgba(0, 0, 0, 0.85), inset 0 0 80px ${leagueConfig.color}25`,
        }}
      >
        {/* Full-Card Centered Ambient Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${leagueConfig.glow.replace(/[\d.]+\)$/, '0.24)')} 0%, transparent 80%)`,
          }}
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Enlarged Clean Player Headshot & Identity Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7">
            {/* Enlarged Clean Player Portrait Frame */}
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-3xl p-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent shadow-[0_12px_36px_rgba(0,0,0,0.85)] shrink-0 group"
            >
              <div
                className="w-full h-full rounded-[22px] overflow-hidden bg-[#000C12] border flex items-center justify-center relative shadow-inner"
                style={{
                  borderColor: leagueConfig.borderColor,
                }}
              >
                {playerImg && !imgError ? (
                  <img
                    src={playerImg}
                    alt={player.player_name}
                    className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-[1.02] transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white/90 font-heading">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Large 56px League Crest, Position Badge & Player Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Large 56px Circular League Crest */}
              <LeagueLogo leagueName={player.league} size="lg" className="shrink-0" />

              {/* Identity Stack */}
              <div className="flex flex-col gap-1.5">
                {/* Position Badge & Club Meta Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <PositionBadge positionGroup={player.position_group} />
                  <span className="text-xs font-mono font-bold text-white/90">
                    {formatLeagueName(player.league)}
                  </span>
                  <span className="text-[#64748B]">•</span>
                  <span className="text-xs font-bold text-[#94A3B8]">
                    {player.squad || 'Club'}
                  </span>
                </div>

                {/* Player Name Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
                  {player.player_name}
                </h1>

                {/* Archetype Tag & Metrics Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <ClusterTag clusterName={player.cluster_name} />
                  {player.age && (
                    <span className="text-[11px] font-mono text-[#94A3B8] bg-[#000910]/90 px-2 py-0.5 rounded border border-white/10 shadow-sm">
                      Age: <strong className="text-white">{player.age}</strong>
                    </span>
                  )}
                  {player.minutes_played && (
                    <span className="text-[11px] font-mono text-[#94A3B8] bg-[#000910]/90 px-2 py-0.5 rounded border border-white/10 shadow-sm">
                      Season: <strong className="text-white">{player.minutes_played.toLocaleString()} mins</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Minimalist Action CTAs with Dynamic League Harmony */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/[0.08] shrink-0">
            <Link
              to={`/u21-scouting`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 text-xs font-bold font-mono text-white transition-all shadow-md active:scale-95 group"
              title="Find young prospects with similar 8D metrics"
            >
              <span>Scout U21 Twins</span>
              <span
                className="group-hover:translate-x-0.5 transition-transform"
                style={{ color: secondaryColor }}
              >
                →
              </span>
            </Link>

            <Link
              to={`/scout-chat`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold font-mono transition-all active:scale-95 group"
              style={{
                background: `linear-gradient(to right, ${themeColor}, ${secondaryColor})`,
                boxShadow: `0 0 16px ${leagueConfig.glow}`,
              }}
              title="Ask the AI Scout Agent natural language queries about this player"
            >
              <span>Ask AI Scout</span>
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. COMPACT TACTICAL BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Bento Column (4 cols): 8-Metric Percentile Progress Bars */}
        <div className="gsap-bento-card lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#03151F]/95 backdrop-blur-2xl border border-white/[0.08] shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
            <ShimmeringText
              text="Key Per-90 Percentiles"
              className="text-xs font-bold font-mono uppercase tracking-wider text-white"
            />
            <span className="text-[9px] font-mono text-[#94A3B8] bg-[#000910]/90 px-1.5 py-0.5 rounded border border-white/10">
              Pos. Baseline
            </span>
          </div>

          <MetricPercentileBars
            stats={player.stats}
            activeMetric={activeMetric}
            onHoverMetric={setActiveMetric}
            leagueConfig={leagueConfig}
          />
        </div>

        {/* Center Bento Column (4 cols): Tactical Radar Visualizer */}
        <div className="gsap-bento-card lg:col-span-4 flex flex-col gap-4">
          <TacticalRadar
            stats={player.stats}
            activeMetric={activeMetric}
            onHoverMetric={setActiveMetric}
            leagueConfig={leagueConfig}
          />

          {/* Clean Telemetry Coordinates Snippet with Contrast Shielding */}
          <div className="p-3.5 rounded-xl bg-[#03151F]/95 border border-white/[0.06] flex items-center justify-between">
            <span className="text-xs font-mono text-[#94A3B8]">PCA Coordinates</span>
            <div className="flex items-center gap-2 font-mono text-xs text-white">
              <span className="bg-[#000910]/90 px-2 py-0.5 rounded border border-white/10">
                X: <strong style={{ color: themeColor }}>{typeof player.pca_x === 'number' ? player.pca_x.toFixed(2) : '0.00'}</strong>
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="bg-[#000910]/90 px-2 py-0.5 rounded border border-white/10">
                Y: <strong style={{ color: secondaryColor }}>{typeof player.pca_y === 'number' ? player.pca_y.toFixed(2) : '0.00'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Bento Column (4 cols): GMM Soft-Clustering DNA + Similar Tactical Twins */}
        <div className="gsap-bento-card lg:col-span-4 flex flex-col gap-4">
          {/* GMM Soft-Clustering Widget */}
          <GMMWidget
            probabilities={player.gmm_probabilities}
            leagueConfig={leagueConfig}
          />

          {/* Top-5 Similar Players Widget */}
          <SimilarPlayers
            playerId={player.player_id}
            leagueConfig={leagueConfig}
          />
        </div>
      </div>
    </div>
  );
}
