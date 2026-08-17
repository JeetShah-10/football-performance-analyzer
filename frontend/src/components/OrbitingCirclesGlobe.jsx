import React from 'react';
import ParticleSphere from './ParticleSphere';
import premierLeagueSvg from '../assets/leagues/premier-league.svg';
import laligaSvg from '../assets/leagues/laliga.svg';
import bundesligaSvg from '../assets/leagues/bundesliga.svg';
import serieASvg from '../assets/leagues/serie-a.svg';
import ligue1Svg from '../assets/leagues/ligue-1.svg';

/**
 * Big 5 European Leagues 3-Ring Orbiting Constellation
 * Rendered with enlarged high-visibility circular badges per user specifications:
 * - Premier League: Sky Blue (#38B6FF)
 * - La Liga: Calibrated Warm Orange-Red (#D63A2B)
 * - Bundesliga: Bright Red (#D20515)
 * - Ligue 1: Pitch Black (#000000)
 * - Serie A: Crisp White (#FFFFFF)
 */
const BIG5_ORBITS = [
  {
    // Ring 1 (Inner): Premier League
    size: 'w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px]',
    duration: 20,
    items: [
      {
        name: 'Premier League',
        src: premierLeagueSvg,
        angle: 0,
        bgColor: '#38B6FF',
        borderColor: '#00A3E0',
        padding: 'p-3 sm:p-3.5',
      },
    ],
  },
  {
    // Ring 2 (Middle): La Liga & Bundesliga
    size: 'w-[430px] h-[430px] sm:w-[530px] sm:h-[530px] md:w-[630px] md:h-[630px]',
    duration: 26,
    items: [
      {
        name: 'La Liga',
        src: laligaSvg,
        angle: -45,
        bgColor: '#D63A2B',
        borderColor: '#E24C3E',
        padding: 'p-3 sm:p-3.5',
      },
      {
        name: 'Bundesliga',
        src: bundesligaSvg,
        angle: 135,
        bgColor: '#D20515',
        borderColor: '#E20613',
        padding: 'p-3 sm:p-3.5',
      },
    ],
  },
  {
    // Ring 3 (Outer): Serie A & Ligue 1
    size: 'w-[560px] h-[560px] sm:w-[680px] sm:h-[680px] md:w-[800px] md:h-[800px]',
    duration: 32,
    items: [
      {
        name: 'Serie A',
        src: serieASvg,
        angle: -90,
        bgColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        padding: 'p-3 sm:p-3.5',
      },
      {
        name: 'Ligue 1',
        src: ligue1Svg,
        angle: 90,
        bgColor: '#000000',
        borderColor: '#333333',
        padding: 'p-3 sm:p-3.5',
      },
    ],
  },
];

export default function OrbitingCirclesGlobe() {
  return (
    <div className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] overflow-hidden flex justify-center items-end select-none">
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)); }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)); }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)); }
        }
      `}</style>

      {/* Enlarged 3D Particle Globe Sphere with Breathing Space */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none w-[320px] sm:w-[400px] md:w-[480px] z-10">
        <ParticleSphere count={280} radius={155} color="#FF4E32" accentColor="#FFB800" />
      </div>

      {/* Ambient Horizon Glow: Subtle, dull-to-duller terracotta orange centered under the globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-[650px] sm:w-[850px] h-[340px] bg-[radial-gradient(ellipse_60%_50%_at_50%_75%,rgba(214,58,43,0.16)_0%,rgba(160,40,15,0.05)_45%,transparent_75%)] blur-[110px] pointer-events-none z-0" />

      {/* Orbiting rings */}
      {BIG5_ORBITS.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? 'orbit-cw' : 'orbit-ccw';
        const counterAnim = isCW ? 'counter-cw' : 'counter-ccw';

        return (
          <div
            key={index}
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-white/[0.06] ${orbit.size} pointer-events-none`}
          >
            {orbit.items.map((itemData, itemIndex) => (
              <div
                key={itemIndex}
                className="absolute top-0 left-1/2 h-1/2 -ml-8 sm:-ml-10 origin-bottom flex flex-col justify-start items-center pointer-events-auto"
                style={{
                  '--start-angle': `${itemData.angle}deg`,
                  animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                }}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.95)] hover:scale-125 transition-transform cursor-pointer flex items-center justify-center border-2 ${itemData.padding}`}
                  style={{
                    backgroundColor: itemData.bgColor,
                    borderColor: itemData.borderColor,
                    '--counter-offset': `${-itemData.angle}deg`,
                    animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                  }}
                  title={itemData.name}
                >
                  <img
                    src={itemData.src}
                    alt={itemData.name}
                    className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-md"
                    loading="eager"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
