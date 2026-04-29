import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { cn } from "../lib/utils";
import { AI_LAYERS } from "../constants";

interface NeuralArchitectureProps {
  historyLength: number;
}

export const NeuralArchitecture: React.FC<NeuralArchitectureProps> = React.memo(({
  historyLength,
}) => {
  return (
    <div className="glass-panel p-4 border border-gold/20 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <div>
            <h2 className="text-sm font-serif font-black italic gold-text tracking-widest uppercase">
              Arquitetura Neural
            </h2>
            <p className="text-[7px] font-black uppercase text-white/40 tracking-[0.3em]">
              Motores de Previsão
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="px-2 py-1 rounded border border-emerald-500/30 flex items-center space-x-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400">
              {AI_LAYERS.filter((_, idx) => historyLength > idx * 0.3).length}/{AI_LAYERS.length} Ativos
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 relative z-10">
        {AI_LAYERS.map((layer: any, idx) => {
          const isActive = historyLength > idx * 0.3;
          const isProcessing = historyLength > 0 && Math.random() > 0.6;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              key={layer.id || idx}
              className={cn(
                "p-1.5 rounded-lg border flex flex-col justify-between h-[48px] relative overflow-hidden group transition-all",
                isActive
                  ? layer.type === "omega"
                    ? "bg-gold/10 border-gold/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                    : layer.type === "extreme"
                      ? "bg-red-900/20 border-red-500/30"
                      : layer.type === "neural"
                        ? "bg-indigo-900/20 border-indigo-500/30"
                        : "bg-white/5 border-emerald-500/20 hover:border-emerald-500/40"
                  : "bg-black/40 border-white/5 opacity-50 grayscale",
              )}
            >
              {isActive && isProcessing && (
                <div className="absolute inset-0 bg-white/5 animate-pulse transition-opacity" />
              )}
              <div className="flex justify-between items-start relative z-10">
                <span
                  className={cn(
                    "text-[5px] font-black uppercase tracking-widest px-1 py-[1px] rounded shadow-sm",
                    layer.type === "omega"
                      ? "bg-gold text-black"
                      : layer.type === "extreme"
                        ? "bg-red-500/20 text-red-400"
                        : layer.type === "neural"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-white/10 text-white/50",
                  )}
                >
                  {layer.id === "EXTRA" ? "EXT" : `L${layer.id || idx}`}
                </span>

                <div className="flex space-x-0.5">
                  {isActive ? (
                    <>
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full shadow-[0_0_3px_currentColor]",
                          layer.type === "omega"
                            ? "bg-gold text-gold"
                            : "bg-emerald-400 text-emerald-400",
                        )}
                      />
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full transition-colors duration-300",
                          isProcessing
                            ? "bg-emerald-400 animate-pulse shadow-[0_0_3px_currentColor] text-emerald-400"
                            : "bg-white/20",
                        )}
                      />
                    </>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-red-500/50" />
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-1">
                <h4
                  className={cn(
                    "text-[6px] font-black uppercase tracking-widest leading-tight line-clamp-2",
                    isActive
                      ? layer.type === "omega"
                        ? "text-gold drop-shadow-sm"
                        : "text-white"
                      : "text-white/30",
                  )}
                >
                  {layer.name || layer}
                </h4>
                {isActive && (
                  <div className="mt-0.5 flex items-center space-x-1">
                    <div className="flex-1 h-[1px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-1000",
                          layer.type === "omega"
                            ? "bg-gold"
                            : layer.type === "extreme"
                              ? "bg-red-500"
                              : layer.type === "neural"
                                ? "bg-indigo-500"
                                : "bg-emerald-500",
                        )}
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
