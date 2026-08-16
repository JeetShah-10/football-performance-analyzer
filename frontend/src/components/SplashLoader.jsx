import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ElevenLoader from './ElevenLoader';

/**
 * SplashLoader — App Launch Sequence featuring the 2-Second ElevenLoader
 *
 * Sequence:
 * 0.0s - 1.6s: ElevenLoader animation (White geometric "11" bars draw upward,
 *              orange football dot drops & bounces, ELEVEN fades in).
 * 1.6s - 2.3s: Staggered Double Stairs curtain exit reveals dashboard.
 */

const NUM_COLUMNS = 5;
const COLUMN_EASING = [0.76, 0, 0.24, 1];

export default function SplashLoader({ onComplete }) {
  const [phase, setPhase] = useState('animating'); // 'animating' | 'exiting' | 'done'

  useEffect(() => {
    // Transition from loader sequence to double-stairs curtain exit
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 1650);

    // Complete transition
    const doneTimer = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 2400);

    // Skip on Escape key or Click
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPhase('done');
        if (onComplete) onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      onClick={() => {
        setPhase('done');
        if (onComplete) onComplete();
      }}
      className="fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer bg-[#0B0B0C]"
      aria-label="Loading Eleven..."
      role="dialog"
      aria-modal="true"
    >
      {/* 5 Double-Stairs Vertical Columns for Seamless Curtain Exit */}
      <div className="absolute inset-0 flex w-full h-full pointer-events-none">
        {Array.from({ length: NUM_COLUMNS }).map((_, index) => {
          const exitDirection = index % 2 === 0 ? '-100%' : '100%';
          const isExiting = phase === 'exiting';

          return (
            <motion.div
              key={index}
              initial={{ y: '0%' }}
              animate={{ y: isExiting ? exitDirection : '0%' }}
              transition={{
                duration: 0.75,
                ease: COLUMN_EASING,
                delay: isExiting ? index * 0.06 : 0,
              }}
              className="relative h-full flex-1 border-r border-[#15191E]/50 last:border-r-0"
              style={{
                backgroundColor: index % 2 === 0 ? '#0B0B0C' : '#0E1114',
              }}
            />
          );
        })}
      </div>

      {/* Center 2-Second ElevenLoader Animation */}
      <AnimatePresence>
        {phase !== 'exiting' && (
          <motion.div
            key="eleven-loader-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-4"
          >
            <ElevenLoader loop={false} aspectRatio="responsive" />

            {/* Skip hint */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="absolute bottom-8 text-[10px] font-mono text-[#5A7280] tracking-widest uppercase"
            >
              Click or Press ESC to Skip
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
