import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Users,
  ShieldCheck,
  MapPin,
  ChevronDown,
  MessageSquareCode,
  Layers,
  Zap,
  Sparkles,
  Cpu,
  Compass,
  FileSpreadsheet,
  Workflow,
  Terminal as TerminalIcon,
} from 'lucide-react';
import HeroSearch from '../components/HeroSearch';
import StickyCard002 from '../components/StickyCard002';
import { Terminal, TypingAnimation, AnimatedSpan } from '../components/Terminal';
import ShimmerButton from '../components/ShimmerButton';
import FlickeringGrid from '../components/FlickeringGrid';
import OrbitingCirclesGlobe from '../components/OrbitingCirclesGlobe';
import Marquee from '../components/Marquee';
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

  // 5 High-Impact Tactical Superpower Cards with Bright Gold, Amber, Orange, Coral & Crimson Variety
  const superpowerCards = [
    {
      id: 'dual-radar',
      title: 'Dual Radar Comparison',
      badge: 'EXPLORER & BENCHMARK',
      accentColor: '#FFB800',
      icon: Users,
      tagline: '8-Axis Per-90 Positional Percentile Overlays',
      description:
        'Compare any two players across Europe’s Top 5 leagues. Evaluate technical output normalized within positional cohorts on an absolute 0–100 percentile curve.',
      pills: ['Per-90 Normalized', 'Position-Scoped', 'Dual Polygon Overlay'],
      link: '/explorer',
      linkText: 'Launch Dual Radar',
      visual: (
        <div className="w-full h-full p-4 rounded-2xl bg-[#05080E] border border-white/[0.08] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
            <span className="text-[#FFB800] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFB800]" />
              HAALAND (MCI)
            </span>
            <span className="text-white/40 text-[10px]">8D NORMALIZATION</span>
            <span className="text-[#E61E38] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E61E38]" />
              KANE (BAY)
            </span>
          </div>

          <div className="relative w-full h-36 flex items-center justify-center my-1">
            <svg viewBox="0 0 200 200" className="w-36 h-36">
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="100" cy="100" r="55" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="43" y1="43" x2="157" y2="157" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="157" y1="43" x2="43" y2="157" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              <polygon
                points="100,24 165,55 170,100 135,145 100,165 65,135 30,100 45,55"
                fill="rgba(255, 184, 0, 0.22)"
                stroke="#FFB800"
                strokeWidth="2"
              />
              <polygon
                points="100,32 155,50 160,100 155,150 100,155 50,145 40,100 60,60"
                fill="rgba(230, 30, 56, 0.15)"
                stroke="#E61E38"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx="100" cy="100" r="2.5" fill="#FFB800" />
            </svg>

            <div className="absolute top-0 left-2 text-[9px] font-mono text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20 px-1.5 py-0.5 rounded">
              xG: 99th %tile
            </div>
            <div className="absolute bottom-0 right-2 text-[9px] font-mono text-[#E61E38] bg-[#E61E38]/10 border border-[#E61E38]/20 px-1.5 py-0.5 rounded">
              Passes: 94th %tile
            </div>
          </div>

          <div className="text-[10px] font-mono text-center text-white/90 bg-white/[0.04] py-1.5 rounded-xl border border-white/[0.08]">
            96.4% COMPOSITE ATTACK INDEX • GROUND-TRUTH PERCENTILES
          </div>
        </div>
      ),
    },
    {
      id: 'pitch-map',
      title: '2D PCA Tactical Pitch Map',
      badge: 'SPATIAL REDUCTION',
      accentColor: '#FF7A00',
      icon: MapPin,
      tagline: 'Dimensionality-Reduced Field Coordinates (67.2% Variance)',
      description:
        'Explore 1,802 players plotted in 2D coordinate space via Principal Component Analysis (PC1 & PC2), revealing spatial tendencies and tactical deployment.',
      pills: ['PCA PC1: 44.06%', 'PCA PC2: 23.17%', 'Interactive Nodes'],
      link: '/pitch-map',
      linkText: 'Open Pitch Map',
      visual: (
        <div className="w-full h-full p-4 rounded-2xl bg-[#05080E] border border-white/[0.08] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
            <span className="text-white font-bold">2D FIELD TOPOLOGY</span>
            <span className="text-[#FF7A00] font-mono text-[10px] font-bold">1,802 NODES</span>
          </div>

          <div className="relative h-36 my-1 rounded-xl bg-[#03060B] border border-white/[0.08] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/[0.08]" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/[0.08]" />
            <div className="w-16 h-16 rounded-full border border-white/[0.08] absolute" />
            
            <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-white/40" />
            <div className="absolute top-9 left-12 w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="absolute bottom-8 left-10 w-2 h-2 rounded-full bg-white/40" />
            
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF7A00]" />
            <div className="absolute top-8 left-[45%] w-1.5 h-1.5 rounded-full bg-[#FF7A00]/60" />
            <div className="absolute bottom-10 left-[52%] w-1.5 h-1.5 rounded-full bg-[#FF7A00]/60" />
            
            <div className="absolute top-6 right-10 w-2 h-2 rounded-full bg-[#FFB800]" />
            <div className="absolute bottom-8 right-8 w-3 h-3 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.8)]" />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-white/70 bg-white/[0.04] py-1.5 px-3 rounded-xl border border-white/[0.06]">
            <span>DEF: 748</span>
            <span>MID: 603</span>
            <span>FWD: 451</span>
            <span className="text-[#FF7A00] font-bold">67.23% VAR</span>
          </div>
        </div>
      ),
    },
    {
      id: 'gmm-matrix',
      title: 'GMM Playing Style Archetypes',
      badge: 'UNSUPERVISED AI',
      accentColor: '#FF3C00',
      icon: Brain,
      tagline: '7 Gaussian Mixture Soft-Clustering Probabilities',
      description:
        'Players do not fit into binary roles. Gaussian Mixture Models calculate soft probability distributions across 7 playing-style archetypes.',
      pills: ['Soft Probabilities', '7 Tactical Archetypes', 'Zero Stereotypes'],
      link: '/gmm-matrix',
      linkText: 'Explore Archetypes',
      visual: (
        <div className="w-full h-full p-4 rounded-2xl bg-[#05080E] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
            <span className="text-white font-bold">TACTICAL DNA SPECTRUM</span>
            <span className="text-[#FF3C00] text-[10px] font-bold">PEDRI (BAR)</span>
          </div>
          <div className="space-y-2.5 my-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/90 mb-1">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-[#FF3C00]" /> Creative Maestro</span>
                <span className="text-[#FF3C00] font-bold">94.6%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF3C00] to-[#FF7A00] rounded-full w-[94.6%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/70 mb-1">
                <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-[#FFB800]" /> Box-to-Box Engine</span>
                <span className="text-[#FFB800] font-bold">78.2%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFB800] rounded-full w-[78.2%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-white/70 mb-1">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-[#4D0E1A]" /> Pressing Destroyer</span>
                <span className="text-white/40 font-bold">14.1%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                <div className="h-full bg-[#4D0E1A] rounded-full w-[14.1%]" />
              </div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-center text-white/60 bg-white/[0.04] py-1.5 rounded-xl border border-white/[0.06]">
            PROBABILISTIC CLASSIFICATION (k=2 Silhouette Peak)
          </div>
        </div>
      ),
    },
    {
      id: 'u21-scouting',
      title: 'U21 Wonderkid Scouting',
      badge: 'MARKET INTELLIGENCE',
      accentColor: '#FF4359',
      icon: ShieldCheck,
      tagline: 'Cosine Nearest-Neighbor Under-21 Value Discovery',
      description:
        'Identify emerging prospects matching the statistical profile of established world-class stars in an 8D scaled feature space.',
      pills: ['Age <= 21', 'Cosine NearestNeighbors', 'Market Replacement'],
      link: '/u21-scouting',
      linkText: 'Scout Wonderkids',
      visual: (
        <div className="w-full h-full p-4 rounded-2xl bg-[#05080E] border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
            <span className="text-white/70 font-bold">SENIOR TARGET: BUKAYO SAKA</span>
            <span className="text-[#FF4359] text-[10px] font-bold">U21 DISCOVERY</span>
          </div>
          <div className="p-3 my-1.5 rounded-xl bg-[#2A080F]/70 border border-[#FF4359]/30 flex items-center justify-between">
            <div>
              <span className="text-sm font-black italic text-white block font-display">LAMINE YAMAL</span>
              <span className="text-[10px] font-mono text-white/60">FC BARCELONA • 17 YRS • RIGHT WING</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-bold text-[#FF4359] block">94.8% MATCH</span>
              <span className="text-[9px] font-mono text-white/40">COSINE: 0.052</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-1.5 rounded-lg bg-white/[0.03] text-center text-white/70 border border-white/[0.05]">
              <span className="text-[#FF4359] font-bold">+0.42</span> Key Passes/90
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.03] text-center text-white/70 border border-white/[0.05]">
              <span className="text-[#FF4359] font-bold">+1.8</span> Prog. Carries/90
            </div>
          </div>
          <div className="text-[10px] font-mono text-center text-white/80 bg-white/[0.04] py-1.5 rounded-xl border border-white/[0.08]">
            #1 STATISTICAL REPLACEMENT IDENTIFIED
          </div>
        </div>
      ),
    },
    {
      id: 'scout-ai',
      title: 'Scout AI Terminal',
      badge: 'NATURAL LANGUAGE',
      accentColor: '#E61E38',
      icon: MessageSquareCode,
      tagline: 'Conversational Football Intelligence via Intent Classification',
      description:
        'Ask complex scouting queries in plain English. Eleven classifies query intent, retrieves player entities, and computes statistical insights with zero hallucination.',
      pills: ['Intent Classifier', 'Entity Recognition', 'Structured JSON'],
      link: '/scout-chat',
      linkText: 'Launch Scout AI',
      visual: (
        <div className="w-full h-full p-4 rounded-2xl bg-[#05080E] border border-white/[0.08] flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E61E38]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="text-[10px] text-white/40 ml-1">scout_agent.py</span>
            </div>
            <span className="text-[#E61E38] text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E61E38]" />
              FASTAPI LIVE
            </span>
          </div>

          <div className="space-y-1.5 my-2 text-[11px]">
            <div className="text-white/50">&gt; &quot;Find left-footed playmakers under 23 with &gt;2.4 key passes/90&quot;</div>
            <div className="p-2 rounded-lg bg-[#2A080F]/80 border border-[#E61E38]/30 text-white/90 space-y-0.5 text-[10px]">
              <div className="text-[#FFB800] font-bold">[INTENT: FIND_BY_CRITERIA] (Confidence: 98.6%)</div>
              <div className="text-white/70">[MATCHED: 4 PLAYERS IN TOP 5 LEAGUES]</div>
              <div className="text-white">&gt; 1. Lamine Yamal (Barcelona) • 2.65 KP/90</div>
            </div>
          </div>

          <div className="text-[10px] text-center text-white/50 bg-white/[0.04] py-1 rounded-lg border border-white/[0.06]">
            STRUCTURED STATISTICAL REASONING PIPELINE
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#04070A] text-[#F5F1EB] overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (100dvh VIEWPORT LOCKED FOR NORMAL NON-F11 BROWSERS)      */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] flex flex-col justify-between pt-12 sm:pt-14 pb-2 overflow-visible z-20">
        
        {/* Full-Bleed Edge-to-Edge hero-bg.jpg Backdrop */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
          <img
            src={heroBgImg}
            alt="Eleven Tactical Hero Background"
            className="w-full h-full object-cover object-center filter brightness-78 contrast-112 saturate-95"
          />
          <div className="absolute inset-0 bg-[#05080C]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05080C]/55 via-transparent to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center min-h-0 overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center w-full h-full overflow-visible">
            
            {/* Left Column */}
            <div className="lg:col-span-5 xl:col-span-5 relative z-30 flex flex-col justify-center lg:pl-8 xl:pl-14 lg:translate-x-4 overflow-visible">
              
              <div className="flex items-center gap-2.5 mb-1.5 sm:mb-2">
                <span className="w-6 h-[2.5px] bg-[#FF4E32]" />
                <span className="text-[10.5px] sm:text-xs md:text-sm font-mono font-bold tracking-[0.28em] text-[#FF4E32] uppercase">
                  FOOTBALL INTELLIGENCE PLATFORM
                </span>
              </div>

              <h1 className="font-display text-[clamp(3.8rem,7vw,7.2rem)] font-black italic tracking-tighter text-white leading-[0.84] mb-2 sm:mb-2.5 drop-shadow-[0_16px_32px_rgba(0,0,0,0.9)]">
                Eleven
              </h1>

              <p className="text-xs sm:text-sm font-mono font-medium text-[#9BB1BC] uppercase tracking-[0.2em] leading-relaxed max-w-lg mb-3 sm:mb-4 drop-shadow-md">
                ANALYZE. COMPARE. UNDERSTAND.
                <br />
                FOOTBALL, THROUGH DATA.
              </p>

              <HeroSearch className="mb-0" />
            </div>

            <div className="hidden lg:block lg:col-span-7 xl:col-span-7 h-full pointer-events-none" />

          </div>
        </div>

        {/* Player Cutout */}
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

        <HeroScrollCue onClick={scrollToContent} />

      </div>

      {/* ========================================================================= */}
      {/* 2. MONUMENTAL EXPANDED TACTICAL ORANGE CANVAS (#FF3C00)                   */}
      {/* ========================================================================= */}
      <section
        id="intelligence-architecture"
        className="relative w-full bg-[#FF3C00] text-[#000C12] py-20 sm:py-28 lg:py-32 rounded-t-[48px] sm:rounded-t-[72px] lg:rounded-t-[96px] overflow-hidden shadow-[0_25px_60px_rgba(255,60,0,0.35)] z-20"
      >
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <pattern
              id="orange-block-grid"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 56 0 L 0 0 0 56"
                fill="none"
                stroke="#000C12"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="1.5" fill="#000C12" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#orange-block-grid)" />

          <g stroke="#000C12" strokeWidth="1.5" opacity="0.45">
            <circle cx="85%" cy="40%" r="320" strokeDasharray="6 8" />
            <circle cx="15%" cy="60%" r="220" strokeDasharray="4 6" />
            <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="8 8" />
            <rect x="5%" y="15%" width="90%" height="70%" strokeDasharray="12 12" />
          </g>
        </svg>

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-[3px] bg-[#000C12]" />
                <span className="text-xs sm:text-sm font-mono font-black tracking-[0.28em] text-[#000C12] uppercase">
                  INTELLIGENCE ARCHITECTURE — OPTA VISION × UNSUPERVISED AI
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black italic tracking-tight text-[#000C12] leading-[0.92]">
                From Raw Match Logs to Pure Tactical DNA
              </h2>
              <p className="mt-5 text-base sm:text-xl font-bold text-[#000C12]/90 leading-relaxed max-w-2xl">
                1,802 outfield players across Europe&apos;s Top 5 Leagues decomposed into 8 per-90 dimensions and 7 Gaussian Mixture archetypes with instant similarity retrieval.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <ShimmerButton
                to="/explorer"
                shimmerColor="#FF4E32"
                shimmerDuration="2.2s"
                background="#000C12"
                className="shadow-2xl hover:scale-105 border-black/40"
              >
                <span>Launch Explorer</span>
                <ArrowRight className="w-4 h-4 ml-1.5 inline-block text-[#FF4E32]" />
              </ShimmerButton>

              <ShimmerButton
                to="/pitch-map"
                shimmerColor="#FFFFFF"
                shimmerDuration="3s"
                background="rgba(255, 255, 255, 0.2)"
                className="text-[#000C12] border-[#000C12]/25 shadow-lg"
              >
                <span className="text-[#000C12]">Pitch Map</span>
              </ShimmerButton>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#000C12] text-white border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">COHORT INDEX</span>
                <FileSpreadsheet className="w-4 h-4 text-[#FFB800]" />
              </div>
              <span className="text-4xl sm:text-5xl font-black italic tracking-tight font-display text-white">
                1,802
              </span>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-white">
                  PLAYERS INDEXED
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  Big-5 European Leagues (Min &ge; 450)
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#000C12] text-white border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">VARIANCE CAPTURE</span>
                <Compass className="w-4 h-4 text-[#FF7A00]" />
              </div>
              <span className="text-4xl sm:text-5xl font-black italic tracking-tight font-display text-[#FFB800]">
                67.2%
              </span>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-white">
                  PCA EXPLAINED
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  PC1 (44.06%) + PC2 (23.17%)
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#000C12] text-white border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">CLUSTERING DNA</span>
                <Workflow className="w-4 h-4 text-[#FF3C00]" />
              </div>
              <span className="text-4xl sm:text-5xl font-black italic tracking-tight font-display text-white">
                7
              </span>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-white">
                  GMM ARCHETYPES
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  Unsupervised Soft-Probabilities
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#000C12] text-white border border-black/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">DATA INTEGRITY</span>
                <ShieldCheck className="w-4 h-4 text-[#FF4359]" />
              </div>
              <span className="text-4xl sm:text-5xl font-black italic tracking-tight font-display text-[#FF3C00]">
                0%
              </span>
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs font-mono font-bold tracking-wider uppercase block text-white">
                  SYNTHETIC DATA
                </span>
                <span className="text-[11px] font-mono text-white/50">
                  100% Ground-Truth FBref Events
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2.5 INFINITE TACTICAL TELEMETRY MARQUEE                                    */}
      {/* ========================================================================= */}
      <div className="relative w-full bg-[#03060A] py-3.5 border-y border-white/[0.08] overflow-hidden z-20">
        <Marquee duration={28} className="py-0">
          <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-white/60">
            <span className="flex items-center gap-2 text-[#FF4E32] font-bold">
              <Zap className="w-3.5 h-3.5" /> OPTA EVENT LOGS
            </span>
            <span className="text-white/20">•</span>
            <span>1,802 PLAYERS INDEXED</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FFB800] font-bold">8D RADAR NORMALIZATION</span>
            <span className="text-white/20">•</span>
            <span>7 GMM SOFT-CLUSTERS</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FF7A00] font-bold">67.2% PCA VARIANCE</span>
            <span className="text-white/20">•</span>
            <span>COSINE SIMILARITY KNN</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FF3C00] font-bold">0% SYNTHETIC DATA</span>
            <span className="text-white/20">•</span>
          </div>
        </Marquee>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLICKERING GRID POST-ORANGE CANVAS: STACKED CARDS                      */}
      {/* ========================================================================= */}
      <div className="relative w-full z-20 bg-[#04070A] overflow-hidden">
        <FlickeringGrid
          squareSize={3}
          gridGap={26}
          flickerChance={0.25}
          color="rgb(255, 78, 50)"
          maxOpacity={0.35}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#03060A] to-transparent pointer-events-none z-10" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#FF3C00]/10 rounded-full blur-[140px] pointer-events-none z-10" />

        {/* 3. THE 5 CORE ENGINES — STICKYCARD002 GSAP STACKED DECK */}
        <section className="relative w-full pt-16 pb-0 z-20">
          <div className="relative z-10 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/80 text-xs font-mono tracking-widest uppercase mb-2">
              <Layers className="w-3.5 h-3.5 text-[#FF4E32]" />
              <span>THE 5 SUPERPOWERS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black italic tracking-tight text-white">
              Precision Intelligence Stack
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-mono text-[#94A3B8] max-w-xl mx-auto">
              Scroll through Eleven&apos;s modular analytical engines, engineered for technical directors and recruitment analysts.
            </p>
          </div>

          <StickyCard002 cards={superpowerCards} />
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. TACTICAL ORANGE (#FF3C00) PIPELINE TERMINAL (CURVED RECTANGLE + DROOL) */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-[#FF3C00] via-[#FF3C00] to-[#E63600] text-[#000C12] pt-16 sm:pt-22 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 rounded-[48px] sm:rounded-[72px] lg:rounded-[96px] shadow-[0_30px_90px_rgba(255,60,0,0.45)] z-20 overflow-hidden">
        {/* Tactical Geometry Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-18 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <pattern
            id="terminal-orange-grid"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke="#000C12"
              strokeWidth="1"
            />
            <circle cx="0" cy="0" r="1.5" fill="#000C12" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#terminal-orange-grid)" />
          <g stroke="#000C12" strokeWidth="1.5" opacity="0.35">
            <circle cx="90%" cy="50%" r="280" strokeDasharray="6 8" />
            <circle cx="10%" cy="50%" r="220" strokeDasharray="4 6" />
          </g>
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000C12] text-[#FF4E32] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-md">
            <TerminalIcon className="w-4 h-4 text-[#FF4E32]" />
            <span>LIVE PIPELINE TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight text-[#000C12] leading-[0.95]">
            Deterministic Intelligence Core
          </h2>
          <p className="mt-2 text-xs sm:text-sm font-mono font-bold text-[#000C12]/90 max-w-xl mx-auto">
            Sub-second inference across 1,802 players with zero hallucination. Opta event ingestion to unsupervised Gaussian Mixture classification.
          </p>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <Terminal sequence={true} startOnView={true} className="border-black/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
            <TypingAnimation className="text-[#FF4E32] font-bold">
              $ python -m pipeline.scout_inference --player &quot;Lamine Yamal&quot; --k-archetypes 7
            </TypingAnimation>
            <AnimatedSpan className="text-emerald-400">
              ✔ [0.008s] Ingested 1,802 players across Europe&apos;s Big 5 leagues (Min &ge; 450).
            </AnimatedSpan>
            <AnimatedSpan className="text-emerald-400">
              ✔ [0.015s] Position-scoped StandardScaler applied: 8 technical per-90 dimensions normalized.
            </AnimatedSpan>
            <AnimatedSpan className="text-[#FFB800]">
              ✔ [0.022s] 2D PCA spatial decomposition: 67.23% variance retained (PC1: 44.06%, PC2: 23.17%).
            </AnimatedSpan>
            <AnimatedSpan className="text-[#5AD2F4]">
              ✔ [0.031s] GMM Soft-Clustering DNA: Creative Maestro (94.6%), Box-to-Box Engine (78.2%).
            </AnimatedSpan>
            <AnimatedSpan className="text-[#FF4359]">
              ✔ [0.038s] Cosine NearestNeighbors: Top twin Bukayo Saka (94.8% similarity, dist: 0.052).
            </AnimatedSpan>
            <TypingAnimation className="text-white font-bold" duration={35}>
              [SUCCESS] FastAPI response serialized in 0.042s (100% Ground-Truth FBref Events).
            </TypingAnimation>
          </Terminal>

          {/* Terminal Action Launch Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ShimmerButton
              to="/scout-chat"
              shimmerColor="#FF4E32"
              shimmerDuration="2.2s"
              background="#000C12"
              className="border-black/40 shadow-2xl hover:scale-105"
            >
              <span>Launch Scout AI Terminal</span>
              <ArrowRight className="w-4 h-4 ml-2 inline-block text-[#FF4E32]" />
            </ShimmerButton>

            <ShimmerButton
              to="/explorer"
              shimmerColor="#FFFFFF"
              shimmerDuration="3s"
              background="rgba(255, 255, 255, 0.25)"
              className="text-[#000C12] border-black/20 shadow-lg"
            >
              <span className="text-[#000C12]">Explore Full 1,802 Dataset</span>
            </ShimmerButton>
          </div>
        </div>

        {/* Bottom Ambient Glow Drool */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-black/20 blur-2xl pointer-events-none" />
      </section>

      {/* ========================================================================= */}
      {/* 5. EUROPEAN LEAGUE ORBITING SATELLITE CONSTELLATION (FLUID TO FOOTER)    */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-16 sm:pt-20 pb-0 px-4 sm:px-6 lg:px-8 bg-[#04070A] z-10 overflow-hidden">
        {/* Drool Glow Bleed from the Orange section into the dark globe */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-36 bg-[#FF3C00]/25 rounded-full blur-[90px] pointer-events-none z-10" />

        <FlickeringGrid
          squareSize={3}
          gridGap={26}
          flickerChance={0.25}
          color="rgb(255, 78, 50)"
          maxOpacity={0.28}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Pure Orbiting Globe with Breathing Room */}
        <div className="relative z-10 max-w-6xl mx-auto mb-0">
          <OrbitingCirclesGlobe />
        </div>
      </section>

    </div>
  );
}
