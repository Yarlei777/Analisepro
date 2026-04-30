import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, X, ExternalLink } from 'lucide-react';

interface IframeBrowserProps {
  iframeUrl: string;
  casinoUrl: string;
  setCasinoUrl: (url: string) => void;
  setIframeUrl: (url: string) => void;
  onLaunch: (input: string) => void;
}

const MemoizedIframe = React.memo(({ iframeUrl }: { iframeUrl: string }) => (
  <iframe 
    src={iframeUrl} 
    className="absolute inset-0 w-full h-full border-none shadow-2xl"
    title="Casino View"
    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
  />
));

export const IframeBrowser = React.memo(({ 
  iframeUrl, 
  casinoUrl, 
  setCasinoUrl, 
  setIframeUrl, 
  onLaunch,
  children
}: IframeBrowserProps & { children?: React.ReactNode }) => {
  return (
    <>
      {/* Casino Access */}
      <div className="w-full max-w-md glass-panel p-2 flex items-center justify-between premium-border relative overflow-hidden my-4">
        <div className="absolute inset-0 bg-gold/5 blur" />
        <div className="flex items-center space-x-2 w-full relative z-10 px-2 py-1">
          <Search className="w-4 h-4 text-gold/50" />
          <input 
            type="text" 
            value={casinoUrl}
            onChange={(e) => setCasinoUrl(e.target.value)}
            placeholder="URL ou Pesquisa (ex: bet365 ou roleta)"
            className="flex-1 bg-transparent border-none outline-none text-[11px] font-black tracking-wider text-white placeholder-white/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onLaunch(casinoUrl);
            }}
          />
          <button 
            onClick={() => onLaunch(casinoUrl)}
            disabled={!casinoUrl.trim()}
            className="p-2 bg-gold/20 hover:bg-gold/40 border border-gold/30 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          >
            <Globe className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* In-App Browser Integration */}
      {iframeUrl && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 600, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="w-full max-w-4xl overflow-hidden glass-panel premium-border my-4 relative flex flex-col group/browser"
        >
          <div className="bg-black/60 px-3 py-1.5 flex items-center justify-between border-b border-white/10 z-10 shrink-0">
            <div className="flex items-center space-x-2 truncate mr-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest truncate">{iframeUrl}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIframeUrl('')}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
                title="Fechar Navegador"
              >
                <X className="w-3 h-3 text-white/40" />
              </button>
              <button 
                onClick={() => window.open(iframeUrl, '_blank')}
                className="p-1 hover:bg-gold/10 rounded-md transition-colors"
                title="Abrir em Nova Aba"
              >
                <ExternalLink className="w-3 h-3 text-gold/60" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-white relative">
            <MemoizedIframe iframeUrl={iframeUrl} />
            {/* Minimal overlays for a more "integrated" feel */}
            <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
            {children}
          </div>
        </motion.div>
      )}
    </>
  );
});

IframeBrowser.displayName = 'IframeBrowser';
