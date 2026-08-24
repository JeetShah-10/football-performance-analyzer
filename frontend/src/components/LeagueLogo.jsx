import React from 'react';
import premierLeagueSvg from '../assets/leagues/premier-league.svg';
import laligaSvg from '../assets/leagues/laliga.svg';
import bundesligaSvg from '../assets/leagues/bundesliga.svg';
import serieASvg from '../assets/leagues/serie-a.svg';
import ligue1Svg from '../assets/leagues/ligue-1.svg';

export const LEAGUE_CONFIGS = {
  'Premier League': {
    name: 'Premier League',
    short: 'EPL',
    src: premierLeagueSvg,
    bgColor: '#38B6FF',
    borderColor: '#00A3E0',
    color: '#38B6FF',
    secondaryColor: '#68C5F2',
    textColor: 'text-[#38B6FF]',
    glow: 'rgba(56, 182, 255, 0.35)',
    barGradient: 'bg-gradient-to-r from-[#38B6FF] to-[#68C5F2]',
    barShadow: 'shadow-[0_0_12px_rgba(56,182,255,0.45)]',
    badge: 'bg-[#38B6FF]/15 text-[#68C5F2] border-[#38B6FF]/40',
    padding: 'p-1.5 sm:p-2',
  },
  'La Liga': {
    name: 'La Liga',
    short: 'LaLiga',
    src: laligaSvg,
    bgColor: '#D63A2B',
    borderColor: '#E24C3E',
    color: '#D63A2B',
    secondaryColor: '#FF6A59',
    textColor: 'text-[#D63A2B]',
    glow: 'rgba(214, 58, 43, 0.35)',
    barGradient: 'bg-gradient-to-r from-[#D63A2B] to-[#FF6A59]',
    barShadow: 'shadow-[0_0_12px_rgba(214,58,43,0.45)]',
    badge: 'bg-[#D63A2B]/15 text-[#FF6A59] border-[#D63A2B]/40',
    padding: 'p-1.5 sm:p-2',
  },
  'Bundesliga': {
    name: 'Bundesliga',
    short: 'Bundesliga',
    src: bundesligaSvg,
    bgColor: '#D20515',
    borderColor: '#E20613',
    color: '#D20515',
    secondaryColor: '#FF4D5A',
    textColor: 'text-[#D20515]',
    glow: 'rgba(210, 5, 21, 0.35)',
    barGradient: 'bg-gradient-to-r from-[#D20515] to-[#FF4D5A]',
    barShadow: 'shadow-[0_0_12px_rgba(210,5,21,0.45)]',
    badge: 'bg-[#D20515]/15 text-[#FF4D5A] border-[#D20515]/40',
    padding: 'p-1.5 sm:p-2',
  },
  'Serie A': {
    name: 'Serie A',
    short: 'Serie A',
    src: serieASvg,
    bgColor: '#FFFFFF',
    borderColor: '#0057B8',
    color: '#0066FF',
    secondaryColor: '#4D94FF',
    textColor: 'text-[#0066FF]',
    glow: 'rgba(0, 102, 255, 0.35)',
    barGradient: 'bg-gradient-to-r from-[#0066FF] to-[#4D94FF]',
    barShadow: 'shadow-[0_0_12px_rgba(0,102,255,0.45)]',
    badge: 'bg-[#0066FF]/15 text-[#4D94FF] border-[#0066FF]/40',
    padding: 'p-1 sm:p-1.5',
  },
  'Ligue 1': {
    name: 'Ligue 1',
    short: 'Ligue 1',
    src: ligue1Svg,
    bgColor: '#000000',
    borderColor: '#333333',
    color: '#A3E635',
    secondaryColor: '#BEF264',
    textColor: 'text-[#A3E635]',
    glow: 'rgba(163, 230, 53, 0.18)',
    barGradient: 'bg-gradient-to-r from-[#84CC16] to-[#A3E635]',
    barShadow: 'shadow-[0_0_8px_rgba(163,230,53,0.3)]',
    badge: 'bg-[#A3E635]/15 text-[#BEF264] border-[#A3E635]/40',
    padding: 'p-1.5 sm:p-2',
  },
};

/**
 * Bulletproof league identifier that avoids "bundesliga" substring collision with "liga".
 */
export function getLeagueConfig(leagueName = '') {
  const norm = String(leagueName).toLowerCase().trim();

  // 1. Bundesliga FIRST — MUST precede 'liga' check because 'bundesliga' contains the substring 'liga'
  if (norm.includes('bundesliga') || norm.includes('germany') || norm.startsWith('de ')) {
    return LEAGUE_CONFIGS['Bundesliga'];
  }

  // 2. Premier League
  if (norm.includes('premier') || norm.includes('epl') || norm.includes('england') || norm.startsWith('eng ')) {
    return LEAGUE_CONFIGS['Premier League'];
  }

  // 3. Serie A
  if (norm.includes('serie') || norm.includes('italy') || norm.startsWith('it ')) {
    return LEAGUE_CONFIGS['Serie A'];
  }

  // 4. Ligue 1
  if (norm.includes('ligue') || norm.includes('france') || norm.startsWith('fr ')) {
    return LEAGUE_CONFIGS['Ligue 1'];
  }

  // 5. La Liga
  if (norm.includes('la liga') || norm.includes('laliga') || norm.includes('spain') || norm.startsWith('es ') || norm.includes('liga')) {
    return LEAGUE_CONFIGS['La Liga'];
  }

  return LEAGUE_CONFIGS['Premier League'];
}

/**
 * Clean human-readable league name without dataset country code prefixes (e.g. "de Bundesliga" -> "Bundesliga").
 */
export function formatLeagueName(leagueName = '') {
  const config = getLeagueConfig(leagueName);
  return config.name;
}

/**
 * Circular League Badge matching OrbitingCirclesGlobe styling with large high-fill SVGs.
 */
export default function LeagueLogo({ leagueName, size = 'lg', className = '' }) {
  const config = getLeagueConfig(leagueName);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    studio: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    hero: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  }[size] || 'w-14 h-14 sm:w-16 sm:h-16';

  return (
    <div
      className={`rounded-full flex items-center justify-center border-2 shrink-0 select-none transition-all duration-300 hover:scale-105 ${config.padding} ${sizeClasses} ${className}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        boxShadow: `0 0 20px ${config.glow}, 0 8px 30px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255,255,255,0.4)`,
      }}
      title={config.name}
    >
      <img
        src={config.src}
        alt={config.name}
        className="w-full h-full object-contain select-none pointer-events-none filter drop-shadow-md"
      />
    </div>
  );
}
