import React from 'react';

interface CapybaraAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'chill' | 'happy' | 'thinking' | 'excited' | 'cheering';
  hat?: string;
  face?: string;
  inWater?: boolean;
  className?: string;
  isDancing?: boolean;
}

export const CapybaraAvatar: React.FC<CapybaraAvatarProps> = ({
  size = 'md',
  expression = 'chill',
  hat = 'yuzu',
  face = 'none',
  inWater = false,
  className = '',
  isDancing = false,
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${isDancing ? 'animate-bounce' : ''} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Steam when in water */}
        {inWater && (
          <g className="opacity-60">
            <path
              d="M60 40 Q55 25 62 10"
              stroke="#E0F2FE"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M140 45 Q145 28 138 12"
              stroke="#E0F2FE"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.4s' }}
            />
          </g>
        )}

        {/* Ears */}
        {/* Left Ear */}
        <ellipse cx="65" cy="70" rx="14" ry="12" fill="#8B5A2B" transform="rotate(-15 65 70)" />
        <ellipse cx="65" cy="70" rx="8" ry="7" fill="#5C3A21" transform="rotate(-15 65 70)" />

        {/* Right Ear */}
        <ellipse cx="135" cy="70" rx="14" ry="12" fill="#8B5A2B" transform="rotate(15 135 70)" />
        <ellipse cx="135" cy="70" rx="8" ry="7" fill="#5C3A21" transform="rotate(15 135 70)" />

        {/* Body (if not deeply submerged) */}
        {!inWater ? (
          <path
            d="M50 140 C50 110, 150 110, 150 140 L160 185 C160 195, 140 198, 100 198 C60 198, 40 195, 40 185 Z"
            fill="#9C6634"
          />
        ) : (
          /* Subtle body curve under water */
          <path
            d="M55 130 C55 110, 145 110, 145 130 L150 145 C130 152, 70 152, 50 145 Z"
            fill="#9C6634"
          />
        )}

        {/* Big Characteristic Capybara Head */}
        <rect x="55" y="70" width="90" height="75" rx="36" fill="#B27A44" />
        
        {/* Snout - distinctive flat boxy snout */}
        <path
          d="M65 96 C65 88, 135 88, 135 96 L130 135 C130 144, 70 144, 70 135 Z"
          fill="#945F31"
        />

        {/* Cheeks / highlight */}
        <circle cx="70" cy="115" r="7" fill="#F87171" opacity={expression === 'happy' || face === 'blush' ? '0.55' : '0.2'} />
        <circle cx="130" cy="115" r="7" fill="#F87171" opacity={expression === 'happy' || face === 'blush' ? '0.55' : '0.2'} />

        {/* Nostrils */}
        <ellipse cx="88" cy="126" rx="4" ry="2.5" fill="#3D210F" />
        <ellipse cx="112" cy="126" rx="4" ry="2.5" fill="#3D210F" />

        {/* Mouth */}
        {expression === 'happy' || expression === 'excited' || expression === 'cheering' ? (
          <path
            d="M93 132 Q100 138 107 132"
            stroke="#3D210F"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <path
            d="M95 132 L105 132"
            stroke="#3D210F"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* Eyes */}
        {expression === 'happy' || expression === 'cheering' ? (
          // Happy curved eyes ^^
          <g>
            <path d="M72 88 Q80 81 88 88" stroke="#26150B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M112 88 Q120 81 128 88" stroke="#26150B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        ) : expression === 'thinking' ? (
          // One eye squinting
          <g>
            <circle cx="80" cy="86" r="4.5" fill="#26150B" />
            <path d="M112 87 L126 84" stroke="#26150B" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : (
          // Chill closed/sleepy eyes
          <g>
            <ellipse cx="79" cy="86" rx="5.5" ry="3.5" fill="#26150B" />
            <circle cx="81" cy="85" r="1.5" fill="#FFF" />
            <ellipse cx="121" cy="86" rx="5.5" ry="3.5" fill="#26150B" />
            <circle cx="123" cy="85" r="1.5" fill="#FFF" />
          </g>
        )}

        {/* Glasses (face accessory) */}
        {face === 'glasses' && (
          <g>
            <circle cx="80" cy="86" r="13" stroke="#D97706" strokeWidth="3" fill="none" />
            <circle cx="120" cy="86" r="13" stroke="#D97706" strokeWidth="3" fill="none" />
            <path d="M93 86 L107 86" stroke="#D97706" strokeWidth="3" />
          </g>
        )}

        {/* Sunglasses (face accessory) */}
        {face === 'sunglasses' && (
          <g>
            <path d="M66 80 L94 80 L90 94 L70 94 Z" fill="#18181B" rx="2" />
            <path d="M106 80 L134 80 L130 94 L110 94 Z" fill="#18181B" rx="2" />
            <path d="M94 84 L106 84" stroke="#18181B" strokeWidth="3" />
            <path d="M69 83 L76 91" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M109 83 L116 91" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        )}

        {/* Hats / Headgear */}
        {hat === 'yuzu' && (
          <g className="transform -translate-y-1">
            {/* Bright yellow yuzu citrus */}
            <circle cx="100" cy="62" r="16" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
            <circle cx="103" cy="52" r="3" fill="#CA8A04" />
            {/* Green leaf */}
            <path
              d="M103 52 C114 46, 122 50, 120 56 C112 58, 106 55, 103 52 Z"
              fill="#22C55E"
            />
          </g>
        )}

        {hat === 'flower' && (
          <g>
            <circle cx="100" cy="62" r="7" fill="#F43F5E" />
            <circle cx="91" cy="59" r="6" fill="#FB7185" />
            <circle cx="109" cy="59" r="6" fill="#FB7185" />
            <circle cx="94" cy="70" r="6" fill="#FB7185" />
            <circle cx="106" cy="70" r="6" fill="#FB7185" />
            <circle cx="100" cy="62" r="4" fill="#FEF08A" />
          </g>
        )}

        {hat === 'scholar' && (
          <g>
            {/* Mortarboard */}
            <polygon points="100,44 142,56 100,66 58,56" fill="#1E293B" />
            <rect x="86" y="64" width="28" height="10" fill="#334155" rx="3" />
            {/* Tassel */}
            <path d="M100 56 Q128 58 134 76" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
            <circle cx="134" cy="78" r="3" fill="#F59E0B" />
          </g>
        )}

        {hat === 'towel' && (
          <g>
            {/* Folded white onsen towel */}
            <rect x="75" y="58" width="50" height="15" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M85 64 L115 64" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {hat === 'duck' && (
          <g transform="translate(18, -2)">
            {/* Cute mini yellow rubber duck on head */}
            <ellipse cx="82" cy="60" rx="10" ry="7" fill="#FBBF24" />
            <circle cx="88" cy="53" r="6" fill="#FBBF24" />
            <polygon points="93,52 99,55 93,57" fill="#F97316" />
            <circle cx="89" cy="51" r="1" fill="#000" />
          </g>
        )}

        {/* Hot Spring Water ripples (if in water) */}
        {inWater && (
          <g>
            {/* Hot spring tub or water surface */}
            <path
              d="M20 148 Q60 142 100 148 T180 148 L190 195 L10 195 Z"
              fill="#38BDF8"
              fillOpacity="0.45"
            />
            <path
              d="M15 152 Q55 146 95 152 T175 152 L185 195 L15 195 Z"
              fill="#0284C7"
              fillOpacity="0.3"
            />
            {/* Water highlights */}
            <ellipse cx="60" cy="158" rx="20" ry="3" fill="#BAE6FD" opacity="0.6" />
            <ellipse cx="140" cy="162" rx="25" ry="3" fill="#BAE6FD" opacity="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
};
