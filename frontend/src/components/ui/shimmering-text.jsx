import React, { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * ShimmeringText — Bklit UI Component
 * Per-character shimmer animation for tactical labels, badges, and headers.
 */
export function ShimmeringText({
  text,
  duration = 1.5,
  isStopped = false,
  paused = false,
  className = '',
  ...props
}) {
  const reducedMotion = useReducedMotion();
  const stopped = isStopped || paused || reducedMotion === true;

  const createCharVariants = useCallback(
    (charIndex) => ({
      running: {
        color: ['var(--color, #8FA3AD)', 'var(--shimmering-color, #FFFFFF)', 'var(--color, #8FA3AD)'],
        transition: {
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop',
          repeatDelay: (text?.length || 1) * 0.04,
          delay: ((charIndex * duration) / (text?.length || 1)),
          ease: 'easeInOut',
        },
      },
      stopped: {
        color: 'var(--color, #8FA3AD)',
        transition: {
          duration: duration * 0.5,
          ease: 'easeOut',
        },
      },
    }),
    [duration, text]
  );

  if (!text) return null;

  return (
    <motion.span
      className={cn(
        'inline-flex select-none items-center leading-none',
        '[--color:#8FA3AD] [--shimmering-color:#FFFFFF]',
        className
      )}
      {...props}
    >
      {text.split('').map((char, index) => (
        <motion.span
          animate={stopped ? 'stopped' : 'running'}
          aria-hidden
          className="inline-block whitespace-pre leading-none"
          initial="stopped"
          key={index}
          variants={createCharVariants(index)}
        >
          {char}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </motion.span>
  );
}

export default ShimmeringText;
