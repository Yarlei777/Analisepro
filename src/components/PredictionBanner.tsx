import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { cn } from '../lib/utils';

interface PredictionBannerProps {
  confidence: number;
  activeSector: string;
  ballistics: {
    active: boolean;
    mainTarget: number | null;
    message: string;
    targets: number[];
  };
}

export const PredictionBanner: React.FC<PredictionBannerProps> = React.memo(({ confidence, activeSector, ballistics }) => {
  return (
    <div className="w-full max-w-2xl glass-panel p-6 relative overflow-hidden group premium-border">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-2 sm:px-4 relative z-10 py-2">
        {/* Futuristic Neural Tally Matrix - Centered horizontally in its own block if needed */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-6 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group/tally">
            {/* Animated Scanline Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-scanline pointer-events-none" />
            
            {/* Left Side: Status Bits */}
            <div className="hidden sm:flex flex-col gap-1">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    backgroundColor: confidence > 80 ? ['#ffffff10', '#10b981', '#ffffff10'] : ['#ffffff10', '#d4af37', '#ffffff10']
                  }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-sm"
                />
              ))}
            </div>

            {/* Main Readout */}
            <div className="flex flex-col items-center justify-center relative min-w-[110px]">
              <span className="text-[7px] sm:text-[8px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">
                Neural Sync Index
              </span>
              
              <div className="flex items-baseline">
                <motion.span 
                  key={confidence}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "text-4xl sm:text-6xl font-black font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                    confidence > 80 ? "text-emerald-400" : "text-gold"
                  )}
                >
                  {confidence.toString().padStart(2, '0')}
                </motion.span>
                <span className="text-sm font-black text-white/30 ml-1 uppercase">%</span>
              </div>

              <div className="w-full h-[2px] bg-white/5 mt-1 relative overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={cn(
                    "absolute top-0 bottom-0 left-0 shadow-[0_0_10px_currentColor]",
                    confidence > 80 ? "bg-emerald-500 text-emerald-500" : "bg-gold text-gold"
                  )}
                />
              </div>
            </div>

            {/* Right Side: Level Meter Blocks */}
            <div className="flex gap-[3px] items-end h-12">
              {[...Array(10)].map((_, i) => {
                const threshold = (i + 1) * 10;
                const isActive = confidence >= threshold;
                return (
                  <motion.div 
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ 
                      height: isActive ? (6 + i * 4) : 4,
                      opacity: isActive ? 1 : 0.1
                    }}
                    className={cn(
                      "w-2 rounded-t-[1px] transition-colors duration-500",
                      isActive 
                        ? (confidence > 80 ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : "bg-gold shadow-[0_0_8px_#d4af37]") 
                        : "bg-white"
                    )}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Legend / Status Footer */}
          <div className="mt-3 flex items-center space-x-4 opacity-50">
            <div className="flex items-center space-x-1.5">
              <div className={cn("w-1 h-1 rounded-full", confidence > 85 ? "bg-emerald-400 animate-pulse" : "bg-white/20")} />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Consistência</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center space-x-1.5">
              <div className={cn("w-1 h-1 rounded-full", confidence > 60 ? "bg-gold animate-pulse" : "bg-white/20")} />
              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white">Sincronia</span>
            </div>
          </div>
        </div>

        {/* Info Stats Group - Centered Vertically and Horizontally */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-[9px] sm:text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
              Precisão do Oráculo
            </span>
            <div className="flex items-center justify-center space-x-2.5">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                confidence >= 80 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse" : "bg-gold shadow-[0_0_12px_rgba(212,175,55,0.8)]"
              )} />
              <span className="text-[10px] sm:text-xs font-serif font-bold italic text-white/70 tracking-wider">
                {confidence >= 80 ? 'Análise Consolidada' : 'Calibrando Sistema'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Setor Ativo</span>
            <span className="text-[9px] sm:text-[11px] font-black px-4 sm:px-5 py-2 rounded-xl border text-gold border-gold/30 bg-gold/10 uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)] block">
              {activeSector}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-white/5 relative z-10 w-full mb-2">
        <div className="w-full relative group cursor-default">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-2xl transition-all duration-1000" />
          <div className="bg-[#09090b]/80 border border-emerald-500/20 p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-2xl shadow-[0_10px_30px_rgba(16,185,129,0.1)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(16,185,129,0.05)_50%,transparent)] bg-[length:100%_4px] opacity-30 pointer-events-none" />
            
            {ballistics.active && (
              <div className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-[0.15] pointer-events-none">
                  <div className="w-1/2 h-1/2 origin-bottom-right bg-[conic-gradient(from_90deg_at_100%_100%,transparent_0deg,rgba(16,185,129,0.5)_90deg,transparent_90deg)]" />
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-4 relative z-10">
               <Target className={cn("w-4 h-4", ballistics.active ? "text-emerald-400" : "text-white/30")} />
               <span className={cn("text-[9px] sm:text-[10px] font-black tracking-[0.3em] uppercase", ballistics.active ? "text-emerald-400" : "text-white/30")}>
                 MIRA BALÍSTICA
               </span>
            </div>
            
            {ballistics.active ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full z-10">
                <div className="relative">
                   <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-[ping_2s_ease-out_infinite]" />
                   <div className="w-20 h-20 rounded-full border border-emerald-500/50 bg-emerald-500/5 flex items-center justify-center backdrop-blur-md relative shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]">
                      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-500/30 -translate-x-1/2" />
                      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-emerald-500/30 -translate-y-1/2" />
                      <div className="w-14 h-14 rounded-full bg-black/60 border border-emerald-500/30 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                         <span className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]">
                           {ballistics.mainTarget}
                         </span>
                      </div>
                   </div>
                </div>
                
                <div className="flex flex-col items-center sm:items-start justify-center">
                  <span className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1">Status da Calibração:</span>
                  <span className="text-[10px] font-black text-emerald-400 mb-3 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{ballistics.message}</span>
                  <span className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] mb-2">Zonas de Cobertura Física:</span>
                  <div className="flex justify-center sm:justify-start gap-1.5 flex-wrap max-w-[200px] sm:max-w-none">
                    {ballistics.targets.filter(t => t !== ballistics.mainTarget).map((t, i) => (
                      <div key={`${t}-${i}`} className="min-w-[32px] h-8 px-2 bg-[#09090b]/90 border border-white/10 rounded-lg flex items-center justify-center shadow-lg relative group-hover:border-emerald-500/30 transition-colors">
                        <span className="text-emerald-400/90 font-black text-xs">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-white/20">
                <span className="text-xs font-black uppercase tracking-widest">{ballistics.message || "AGUARDANDO DADOS BALÍSTICOS..."}</span>
                <span className="text-[9px] mt-2 uppercase tracking-widest">MIN: 2 NÚMEROS</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
