import React from 'react';

/**
 * Marquee — Infinite scrolling ribbon component inspired by Magic UI
 * Supports smooth continuous motion, pause on hover, and customizable direction.
 */
export default function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = true,
  repeat = 4,
  duration = 35,
}) {
  return (
    <div
      className={`group flex overflow-hidden p-2 select-none [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] ${className}`}
    >
      <div
        className={`flex shrink-0 justify-around gap-6 min-w-full animate-marquee ${
          reverse ? 'flex-row-reverse' : 'flex-row'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center justify-around gap-6">
            {children}
          </div>
        ))}
      </div>
      <div
        aria-hidden="true"
        className={`flex shrink-0 justify-around gap-6 min-w-full animate-marquee ${
          reverse ? 'flex-row-reverse' : 'flex-row'
        } ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}`}
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className="flex shrink-0 items-center justify-around gap-6">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
