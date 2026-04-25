import React from 'react';
import { Keyboard, Target, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { HistoryBar } from './HistoryBar';
import { NumberGrid } from './NumberGrid';

interface ManualControlProps {
  isNextRight: boolean;
  setIsNextRight: (val: boolean) => void;
  removeLast: () => void;
  resetHistory: () => void;
  showClearConfirm: boolean;
  setShowClearConfirm: (val: boolean) => void;
  history: number[];
  addNumber: (val: number) => void;
}

export const ManualControl: React.FC<ManualControlProps> = React.memo(({
  isNextRight,
  setIsNextRight,
  removeLast,
  resetHistory,
  showClearConfirm,
  setShowClearConfirm,
  history,
  addNumber
}) => {
  return (
    <div className="w-full max-w-2xl glass-panel p-3 sm:p-4 premium-border mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3 px-1">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
            <Keyboard className="w-4 h-4 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Entrada Manual</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Sincronização</span>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-1 bg-black/20 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setIsNextRight(false)}
              className={cn(
                "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95",
                !isNextRight 
                  ? "bg-blue-500/20 border border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                  : "text-white/20 hover:text-white/40"
              )}
              title="Próximo Lançamento: Anti-Horário (Esquerda)"
            >
              <Target className={cn("w-3.5 h-3.5", !isNextRight ? "animate-pulse" : "")} />
              <span className="text-[9px] font-black uppercase tracking-widest">Esq</span>
            </button>
            <button
              onClick={() => setIsNextRight(true)}
              className={cn(
                "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95",
                isNextRight 
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                  : "text-white/20 hover:text-white/40"
              )}
              title="Próximo Lançamento: Horário (Direita)"
            >
              <Target className={cn("w-3.5 h-3.5", isNextRight ? "animate-pulse" : "")} />
              <span className="text-[9px] font-black uppercase tracking-widest">Dir</span>
            </button>
          </div>
          <div className="w-[1px] h-6 bg-white/10 mx-2 hidden sm:block" />

          <button 
            onClick={removeLast}
            className="flex items-center space-x-1.5 text-orange-400 hover:text-orange-300 transition-all bg-orange-500/5 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 active:scale-95"
            title="Apagar Último Número"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Voltar</span>
          </button>
          
          {showClearConfirm ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={resetHistory}
                className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-all bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/30 active:scale-95"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Confirmar</span>
              </button>
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/60 px-2"
              >
                Sair
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center space-x-1.5 text-red-500 hover:text-red-400 transition-all bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 active:scale-95"
              title="Limpar Todo o Histórico"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Limpar</span>
            </button>
          )}
        </div>
      </div>

      <HistoryBar history={history} />
      <NumberGrid onAddNumber={addNumber} />
    </div>
  );
});
