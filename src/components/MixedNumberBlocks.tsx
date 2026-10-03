import React from 'react';
import { FractionPie } from './FractionPie';
import { FractionDisplay } from './FractionDisplay';

interface MixedNumberBlocksProps {
  mode: 'improper_to_mixed' | 'mixed_to_improper';
  whole: number;
  remainder: number;
  denominator: number;
  improperNumerator: number;
  showSolution?: boolean;
  className?: string;
}

export const MixedNumberBlocks: React.FC<MixedNumberBlocksProps> = ({
  mode,
  whole,
  remainder,
  denominator,
  improperNumerator,
  showSolution = false,
  className = '',
}) => {
  if (!showSolution) {
    // Challenge view while the student is solving - NO SPOILERS!
    return (
      <div className={`p-5 bg-amber-50/50 border border-amber-200 rounded-2xl flex flex-col items-center select-none w-full max-w-md ${className}`}>
        <div className="text-xs font-semibold text-stone-600 mb-3 text-center">
          {mode === 'improper_to_mixed'
            ? 'Unechten Bruch in eine gemischte Zahl umwandeln'
            : 'Gemischte Zahl in einen unechten Bruch umwandeln'}
        </div>

        {/* Challenge Box */}
        <div className="flex items-center justify-center gap-4 bg-white px-6 py-4 rounded-xl border border-stone-200 shadow-xs w-full">
          {mode === 'improper_to_mixed' ? (
            <>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-stone-400 font-medium mb-1">Unechter Bruch</span>
                <FractionDisplay num={improperNumerator} den={denominator} size="lg" />
              </div>

              <div className="text-2xl font-bold text-amber-500">=</div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] text-stone-400 font-medium mb-1">Gemischte Zahl</span>
                <div className="px-3 py-1 bg-amber-100/70 border-2 border-dashed border-amber-400 rounded-lg text-amber-950 font-display font-extrabold text-xl">
                  ?
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-stone-400 font-medium mb-1">Gemischte Zahl</span>
                <FractionDisplay whole={whole} num={remainder} den={denominator} size="lg" />
              </div>

              <div className="text-2xl font-bold text-amber-500">=</div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] text-stone-400 font-medium mb-1">Unechter Bruch</span>
                <div className="px-3 py-1 bg-amber-100/70 border-2 border-dashed border-amber-400 rounded-lg text-amber-950 font-display font-extrabold text-xl">
                  ?
                </div>
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-stone-500 text-center mt-3">
          {mode === 'improper_to_mixed'
            ? `Wie oft passt der Nenner ${denominator} vollständig in den Zähler ${improperNumerator}? Was bleibt als Rest?`
            : `Wie viele ${denominator}stel stecken in den ${whole} Ganzen zusammen mit den ${remainder} Rest-Stücken?`}
        </p>
      </div>
    );
  }

  // Solution view shown ONLY AFTER the student has submitted their answer:
  return (
    <div className={`p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center select-none ${className}`}>
      <div className="text-xs font-semibold text-emerald-800 mb-3 text-center">
        Anschauliche Lösung: {whole} Ganze(s) und {remainder}/{denominator}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Render Whole Units */}
        {Array.from({ length: whole }).map((_, i) => (
          <div key={`whole_${i}`} className="flex flex-col items-center">
            <FractionPie
              totalParts={denominator}
              selectedParts={Array.from({ length: denominator }, (_, idx) => idx)}
              size={85}
              theme="melon"
            />
            <span className="text-[11px] font-mono font-bold text-emerald-800 mt-1">
              1 Ganzes ({denominator}/{denominator})
            </span>
          </div>
        ))}

        {/* Plus sign */}
        {remainder > 0 && whole > 0 && (
          <div className="text-2xl font-bold text-stone-400 self-center">+</div>
        )}

        {/* Render Remainder Unit */}
        {remainder > 0 && (
          <div className="flex flex-col items-center">
            <FractionPie
              totalParts={denominator}
              selectedParts={Array.from({ length: remainder }, (_, idx) => idx)}
              size={85}
              theme="melon"
            />
            <span className="text-[11px] font-mono font-bold text-emerald-800 mt-1">
              {remainder}/{denominator}
            </span>
          </div>
        )}
      </div>

      {/* Complete Equation banner */}
      <div className="mt-4 px-4 py-2 bg-white rounded-xl border border-stone-200 flex items-center gap-3 text-sm font-semibold text-stone-800 shadow-xs">
        <span>Unechter Bruch:</span>
        <FractionDisplay num={improperNumerator} den={denominator} size="md" />
        <span>=</span>
        <span>Gemischte Zahl:</span>
        <FractionDisplay whole={whole} num={remainder} den={denominator} size="md" />
      </div>
    </div>
  );
};
