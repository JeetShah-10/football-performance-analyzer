import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, Brain, Users, ShieldCheck, MapPin, ChevronDown } from 'lucide-react';
import HeroSearch from '../components/HeroSearch';
import heroBgImg from '../assets/hero-bg.jpg';
import heroPlayerImg from '../assets/hero-player.webp';

function HeroScrollCue({ onClick }) {
  const springConfig = { damping: 18, stiffness: 300 };
  const cueX = useSpring(0, springConfig);
  const cueY = useSpring(0, springConfig);
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    cueX.set((e.clientX - centerX) * 0.35);
    cueY.set((e.clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    cueX.set(0);
    cueY.set(0);
  };

  return (
    <div className="relative z-30 flex items-center justify-center pointer-events-auto pb-1 mt-1 shrink-0">
      <motion.button
        ref={buttonRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: cueX, y: cueY }}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-[#FF4E32]/60 text-white/70 hover:text-white text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer group shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        title="Scroll to Intelligence Architecture"
      >
        {/* Pulsing Kickoff Orb Spell */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4E32] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4E32]" />
        </span>
        <span>DISCOVER MODULES</span>
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#FF4E32] group-hover:scale-125 transition-transform" />
        </motion.div>
      </motion.button>
    </div>
  );
}

export default function HomeTab() {
  const scrollToContent = () => {
    const nextSection = document.getElementById('intelligence-architecture');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05080C] text-[#F5F1EB] overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (100dvh VIEWPORT LOCKED FOR NORMAL NON-F11 BROWSERS)      */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] flex flex-col justify-between pt-12 sm:pt-14 pb-2 overflow-visible z-20">
        
        {/* Full-Bleed Edge-to-Edge hero-bg.jpg Backdrop (z-0, balanced visibility & brightened bottom-left corner) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={heroBgImg}
            alt="Eleven Tactical Hero Background"
            className="w-full h-full object-cover object-center filter brightness-78 contrast-112 saturate-95"
          />
          {/* Subtle cinematic tint allowing stadium floodlights & bottom-left tactical pitch details to shine through */}
          <div className="absolute inset-0 bg-[#05080C]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080C]/55 via-transparent to-black/30" />
        </div>

        {/* Hero Content: Vertically Centered with Left Column Elevated */}
        <div className="relative z-20 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center min-h-0 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center w-full h-full overflow-visible">
            
            {/* Left Column: Shifted Inward/Rightward for Tighter Balance */}
            <div className="lg:col-span-5 xl:col-span-5 relative z-30 flex flex-col justify-center lg:pl-8 xl:pl-14 lg:translate-x-4 overflow-visible">
              
              {/* Eyebrow Tag */}
              <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                <span className="w-6 h-[2.5px] bg-[#FF4E32]" />
                <span className="text-[10.5px] sm:text-xs md:text-sm font-mono font-bold tracking-[0.28em] text-[#FF4E32] uppercase">
                  FOOTBALL INTELLIGENCE PLATFORM
                </span>
              </div>

              {/* Fluid Heavy Italic Display Headline */}
              <h1 className="font-display text-[clamp(3.8rem,7vw,7.2rem)] font-black italic tracking-tighter text-white leading-[0.84] mb-2 sm:mb-2.5 drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)]">
                Eleven
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-mono font-medium text-[#9BB1BC] uppercase tracking-[0.2em] leading-relaxed max-w-lg mb-3 sm:mb-4 drop-shadow-md">
                ANALYZE. COMPARE. UNDERSTAND.
                <br />
                FOOTBALL, THROUGH DATA.
              </p>

              {/* Functional Apple Glass Search Bar */}
              <HeroSearch className="mb-0" />
            </div>

            {/* Spacer for Right Column on Large Screens */}
            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 h-full pointer-events-none" />

          </div>
        </div>

        {/* Absolute Grounded Player Cutout Layer (z-10, Anchored directly to bottom-0 of hero section) */}
        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-10 overflow-hidden flex items-end justify-center lg:justify-end max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full lg:w-[62%] xl:w-[65%] 2xl:w-[68%] h-full flex items-end justify-center lg:justify-center">
            <img
              src={heroPlayerImg}
              alt="Eleven Featured Player"
              className="w-full max-w-[950px] sm:max-w-[1150px] lg:max-w-[1450px] xl:max-w-[1700px] 2xl:max-w-[1950px] max-h-[80vh] sm:max-h-[86vh] lg:max-h-[93vh] xl:max-h-[98vh] h-auto object-contain object-bottom drop-shadow-[0_30px_70px_rgba(0,0,0,0.98)] filter brightness-75 contrast-110 saturate-85 transition-all translate-y-0 lg:translate-y-1 [mask-image:linear-gradient(to_bottom,black_75%,rgba(0,0,0,0.9)_88%,rgba(0,0,0,0.3)_96%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_75%,rgba(0,0,0,0.9)_88%,rgba(0,0,0,0.3)_96%,transparent_100%)]"
              loading="eager"
            />
          </div>
        </div>

        {/* Bottom Viewport Scroll Cue with Spell 4 Elastic Kickoff Physics */}
        <HeroScrollCue onClick={scrollToContent} />

      </div>

      {/* ========================================================================= */}
      {/* 2. FULL-WIDTH ORANGE SVG BLOCK (TRANSITION / NEXT SECTION)                 */}
      {/* ========================================================================= */}
      <section
        id="intelligence-architecture"
        className="relative w-full bg-[#FF3C00] text-[#000C12] py-14 sm:py-16 overflow-hidden shadow-[0_20px_50px_rgba(255,60,0,0.3)] z-10"
      >
        {/* Full-Screen Tactical SVG Geometry Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <pattern
              id="orange-block-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#000C12"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="#000C12" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#orange-block-grid)" />

          {/* Tactical Pitch Geometry Lines */}
          <g stroke="#000C12" strokeWidth="1.5" opacity="0.4">
            <circle cx="90%" cy="50%" r="260" strokeDasharray="6 8" />
            <circle cx="10%" cy="50%" r="180" strokeDasharray="4 6" />
            <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="8 8" />
          </g>
        </svg>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-[2px] bg-[#000C12]" />
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#000C12] uppercase">
                  INTELLIGENCE ARCHITECTURE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight text-[#000C12] leading-[1.05]">
                Opta-Grade Precision Meets Unsupervised AI
              </h2>
              <p className="mt-3 text-sm sm:text-base font-semibold text-[#000C12]/80 leading-relaxed max-w-xl">
                1,802 players across Europe's Top 5 leagues clustered into 7 distinct tactical archetypes with per-90 radar normalization and live similarity matching.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/explorer"
                className="px-6 py-3.5 rounded-xl bg-[#000C12] text-[#F5F1EB] hover:bg-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2"
              >
                <span>Launch Explorer</span>
                <ArrowRight className="w-4 h-4 text-[#FF3C00]" />
              </Link>
              <Link
                to="/pitch-map"
                className="px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-[#000C12] font-bold text-xs uppercase tracking-wider transition-all border border-[#000C12]/20"
              >
                <span>Pitch Radar</span>
              </Link>
            </div>
          </div>

          {/* 4 Core Module Cards with High-Contrast Dark Styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <Link
              to="/explorer"
              className="group p-6 rounded-2xl bg-[#000C12] text-[#F5F1EB] border border-black/40 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#03151F] border border-[#0A222E] flex items-center justify-center text-[#3AA6D9] mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  Player Directory & Radar
                </h3>
                <p className="text-xs text-[#8FA3AD] leading-relaxed font-mono">
                  Compare 1,802 players across 8 per-90 metrics with dual polygon radar overlays.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-[#3AA6D9]">
                <span>Explore Directory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/pitch-map"
              className="group p-6 rounded-2xl bg-[#000C12] text-[#F5F1EB] border border-black/40 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#03151F] border border-[#0A222E] flex items-center justify-center text-[#E8B33D] mb-4 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  2D Pitch Coordinates
                </h3>
                <p className="text-xs text-[#8FA3AD] leading-relaxed font-mono">
                  Interactive field coordinates highlighting player zone bias and spatial coverage.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-[#E8B33D]">
                <span>Open Pitch Map</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              to="/gmm-matrix"
              className="group p-6 rounded-2xl bg-[#000C12] text-[#F5F1EB] border border-black/40 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#03151F] border border-[#0A222E] flex items-center justify-center text-[#FF3C00] mb-4 group-hover:scale-105 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  GMM Style Archetypes
                </h3>
                <p className="text-xs text-[#8FA3AD] leading-relaxed font-mono">
                  7 unsupervised Gaussian Mixture Model clusters with soft probability distributions.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-[#FF3C00]">
                <span>View Archetypes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              to="/u21-scouting"
              className="group p-6 rounded-2xl bg-[#000C12] text-[#F5F1EB] border border-black/40 hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#03151F] border border-[#0A222E] flex items-center justify-center text-[#E8437A] mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  U21 Wonderkid Scouting
                </h3>
                <p className="text-xs text-[#8FA3AD] leading-relaxed font-mono">
                  AI nearest-neighbor cosine similarity matching U21 emerging talent to senior stars.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-mono text-[#E8437A]">
                <span>Scout Under-21s</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
