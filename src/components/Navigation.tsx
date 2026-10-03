import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Headphones } from 'lucide-react';
import { sound, bgm } from '../utils/audio';

interface NavigationProps {
  currentTab: 'overview' | 'exercise' | 'spa';
  onSelectTab: (tab: 'overview' | 'exercise' | 'spa') => void;
  onOpenMiniGame: (game: 'citrus' | 'lily') => void;
  yuzuCoins: number;
  streak: number;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenMiniGame,
  yuzuCoins,
  streak,
  isMusicPlaying: externalIsMusicPlaying,
  onToggleMusic: externalOnToggleMusic,
}) => {
  const [isMuted, setIsMuted] = useState(!sound.enabled);
  const [internalMusicPlaying, setInternalMusicPlaying] = useState(false);
  const [showMusicControls, setShowMusicControls] = useState(false);
  const [musicVol, setMusicVol] = useState(50);

  const isMusicPlaying = externalIsMusicPlaying !== undefined ? externalIsMusicPlaying : internalMusicPlaying;

  // Sync music state
  useEffect(() => {
    setInternalMusicPlaying(bgm.getIsPlaying());
  }, []);

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setIsMuted(!sound.enabled);
    if (sound.enabled) {
      sound.pop();
    }
  };

  const toggleMusic = () => {
    if (externalOnToggleMusic) {
      externalOnToggleMusic();
      return;
    }
    sound.pop();
    if (internalMusicPlaying) {
      bgm.stop();
      setInternalMusicPlaying(false);
    } else {
      bgm.start();
      setInternalMusicPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setMusicVol(val);
    bgm.setVolume(val / 100);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sound.pop();
            onSelectTab('overview');
          }}
          className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight flex items-center gap-2 shrink-0 hover:text-amber-800 transition-colors"
        >
          <span>♨️</span>
          <span>CapyBrüche</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => {
              sound.pop();
              onSelectTab('overview');
            }}
            className={`transition-colors hover:text-stone-900 cursor-pointer ${
              currentTab === 'overview'
                ? 'text-stone-900 font-bold border-b-2 border-amber-500 pb-0.5'
                : ''
            }`}
          >
            Themen-Übersicht
          </button>
          <button
            onClick={() => {
              sound.pop();
              onSelectTab('exercise');
            }}
            className={`transition-colors hover:text-stone-900 cursor-pointer ${
              currentTab === 'exercise'
                ? 'text-stone-900 font-bold border-b-2 border-amber-500 pb-0.5'
                : ''
            }`}
          >
            Aktuelle Übung
          </button>
          <button
            onClick={() => {
              sound.pop();
              onSelectTab('spa');
            }}
            className={`transition-colors hover:text-stone-900 cursor-pointer ${
              currentTab === 'spa'
                ? 'text-stone-900 font-bold border-b-2 border-amber-500 pb-0.5'
                : ''
            }`}
          >
            Capy-Spa & Garderobe
          </button>
          <button
            onClick={() => {
              sound.pop();
              onOpenMiniGame('citrus');
            }}
            className="transition-colors hover:text-stone-900 cursor-pointer"
          >
            Yuzu-Fang
          </button>
          <button
            onClick={() => {
              sound.pop();
              onOpenMiniGame('lily');
            }}
            className="transition-colors hover:text-stone-900 cursor-pointer"
          >
            Seerosen-Fluss
          </button>
        </nav>

        {/* Zone 3: Primary actions & Audio controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Yuzu coin counter */}
          <button
            onClick={() => {
              sound.pop();
              onSelectTab('spa');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/90 text-amber-950 text-xs font-semibold transition-colors cursor-pointer"
            title="Zu deinem Capybara-Spa"
          >
            <span>🪙</span>
            <span className="font-mono font-bold">{yuzuCoins}</span>
          </button>

          {/* Streak indicator */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 font-mono">
              <span>🔥</span>
              <span>{streak}x</span>
            </div>
          )}

          {/* Relaxing Focus Music Toggle Button with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleMusic}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowMusicControls(v => !v);
              }}
              title={isMusicPlaying ? 'Fokus-Musik pausieren (Rechtsklick für Lautstärke)' : 'Fokus-Hintergrundmusik starten'}
              aria-label="Fokus-Hintergrundmusik"
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMusicPlaying
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs ring-2 ring-amber-400/30'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">
                {isMusicPlaying ? 'Fokus-Musik 🎶' : 'Fokus-Musik'}
              </span>
            </button>

            {/* Quick volume popup if opened */}
            {showMusicControls && (
              <div className="absolute right-0 top-12 bg-white p-3 rounded-2xl border border-stone-200 shadow-xl w-48 z-50 animate-fade-in text-xs">
                <div className="flex justify-between items-center mb-1 text-stone-700 font-semibold">
                  <span>Musik-Lautstärke</span>
                  <span className="font-mono">{musicVol}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <button
                  onClick={() => setShowMusicControls(false)}
                  className="mt-2 text-[10px] text-stone-400 hover:text-stone-700 block w-full text-right"
                >
                  Schließen
                </button>
              </div>
            )}
          </div>

          {/* Sound FX Mute/Unmute */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Soundeffekte einschalten' : 'Soundeffekte stumm schalten'}
            title={isMuted ? 'Soundeffekte einschalten' : 'Soundeffekte stumm schalten'}
            className="w-9 h-9 rounded-xl border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-stone-700" />}
          </button>
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-100 bg-stone-50/90 py-2 px-3 text-xs font-medium text-stone-600">
        <button
          onClick={() => {
            sound.pop();
            onSelectTab('overview');
          }}
          className={`px-2 py-1 rounded-md transition-colors ${
            currentTab === 'overview' ? 'text-amber-900 font-bold bg-amber-100/60' : ''
          }`}
        >
          Themen
        </button>
        <button
          onClick={() => {
            sound.pop();
            onSelectTab('exercise');
          }}
          className={`px-2 py-1 rounded-md transition-colors ${
            currentTab === 'exercise' ? 'text-amber-900 font-bold bg-amber-100/60' : ''
          }`}
        >
          Übung
        </button>
        <button
          onClick={() => {
            sound.pop();
            onSelectTab('spa');
          }}
          className={`px-2 py-1 rounded-md transition-colors ${
            currentTab === 'spa' ? 'text-amber-900 font-bold bg-amber-100/60' : ''
          }`}
        >
          Spa & Look
        </button>
        <button
          onClick={toggleMusic}
          className={`px-2 py-1 rounded-md flex items-center gap-1 font-medium transition-colors ${
            isMusicPlaying ? 'bg-amber-200 text-amber-950 font-bold' : 'text-stone-600'
          }`}
        >
          <Headphones className="w-3 h-3" />
          <span>{isMusicPlaying ? 'Musik an' : 'Musik'}</span>
        </button>
      </div>
    </header>
  );
};
