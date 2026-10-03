import React from 'react';

interface FractionPieProps {
  totalParts: number;
  selectedParts?: number[]; // indices of selected/colored parts
  onTogglePart?: (index: number) => void;
  interactive?: boolean;
  size?: number;
  theme?: 'citrus' | 'melon' | 'classic';
  className?: string;
}

export const FractionPie: React.FC<FractionPieProps> = ({
  totalParts,
  selectedParts = [],
  onTogglePart,
  interactive = false,
  size = 180,
  theme = 'citrus',
  className = '',
}) => {
  const center = size / 2;
  const radius = size * 0.42;

  // Colors per theme
  const colors = {
    citrus: {
      rim: '#F59E0B',
      empty: '#FEF3C7',
      filled: '#F59E0B',
      hover: '#FDE68A',
      stroke: '#D97706',
      pulp: '#EA580C',
    },
    melon: {
      rim: '#15803D',
      empty: '#DCFCE7',
      filled: '#EF4444',
      hover: '#FCA5A5',
      stroke: '#166534',
      pulp: '#B91C1C',
    },
    classic: {
      rim: '#0284C7',
      empty: '#F1F5F9',
      filled: '#0EA5E9',
      hover: '#BAE6FD',
      stroke: '#0369A1',
      pulp: '#0369A1',
    },
  }[theme];

  // Helper to calculate SVG arc path for a sector
  const getSectorPath = (index: number) => {
    const anglePerPart = (2 * Math.PI) / totalParts;
    const startAngle = index * anglePerPart - Math.PI / 2;
    const endAngle = (index + 1) * anglePerPart - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = anglePerPart > Math.PI ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Outer Crust/Rim */}
        <circle
          cx={center}
          cy={center}
          r={radius + 6}
          fill={colors.rim}
          stroke={colors.stroke}
          strokeWidth="2"
        />
        <circle cx={center} cy={center} r={radius} fill="#FFFFFF" />

        {/* Sectors */}
        {Array.from({ length: totalParts }).map((_, i) => {
          const isSelected = selectedParts.includes(i);
          return (
            <path
              key={i}
              d={getSectorPath(i)}
              fill={isSelected ? colors.filled : colors.empty}
              stroke={colors.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
              className={`transition-colors duration-150 ${
                interactive
                  ? 'cursor-pointer hover:opacity-85 active:scale-[0.98]'
                  : ''
              }`}
              onClick={() => interactive && onTogglePart && onTogglePart(i)}
            />
          );
        })}

        {/* Center pip/seed decor */}
        <circle
          cx={center}
          cy={center}
          r={size * 0.045}
          fill={colors.rim}
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
      </svg>

      {interactive && (
        <div className="text-center mt-1">
          <span className="text-xs text-stone-500 font-medium">
            Tippe zum An-/Abwählen ({selectedParts.length}/{totalParts})
          </span>
        </div>
      )}
    </div>
  );
};
