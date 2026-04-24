import React from 'react';
import { cn } from '../lib/utils';
import { RED_NUMBERS } from '../constants';

interface HistoryBarProps {
  history: number[];
}

export const HistoryBar = React.memo(({ history }: HistoryBarProps) => {
  if (history.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 mb-3 px-2 overflow-x-auto custom-scrollbar pb-1.5 pt-0.5">
      <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap mr-2">Últimos Lidos:</span>
      {history.slice(0, 10).map((num, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-center min-w-[28px] h-7 rounded-md text-[11px] font-black border shadow-sm shrink-0",
            RED_NUMBERS.includes(num) ? "bg-red-600 border-red-400/30 text-white" : 
            num === 0 ? "bg-emerald-600 border-emerald-400/30 text-white" : 
            "bg-zinc-900 border-white/10 text-white",
            i === 0 && "ring-1 ring-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]"
          )}
        >
          {num}
        </div>
      ))}
    </div>
  );
});

HistoryBar.displayName = 'HistoryBar';
