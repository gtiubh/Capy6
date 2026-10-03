import React, { useState, useEffect } from 'react';
import { CapybaraAvatar } from './CapybaraAvatar';
import { FractionDisplay } from './FractionDisplay';
import { sound } from '../utils/audio';
import { areFractionsEqual, pickRandom, shuffle } from '../utils/fractions';
import { X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MiniGameLilyHopProps {
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
  equippedHat?: string;
  equippedFace?: string;
}

interface LilyPadOption {
  id: string;
  num: number;
  den: number;
  isCorrect: boolean;
}

export const MiniGameLilyHop: React.FC<MiniGameLilyHopProps> = ({
  onClose,
  onRewardCoins,
  equippedHat = 'yuzu',
  equippedFace = 'none',
}) => {
  const [targetFraction, setTargetFraction] = useState({ num: 1, den: 2 });
  const [options, setOptions] = useState<LilyPadOption[]>([]);
  const [hopStep, setHopStep] = useState(0);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Generate a new river jumping round
  const nextRound = () => {
    // Pick base fraction: 1/2, 1/3, 2/3, 1/4, 3/4, 1/5, 2/5, 3/5
    const baseList = [
      { num: 1, den: 2 },
      { num: 1, den: 3 },
      { num: 2, den: 3 },
      { num: 1, den: 4 },
      { num: 3, den: 4 },
      { num: 1, den: 5 },
      { num: 2, den: 5 },
    ];
    const base = pickRandom(baseList);
    setTargetFraction(base);

    // Generate 1 equivalent fraction and 2 non-equivalent
    const mult = pickRandom([2, 3, 4, 5]);
    const correctPad: LilyPadOption = {
      id: 'pad_c_' + Math.random(),
      num: base.num * mult,
      den: base.den * mult,
      isCorrect: true,
    };

    const wrongList: LilyPadOption[] = [];
    while (wrongList.length < 2) {
      const wNum = Math.floor(Math.random() * 8) + 1;
      const wDen = Math.floor(Math.random() * 9) + 2;
      if (!areFractionsEqual(base.num, base.den, wNum, wDen) && wNum < wDen) {
        wrongList.push({
          id: `pad_w_${wrongList.length}_` + Math.random(),
          num: wNum,
          den: wDen,
          isCorrect: false,
        });
      }
    }

    setOptions(shuffle([correctPad, ...wrongList]));
    setSelectedPadId(null);
    setFeedback(null);
  };

  useEffect(() => {
    nextRound();
  }, []);

  const handleHop = (pad: LilyPadOption) => {
    if (isJumping || selectedPadId) return;
    setSelectedPadId(pad.id);

    if (pad.isCorrect) {
      sound.splash();
      sound.correct();
      setIsJumping(true);
      setScore(s => s + 1);
      setCoinsEarned(c => c + 15);
      setHopStep(h => h + 1);
      setFeedback('Platsch! Volltreffer!');

      setTimeout(() => {
        setIsJumping(false);
        if (hopStep >= 7) {
          // Completed across the river!
          endGame();
        } else {
          nextRound();
        }
      }, 700);
    } else {
      sound.wrong();
      setFeedback('Huch, daneben gehopst! Versuche es gleich nochmal.');
      setTimeout(() => {
        setSelectedPadId(null);
        setFeedback(null);
      }, 1000);
    }
  };

  const endGame = () => {
    setIsGameOver(true);
    sound.fanfare();
    confetti({ particleCount: 70, spread: 70 });
    onRewardCoins(coinsEarned + 25);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-emerald-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐸</span>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Seerosen-Hüpfen auf dem Bruch-Fluss
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Überquere den Fluss mit gleichwertigen Brüchen!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* River Progress Bar */}
        <div className="bg-emerald-50 px-4 py-2 flex items-center justify-between text-xs font-semibold text-stone-700 border-b border-emerald-100">
          <div className="flex items-center gap-1">
            <span>Uferüberquerung:</span>
            <span className="font-mono text-emerald-800 font-bold">{hopStep} / 8 Sprünge</span>
          </div>
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <span>🪙 +{coinsEarned} Yuzus</span>
          </div>
        </div>

        {/* River Scene */}
        <div className="relative w-full h-88 bg-gradient-to-b from-teal-200 via-teal-100 to-emerald-200 p-4 flex flex-col justify-between overflow-hidden">
          {/* River ripples */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 left-4 w-32 h-1 bg-white rounded-full" />
            <div className="absolute top-28 right-8 w-48 h-1 bg-white rounded-full" />
            <div className="absolute bottom-16 left-12 w-40 h-1 bg-white rounded-full" />
          </div>

          {/* Goal Banner */}
          <div className="z-10 bg-white/90 backdrop-blur-xs rounded-2xl p-3 shadow-md border border-emerald-300 text-center max-w-sm mx-auto">
            <span className="text-xs text-stone-600 font-medium block">
              Springe auf die Seerose mit demselben Wert wie:
            </span>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-emerald-900 font-display">Ziel-Bruch:</span>
              <div className="bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                <FractionDisplay num={targetFraction.num} den={targetFraction.den} size="md" />
              </div>
            </div>
          </div>

          {/* Capybara on current pad */}
          <div className="z-10 flex justify-center items-center my-1">
            <div className={`relative flex flex-col items-center transition-transform duration-300 ${isJumping ? '-translate-y-8 scale-110' : ''}`}>
              <CapybaraAvatar
                size="sm"
                hat={equippedHat}
                face={equippedFace}
                expression={isJumping ? 'cheering' : 'happy'}
              />
              <div className="w-16 h-4 bg-emerald-700/40 rounded-full blur-[2px] -mt-1" />
            </div>
          </div>

          {/* 3 Lily pads to choose */}
          <div className="z-10 grid grid-cols-3 gap-3 mb-2">
            {options.map((pad) => {
              const isSelected = selectedPadId === pad.id;
              return (
                <button
                  key={pad.id}
                  onClick={() => handleHop(pad)}
                  disabled={isJumping || isGameOver}
                  className={`relative p-3 rounded-2xl border-2 transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? pad.isCorrect
                        ? 'bg-emerald-300 border-emerald-600 scale-105 shadow-lg'
                        : 'bg-rose-200 border-rose-500'
                      : 'bg-emerald-100/90 hover:bg-emerald-200 border-emerald-400 hover:border-emerald-600 shadow-md'
                  }`}
                >
                  {/* Lotus leaf decoration */}
                  <span className="absolute -top-3 text-lg">🪷</span>
                  <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs mt-1">
                    <FractionDisplay num={pad.num} den={pad.den} size="md" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="z-20 text-center text-xs font-bold text-emerald-950 bg-emerald-300/90 py-1 px-3 rounded-full mx-auto shadow-xs">
              {feedback}
            </div>
          )}

          {/* Victory Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 z-30 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <Trophy className="w-14 h-14 text-amber-400 mb-2 animate-bounce" />
              <h4 className="font-display font-extrabold text-2xl text-emerald-300">
                Fluss erfolgreich überquert!
              </h4>
              <p className="text-sm text-stone-200 mt-1 max-w-xs">
                Großartige Bruchrechen-Leistung! Du hast das andere Flussufer sicher erreicht.
              </p>
              <div className="mt-2 text-amber-300 font-bold font-mono text-base">
                +{coinsEarned + 25} Yuzu-Münzen Belohnung!
              </div>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Zurück zur Mathe-Oase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
