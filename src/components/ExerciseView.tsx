import React, { useState, useEffect } from 'react';
import { QuestionData, TopicId, PlayerStats } from '../types/game';
import { FractionDisplay } from './FractionDisplay';
import { FractionPie } from './FractionPie';
import { FractionBar } from './FractionBar';
import { BalanceScale } from './BalanceScale';
import { NumberLine } from './NumberLine';
import { MixedNumberBlocks } from './MixedNumberBlocks';
import { CapybaraAvatar } from './CapybaraAvatar';
import { sound } from '../utils/audio';
import { CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseViewProps {
  question: QuestionData;
  playerStats: PlayerStats;
  onAnswerCorrect: (points: number) => void;
  onAnswerIncorrect: () => void;
  onNextQuestion: () => void;
  onOpenMiniGame: (game: 'citrus' | 'lily') => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  question,
  playerStats,
  onAnswerCorrect,
  onAnswerIncorrect,
  onNextQuestion,
  onOpenMiniGame,
}) => {
  // State for user input
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [paintedIndices, setPaintedIndices] = useState<number[]>([]);
  const [numberLinePos, setNumberLinePos] = useState<{ num: number; den: number } | null>(null);
  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setPaintedIndices([]);
    setNumberLinePos(
      question.type === 'numberline_read' && question.numberLineTarget
        ? question.numberLineTarget
        : null
    );
    if (question.type === 'order_fractions' && question.fractionsToCompare) {
      setOrderedItems(question.fractionsToCompare.map(f => `${f.num}/${f.den}`));
    }
    setShowHint(false);
    setFeedbackState('idle');
  }, [question.id]);

  // Handler for pie painting
  const handleTogglePiePart = (index: number) => {
    if (feedbackState !== 'idle') return;
    sound.pop();
    setPaintedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Submit and verify answer
  const handleSubmit = (overrideAnswer?: any) => {
    if (feedbackState !== 'idle') return;

    let isCorrect = false;

    if (question.type === 'pie_paint') {
      isCorrect = paintedIndices.length === question.correctAnswer;
    } else if (question.type === 'numberline_place') {
      if (numberLinePos && question.numberLineTarget) {
        isCorrect =
          numberLinePos.num === question.numberLineTarget.num &&
          numberLinePos.den === question.numberLineTarget.den;
      }
    } else if (question.type === 'order_fractions') {
      isCorrect = orderedItems.join(',') === question.correctAnswer;
    } else {
      const answer = overrideAnswer !== undefined ? overrideAnswer : selectedOption;
      isCorrect = answer === question.correctAnswer;
    }

    if (isCorrect) {
      sound.correct();
      setFeedbackState('correct');
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
      });
      onAnswerCorrect(10);
    } else {
      sound.wrong();
      setFeedbackState('wrong');
      onAnswerIncorrect();
    }
  };

  const isSubmitted = feedbackState !== 'idle';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 sm:p-6 select-none">
      {/* Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <CapybaraAvatar
            size="sm"
            hat={playerStats.equippedHat}
            face={playerStats.equippedFace}
            expression={
              feedbackState === 'correct'
                ? 'cheering'
                : feedbackState === 'wrong'
                ? 'thinking'
                : 'chill'
            }
          />
          <div>
            <span className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">
              Gymnasium 6. Klasse
            </span>
            <h3 className="font-display font-extrabold text-lg text-stone-900 leading-snug">
              {question.prompt}
            </h3>
          </div>
        </div>

        {/* Hint button */}
        <button
          onClick={() => {
            sound.pop();
            setShowHint(h => !h);
          }}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>{showHint ? 'Tipp verbergen' : 'Capybara-Tipp'}</span>
        </button>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950 animate-fade-in">
          <span className="text-xl">💡</span>
          <div>
            <span className="font-bold block mb-0.5">Tipp vom weisen Capybara:</span>
            {question.hint}
          </div>
        </div>
      )}

      {/* Interactive Visualization Arena */}
      <div className="py-6 flex flex-col items-center justify-center min-h-60">
        {/* Topic 1: Pie / Bar */}
        {question.type === 'pie_paint' && question.divisions && (
          <div className="flex flex-col items-center gap-4">
            <FractionPie
              totalParts={question.divisions}
              selectedParts={paintedIndices}
              onTogglePart={handleTogglePiePart}
              interactive={feedbackState === 'idle'}
              size={210}
              theme="melon"
            />
            <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              Ausgewählt: <span className="font-mono font-bold text-amber-900">{paintedIndices.length}</span> von <span className="font-mono">{question.divisions}</span> Stücken
            </div>
          </div>
        )}

        {question.type === 'pie_identify' && question.divisions && (
          <div className="flex flex-col items-center gap-4">
            <FractionPie
              totalParts={question.divisions}
              selectedParts={Array.from({ length: question.coloredCount || 0 }, (_, i) => i)}
              size={200}
              theme="citrus"
            />
          </div>
        )}

        {/* Topic 2: Erweitern & Kürzen */}
        {(question.type === 'expand_step' || question.type === 'reduce_step') &&
          question.numerator &&
          question.denominator && (
            <div className="flex flex-col items-center gap-5 w-full">
              <div className="flex items-center gap-4 bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-stone-500 mb-1">Ausgangsbruch:</span>
                  <FractionDisplay
                    num={question.numerator}
                    den={question.denominator}
                    size="lg"
                  />
                </div>

                <div className="flex flex-col items-center text-stone-600 font-bold font-mono">
                  <span className="text-xs text-amber-800">
                    {question.type === 'expand_step' ? `· ${question.factor}` : `÷ ${question.factor}`}
                  </span>
                  <ArrowRight className="w-5 h-5 text-amber-600 my-0.5" />
                  <span className="text-xs text-amber-800">
                    {question.type === 'expand_step' ? `· ${question.factor}` : `÷ ${question.factor}`}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs text-stone-500 mb-1">
                    {question.type === 'expand_step' ? 'Erweitert:' : 'Gekürzt:'}
                  </span>
                  <div className="w-16 h-16 border-2 border-dashed border-amber-400 bg-white rounded-xl flex items-center justify-center font-display font-bold text-amber-900">
                    {isSubmitted && question.targetFraction ? (
                      <FractionDisplay
                        num={question.targetFraction.num}
                        den={question.targetFraction.den}
                        size="md"
                      />
                    ) : (
                      <span className="text-2xl text-amber-600">?</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual Strip comparison: Show original strip before submit; show subdivided/reduced strip ONLY after submit! */}
              <FractionBar
                totalParts={isSubmitted && question.type === 'reduce_step' && question.targetFraction ? question.targetFraction.den : question.denominator}
                coloredParts={isSubmitted && question.type === 'reduce_step' && question.targetFraction ? question.targetFraction.num : question.numerator}
                subdivisions={isSubmitted && question.type === 'expand_step' ? question.factor : 1}
                label={isSubmitted ? 'Bruchstreifen (Lösungsmodell)' : 'Bruchstreifen (Ausgangsbruch)'}
                showNumbers={isSubmitted}
                showFactorHint={isSubmitted}
              />
            </div>
          )}

        {/* Topic 3: Vergleichen & Ordnen */}
        {question.type === 'compare_fractions' && question.fractionsToCompare && (
          <div className="w-full flex justify-center">
            <BalanceScale
              leftFraction={question.fractionsToCompare[0]}
              rightFraction={question.fractionsToCompare[1]}
              chosenOperator={selectedOption as any}
              showComparisonResult={isSubmitted}
            />
          </div>
        )}

        {question.type === 'order_fractions' && (
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <p className="text-xs text-stone-500 font-medium">
              Tausche die Brüche mit den Pfeilen, bis sie von klein nach groß (aufsteigend) sortiert sind:
            </p>
            <div className="grid grid-cols-4 gap-2 w-full">
              {orderedItems.map((fracStr, idx) => {
                const [num, den] = fracStr.split('/').map(Number);
                return (
                  <div
                    key={fracStr}
                    className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex flex-col items-center justify-center shadow-xs"
                  >
                    <span className="text-[10px] text-stone-400 font-mono mb-1">Pos {idx + 1}</span>
                    <FractionDisplay num={num} den={den} size="md" />
                    {!isSubmitted && (
                      <div className="flex gap-1 mt-2">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              sound.pop();
                              const copy = [...orderedItems];
                              [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
                              setOrderedItems(copy);
                            }}
                            className="px-1.5 py-0.5 text-xs bg-white rounded border border-stone-300 hover:bg-stone-100 cursor-pointer"
                          >
                            ←
                          </button>
                        )}
                        {idx < orderedItems.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              sound.pop();
                              const copy = [...orderedItems];
                              [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
                              setOrderedItems(copy);
                            }}
                            className="px-1.5 py-0.5 text-xs bg-white rounded border border-stone-300 hover:bg-stone-100 cursor-pointer"
                          >
                            →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic 4: Zahlenstrahl */}
        {(question.type === 'numberline_read' || question.type === 'numberline_place') &&
          question.numberLineTicks &&
          question.numberLineMax && (
            <div className="w-full">
              <NumberLine
                max={question.numberLineMax}
                ticksPerWhole={question.numberLineTicks}
                currentPosition={numberLinePos}
                interactive={question.type === 'numberline_place' && feedbackState === 'idle'}
                onSelectPosition={pos => {
                  sound.pop();
                  setNumberLinePos(pos);
                }}
                revealFraction={isSubmitted}
                mode={question.type === 'numberline_read' ? 'read' : 'place'}
                equippedHat={playerStats.equippedHat}
                equippedFace={playerStats.equippedFace}
              />
            </div>
          )}

        {/* Topic 5: Unechte Brüche & gemischte Zahlen */}
        {(question.type === 'improper_to_mixed' || question.type === 'mixed_to_improper') &&
          question.denominator &&
          question.whole !== undefined &&
          question.numerator !== undefined && (
            <MixedNumberBlocks
              mode={question.type}
              whole={question.whole}
              remainder={question.type === 'improper_to_mixed' ? question.numerator % question.denominator : question.numerator}
              denominator={question.denominator}
              improperNumerator={question.type === 'improper_to_mixed' ? question.numerator : question.whole * question.denominator + question.numerator}
              showSolution={isSubmitted}
            />
          )}
      </div>

      {/* Answer selection controls (Options buttons) */}
      {question.options && !isSubmitted && question.type !== 'order_fractions' && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {question.options.map(opt => {
              const isSelected = selectedOption === opt.value;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    sound.pop();
                    setSelectedOption(opt.value);
                  }}
                  className={`p-3.5 rounded-2xl border-2 font-display font-bold text-base transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100/70 text-amber-950 shadow-xs ring-2 ring-amber-400/40'
                      : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                  }`}
                >
                  {opt.num && opt.den ? (
                    <FractionDisplay
                      whole={opt.whole}
                      num={opt.num}
                      den={opt.den}
                      size="md"
                    />
                  ) : (
                    <span>{opt.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit / Action Bar */}
      {!isSubmitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleSubmit()}
            disabled={
              question.type === 'pie_paint'
                ? paintedIndices.length === 0
                : question.type === 'numberline_place'
                ? !numberLinePos
                : question.type === 'order_fractions'
                ? false
                : !selectedOption
            }
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-stone-400 text-stone-950 font-display font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>Antwort überprüfen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Feedback & Explanation Card - ONLY VISIBLE AFTER SUBMISSION */}
      {isSubmitted && (
        <div
          className={`mt-6 p-4 sm:p-5 rounded-2xl border-2 animate-fade-in ${
            feedbackState === 'correct'
              ? 'bg-emerald-50/80 border-emerald-300'
              : 'bg-rose-50/80 border-rose-300'
          }`}
        >
          <div className="flex items-start gap-3">
            {feedbackState === 'correct' ? (
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4
                className={`font-display font-bold text-base ${
                  feedbackState === 'correct' ? 'text-emerald-900' : 'text-rose-900'
                }`}
              >
                {feedbackState === 'correct'
                  ? 'Richtig gelöst! 🎉'
                  : 'Leider nicht ganz richtig! Hier ist die Erklärung:'}
              </h4>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-stone-600">
              {feedbackState === 'correct'
                ? '+10 Yuzus verdient · Thermalbad heizt auf!'
                : 'Schau dir das Modell oben genau an und versuche die nächste Aufgabe!'}
            </span>

            <button
              onClick={() => {
                sound.pop();
                onNextQuestion();
              }}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <span>Nächste Aufgabe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
