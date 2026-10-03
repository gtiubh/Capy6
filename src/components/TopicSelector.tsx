import React from 'react';
import { TopicId, TopicInfo, PlayerStats } from '../types/game';
import { sound } from '../utils/audio';
import { Sparkles, ArrowRight, Star, Award } from 'lucide-react';

interface TopicSelectorProps {
  topics: TopicInfo[];
  currentTopic: TopicId;
  playerStats: PlayerStats;
  onSelectTopic: (id: TopicId) => void;
  onOpenMiniGame: (game: 'citrus' | 'lily') => void;
  onOpenShop: () => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  currentTopic,
  playerStats,
  onSelectTopic,
  onOpenMiniGame,
  onOpenShop,
}) => {
  return (
    <div className="space-y-6">
      {/* Onsen Warmth Motivation Bar */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 border border-amber-300 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">♨️</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-stone-900 text-base sm:text-lg">
                  Onsen-Thermalbad Wärme
                </h3>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                  {playerStats.onsenWarmth}%
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Richtig gelöste Aufgaben heizen das Thermalbad auf! Bei 100% wartet eine große Bonus-Runde.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.pop();
                onOpenMiniGame('citrus');
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>🍊 Mini-Spiel: Yuzu-Fang</span>
            </button>
            <button
              onClick={() => {
                sound.pop();
                onOpenMiniGame('lily');
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>🪷 Seerosen-Hüpfen</span>
            </button>
          </div>
        </div>

        {/* Progress meter */}
        <div className="w-full bg-amber-200/60 h-3 rounded-full mt-3 overflow-hidden border border-amber-300/80">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, playerStats.onsenWarmth))}%` }}
          />
        </div>
      </div>

      {/* Grid of the 5 curriculum topics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display font-extrabold text-xl text-stone-900">
              Mathematische Themen (Klasse 6 Gymnasium)
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
              <span>Lehrplanorientiert</span>
              <span aria-hidden="true">·</span>
              <span>5 Kernmodule</span>
              <span aria-hidden="true">·</span>
              <span>Mit visuellen Hilfen</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topics.map((t, idx) => {
            const mastery = playerStats.topicMastery[t.id] || { completed: 0, total: 10, stars: 0 };
            const isSelected = currentTopic === t.id;

            return (
              <div
                key={t.id}
                onClick={() => {
                  sound.pop();
                  onSelectTopic(t.id);
                }}
                className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/30'
                    : 'border-stone-200/90 bg-white hover:border-amber-400 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 font-mono mb-1.5">
                    <span>Modul 0{idx + 1}</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-sans">
                      {Array.from({ length: 3 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3.5 h-3.5 ${
                            sIdx < mastery.stars ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-500">
                    {mastery.completed} Aufgaben gemeistert
                  </span>
                  <span className="font-bold text-amber-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? 'Aktiv' : 'Wählen'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
