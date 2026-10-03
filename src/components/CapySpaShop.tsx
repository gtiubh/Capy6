import React from 'react';
import { CapybaraAvatar } from './CapybaraAvatar';
import { AccessoryItem } from '../types/game';
import { sound } from '../utils/audio';
import { Check, Lock, Sparkles, X } from 'lucide-react';

interface CapySpaShopProps {
  coins: number;
  unlockedItems: string[];
  equippedHat: string;
  equippedFace: string;
  equippedBath: string;
  onBuyItem: (item: AccessoryItem) => void;
  onEquipItem: (category: 'hat' | 'face' | 'bath', itemId: string) => void;
  onClose: () => void;
}

const SHOP_ITEMS: AccessoryItem[] = [
  // Hats
  { id: 'yuzu', name: 'Yuzu-Zitrone', category: 'hat', cost: 0, description: 'Der zeitlose Klassiker auf jedem entspannten Capybara-Kopf.', icon: '🍊' },
  { id: 'towel', name: 'Bade-Handtuch', category: 'hat', cost: 30, description: 'Frisch gefaltet für das perfekte Onsen-Erlebnis.', icon: '🧖' },
  { id: 'flower', name: 'Sakura-Blüte', category: 'hat', cost: 45, description: 'Duftende Kirschblüten aus dem Frühlingsgarten.', icon: '🌸' },
  { id: 'duck', name: 'Badeente', category: 'hat', cost: 60, description: 'Eine kleine gelbe Quietscheente für beste Laune.', icon: '🦆' },
  { id: 'scholar', name: 'Gymnasium-Doktorhut', category: 'hat', cost: 85, description: 'Für meisterhafte Mathe-Profis der 6. Klasse!', icon: '🎓' },

  // Face
  { id: 'none', name: 'Natürlicher Charme', category: 'face', cost: 0, description: 'Pure, unberührte Capybara-Gelassenheit.', icon: '✨' },
  { id: 'blush', name: 'Sanfte Wangenröte', category: 'face', cost: 25, description: 'Vom warmen Thermalbad herrlich aufgewärmt.', icon: '😊' },
  { id: 'sunglasses', name: 'Coole Sonnenbrille', category: 'face', cost: 50, description: 'Weil Brüche rechnen einfach extrem lässig ist.', icon: '🕶️' },
  { id: 'glasses', name: 'Mathe-Scholarenbrille', category: 'face', cost: 75, description: 'Schärft den Blick für kleinste gemeinsame Nenner.', icon: '👓' },
];

export const CapySpaShop: React.FC<CapySpaShopProps> = ({
  coins,
  unlockedItems,
  equippedHat,
  equippedFace,
  equippedBath,
  onBuyItem,
  onEquipItem,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<'hat' | 'face'>('hat');

  const filteredItems = SHOP_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-4 border-amber-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-4 text-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♨️</span>
            <div>
              <h3 className="font-display font-extrabold text-xl leading-tight">
                Capybara-Garderobe & Spa
              </h3>
              <p className="text-xs text-amber-950 font-medium">
                Schmücke dein Mathe-Capybara mit gesammelten Yuzu-Münzen!
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

        {/* Live Preview Stage */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-4 border-b border-amber-200 flex flex-col items-center">
          <div className="relative p-2 bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
            <CapybaraAvatar
              size="lg"
              hat={equippedHat}
              face={equippedFace}
              inWater={true}
              expression="happy"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 bg-amber-100/80 px-3 py-1 rounded-full text-stone-800 text-xs font-semibold">
            <span>🪙 Dein Kontostand:</span>
            <span className="font-mono text-amber-900 font-bold">{coins} Yuzus</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            onClick={() => {
              setActiveCategory('hat');
              sound.pop();
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeCategory === 'hat'
                ? 'border-amber-500 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🧢 Kopfbedeckungen
          </button>
          <button
            onClick={() => {
              setActiveCategory('face');
              sound.pop();
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors cursor-pointer ${
              activeCategory === 'face'
                ? 'border-amber-500 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🕶️ Gesicht & Brillen
          </button>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredItems.map(item => {
              const isUnlocked = item.cost === 0 || unlockedItems.includes(item.id);
              const isEquipped =
                item.category === 'hat'
                  ? equippedHat === item.id
                  : equippedFace === item.id;
              const canAfford = coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                      : isUnlocked
                      ? 'border-stone-200 bg-white hover:border-amber-300'
                      : 'border-stone-200 bg-stone-50/80 opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-3xl p-1.5 bg-stone-100 rounded-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      {isUnlocked ? (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Im Besitz
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-amber-900 flex items-center gap-1">
                          🪙 {item.cost} Yuzus
                        </span>
                      )}
                    </div>

                    <div>
                      {isEquipped ? (
                        <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                          Aktiv
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            sound.pop();
                            onEquipItem(item.category, item.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Anziehen
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onBuyItem(item);
                            } else {
                              sound.wrong();
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xs'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          Freischalten
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs text-stone-500">
          💡 Löse Mathe-Aufgaben oder spiele Mini-Spiele, um weitere Yuzus zu verdienen!
        </div>
      </div>
    </div>
  );
};
