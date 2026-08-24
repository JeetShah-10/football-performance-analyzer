import React from 'react';

const POSITION_CONFIGS = {
  Defender: {
    label: 'DEF',
    fullName: 'Defender',
    textColor: 'text-[#14B8A6]',
    bgColor: 'bg-[#14B8A6]/10',
    borderColor: 'border-[#14B8A6]/35',
  },
  Midfielder: {
    label: 'MID',
    fullName: 'Midfielder',
    textColor: 'text-[#F59E0B]',
    bgColor: 'bg-[#F59E0B]/10',
    borderColor: 'border-[#F59E0B]/35',
  },
  Forward: {
    label: 'ATT',
    fullName: 'Forward',
    textColor: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/35',
  },
};

export default function PositionBadge({ positionGroup, className = '' }) {
  const config = POSITION_CONFIGS[positionGroup] || {
    label: positionGroup || 'POS',
    fullName: positionGroup,
    textColor: 'text-zinc-300',
    bgColor: 'bg-white/10',
    borderColor: 'border-white/20',
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono text-[11px] font-extrabold uppercase tracking-wider border backdrop-blur-md select-none transition-all ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      title={`Position: ${config.fullName || positionGroup}`}
    >
      {config.label}
    </span>
  );
}
