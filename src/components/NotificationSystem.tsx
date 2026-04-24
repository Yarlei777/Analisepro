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
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={cn(
              "px-4 py-3 rounded-xl border backdrop-blur-lg shadow-2xl max-w-sm flex items-center space-x-3 pointer-events-auto",
              notif.type === 'vacuum' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : 
              notif.type === 'omega' ? "bg-gold/10 border-gold/30 text-gold" :
              notif.type === 'sequence' ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
              notif.type === 'zone' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
              "bg-purple-500/10 border-purple-500/30 text-purple-400"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
              notif.type === 'vacuum' ? "bg-amber-500/20 border-amber-500/40" : 
              notif.type === 'omega' ? "bg-gold/20 border-gold/40" :
              notif.type === 'sequence' ? "bg-blue-500/20 border-blue-500/40" :
              notif.type === 'zone' ? "bg-emerald-500/20 border-emerald-500/40" :
              "bg-purple-500/20 border-purple-500/40"
            )}>
              {notif.type === 'vacuum' ? <AlertTriangle className="w-4 h-4" /> : 
               notif.type === 'omega' ? <Crown className="w-4 h-4 text-gold" /> :
               notif.type === 'sequence' ? <History className="w-4 h-4 text-blue-400" /> :
               notif.type === 'zone' ? <PieChart className="w-4 h-4 text-emerald-400" /> :
               <Repeat className="w-4 h-4" />}
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider">{notif.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';
