import React, { useState, useEffect, useRef } from 'react';
import { CapybaraAvatar } from './CapybaraAvatar';
import { sound } from '../utils/audio';
import { Play, RotateCcw, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MiniGameCitrusCatchProps {
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
  equippedHat?: string;
  equippedFace?: string;
}

interface FallingFruit {
  id: number;
  x: number; // percentage 5 to 95
  y: number; // pixels from top
  type: 'yuzu' | 'melon' | 'star' | 'ice';
  points: number;
  speed: number;
}

export const MiniGameCitrusCatch: React.FC<MiniGameCitrusCatchProps> = ({
  onClose,
  onRewardCoins,
  equippedHat = 'yuzu',
  equippedFace = 'none',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [capyX, setCapyX] = useState(50); // percentage 10 to 90
  const [lives, setLives] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);
  const fruitsRef = useRef<FallingFruit[]>([]);
  const [, setFrameCount] = useState(0);

  // Key tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setCapyX(prev => Math.max(10, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setCapyX(prev => Math.min(90, prev + 7));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Pointer / Touch move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setCapyX(Math.max(10, Math.min(90, relativeX)));
  };

  // Start game
  const startGame = () => {
    fruitsRef.current = [];
    setScore(0);
    setCoinsEarned(0);
    setTimeLeft(30);
    setLives(3);
    setCapyX(50);
    setIsGameOver(false);
    setIsPlaying(true);
    sound.pop();
  };

  // Game timer loop
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Animation frame physics
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastSpawn = Date.now();
    let idCounter = 1;

    const gameLoop = () => {
      const now = Date.now();

      // Spawn items
      if (now - lastSpawn > 550) {
        lastSpawn = now;
        const rand = Math.random();
        let type: FallingFruit['type'] = 'yuzu';
        let points = 10;
        let speed = 4 + Math.random() * 3;

        if (rand < 0.2) {
          type = 'ice';
          points = -15;
          speed = 3.5;
        } else if (rand < 0.35) {
          type = 'melon';
          points = 25;
          speed = 4.5;
        } else if (rand < 0.45) {
          type = 'star';
          points = 50;
          speed = 5.5;
        }

        fruitsRef.current.push({
          id: idCounter++,
          x: Math.floor(Math.random() * 80) + 10,
          y: -20,
          type,
          points,
          speed,
        });
      }

      // Update positions & check collisions
      const gameHeight = 360;
      const catcherY = gameHeight - 75;
      const remaining: FallingFruit[] = [];

      for (const fruit of fruitsRef.current) {
        fruit.y += fruit.speed;

        // Check collision with Capybara
        const isNearY = fruit.y >= catcherY - 20 && fruit.y <= catcherY + 30;
        const isNearX = Math.abs(fruit.x - capyX) < 14;

        if (isNearY && isNearX) {
          if (fruit.type === 'ice') {
            sound.wrong();
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setTimeout(endGame, 50);
              }
              return newLives;
            });
          } else {
            sound.coin();
            setScore(s => s + fruit.points);
            const coinGain = fruit.type === 'star' ? 15 : fruit.type === 'melon' ? 8 : 4;
            setCoinsEarned(c => c + coinGain);
          }
          // Fruit caught!
          continue;
        }

        // Missed item reaches bottom
        if (fruit.y < gameHeight) {
          remaining.push(fruit);
        }
      }

      fruitsRef.current = remaining;
      setFrameCount(c => c + 1);
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, capyX]);

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    sound.fanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    // Add coins
    setCoinsEarned(total => {
      onRewardCoins(total);
      return total;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4 text-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍊</span>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">
                Yuzu-Fang im Onsen
              </h3>
              <p className="text-xs text-amber-950 font-medium">
                Fange Früchte für das Capybara & weiche Eiswürfeln aus!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-amber-950" />
          </button>
        </div>

        {/* Dashboard Bar */}
        <div className="bg-amber-100/70 px-4 py-2 flex items-center justify-between text-xs font-semibold text-stone-700 border-b border-amber-200">
          <div className="flex items-center gap-1">
            <span>⏱️ Zeit:</span>
            <span className="font-mono text-sm text-stone-900">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️ Leben:</span>
            <span className="text-sm">{'❤️'.repeat(Math.max(0, lives))}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🪙 Yuzus:</span>
            <span className="font-mono text-sm font-bold text-amber-800">+{coinsEarned}</span>
          </div>
        </div>

        {/* Game Stage */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-88 bg-gradient-to-b from-sky-100 via-sky-50 to-cyan-200 overflow-hidden cursor-crosshair touch-none select-none"
        >
          {/* Water effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-sky-400/30 backdrop-blur-[1px] border-t-2 border-sky-300" />

          {/* Falling items */}
          {fruitsRef.current.map(fruit => (
            <div
              key={fruit.id}
              className="absolute text-2xl filter drop-shadow-sm transition-transform pointer-events-none"
              style={{
                left: `${fruit.x}%`,
                top: `${fruit.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {fruit.type === 'yuzu' && '🍊'}
              {fruit.type === 'melon' && '🍉'}
              {fruit.type === 'star' && '⭐'}
              {fruit.type === 'ice' && '🧊'}
            </div>
          ))}

          {/* Capybara Catcher */}
          <div
            className="absolute bottom-2 transition-transform duration-75 pointer-events-none"
            style={{
              left: `${capyX}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="relative">
              {/* Wooden Onsen Tub */}
              <div className="w-20 h-6 bg-amber-800 rounded-b-xl border-t-2 border-amber-950 shadow-md flex items-center justify-center">
                <span className="text-[10px] text-amber-200 font-bold tracking-wider">♨️ ONSEN</span>
              </div>
              <div className="-mt-16 flex justify-center">
                <CapybaraAvatar
                  size="sm"
                  hat={equippedHat}
                  face={equippedFace}
                  expression={isPlaying ? 'happy' : 'chill'}
                />
              </div>
            </div>
          </div>

          {/* Start Screen Overlay */}
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <span className="text-5xl mb-2 animate-bounce">🍊</span>
              <h4 className="font-display font-extrabold text-2xl text-amber-300">
                Bereit zum Früchte-Fangen?
              </h4>
              <p className="text-xs text-stone-200 max-w-xs mt-1 mb-5">
                Steuere mit Pfeiltasten / Touch das Capybara nach links & rechts. Schnappe dir Zitrusfrüchte für Yuzu-Münzen!
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-display font-bold text-base shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                Spiel Starten
              </button>
            </div>
          )}

          {/* Game Over Screen Overlay */}
          {isGameOver && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-pulse" />
              <h4 className="font-display font-extrabold text-2xl text-amber-300">
                Klasse gefangen!
              </h4>
              <p className="text-sm text-stone-200 mt-1">
                Du hast <span className="font-bold text-amber-300 font-mono">+{coinsEarned} Yuzu-Münzen</span> gesammelt!
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={startGame}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nochmal
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Zurück zum Lernen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile controls hints */}
        <div className="p-3 bg-stone-100 text-center text-xs text-stone-500">
          Tippe & ziehe auf dem Bildschirm oder nutze <kbd className="px-1 py-0.5 bg-white border rounded">←</kbd> <kbd className="px-1 py-0.5 bg-white border rounded">→</kbd>
        </div>
      </div>
    </div>
  );
};
