import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, Target, AlertCircle, Crosshair } from "lucide-react";

interface AlertTrackerProps {
  stats: {
    biasDetected?: boolean;
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
  };
}

export const AlertTracker: React.FC<AlertTrackerProps> = React.memo(({ stats }) => {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <AnimatePresence mode="popLayout">
        {stats.crazyTable && (
          <motion.div
            key="alert-crazy-table"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-red-500 bg-red-500/10 py-3 rounded-xl border border-red-500/20 flex flex-col items-center justify-center space-y-1 text-center px-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 animate-pulse" />
              <span className="tracking-[0.2em]">
                ALERTA: MESA MALUCA / NÃO ESTÁ PAGANDO
              </span>
            </div>
            <span className="text-[8px] font-mono opacity-80 tracking-widest">
              ENTROPIA: {stats.entropyLevel}% | ASSERTIVIDADE: {stats.winRate}%
            </span>
          </motion.div>
        )}

        {stats.biasDetected && !stats.crazyTable && (
          <motion.div
            key="alert-bias"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-gold bg-gold/10 py-3 rounded-xl border border-gold/20 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              VIÉS ESTATÍSTICO DETECTADO: NÚMERO {stats.biasTarget ?? 'VICIADO'}
            </span>
          </motion.div>
        )}

        {stats.terminalRepeat && (
          <motion.div
            key="alert-terminal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span className="tracking-[0.2em]">
              REPETIÇÃO DE GRUPO TERMINAL ({stats.lastTerminalGroup})
            </span>
          </motion.div>
        )}

        {stats.sectorConfidence !== undefined &&
          stats.sectorConfidence > 0.7 && (
            <motion.div
              key="alert-sector-confidence"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-2"
            >
              <Target className="w-4 h-4 animate-pulse" />
              <span className="tracking-[0.2em]">
                PADRÃO DE TRANSIÇÃO DE ÁREA DETECTADO:{" "}
                {stats.predictedSector?.toUpperCase()}
              </span>
            </motion.div>
          )}

        {stats.sectorSequencePattern !== "N/A" && (
          <motion.div
            key="alert-sector-sequence"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-gold bg-gold/10 py-3 rounded-xl border border-gold/20 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              SEQUÊNCIA DE SETORES DETECTADA: {stats.sectorSequencePattern}
            </span>
          </motion.div>
        )}

        {stats.mirrorAlert && (
          <motion.div
            key="alert-mirror"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-red-400 bg-red-500/10 py-3 rounded-xl border border-red-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span className="tracking-[0.2em]">
              ALERTA DE ESPELHO: JOGAR NO {stats.mirrorTarget}
            </span>
          </motion.div>
        )}

        {(stats as any).somaAlert && (
          <motion.div
            key="alert-soma"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-blue-400 bg-blue-500/10 py-3 rounded-xl border border-blue-500/20 flex items-center justify-center space-x-2"
          >
            <Target className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              ALERTA DE SOMA ({(stats as any).somaTargetSum}): CONVERGÊNCIA NOS NÚMEROS DE SOMA IGUAL
            </span>
          </motion.div>
        )}

        {(stats as any).timeMirrorAlert &&
          (stats as any).timeMirrorTarget !== null && (
            <motion.div
              key="alert-time-mirror"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-[10px] font-black text-purple-400 bg-purple-500/10 py-3 rounded-xl border border-purple-500/20 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 animate-bounce" />
              <span className="tracking-[0.2em]">
                ESPELHO TEMPORAL ({(stats as any).timeMirrorSeq?.join(" - ")}):
                JOGAR NO {(stats as any).timeMirrorTarget} E VIZINHOS
              </span>
            </motion.div>
          )}

        {stats.quebraAlert && stats.quebraTarget !== null && (
          <motion.div
            key="alert-quebra"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-orange-400 bg-orange-500/10 py-3 rounded-xl border border-orange-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              {stats.quebraReason}: JOGAR NO {stats.quebraTarget}
            </span>
          </motion.div>
        )}

        {stats.signatureClusterAlert && (
          <motion.div
            key="alert-signature-cluster"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 py-3 rounded-xl border border-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <Target className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              ASSINATURA DE DEALER (CLUSTER): {stats.signatureClusterTarget}
            </span>
          </motion.div>
        )}

        {stats.robberyAlert && stats.robberyGaps && stats.robberyGaps.length > 0 && (
          <motion.div
            key="alert-robbery-gap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-[10px] font-black text-rose-500 bg-rose-500/10 py-3 rounded-xl border border-rose-500/30 flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            <Crosshair className="w-4 h-4 animate-spin-slow" />
            <span className="tracking-[0.2em] text-center">
              PADRÃO DE ROUBO ATIVO ({stats.robberyRecentCount}x):<br />
              <span className="text-rose-400 font-mono text-xs">COBRINDO BURACOS: {stats.robberyGaps.join(", ")}</span>
            </span>
          </motion.div>
        )}

        {stats.sleepingDozen !== undefined && stats.sleepingDozen !== null && stats.sleepingDozenCount && stats.sleepingDozenCount > 6 && (
          <motion.div
            key="alert-sleeping-dozen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-fuchsia-400 bg-fuchsia-500/10 py-3 rounded-xl border border-fuchsia-500/20 flex items-center justify-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              SONO PROFUNDO: DÚZIA {stats.sleepingDozen} AUSENTE HÁ {stats.sleepingDozenCount} RODADAS
            </span>
          </motion.div>
        )}

        {stats.sleepingColumn !== undefined && stats.sleepingColumn !== null && stats.sleepingColumnCount && stats.sleepingColumnCount > 6 && (
          <motion.div
            key="alert-sleeping-column"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-fuchsia-400 bg-fuchsia-500/10 py-3 rounded-xl border border-fuchsia-500/20 flex items-center justify-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              SONO PROFUNDO: COLUNA {stats.sleepingColumn} AUSENTE HÁ {stats.sleepingColumnCount} RODADAS
            </span>
          </motion.div>
        )}

        {stats.alternatingColorPattern && (
          <motion.div
            key="alert-alt-color"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-[10px] font-black text-yellow-400 bg-yellow-500/10 py-3 rounded-xl border border-yellow-500/20 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">
              PADRÃO DE PING-PONG (Cores Alternadas) DETECTADO
            </span>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
});
