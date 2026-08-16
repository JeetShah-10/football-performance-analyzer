import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * ElevenLoader — Core 2-Second SVG Loading & Branding Animation
 *
 * Palette:
 * - Background: #0B0B0C
 * - Bars: #FFFFFF (Geometric "11" pillars with flag cuts)
 * - Dot: #FF4E32 (Orange football-dot with bounce physics)
 * - Text: #F5F1EB (Bold geometric wordmark "ELEVEN")
 */

export default function ElevenLoader({
  loop = true,
  aspectRatio = 'responsive', // 'responsive' | '16:9' | '9:16' | 'fullscreen'
  className = '',
  onAnimationComplete,
}) {
  const shouldReduceMotion = useReducedMotion();

  const aspectClasses = {
    '16:9': 'w-full max-w-[720px] aspect-[16/9]',
    '9:16': 'w-full max-w-[380px] aspect-[9/16]',
    fullscreen: 'fixed inset-0 z-[9999] w-screen h-screen',
    responsive: 'w-full h-full max-w-[460px] max-h-[340px]',
  }[aspectRatio] || 'w-full h-full';

  // 2-Second Animation Variants
  const leftBarVariants = {
    initial: { scaleY: 0, opacity: 0 },
    animate: {
      scaleY: [0, 1, 1, 1, 0],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 2.0,
        repeat: loop ? Infinity : 0,
        times: [0, 0.25, 0.75, 0.9, 1.0],
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const rightBarVariants = {
    initial: { scaleY: 0, opacity: 0 },
    animate: {
      scaleY: [0, 1, 1, 1, 0],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: 2.0,
        repeat: loop ? Infinity : 0,
        delay: 0.08,
        times: [0, 0.25, 0.75, 0.9, 1.0],
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const ballVariants = {
    initial: { y: -90, scaleX: 1, scaleY: 1, opacity: 0 },
    animate: {
      y: [-90, -90, 42, 16, 40, 40, -90],
      scaleX: [1, 1, 1.35, 0.9, 1, 1, 1],
      scaleY: [1, 1, 0.65, 1.15, 1, 1, 1],
      opacity: [0, 1, 1, 1, 1, 1, 0],
      transition: {
        duration: 2.0,
        repeat: loop ? Infinity : 0,
        times: [0, 0.15, 0.42, 0.58, 0.7, 0.9, 1.0],
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 12, letterSpacing: '0.2em' },
    animate: {
      opacity: [0, 0, 1, 1, 0],
      y: [12, 12, 0, 0, -8],
      letterSpacing: ['0.2em', '0.2em', '0.36em', '0.36em', '0.4em'],
      transition: {
        duration: 2.0,
        repeat: loop ? Infinity : 0,
        times: [0, 0.45, 0.7, 0.9, 1.0],
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const pulseRingVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: [0.5, 0.5, 1.8, 1.8, 0.5],
      opacity: [0, 0, 0.6, 0, 0],
      transition: {
        duration: 2.0,
        repeat: loop ? Infinity : 0,
        times: [0, 0.4, 0.55, 0.75, 1.0],
        ease: 'easeOut',
      },
    },
  };

  if (shouldReduceMotion) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#0B0B0C] text-[#F5F1EB] p-8 ${aspectClasses} ${className}`}
        role="status"
        aria-label="Loading Eleven..."
      >
        <svg
          viewBox="0 0 320 240"
          className="w-48 h-36 max-w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="110" y="50" width="16" height="90" rx="3" fill="#FFFFFF" />
          <rect x="154" y="50" width="16" height="90" rx="3" fill="#FFFFFF" />
          <circle cx="140" cy="115" r="7" fill="#FF4E32" />
          <text
            x="140"
            y="180"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="18"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.32em"
          >
            ELEVEN
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-[#0B0B0C] overflow-hidden select-none ${aspectClasses} ${className}`}
      role="status"
      aria-label="Loading Eleven..."
    >
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="elevenDotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF4E32" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF4E32" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform="translate(200, 120)">
          {/* Ground Baseline Guideline */}
          <line
            x1="-60"
            y1="50"
            x2="60"
            y2="50"
            stroke="#1A1D20"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Left "1" Pillar */}
          <g transform="translate(-26, 50)">
            <motion.rect
              x="-8"
              y="-96"
              width="16"
              height="96"
              rx="3"
              fill="#FFFFFF"
              style={{ originY: 1, originX: 0.5 }}
              variants={leftBarVariants}
              initial="initial"
              animate="animate"
            />
            <motion.path
              d="M -8 -96 L -18 -82 L -8 -82 Z"
              fill="#FFFFFF"
              style={{ originY: 1, originX: 0.5 }}
              variants={leftBarVariants}
              initial="initial"
              animate="animate"
            />
          </g>

          {/* Right "1" Pillar */}
          <g transform="translate(26, 50)">
            <motion.rect
              x="-8"
              y="-96"
              width="16"
              height="96"
              rx="3"
              fill="#FFFFFF"
              style={{ originY: 1, originX: 0.5 }}
              variants={rightBarVariants}
              initial="initial"
              animate="animate"
            />
            <motion.path
              d="M -8 -96 L -18 -82 L -8 -82 Z"
              fill="#FFFFFF"
              style={{ originY: 1, originX: 0.5 }}
              variants={rightBarVariants}
              initial="initial"
              animate="animate"
            />
          </g>

          {/* Shockwave Pulse Ring on Bounce */}
          <motion.circle
            cx="0"
            cy="44"
            r="16"
            stroke="#FF4E32"
            strokeWidth="1.5"
            fill="none"
            variants={pulseRingVariants}
            initial="initial"
            animate="animate"
          />

          {/* Orange Football Dot (#FF4E32) */}
          <motion.g
            variants={ballVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={onAnimationComplete}
          >
            <circle cx="0" cy="0" r="14" fill="url(#elevenDotGlow)" opacity="0.6" />
            <circle
              cx="0"
              cy="0"
              r="7.5"
              fill="#FF4E32"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 78, 50, 0.85))',
              }}
            />
            <circle cx="-2" cy="-2" r="2" fill="#FFE5E0" opacity="0.75" />
          </motion.g>

          {/* ELEVEN Wordmark */}
          <motion.text
            x="0"
            y="88"
            textAnchor="middle"
            fill="#F5F1EB"
            fontSize="17"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Outfit', 'Space Grotesk', sans-serif"
            className="tracking-[0.35em] uppercase"
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            ELEVEN
          </motion.text>
        </g>
      </svg>
    </div>
  );
}
