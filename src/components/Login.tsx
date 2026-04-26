import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'YarleiCosta') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop")' }}
      />
      
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-[#d4af37] to-[#8a7322] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)] p-0.5"
          >
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <span className="text-3xl font-serif text-[#d4af37] font-black italic">E</span>
            </div>
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-widest mb-2 font-serif uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#aa8c2c]">
            Exu do Ouro
          </h1>
          <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase font-bold">Sistema de Elite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuário"
                required
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de Acesso"
                required
                className={cn(
                  "w-full bg-white/5 backdrop-blur-md border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none transition-all font-medium",
                  error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50"
                )}
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center space-x-2 text-red-400 text-[10px] font-black uppercase tracking-wider justify-center bg-red-500/10 py-2 mt-2 rounded-xl border border-red-500/20">
                    <AlertCircle className="w-3 h-3" />
                    <span>Acesso Negado</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] bg-[length:200%_auto] hover:bg-[position:right_center] text-black font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-500 active:scale-95"
          >
            Entrar no Sistema
          </button>
        </form>
      </motion.div>
    </div>
  );
};
