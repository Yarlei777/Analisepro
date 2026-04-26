import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Crown, History, Repeat, PieChart } from 'lucide-react';
import { cn } from '../lib/utils';

interface AlertNotification {
  id: string;
  type: 'vacuum' | 'terminal' | 'omega' | 'sequence' | 'zone';
  message: string;
}

interface NotificationSystemProps {
  notifications: AlertNotification[];
}

export const NotificationSystem = React.memo(({ notifications }: NotificationSystemProps) => {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.8, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)", transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "p-3 rounded-2xl backdrop-blur-xl border-y border-white/5 shadow-2xl relative overflow-hidden group max-w-sm flex items-center space-x-3 pointer-events-auto transition-colors",
              notif.type === 'vacuum' ? "bg-black/80 border-amber-500/30 text-amber-400 shadow-amber-500/10" : 
              notif.type === 'omega' ? "bg-black/80 border-gold/30 text-gold shadow-gold/10" :
              notif.type === 'sequence' ? "bg-black/80 border-blue-500/30 text-blue-400 shadow-blue-500/10" :
              notif.type === 'zone' ? "bg-black/80 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10" :
              "bg-black/80 border-purple-500/30 text-purple-400 shadow-purple-500/10"
            )}
          >
            <div className={cn(
              "absolute inset-0 opacity-[0.03] pointer-events-none",
              notif.type === 'vacuum' ? "bg-[radial-gradient(ellipse_at_top,_#f59e0b_0%,_transparent_70%)]" : 
              notif.type === 'omega' ? "bg-[radial-gradient(ellipse_at_top,_#d4af37_0%,_transparent_70%)]" :
              notif.type === 'sequence' ? "bg-[radial-gradient(ellipse_at_top,_#3b82f6_0%,_transparent_70%)]" :
              notif.type === 'zone' ? "bg-[radial-gradient(ellipse_at_top,_#10b981_0%,_transparent_70%)]" :
              "bg-[radial-gradient(ellipse_at_top,_#a855f7_0%,_transparent_70%)]"
            )} />
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border relative z-10",
              notif.type === 'vacuum' ? "bg-amber-500/10 border-amber-500/20" : 
              notif.type === 'omega' ? "bg-gold/10 border-gold/20" :
              notif.type === 'sequence' ? "bg-blue-500/10 border-blue-500/20" :
              notif.type === 'zone' ? "bg-emerald-500/10 border-emerald-500/20" :
              "bg-purple-500/10 border-purple-500/20"
            )}>
              {notif.type === 'vacuum' ? <AlertTriangle className="w-4 h-4" /> : 
               notif.type === 'omega' ? <Crown className="w-4 h-4 text-gold drop-shadow-md" /> :
               notif.type === 'sequence' ? <History className="w-4 h-4 text-blue-400" /> :
               notif.type === 'zone' ? <PieChart className="w-4 h-4 text-emerald-400" /> :
               <Repeat className="w-4 h-4" />}
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest leading-snug drop-shadow-md relative z-10">
              {notif.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';
