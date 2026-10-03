import React from 'react';

interface FractionDisplayProps {
  num: number | string;
  den: number | string;
  whole?: number | string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlight?: 'none' | 'num' | 'den' | 'both';
  className?: string;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  num,
  den,
  whole,
  size = 'md',
  highlight = 'none',
  className = '',
}) => {
  const sizeConfig = {
    sm: { text: 'text-xs', wholeText: 'text-base', barH: 'h-0.5', px: 'px-1', gap: 'gap-0.5' },
    md: { text: 'text-base font-semibold', wholeText: 'text-2xl font-bold', barH: 'h-0.5', px: 'px-1.5', gap: 'gap-0.5' },
    lg: { text: 'text-xl font-bold', wholeText: 'text-3xl font-extrabold', barH: 'h-1', px: 'px-2', gap: 'gap-1' },
    xl: { text: 'text-2xl font-bold', wholeText: 'text-4xl font-extrabold', barH: 'h-1', px: 'px-2.5', gap: 'gap-1' },
  };

  const currentSize = sizeConfig[size];

  const numHighlight = highlight === 'num' || highlight === 'both' ? 'text-amber-600 bg-amber-100 rounded px-1' : '';
  const denHighlight = highlight === 'den' || highlight === 'both' ? 'text-emerald-700 bg-emerald-100 rounded px-1' : '';

  return (
    <span className={`inline-flex items-center align-middle font-mono tabular-nums select-none ${className}`}>
      {whole !== undefined && whole !== null && Number(whole) !== 0 && (
        <span className={`${currentSize.wholeText} mr-1 text-stone-800 leading-none`}>
          {whole}
        </span>
      )}
      <span className={`inline-flex flex-col items-center justify-center ${currentSize.gap}`}>
        <span className={`${currentSize.text} leading-none ${currentSize.px} ${numHighlight}`}>
          {num}
        </span>
        <span className={`w-full ${currentSize.barH} bg-stone-700 rounded-full`} />
        <span className={`${currentSize.text} leading-none ${currentSize.px} ${denHighlight}`}>
          {den}
        </span>
      </span>
    </span>
  );
};
