import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_TABS = [
  { path: '/explorer', label: 'EXPLORER' },
  { path: '/pitch-map', label: 'PITCH MAP' },
  { path: '/gmm-matrix', label: 'GMM MATRIX' },
  { path: '/u21-scouting', label: 'U21 SCOUTING' },
  { path: '/scout-chat', label: 'SCOUT AI' },
];

export default function Navbar() {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
  const navRef = useRef(null);

  // Spell: Liquid Glass Cursor Sheen
  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <header className="fixed top-3.5 sm:top-4 inset-x-0 mx-auto w-full max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8 z-50 select-none">
      {/* Prominent Floating Apple Liquid Glass Capsule Aligned with Content */}
      <nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Main navigation"
        className="relative flex items-center justify-between rounded-2xl bg-[#060A10]/60 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/[0.12] border-t-white/[0.22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_50px_rgba(0,0,0,0.7),0_2px_6px_rgba(0,0,0,0.3)] px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 transition-all overflow-hidden"
      >
        {/* Spell: Liquid Glass Specular Spotlight Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-0"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.14), transparent 75%)`,
          }}
        />

        {/* Left: Prominent Brand "11" Monogram & Wordmark */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-3 group transition-transform active:scale-95 shrink-0"
          title="Eleven — Football Intelligence Platform"
        >
          <svg
            width="32"
            height="28"
            viewBox="0 0 32 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white group-hover:text-[#FF4E32] transition-colors"
          >
            {/* Bold Italic 11 */}
            <path
              d="M 5 6 L 10 2 V 26 H 5 M 10 26 H 15"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 17 6 L 22 2 V 26 H 17 M 22 26 H 27"
              stroke="currentColor"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-black tracking-[0.28em] text-base sm:text-lg text-white group-hover:text-[#FF4E32] transition-colors">
            ELEVEN
          </span>
        </Link>

        {/* Center / Right: Prominent Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {NAV_TABS.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === '/explorer' && location.pathname.startsWith('/player/'));

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`relative px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all rounded-xl ${
                  isActive
                    ? 'text-white font-extrabold'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="apple-navbar-active"
                    className="absolute inset-0 bg-white/[0.14] rounded-xl border border-white/25 -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.25)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
