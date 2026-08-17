import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ShimmerButton Component — Magic UI
 * High-performance button with an animated laser perimeter shimmer.
 * Supports both standard button actions and Link navigation via `to` prop.
 */
export default function ShimmerButton({
  children,
  to,
  className = '',
  shimmerColor = '#FF4E32',
  shimmerSize = '0.08em',
  shimmerDuration = '2.5s',
  borderRadius = '1rem',
  background = 'rgba(9, 13, 20, 0.95)',
  onClick,
  ...props
}) {
  const content = (
    <>
      {/* Spark / Shimmer Container */}
      <div className="-z-30 blur-[3px] @container-[size] absolute inset-0 overflow-visible pointer-events-none">
        <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>

      {/* Button Children Content */}
      <span className="relative z-10 font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Surface Specular Highlight */}
      <div className="absolute inset-0 size-full rounded-2xl px-4 py-1.5 shadow-[inset_0_-4px_8px_rgba(255,255,255,0.15)] group-hover:shadow-[inset_0_-6px_12px_rgba(255,255,255,0.25)] transition-all duration-300 pointer-events-none" />

      {/* Inner Mask Backdrop */}
      <div className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)] pointer-events-none" />
    </>
  );

  const sharedStyles = {
    '--spread': '90deg',
    '--shimmer-color': shimmerColor,
    '--radius': borderRadius,
    '--speed': shimmerDuration,
    '--cut': shimmerSize,
    '--bg': background,
  };

  const sharedClasses = `group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/15 px-6 py-3.5 whitespace-nowrap text-white [background:var(--bg)] transform-gpu transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${className}`;

  if (to) {
    return (
      <Link to={to} style={sharedStyles} className={sharedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={sharedStyles}
      className={sharedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
