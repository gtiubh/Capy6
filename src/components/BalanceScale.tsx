import React from 'react';
import { FractionDisplay } from './FractionDisplay';

interface BalanceScaleProps {
  leftFraction: { num: number; den: number };
  rightFraction: { num: number; den: number };
  chosenOperator?: '<' | '=' | '>' | null;
  showComparisonResult?: boolean;
  className?: string;
}

export const BalanceScale: React.FC<BalanceScaleProps> = ({
  leftFraction,
  rightFraction,
  chosenOperator,
  showComparisonResult = false,
  className = '',
}) => {
  const val1 = leftFraction.num / leftFraction.den;
  const val2 = rightFraction.num / rightFraction.den;

  // Calculate tilt angle in degrees (max +-16 degrees)
  let tiltAngle = 0;
  if (showComparisonResult) {
    const diff = val1 - val2;
    if (Math.abs(diff) < 0.0001) {
      tiltAngle = 0;
    } else {
      tiltAngle = diff > 0 ? -12 : 12; // left heavier tilts down to the left
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl select-none ${className}`}>
      <div className="text-xs font-semibold text-amber-950 mb-2">
        Capybara-Wippe (Vergleichswaage)
      </div>

      <div className="relative w-72 h-44 flex items-center justify-center">
        {/* Scale Base and Pole */}
        <div className="absolute bottom-2 w-28 h-4 bg-amber-800 rounded-t-md shadow-xs" />
        <div className="absolute bottom-6 w-3.5 h-24 bg-stone-700 rounded-sm" />
        {/* Center Pivot Point */}
        <div className="absolute top-14 w-6 h-6 rounded-full bg-amber-500 border-2 border-amber-700 z-20 shadow-xs" />

        {/* Rotating Beam with Plates */}
        <div
          className="absolute top-16 w-60 h-2.5 bg-stone-800 rounded-full transition-transform duration-700 ease-out z-10 origin-center"
          style={{ transform: `rotate(${tiltAngle}deg)` }}
        >
          {/* Left Plate Suspension String */}
          <div className="absolute -left-1 top-2.5 w-0.5 h-16 bg-stone-400">
            {/* Left Pan */}
            <div
              className="absolute -left-11 top-16 w-24 h-5 bg-amber-700 rounded-b-xl border-t-2 border-amber-900 flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              {/* Left Item on Pan */}
              <div className="absolute -top-12 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-stone-200 flex items-center justify-center min-w-14">
                <FractionDisplay num={leftFraction.num} den={leftFraction.den} size="sm" />
              </div>
            </div>
          </div>

          {/* Right Plate Suspension String */}
          <div className="absolute -right-1 top-2.5 w-0.5 h-16 bg-stone-400">
            {/* Right Pan */}
            <div
              className="absolute -right-11 top-16 w-24 h-5 bg-amber-700 rounded-b-xl border-t-2 border-amber-900 flex items-center justify-center transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              {/* Right Item on Pan */}
              <div className="absolute -top-12 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-stone-200 flex items-center justify-center min-w-14">
                <FractionDisplay num={rightFraction.num} den={rightFraction.den} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operator sign between them */}
      <div className="mt-1 flex items-center gap-3">
        <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-mono text-lg font-bold text-amber-900 shadow-xs">
          <FractionDisplay num={leftFraction.num} den={leftFraction.den} size="md" />
        </div>

        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-display font-extrabold text-2xl shadow-xs">
          {chosenOperator || '?'}
        </div>

        <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-mono text-lg font-bold text-amber-900 shadow-xs">
          <FractionDisplay num={rightFraction.num} den={rightFraction.den} size="md" />
        </div>
      </div>
    </div>
  );
};
