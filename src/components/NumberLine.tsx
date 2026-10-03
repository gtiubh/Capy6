import React from 'react';
import { CapybaraAvatar } from './CapybaraAvatar';
import { FractionDisplay } from './FractionDisplay';

interface NumberLineProps {
  max: number; // 1 or 2
  ticksPerWhole: number; // e.g. 4, 5, 6, 8, 10
  currentPosition?: { num: number; den: number } | null;
  targetPosition?: { num: number; den: number } | null;
  interactive?: boolean;
  onSelectPosition?: (pos: { num: number; den: number }) => void;
  showLabels?: boolean;
  revealFraction?: boolean; // ONLY show fraction on capybara after answer is submitted
  mode?: 'read' | 'place';
  equippedHat?: string;
  equippedFace?: string;
  className?: string;
}

export const NumberLine: React.FC<NumberLineProps> = ({
  max,
  ticksPerWhole,
  currentPosition,
  targetPosition,
  interactive = false,
  onSelectPosition,
  showLabels = false,
  revealFraction = false,
  mode = 'read',
  equippedHat = 'yuzu',
  equippedFace = 'none',
  className = '',
}) => {
  const totalTicks = max * ticksPerWhole;

  // Fraction to percentage position (8% to 92% of container width for comfortable edge margins)
  const posToPct = (num: number, den: number) => {
    const val = num / den;
    const ratio = Math.min(Math.max(val / max, 0), 1);
    return 8 + ratio * 84;
  };

  const currentPct = currentPosition
    ? posToPct(currentPosition.num, currentPosition.den)
    : null;

  return (
    <div className={`w-full max-w-2xl mx-auto p-4 sm:p-5 bg-white border border-stone-200 rounded-3xl shadow-xs select-none ${className}`}>
      {/* Top Header Information */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
        <span>Start: 0</span>
        {revealFraction ? (
          <span className="text-amber-900 bg-amber-100 font-bold px-2.5 py-0.5 rounded-full font-mono text-xs">
            Schrittweite: 1/{ticksPerWhole} pro Teilabschnitt
          </span>
        ) : (
          <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs font-medium">
            💡 Zähle die Abschnitte von 0 bis 1, um den Nenner zu bestimmen!
          </span>
        )}
        <span>Ende: {max}</span>
      </div>

      {/* Main Track Stage with generous height so Capybara is completely ABOVE the axis line */}
      <div className="relative h-44 w-full mt-2">
        {/* Horizontal Axis Line at y = 104px */}
        <div className="absolute top-[104px] left-6 right-6 h-1.5 bg-stone-800 rounded-full" />
        
        {/* Arrow head on the right */}
        <div className="absolute top-[99px] right-4 border-solid border-l-stone-800 border-l-[10px] border-y-transparent border-y-[6px] border-r-0" />

        {/* Ticks and Scale Numbers */}
        {Array.from({ length: totalTicks + 1 }).map((_, i) => {
          const isMajor = i % ticksPerWhole === 0;
          const wholeVal = i / ticksPerWhole;
          const pct = 8 + (i / totalTicks) * 84;

          return (
            <div
              key={i}
              className="absolute flex flex-col items-center group"
              style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
            >
              {/* Tick Mark extending symmetrically across the axis line at 104px */}
              <div
                className={`transition-all rounded-full ${
                  isMajor
                    ? 'w-1 bg-stone-900 h-8 top-[90px]'
                    : 'w-0.5 bg-stone-400 group-hover:bg-amber-600 group-hover:h-6 h-5 top-[95px]'
                } absolute`}
              />

              {/* Major Whole Numbers strictly BELOW the axis */}
              {isMajor && (
                <span className="absolute top-[122px] text-base font-bold font-mono text-stone-900">
                  {wholeVal}
                </span>
              )}

              {/* Step counter / tick helper if revealed */}
              {!isMajor && showLabels && revealFraction && (
                <span className="absolute top-[122px] text-[10px] font-mono text-stone-500">
                  {i}/{ticksPerWhole}
                </span>
              )}

              {/* Interactive Hit Area (for clicking ticks) */}
              {interactive && (
                <button
                  type="button"
                  aria-label={`Position ${i}/${ticksPerWhole}`}
                  onClick={() => {
                    if (onSelectPosition) {
                      onSelectPosition({ num: i, den: ticksPerWhole });
                    }
                  }}
                  className="absolute top-[80px] -bottom-4 w-7 h-16 bg-transparent hover:bg-amber-400/20 active:bg-amber-500/30 rounded-full cursor-pointer transition-colors z-10"
                />
              )}
            </div>
          );
        })}

        {/* Positioned Capybara: Elevated completely ABOVE the axis line with a crisp needle */}
        {currentPct !== null && (
          <div
            className="absolute transition-all duration-300 ease-out z-20 pointer-events-none"
            style={{
              left: `${currentPct}%`,
              top: '4px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Speech bubble / Label strictly ABOVE the Capybara */}
              <div className="mb-1 text-center">
                {revealFraction ? (
                  <div className="bg-stone-900 text-amber-200 px-2 py-0.5 rounded-lg shadow-sm font-mono font-bold text-xs inline-flex items-center">
                    <FractionDisplay
                      num={currentPosition!.num}
                      den={currentPosition!.den}
                      size="sm"
                      className="text-white"
                    />
                  </div>
                ) : mode === 'read' ? (
                  <div className="bg-amber-100 border border-amber-300 text-amber-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-xs">
                    Hier! ❓
                  </div>
                ) : (
                  <div className="bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-xs">
                    Deine Wahl 📍
                  </div>
                )}
              </div>

              {/* Capybara Avatar circle */}
              <div className="w-13 h-13 bg-amber-100/90 rounded-full p-0.5 border-2 border-amber-500 shadow-md flex items-center justify-center">
                <CapybaraAvatar
                  size="sm"
                  hat={equippedHat}
                  face={equippedFace}
                  expression={revealFraction ? 'happy' : 'chill'}
                />
              </div>

              {/* Sharp Pointer Needle pointing directly to the tick at the axis */}
              <svg width="18" height="24" viewBox="0 0 18 24" className="drop-shadow-xs -mt-0.5">
                <polygon points="9,24 2,4 16,4" fill="#D97706" />
                <circle cx="9" cy="6" r="3" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Helper text underneath */}
      {interactive && !revealFraction && (
        <p className="text-center text-xs text-stone-500 font-medium mt-1">
          Tippe auf den gewünschten Teilstrich am Zahlenstrahl, um das Capybara zu platzieren. Klicke danach auf „Antwort überprüfen“.
        </p>
      )}
      {!interactive && !revealFraction && (
        <p className="text-center text-xs text-stone-500 font-medium mt-1">
          Zähle die Schritte von 0 bis zum Zeiger des Capybaras, um den Zähler und Nenner zu bestimmen.
        </p>
      )}
    </div>
  );
};
