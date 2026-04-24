import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getNumberColor } from '../constants';
import { cn } from '../lib/utils';

interface DetailedStatsProps {
  stats: any;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 space-y-6 gold-border flex flex-col">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
            <Target className="w-5 h-5 text-gold" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Diagnóstico de Setor</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Setor Ativo</span>
              <span className="text-xs font-black italic font-serif text-gold uppercase">
                {stats.activeSector}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Próxima Área</span>
              <span className={cn("text-xs font-black italic font-serif", stats.predictedSector !== 'N/A' ? "text-emerald-400" : "text-white/20")}>
                {stats.predictedSector}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
            <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Sequência de Setores</span>
            <span className={cn("text-xs font-black italic font-serif truncate block", stats.sectorSequencePattern !== 'N/A' ? "text-gold" : "text-white/20")}>
              {stats.sectorSequencePattern}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Ritmo Dealer</span>
              <span className={cn("text-xs font-black italic font-serif", stats.dealerRhythm === 'ESTÁVEL' ? "text-emerald-400" : "text-gold")}>
                {stats.dealerRhythm}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors">
              <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Grupo Terminal</span>
              <span className={cn("text-xs font-black italic font-serif", stats.terminalRepeat ? "text-emerald-400" : "text-gold")}>
                {stats.lastTerminalGroup || '---'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:border-gold/30 transition-colors col-span-2">
              <span className="text-[8px] font-black text-white/40 uppercase block mb-1.5 tracking-widest">Análise de Quebra (Breaker)</span>
              <span className={cn("text-xs font-black italic font-serif", stats.quebraAlert ? "text-cyan-400" : "text-white/20")}>
                {stats.quebraAlert ? (stats.quebraTarget !== null ? `ROUBO DETECTADO: ALVO ${stats.quebraTarget}` : 'DETECTADO') : 'MONITORANDO PADRÕES...'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[200px]">
            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block">Radar de Viés (Setores)</span>
            <div className="h-48 w-full glass-panel !bg-black/20 border-white/5 p-2 overflow-hidden flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.sectorBias}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis 
                    dataKey="sector" 
                    tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
                  <Radar
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
                          <div className="glass-panel p-3 border border-gold/20 shadow-2xl min-w-[120px]">
                            <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-2 border-b border-white/10 pb-1">
                              {data.sector}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[9px]">
                                <span className="text-white/40 uppercase">Frequência:</span>
                                <span className="text-white font-black">{data.frequency}x</span>
                              </div>
                              <div className="flex justify-between text-[9px]">
                                <span className="text-white/40 uppercase">Presença:</span>
                                <span className="text-emerald-400 font-black">{data.percentage}%</span>
                              </div>
                              {data.hotNumbers && data.hotNumbers.length > 0 && (
                                <div className="pt-1.5 border-t border-white/5">
                                  <div className="text-[8px] font-black text-white/30 uppercase mb-1">Números Quentes:</div>
                                  <div className="flex gap-1">
                                    {data.hotNumbers.map((n: number) => (
                                      <div key={n} className={cn(
                                        "w-5 h-5 rounded flex items-center justify-center text-[9px] font-black",
                                        getNumberColor(n) === 'red' ? "bg-red-600" : 
                                        getNumberColor(n) === 'black' ? "bg-zinc-900" : "bg-emerald-600"
                                      )}>
                                        {n}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
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

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Tendência de Cores</span>
              <div className="flex space-x-2">
                <span className="text-[8px] font-bold text-red-400">{stats.colorTendency.red}% R</span>
                <span className="text-[8px] font-bold text-zinc-400">{stats.colorTendency.black}% B</span>
                <span className="text-[8px] font-bold text-emerald-400">{stats.colorTendency.green}% G</span>
              </div>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div style={{ width: `${stats.colorTendency.red}%` }} className="bg-red-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
              <div style={{ width: `${stats.colorTendency.black}%` }} className="bg-zinc-900 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
              <div style={{ width: `${stats.colorTendency.green}%` }} className="bg-emerald-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-6 gold-border flex flex-col">
          <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
            <TrendingUp className="w-5 h-5 text-gold" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Estatísticas Adicionais</h3>
          </div>

          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block">Probabilidade (Últimos 20)</span>
            <div className="h-40 w-full glass-panel !bg-black/20 border-white/5 p-2 overflow-hidden mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.recentProbabilities}>
                  <XAxis 
                    dataKey="num" 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#d4af37' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
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
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="text-[9px] font-black uppercase text-white/40 tracking-widest block">Frequência de Terminais</span>
              <div className="space-y-3">
                {stats.terminalFrequency && Object.entries(stats.terminalFrequency).map(([group, freqValue]) => {
                  const freq = freqValue as number;
                  const maxFreq = Math.max(...Object.values(stats.terminalFrequency) as number[], 1);
                  return (
                    <div key={group} className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black">
                        <span className="text-white/60">Grupos Terminais {group}</span>
                        <span className="gold-text">{freq}x</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(freq / maxFreq) * 100}%` }}
                          className="h-full bg-gradient-to-r from-gold-dark to-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.hotNumbers && stats.hotNumbers.map((item: any, idx: number) => (
              <motion.div 
                key={item.num}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-gold/30 transition-all"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-xl",
                  getNumberColor(item.num) === 'red' ? "bg-red-600" : 
                  getNumberColor(item.num) === 'black' ? "bg-zinc-900" : "bg-emerald-600"
                )}>
                  {item.num}
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">Frequência</div>
                  <div className="text-xl font-serif font-black italic gold-text">{item.count}x</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-gold/5 border border-gold/10">
            <div className="flex items-center space-x-2 mb-3">
              <PieChart className="w-4 h-4 text-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gold">Análise de Viés</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed italic font-serif">
              O sistema detectou uma tendência significativa no setor <span className="text-gold font-black">{stats.activeSector}</span> e no grupo terminal <span className="text-gold font-black">{stats.lastTerminalGroup}</span>. 
              A repetição de terminais {stats.lastTerminalGroup} sugere um padrão de força constante do dealer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
