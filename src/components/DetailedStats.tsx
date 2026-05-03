import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getNumberColor, ROULETTE_NUMBERS } from '../constants';
import { cn } from '../lib/utils';

interface DetailedStatsProps {
  stats: any;
}

export const DetailedStats: React.FC<DetailedStatsProps> = React.memo(({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="glass-panel p-4 pb-0 space-y-4 gold-border flex flex-col lg:col-span-2">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-2">
            <Target className="w-5 h-5 text-gold" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Diagnóstico de Setor</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[7px] font-black text-white/40 uppercase block mb-1 tracking-widest">Setor Ativo</span>
              <span className="text-[10px] font-black italic font-serif text-gold uppercase">
                {stats.activeSector}
              </span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[7px] font-black text-white/40 uppercase block mb-1 tracking-widest">Próxima Área</span>
              <span className={cn("text-[10px] font-black italic font-serif", stats.predictedSector !== 'N/A' ? "text-emerald-400" : "text-white/20")}>
                {stats.predictedSector}
              </span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[7px] font-black text-white/40 uppercase block mb-1 tracking-widest">Ritmo Dealer</span>
              <span className={cn("text-[10px] font-black italic font-serif", stats.dealerRhythm === 'ESTÁVEL' ? "text-emerald-400" : "text-gold")}>
                {stats.dealerRhythm}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[7px] font-black text-white/40 uppercase block mb-1 tracking-widest">Sequência de Setores</span>
              <span className={cn("text-[10px] font-black italic font-serif truncate block", stats.sectorSequencePattern !== 'N/A' ? "text-gold" : "text-white/20")}>
                {stats.sectorSequencePattern}
              </span>
            </div>
             <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[7px] font-black text-white/40 uppercase block mb-1 tracking-widest">Análise de Quebra</span>
              <span className={cn("text-[10px] font-black italic font-serif truncate block", stats.quebraAlert ? "text-cyan-400" : "text-white/20")}>
                {stats.quebraAlert ? (stats.quebraTarget !== null ? `ALVO ${stats.quebraTarget}` : 'DETECTADO') : 'MONITORANDO...'}
              </span>
            </div>
          </div>

          <div className="mt-1 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group transition-colors">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[7px] font-black text-white/40 uppercase tracking-widest">Termômetro de Caos / Volatilidade</span>
              <span className={cn("text-[9px] font-black", stats.entropyLevel >= 70 ? "text-red-500" : stats.entropyLevel >= 40 ? "text-orange-400" : "text-emerald-400")}>
                {stats.entropyLevel}% {stats.entropyLevel >= 70 ? '(CRÍTICO / PAUSE AS APOSTAS)' : stats.entropyLevel >= 40 ? '(MODERADO)' : '(ESTÁVEL)'}
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, stats.entropyLevel || 0))}%` }}
                className={cn(
                  "h-full transition-all duration-1000",
                  stats.entropyLevel >= 70 ? "bg-gradient-to-r from-red-800 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
                  stats.entropyLevel >= 40 ? "bg-gradient-to-r from-orange-800 to-orange-500" : 
                  "bg-gradient-to-r from-emerald-800 to-emerald-500"
                )}
              />
            </div>
          </div>
          
          <div className="flex-1 min-h-[140px] flex items-center justify-between">
            <div className="w-1/2 pr-2">
              <span className="text-[8px] font-black uppercase text-white/40 tracking-widest block mb-1">Via Setorial</span>
              <div className="h-32 w-full glass-panel !bg-black/20 border-white/5 p-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={stats.sectorBias}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis 
                      dataKey="sector" 
                      tick={{ fill: '#ffffff60', fontSize: 8, fontWeight: 'bold' }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
                    <Radar
                      isAnimationActive={false}
                      name="Frequência"
                      dataKey="frequency"
                      stroke="#d4af37"
                      fill="#d4af37"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass-panel p-2 border border-gold/20 shadow-2xl min-w-[100px]">
                              <div className="text-[8px] font-black text-gold uppercase tracking-widest mb-1 border-b border-white/10 pb-0.5">
                                {data.sector}
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-[8px]">
                                  <span className="text-white/40 uppercase">Freq:</span>
                                  <span className="text-white font-black">{data.frequency}x</span>
                                </div>
                                <div className="flex justify-between text-[8px]">
                                  <span className="text-white/40 uppercase">Presença:</span>
                                  <span className="text-emerald-400 font-black">{data.percentage}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-1/2 pl-2 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Cores</span>
                  <div className="flex space-x-1.5">
                    <span className="text-[7px] font-bold text-red-400">{stats.colorTendency.red}%R</span>
                    <span className="text-[7px] font-bold text-zinc-400">{stats.colorTendency.black}%B</span>
                    <span className="text-[7px] font-bold text-emerald-400">{stats.colorTendency.green}%G</span>
                  </div>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                  <div style={{ width: `${stats.colorTendency.red}%` }} className="bg-red-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
                  <div style={{ width: `${stats.colorTendency.black}%` }} className="bg-zinc-900 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
                  <div style={{ width: `${stats.colorTendency.green}%` }} className="bg-emerald-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
              <div className="space-y-2">
                 <span className="text-[8px] font-black uppercase text-white/40 tracking-widest block">Terminais</span>
                 <div className="space-y-1.5">
                  {stats.terminalFrequency && Object.entries(stats.terminalFrequency).map(([group, freqValue]) => {
                    const freq = freqValue as number;
                    const maxFreq = Math.max(...Object.values(stats.terminalFrequency) as number[], 1);
                    return (
                      <div key={group} className="space-y-0.5">
                        <div className="flex justify-between text-[7px] font-black">
                          <span className="text-white/60">G.{group}</span>
                          <span className="gold-text">{freq}x</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(freq / maxFreq) * 100}%` }}
                            className="h-full bg-gradient-to-r from-gold-dark to-gold"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 space-y-4 gold-border flex flex-col">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-2">
            <TrendingUp className="w-5 h-5 text-gold" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Números Quentes</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[8px] font-black uppercase text-white/40 tracking-widest block">Probabilidade</span>
            <div className="h-24 w-full glass-panel !bg-black/20 border-white/5 p-1 overflow-hidden mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentProbabilities}>
                  <XAxis 
                    dataKey="num" 
                    stroke="#ffffff40" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '4px',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      padding: '4px'
                    }}
                    itemStyle={{ color: '#d4af37' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="probability" radius={[2, 2, 0, 0]} isAnimationActive={false}>
                    {stats.recentProbabilities && stats.recentProbabilities.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          getNumberColor(entry.num) === 'red' ? '#dc2626' : 
                          getNumberColor(entry.num) === 'black' ? '#18181b' : '#10b981'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 flex-1 content-start">
            {stats.hotNumbers && stats.hotNumbers.map((item: any, idx: number) => (
              <motion.div 
                key={item.num}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-gold/30 transition-all"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-xl",
                  getNumberColor(item.num) === 'red' ? "bg-red-600" : 
                  getNumberColor(item.num) === 'black' ? "bg-zinc-900" : "bg-emerald-600"
                )}>
                  {item.num}
                </div>
                <div className="text-right">
                  <div className="text-[6px] font-black text-white/40 uppercase tracking-widest">Freq</div>
                  <div className="text-xs font-serif font-black italic gold-text">{item.count}x</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 space-y-4 border-blue-500/20 flex flex-col mt-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
         <div className="flex items-center space-x-3 border-b border-white/5 pb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Detecções do Algoritmo</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Alerta Recolhimento</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.stealingPhaseAlert ? "text-red-500 font-bold" : "text-white/20")}>
                {stats.stealingPhaseAlert ? 'ATIVO (Jogando nos buracos)' : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Alvo Quebra (Breaker)</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.quebraAlert && stats.quebraTarget !== null ? "text-blue-400" : "text-white/20")}>
                {stats.quebraAlert && stats.quebraTarget !== null ? `Alvo: ${stats.quebraTarget} (${stats.quebraReason})` : 'Inativo'}
              </span>
            </div>
            
            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Alerta Vácuo</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.vacuumAlerts?.length > 0 ? "text-purple-400" : "text-white/20")}>
                {stats.vacuumAlerts?.length > 0 ? `Alvo: ${stats.vacuumAlerts[0].num} (Gap: ${stats.vacuumAlerts[0].gap})` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Alerta Ômega</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.omegaAlert && stats.omegaTarget !== null ? "text-orange-400" : "text-white/20")}>
                {stats.omegaAlert && stats.omegaTarget !== null ? `Alvo: ${stats.omegaTarget} (e vizinhos)` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Padrão Sequência</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.sequenceAlert && stats.sequenceTarget !== null ? "text-indigo-400" : "text-white/20")}>
                {stats.sequenceAlert && stats.sequenceTarget !== null ? `Alvo: ${stats.sequenceTarget} (e vizinhos)` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Alerta de Soma</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.somaAlert && stats.somaTargetSum !== null ? "text-pink-400" : "text-white/20")}>
                {stats.somaAlert && stats.somaTargetSum !== null 
                  ? `Soma ${stats.somaTargetSum}: [${ROULETTE_NUMBERS.filter(n => (n < 10 ? n : Math.floor(n / 10) + (n % 10)) === stats.somaTargetSum).join(', ')}]` 
                  : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Dobradinha Bateu</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.twinRepeatAlert && stats.twinRepeatTarget !== null ? "text-yellow-400" : "text-white/20")}>
                {stats.twinRepeatAlert && stats.twinRepeatTarget !== null ? `Alvo: ${stats.twinRepeatTarget} (Viciado)` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Sanduíche Curto</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.sandwichAlert && stats.sandwichTarget !== null ? "text-yellow-400" : "text-white/20")}>
                {stats.sandwichAlert && stats.sandwichTarget !== null ? `Alvo Meio: ${stats.sandwichTarget}` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Magnética do Zero</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.zeroVortexAlert ? "text-emerald-400" : "text-white/20")}>
                {stats.zeroVortexAlert ? `Alvos: ${stats.zeroTargets.join(', ')}` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Espelho Magnético</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.mirrorAlert && stats.mirrorTarget !== null ? "text-cyan-400" : "text-white/20")}>
                {stats.mirrorAlert && stats.mirrorTarget !== null ? `Alvo Curto: ${stats.mirrorTarget}` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Terminal Quente</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.hotTerminalAlert ? "text-red-400 font-bold" : "text-white/20")}>
                {stats.hotTerminalAlert ? `Final ${stats.hotTerminalGroup} (Ciclico)` : 'Inativo'}
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
              <span className="text-[6px] font-black text-white/40 uppercase block mb-1 tracking-widest">Espelho Temporal</span>
              <span className={cn("text-[9px] font-black italic font-serif truncate block", stats.timeMirrorAlert && stats.timeMirrorTarget !== null ? "text-cyan-400" : "text-white/20")}>
                {stats.timeMirrorAlert && stats.timeMirrorTarget !== null ? `Alvo: ${stats.timeMirrorTarget} (Ref: ${stats.timeMirrorSeq?.join(', ')})` : 'Inativo'}
              </span>
            </div>
          </div>
      </div>
    </div>
  );
});
