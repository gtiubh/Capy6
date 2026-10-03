import React from 'react';

interface FractionBarProps {
  totalParts: number;
  coloredParts: number;
  subdivisions?: number; // e.g. if expanding by factor of 2, 3, etc.
  interactive?: boolean;
  selectedIndices?: number[];
  onToggleIndex?: (idx: number) => void;
  label?: string;
  showNumbers?: boolean; // Whether to show numbers on pieces or fraction ratio in header
  showFactorHint?: boolean;
  theme?: 'chocolate' | 'yuzu' | 'lake';
  className?: string;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  totalParts,
  coloredParts,
  subdivisions = 1,
  interactive = false,
  selectedIndices = [],
  onToggleIndex,
  label,
  showNumbers = false,
  showFactorHint = false,
  theme = 'yuzu',
  className = '',
}) => {
  const effectiveParts = totalParts * subdivisions;

  const themes = {
    chocolate: {
      bg: 'bg-amber-950/10 border-amber-900',
      fill: 'bg-amber-800 border-amber-900 text-amber-50',
      empty: 'bg-amber-100/60 border-amber-300 text-amber-800',
      activeSub: 'border-dashed border-amber-600',
    },
    yuzu: {
      bg: 'bg-amber-100 border-amber-400',
      fill: 'bg-amber-500 border-amber-600 text-white',
      empty: 'bg-amber-50 border-amber-200 text-amber-700',
      activeSub: 'border-dashed border-amber-400',
    },
    lake: {
      bg: 'bg-sky-100 border-sky-400',
      fill: 'bg-sky-600 border-sky-700 text-white',
      empty: 'bg-sky-50 border-sky-200 text-sky-700',
      activeSub: 'border-dashed border-sky-400',
    },
  }[theme];

  return (
    <div className={`w-full max-w-md mx-auto select-none ${className}`}>
      {label && (
        <div className="text-xs font-semibold text-stone-600 mb-1 flex justify-between">
          <span>{label}</span>
          {showNumbers && (
            <span className="font-mono tabular-nums">
              {interactive ? selectedIndices.length : coloredParts * subdivisions} / {effectiveParts}
            </span>
          )}
        </div>
      )}
      <div className={`flex w-full h-12 rounded-xl overflow-hidden border-2 shadow-xs ${themes.bg}`}>
        {Array.from({ length: effectiveParts }).map((_, idx) => {
          const isSelected = interactive
            ? selectedIndices.includes(idx)
            : idx < coloredParts * subdivisions;

          // Check if this boundary corresponds to original major parts
          const isMajorBoundary = (idx + 1) % subdivisions === 0 && idx < effectiveParts - 1;

          return (
            <button
              key={idx}
              type="button"
              disabled={!interactive}
              onClick={() => onToggleIndex && onToggleIndex(idx)}
              className={`flex-1 h-full transition-all flex items-center justify-center font-mono text-xs font-bold border-r ${
                isSelected ? themes.fill : themes.empty
              } ${isMajorBoundary ? 'border-r-3 border-r-stone-700' : 'border-r border-stone-300/60'} ${
                interactive ? 'cursor-pointer hover:opacity-85 active:scale-95' : 'cursor-default'
              }`}
            >
              {showNumbers && effectiveParts <= 12 && <span>{idx + 1}</span>}
            </button>
          );
        })}
      </div>
      {showFactorHint && subdivisions > 1 && (
        <div className="text-center mt-1 text-xs text-amber-800 font-medium">
          Jedes Stück wurde in {subdivisions} Teile zerlegt (Erweiterungsfaktor: {subdivisions})
        </div>
      )}
    </div>
  );
};
