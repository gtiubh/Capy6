import React, { useState, useEffect } from 'react';
import { TopicId, TopicInfo, PlayerStats, QuestionData, AccessoryItem } from './types/game';
import { generateQuestion } from './utils/fractions';
import { Navigation } from './components/Navigation';
import { TopicSelector } from './components/TopicSelector';
import { ExerciseView } from './components/ExerciseView';
import { CapySpaShop } from './components/CapySpaShop';
import { MiniGameCitrusCatch } from './components/MiniGameCitrusCatch';
import { MiniGameLilyHop } from './components/MiniGameLilyHop';
import { CapybaraAvatar } from './components/CapybaraAvatar';
import { sound, bgm } from './utils/audio';
import { Sparkles, Trophy, Flame, ChevronRight, Award, Compass, RefreshCw, Headphones, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

const TOPICS_DATA: TopicInfo[] = [
  {
    id: 'anteile',
    title: '1. Anteile eines Ganzen',
    shortTitle: 'Anteile',
    description: 'Veranschauliche Brüche als Teile von Torten, Pizzen, Schokoladen und Obstscheiben. Lerne Zähler & Nenner kennen.',
    iconName: 'pie',
    badge: 'Grundlagen',
  },
  {
    id: 'erweitern_kuerzen',
    title: '2. Erweitern und Kürzen',
    shortTitle: 'Erweitern / Kürzen',
    description: 'Verfeinere oder vergröbere die Einteilung durch Multiplikation oder Division mit demselben Faktor (ggT).',
    iconName: 'expand',
    badge: 'Rechentechnik',
  },
  {
    id: 'vergleichen',
    title: '3. Vergleichen und Ordnen',
    shortTitle: 'Vergleichen',
    description: 'Wiege Brüche auf der Capybara-Wippe ab, bilde Hauptnenner und bringe Brüche in die richtige Reihenfolge.',
    iconName: 'scale',
    badge: 'Größenvergleich',
  },
  {
    id: 'zahlenstrahl',
    title: '4. Am Zahlenstrahl ablesen & eintragen',
    shortTitle: 'Zahlenstrahl',
    description: 'Teile die Strecke von 0 bis 1 in gleich große Schritte und platziere dein Capybara punktgenau.',
    iconName: 'line',
    badge: 'Geometrie & Achse',
  },
  {
    id: 'gemischte_zahlen',
    title: '5. Unechte Brüche & gemischte Zahlen',
    shortTitle: 'Gemischte Zahlen',
    description: 'Verwandle Brüche größer als 1 (z. B. 11/4) in Ganze und Rest (2 3/4) und umgekehrt.',
    iconName: 'mixed',
    badge: 'Ganze & Reste',
  },
];

const INITIAL_STATS: PlayerStats = {
  yuzuCoins: 50, // Starting gift!
  stars: 3,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  onsenWarmth: 20,
  unlockedItems: ['yuzu', 'none'],
  equippedHat: 'yuzu',
  equippedFace: 'none',
  equippedBath: 'clear',
  topicMastery: {
    anteile: { completed: 0, total: 10, stars: 0 },
    erweitern_kuerzen: { completed: 0, total: 10, stars: 0 },
    vergleichen: { completed: 0, total: 10, stars: 0 },
    zahlenstrahl: { completed: 0, total: 10, stars: 0 },
    gemischte_zahlen: { completed: 0, total: 10, stars: 0 },
  },
};

export default function App() {
  // Load saved state or default
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('capy_frac_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_STATS;
  });

  // Current active navigation tab & topic
  const [currentTab, setCurrentTab] = useState<'overview' | 'exercise' | 'spa'>('overview');
  const [currentTopic, setCurrentTopic] = useState<TopicId>('anteile');
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(() =>
    generateQuestion('anteile')
  );

  // Active mini-game overlay
  const [activeMiniGame, setActiveMiniGame] = useState<'citrus' | 'lily' | null>(null);
  const [isSpaOpen, setIsSpaOpen] = useState(false);
  const [showLevelUpCelebration, setShowLevelUpCelebration] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = () => {
    sound.pop();
    if (bgm.getIsPlaying()) {
      bgm.stop();
      setIsMusicPlaying(false);
    } else {
      bgm.start();
      setIsMusicPlaying(true);
    }
  };

  // Persist player stats
  useEffect(() => {
    try {
      localStorage.setItem('capy_frac_stats_v1', JSON.stringify(playerStats));
    } catch {
      // ignore
    }
  }, [playerStats]);

  // When changing topic, generate fresh question
  const handleSelectTopic = (topicId: TopicId) => {
    setCurrentTopic(topicId);
    setCurrentQuestion(generateQuestion(topicId));
    setCurrentTab('exercise');
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(generateQuestion(currentTopic));
  };

  // On answer correct
  const handleAnswerCorrect = (points: number) => {
    setPlayerStats(prev => {
      const newStreak = prev.streak + 1;
      const newCoins = prev.yuzuCoins + points + Math.floor(newStreak / 3) * 5;
      const newWarmth = Math.min(100, prev.onsenWarmth + 15);
      const currentMastery = prev.topicMastery[currentTopic] || { completed: 0, total: 10, stars: 0 };
      const newCompleted = currentMastery.completed + 1;
      const newStars = Math.min(3, Math.floor(newCompleted / 3));

      // Trigger Onsen warm mini-game invite if reaching 100
      if (prev.onsenWarmth < 100 && newWarmth === 100) {
        setTimeout(() => {
          confetti({ particleCount: 80, spread: 80 });
          setShowLevelUpCelebration(true);
        }, 800);
      }

      return {
        ...prev,
        yuzuCoins: newCoins,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalCorrect: prev.totalCorrect + 1,
        onsenWarmth: newWarmth,
        topicMastery: {
          ...prev.topicMastery,
          [currentTopic]: {
            ...currentMastery,
            completed: newCompleted,
            stars: newStars,
          },
        },
      };
    });
  };

  // On answer incorrect
  const handleAnswerIncorrect = () => {
    setPlayerStats(prev => ({
      ...prev,
      streak: 0,
      onsenWarmth: Math.max(10, prev.onsenWarmth - 5),
    }));
  };

  // Reward coins from mini-game
  const handleRewardCoins = (amount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      yuzuCoins: prev.yuzuCoins + amount,
    }));
  };

  // Buy shop item
  const handleBuyShopItem = (item: AccessoryItem) => {
    if (playerStats.yuzuCoins < item.cost) return;
    sound.coin();
    confetti({ particleCount: 30, spread: 40 });

    setPlayerStats(prev => ({
      ...prev,
      yuzuCoins: prev.yuzuCoins - item.cost,
      unlockedItems: [...prev.unlockedItems, item.id],
      ...(item.category === 'hat' ? { equippedHat: item.id } : { equippedFace: item.id }),
    }));
  };

  // Equip item
  const handleEquipItem = (category: 'hat' | 'face' | 'bath', itemId: string) => {
    setPlayerStats(prev => ({
      ...prev,
      ...(category === 'hat' ? { equippedHat: itemId } : { equippedFace: itemId }),
    }));
  };

  const currentTopicInfo = TOPICS_DATA.find(t => t.id === currentTopic) || TOPICS_DATA[0];

  return (
    <div className="min-h-screen bg-amber-50/30 flex flex-col selection:bg-amber-200">
      {/* 3-Zone Navigation Header */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'spa') {
            setIsSpaOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenMiniGame={game => setActiveMiniGame(game)}
        yuzuCoins={playerStats.yuzuCoins}
        streak={playerStats.streak}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section if on Overview */}
        {currentTab === 'overview' && (
          <div className="mb-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Background onsen bubbles */}
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              <div className="max-w-xl z-10 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-semibold text-amber-100 uppercase tracking-wider mb-2">
                  <span>Gymnasium Lehrplan Klasse 6</span>
                  <span aria-hidden="true">·</span>
                  <span>Bruchrechnung spielend meistern</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-4xl leading-tight">
                  Das große Capybara-Bruch-Abenteuer
                </h1>
                <p className="text-sm sm:text-base text-amber-50/90 mt-2 leading-relaxed">
                  Lerne Anteile, Erweitern, Kürzen, Vergleichen, den Zahlenstrahl und gemischte Zahlen. Gewinne Yuzu-Münzen und schalte Belohnungen im Thermalbad frei!
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => {
                      sound.pop();
                      setCurrentTab('exercise');
                    }}
                    className="px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-stone-900 font-display font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 transform hover:scale-105 active:scale-95"
                  >
                    <span>Jetzt losrechnen</span>
                    <ChevronRight className="w-4 h-4 text-amber-700" />
                  </button>
                  <button
                    onClick={toggleMusic}
                    className={`px-5 py-3 rounded-2xl font-semibold text-sm border transition-all cursor-pointer flex items-center gap-2 ${
                      isMusicPlaying
                        ? 'bg-amber-300 text-stone-950 border-amber-200 font-bold shadow-md ring-2 ring-white/50'
                        : 'bg-amber-900/30 hover:bg-amber-900/40 text-white border-white/20'
                    }`}
                  >
                    <Headphones className={`w-4 h-4 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
                    <span>{isMusicPlaying ? '🎶 Fokus-Musik läuft' : '🎧 Fokus-Musik an'}</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.pop();
                      setIsSpaOpen(true);
                    }}
                    className="px-5 py-3 rounded-2xl bg-amber-900/30 hover:bg-amber-900/40 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>♨️ Capy-Garderobe</span>
                  </button>
                </div>
              </div>

              {/* Hero Capybara Avatar */}
              <div className="z-10 flex flex-col items-center">
                <div className="p-3 bg-white/15 backdrop-blur-md rounded-3xl border border-white/30 shadow-inner">
                  <CapybaraAvatar
                    size="lg"
                    hat={playerStats.equippedHat}
                    face={playerStats.equippedFace}
                    inWater={true}
                    expression="happy"
                  />
                </div>
                <span className="text-xs text-amber-100 font-medium mt-2">
                  Dein Mathe-Begleiter ist bereit!
                </span>
              </div>
            </div>

            {/* Topic Selector Cards */}
            <div className="mt-8">
              <TopicSelector
                topics={TOPICS_DATA}
                currentTopic={currentTopic}
                playerStats={playerStats}
                onSelectTopic={handleSelectTopic}
                onOpenMiniGame={game => setActiveMiniGame(game)}
                onOpenShop={() => setIsSpaOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Exercise Tab */}
        {currentTab === 'exercise' && (
          <div className="space-y-6">
            {/* Topic Switcher Bar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-stone-200/90 shadow-xs overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                {TOPICS_DATA.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.pop();
                      handleSelectTopic(t.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      currentTopic === t.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>0{idx + 1}.</span>
                    <span>{t.shortTitle}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-500 ml-4 shrink-0">
                <span>Richtig: {playerStats.totalCorrect}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-bold">Serie: {playerStats.streak}🔥</span>
              </div>
            </div>

            {/* Active Exercise Workout */}
            <ExerciseView
              question={currentQuestion}
              playerStats={playerStats}
              onAnswerCorrect={handleAnswerCorrect}
              onAnswerIncorrect={handleAnswerIncorrect}
              onNextQuestion={handleNextQuestion}
              onOpenMiniGame={game => setActiveMiniGame(game)}
            />

            {/* Quick Helper Cards under exercise */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-stone-700">
                <span className="text-xl">🍕</span>
                <h4 className="font-display font-bold text-sm text-stone-900 mt-1">Zähler & Nenner</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  <strong>Nenner</strong> (unten): In wie viele Teile ist das Ganze geteilt? <strong>Zähler</strong> (oben): Wie viele davon nehmen wir?
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-stone-700">
                <span className="text-xl">⚖️</span>
                <h4 className="font-display font-bold text-sm text-stone-900 mt-1">Goldene Bruchrechen-Regel</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Erweitern & Kürzen ändert nie den Wert eines Bruchs, sondern nur die Feinheit der Einteilung!
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 text-stone-700">
                <span className="text-xl">♨️</span>
                <h4 className="font-display font-bold text-sm text-stone-900 mt-1">Onsen-Wärme: {playerStats.onsenWarmth}%</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Je mehr Aufgaben du löst, desto wärmer wird das Thermalbad! Bei 100% wartet ein Yuzu-Regen!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>♨️ CapyBrüche</span>
            <span aria-hidden="true">·</span>
            <span>Gymnasium Klasse 6 Mathematik</span>
          </div>
          <div>
            <span>Gestaltet für konzentriertes & motivierendes Lernen am PC, Tablet & Smartphone</span>
          </div>
        </div>
      </footer>

      {/* Mini-Games Modals */}
      {activeMiniGame === 'citrus' && (
        <MiniGameCitrusCatch
          onClose={() => setActiveMiniGame(null)}
          onRewardCoins={handleRewardCoins}
          equippedHat={playerStats.equippedHat}
          equippedFace={playerStats.equippedFace}
        />
      )}

      {activeMiniGame === 'lily' && (
        <MiniGameLilyHop
          onClose={() => setActiveMiniGame(null)}
          onRewardCoins={handleRewardCoins}
          equippedHat={playerStats.equippedHat}
          equippedFace={playerStats.equippedFace}
        />
      )}

      {/* Spa & Dressing Room Modal */}
      {isSpaOpen && (
        <CapySpaShop
          coins={playerStats.yuzuCoins}
          unlockedItems={playerStats.unlockedItems}
          equippedHat={playerStats.equippedHat}
          equippedFace={playerStats.equippedFace}
          equippedBath={playerStats.equippedBath}
          onBuyItem={handleBuyShopItem}
          onEquipItem={handleEquipItem}
          onClose={() => setIsSpaOpen(false)}
        />
      )}

      {/* 100% Thermal Warmth Bonus Celebration Modal */}
      {showLevelUpCelebration && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-amber-400">
            <span className="text-5xl animate-bounce inline-block mb-2">♨️✨</span>
            <h3 className="font-display font-extrabold text-2xl text-stone-900">
              Thermalbad kocht vor Freude!
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Glückwunsch! Du hast 100% Onsen-Wärme erreicht. Das Capybara belohnt dich mit <strong className="text-amber-900 font-mono">+50 Yuzu-Münzen</strong> und lädt dich zu einer Runde Yuzu-Fang ein!
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  sound.coin();
                  setPlayerStats(p => ({
                    ...p,
                    yuzuCoins: p.yuzuCoins + 50,
                    onsenWarmth: 20,
                  }));
                  setShowLevelUpCelebration(false);
                  setActiveMiniGame('citrus');
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                🍊 Jetzt Bonus-Spiel starten!
              </button>
              <button
                onClick={() => {
                  sound.coin();
                  setPlayerStats(p => ({
                    ...p,
                    yuzuCoins: p.yuzuCoins + 50,
                    onsenWarmth: 20,
                  }));
                  setShowLevelUpCelebration(false);
                }}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Später spielen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
