import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Target, List } from 'lucide-react';
import { cn } from '../lib/utils';
import { getNumberColor, RED_NUMBERS } from '../constants';

interface HistoryViewProps {
  history: number[];
  onRemoveLast: () => void;
  onClear: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (show: boolean) => void;
}

export const HistoryView = React.memo(({ 
  history, 
  onRemoveLast, 
  onClear, 
  showClearConfirm, 
  setShowClearConfirm 
}: HistoryViewProps) => {
  return (
    <motion.div 
      key="history"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="w-full max-w-4xl space-y-6"
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
            <List className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Histórico de Leituras</h2>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{history.length}/200 MAX REGISTRADOS</span>
          </div>
        </div>
        
        {history.length > 0 && (
          <div className="flex items-center space-x-3">
            <button 
              onClick={onRemoveLast}
              className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-all bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/30 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Desfazer Único</span>
            </button>
            
            {showClearConfirm ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onClear}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-all bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/30 active:scale-95"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">Confirmar Tudo</span>
                </button>
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/60 px-2"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-all bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/30 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Limpar Base</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 flex flex-col items-center justify-center text-white/20 space-y-4"
            >
              <Target className="w-12 h-12 stroke-[1]" />
              <span className="text-xs font-black uppercase tracking-widest">Aguardando Captura de Dados...</span>
            </motion.div>
          ) : (
            history.map((num, i) => (
              <div
                key={history.length - i}
                className={cn(
                  "p-2 rounded-xl flex flex-col items-center justify-center group transition-all premium-border relative aspect-square",
                  RED_NUMBERS.includes(num) ? "bg-red-950/20 hover:bg-red-950/30 border-red-500/10" : 
                  num === 0 ? "bg-emerald-950/20 hover:bg-emerald-950/30 border-emerald-500/10" : 
                  "bg-white/[0.02] hover:bg-white/[0.04] border-white/5"
                )}
              >
                  <div className="absolute top-1.5 left-2 text-[8px] font-black text-white/30 tabular-nums">#{history.length - i}</div>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-lg transition-all duration-500 mt-2",
                    RED_NUMBERS.includes(num) ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]" : 
                    num === 0 ? "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : 
                    "bg-zinc-900 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  )}>
                    {num}
                  </div>
              </div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

HistoryView.displayName = 'HistoryView';
