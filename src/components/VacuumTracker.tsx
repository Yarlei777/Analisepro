import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { getNumberColor } from '../constants';

interface VacuumTrackerProps {
  vacuumAlerts: { num: number; gap: number }[];
}

export const VacuumTracker: React.FC<VacuumTrackerProps> = ({ vacuumAlerts }) => {
  if (!vacuumAlerts || vacuumAlerts.length === 0) return null;

  return (
    <div className="w-full max-w-2xl glass-panel p-4 premium-border mt-3">
      <div className="flex items-center space-x-2 mb-3 border-b border-white/10 pb-2">
         <Clock className="w-4 h-4 text-amber-500" />
         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Monitor de Vácuo</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {vacuumAlerts.map((alert, idx) => (
          <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-lg mb-1 relative z-10 border border-white/10",
              getNumberColor(alert.num) === 'red' ? "bg-red-600" : 
              getNumberColor(alert.num) === 'black' ? "bg-zinc-900" : "bg-emerald-600"
            )}>
              {alert.num}
            </div>
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest relative z-10">{alert.gap} spins</span>
          </div>
        ))}
      </div>
    </div>
  );
};
