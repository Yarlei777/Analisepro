import React from "react";
import { cn } from "../lib/utils";
import { RED_NUMBERS } from "../constants";

interface NumberGridProps {
  onAddNumber: (num: number) => void;
}

export const NumberGrid = React.memo(({ onAddNumber }: NumberGridProps) => {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-12 gap-0.5 sm:gap-0.5">
      <button
        onClick={() => onAddNumber(0)}
        className="h-7 sm:h-8 bg-emerald-700/60 hover:bg-emerald-600 rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-black border border-emerald-500/10 transition-all active:scale-95 sm:col-span-1 col-span-2 relative overflow-hidden group touch-manipulation select-none"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10">0</span>
      </button>
      {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onAddNumber(num)}
          className={cn(
            "h-7 sm:h-8 rounded-sm flex items-center justify-center text-[10px] sm:text-xs font-black border transition-all active:scale-95 relative overflow-hidden group touch-manipulation select-none",
            RED_NUMBERS.includes(num)
              ? "bg-red-700/60 hover:bg-red-600 border-red-500/10"
              : "bg-zinc-950 border-white/5 hover:bg-zinc-900",
          )}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">{num}</span>
        </button>
      ))}
    </div>
  );
});

NumberGrid.displayName = "NumberGrid";
