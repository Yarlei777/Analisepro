import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Target } from 'lucide-react';

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
  };
}

export const AlertTracker: React.FC<AlertTrackerProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <AnimatePresence mode="popLayout">
        {stats.biasDetected && (
          <motion.div 
            key="alert-bias"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-gold bg-gold/10 py-3 rounded-xl border border-gold/20 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">VIÉS ESTATÍSTICO DETECTADO: NÚMERO VICIADO</span>
          </motion.div>
        )}

        {stats.terminalRepeat && (
          <motion.div 
            key="alert-terminal"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 animate-bounce" />
            <span className="tracking-[0.2em]">REPETIÇÃO DE GRUPO TERMINAL ({stats.lastTerminalGroup})</span>
          </motion.div>
        )}

        {stats.sectorConfidence !== undefined && stats.sectorConfidence > 0.7 && (
          <motion.div 
            key="alert-sector-confidence"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20 flex items-center justify-center space-x-2"
          >
            <Target className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">PADRÃO DE TRANSIÇÃO DE ÁREA DETECTADO: {stats.predictedSector.toUpperCase()}</span>
          </motion.div>
        )}

        {stats.sectorSequencePattern !== 'N/A' && (
          <motion.div 
            key="alert-sector-sequence"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-[10px] font-black text-gold bg-gold/10 py-3 rounded-xl border border-gold/20 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 animate-pulse" />
            <span className="tracking-[0.2em]">SEQUÊNCIA DE SETORES DETECTADA: {stats.sectorSequencePattern}</span>
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
            <span className="tracking-[0.2em]">ALERTA DE ESPELHO: JOGAR NO {stats.mirrorTarget}</span>
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
            <span className="tracking-[0.2em]">{stats.quebraReason}: JOGAR NO {stats.quebraTarget}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
