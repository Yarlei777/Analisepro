import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Crown, History, PieChart, Repeat } from 'lucide-react';
import { cn } from '../lib/utils';

export interface AlertNotification {
  id: string;
  type: 'vacuum' | 'omega' | 'sequence' | 'zone' | 'system';
  message: string;
}

interface NotificationSystemProps {
  notifications: AlertNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationSystem = React.memo(({ notifications, onDismiss }: NotificationSystemProps) => {
  return (
    <div className="fixed top-2 right-2 z-[100] flex flex-col space-y-1.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x > 50 || offset.x < -50 || velocity.x > 500 || velocity.x < -500) {
                onDismiss(notif.id);
              }
            }}
            className={cn(
              "p-1.5 rounded-lg border-y border-white/5 shadow-2xl relative overflow-hidden group max-w-[200px] sm:max-w-[250px] flex items-center space-x-1.5 pointer-events-auto transition-colors touch-none bg-black/90",
              notif.type === 'vacuum' ? "bg-black/80 border-amber-500/30 text-amber-400 shadow-amber-500/10" : 
              notif.type === 'omega' ? "bg-black/80 border-gold/30 text-gold shadow-gold/10" :
              notif.type === 'sequence' ? "bg-black/80 border-blue-500/30 text-blue-400 shadow-blue-500/10" :
              notif.type === 'zone' ? "bg-black/80 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10" :
              "bg-black/80 border-purple-500/30 text-purple-400 shadow-purple-500/10"
            )}
          >
            <div className={cn(
              "absolute inset-0 opacity-10 pointer-events-none",
              notif.type === 'vacuum' ? "bg-amber-500/20" : 
              notif.type === 'omega' ? "bg-gold/20" :
              notif.type === 'sequence' ? "bg-blue-500/20" :
              notif.type === 'zone' ? "bg-emerald-500/20" :
              "bg-purple-500/20"
            )} />
            
            <div className={cn(
              "w-6 h-6 rounded flex items-center justify-center shrink-0 border relative z-10",
              notif.type === 'vacuum' ? "bg-amber-500/10 border-amber-500/20" : 
              notif.type === 'omega' ? "bg-gold/10 border-gold/20" :
              notif.type === 'sequence' ? "bg-blue-500/10 border-blue-500/20" :
              notif.type === 'zone' ? "bg-emerald-500/10 border-emerald-500/20" :
              "bg-purple-500/10 border-purple-500/20"
            )}>
              {notif.type === 'vacuum' ? <AlertTriangle className="w-3 h-3" /> : 
               notif.type === 'omega' ? <Crown className="w-3 h-3 text-gold drop-shadow-md" /> :
               notif.type === 'sequence' ? <History className="w-3 h-3 text-blue-400" /> :
               notif.type === 'zone' ? <PieChart className="w-3 h-3 text-emerald-400" /> :
               <Repeat className="w-3 h-3" />}
            </div>

            <div className="flex-1 min-w-0 pr-1 relative z-10">
              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-snug drop-shadow-md">
                {notif.message}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 w-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';
