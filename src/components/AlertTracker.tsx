import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Zap, Target, AlertCircle, Crosshair } from "lucide-react";
import { cn } from "../lib/utils";

interface AlertTrackerProps {
  stats: {
    biasDetected?: boolean;
    biasTarget?: number;
    terminalRepeat: boolean;
    lastTerminalGroup: string | null;
    sectorConfidence?: number;
    predictedSector: string;
    sectorSequencePattern: string;
    mirrorAlert?: boolean;
    mirrorTarget?: number;
    quebraAlert: boolean;
    quebraTarget: number | null;
    quebraReason: string;
    crazyTable?: boolean;
    entropyLevel?: number;
    winRate?: number;
    sleepingDozen?: number | null;
    sleepingDozenCount?: number;
    sleepingColumn?: number | null;
    sleepingColumnCount?: number;
    alternatingColorPattern?: boolean;
    signatureClusterAlert?: boolean;
    signatureClusterTarget?: string;
    robberyAlert?: boolean;
    robberyRecentCount?: number;
    robberyGaps?: number[];
    callsAlerts?: { called: number; count: number }[];
  };
}

export const AlertTracker: React.FC<AlertTrackerProps> = React.memo(({ stats }) => {
  return (
    <div className="w-full max-w-2xl space-y-2">
      <AnimatePresence mode="popLayout">
        {stats.crazyTable && (
          <motion.div
            key="alert-crazy-table"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex flex-col items-center justify-center space-y-1 transition-colors bg-black/80 text-red-500"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#ef4444_0%,_transparent_70%)]" />
            <div className="flex items-center space-x-2 relative z-10 w-full mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md text-left">
                ALERTA: MESA MALUCA / NÃO ESTÁ PAGANDO
              </span>
            </div>
            <span className="text-[8px] font-mono opacity-80 tracking-widest relative z-10">
              ENTROPIA: {stats.entropyLevel}% | ASSERTIVIDADE: {stats.winRate}%
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.sectorConfidence !== undefined &&
          stats.sectorConfidence > 0.7 && (
            <motion.div
              key="alert-sector-confidence"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-emerald-400"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#10b981_0%,_transparent_70%)]" />
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-emerald-500/10 border-emerald-500/20">
                <Target className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
                PADRÃO DE TRANSIÇÃO DE ÁREA DETECTADO: {stats.predictedSector?.toUpperCase()}
              </span>
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
            </motion.div>
          )}

        {stats.sectorSequencePattern !== "N/A" && (
          <motion.div
            key="alert-sector-sequence"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-gold"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#d4af37_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-gold/10 border-gold/20">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              SEQUÊNCIA DE SETORES DETECTADA: {stats.sectorSequencePattern}
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {(stats as any).somaAlert && (
          <motion.div
            key="alert-soma"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-blue-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#60a5fa_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-blue-500/10 border-blue-500/20">
              <Target className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              ALERTA DE SOMA ({(stats as any).somaTargetSum}): CONVERGÊNCIA NOS NÚMEROS DE SOMA IGUAL
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.quebraAlert && stats.quebraTarget !== null && (
          <motion.div
            key="alert-quebra"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-orange-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#fb923c_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-orange-500/10 border-orange-500/20">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              {stats.quebraReason}: JOGAR NO {stats.quebraTarget}
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.signatureClusterAlert && (
          <motion.div
            key="alert-signature-cluster"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-cyan-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#22d3ee_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-cyan-500/10 border-cyan-500/20">
              <Target className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              ASSINATURA DE DEALER (CLUSTER): {stats.signatureClusterTarget}
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.sleepingDozen !== undefined && stats.sleepingDozen !== null && stats.sleepingDozenCount && stats.sleepingDozenCount > 6 && (
          <motion.div
            key="alert-sleeping-dozen"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-fuchsia-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#e879f9_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-fuchsia-500/10 border-fuchsia-500/20">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              SONO PROFUNDO: DÚZIA {stats.sleepingDozen} AUSENTE HÁ {stats.sleepingDozenCount} RODADAS
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.sleepingColumn !== undefined && stats.sleepingColumn !== null && stats.sleepingColumnCount && stats.sleepingColumnCount > 6 && (
          <motion.div
            key="alert-sleeping-column"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-fuchsia-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#e879f9_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-fuchsia-500/10 border-fuchsia-500/20">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              SONO PROFUNDO: COLUNA {stats.sleepingColumn} AUSENTE HÁ {stats.sleepingColumnCount} RODADAS
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.alternatingColorPattern && (
          <motion.div
            key="alert-alt-color"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-yellow-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#facc15_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-yellow-500/10 border-yellow-500/20">
              <TrendingUp className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              PADRÃO DE PING-PONG (Cores Alternadas) DETECTADO
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

        {stats.callsAlerts && stats.callsAlerts.length > 0 && (
          <motion.div
            key="alert-calls"
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-2 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden group w-full flex items-center space-x-2 transition-colors bg-black/80 text-indigo-400"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top,_#818cf8_0%,_transparent_70%)]" />
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border relative z-10 bg-indigo-500/10 border-indigo-500/20">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="flex-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10 text-left">
              ALERTA DE CHAMADAS: {stats.callsAlerts.map(a => `${a.called} (${a.count}x)`).join(" | ")} PODE CHAMAR DE NOVO
            </span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
});

