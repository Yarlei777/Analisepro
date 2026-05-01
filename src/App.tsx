import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  BellOff,
  TrendingUp,
  Target,
  History,
  Plus,
  RotateCcw,
  Brain,
  LayoutDashboard,
  PieChart,
  List,
  Keyboard,
  Disc,
  Zap,
  X,
  AlertTriangle,
  Repeat,
  Search,
  ExternalLink,
  Globe,
} from "lucide-react";
import { RouletteWheel } from "./components/RouletteWheel";
import { HistoryView } from "./components/HistoryView";
import { NumberGrid } from "./components/NumberGrid";
import { HistoryBar } from "./components/HistoryBar";
import { IframeBrowser } from "./components/IframeBrowser";
import { NotificationSystem } from "./components/NotificationSystem";
import { NeuralArchitecture } from "./components/NeuralArchitecture";
import { DetailedStats } from "./components/DetailedStats";
import { PredictionBanner } from "./components/PredictionBanner";
import { VacuumTracker } from "./components/VacuumTracker";
import { AlertTracker } from "./components/AlertTracker";
import { ManualControl } from "./components/ManualControl";
import { Login } from "./components/Login";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  ROULETTE_NUMBERS,
  getNumberColor,
  RED_NUMBERS,
  AI_LAYERS,
  getMirrors,
  getNeighbors,
} from "./constants";
import { cn } from "./lib/utils";
import { analyzeHistory, type BallSize } from "./analyzer";
import { NumberScore } from "./analyzer_types";

type Tab = "analysis" | "stats" | "history";

interface AlertNotification {
  id: string;
  type: "vacuum" | "terminal" | "omega" | "sequence" | "zone" | "timeMirror";
  message: string;
}

const EMPTY_ARRAY: number[] = [];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('exu_do_ouro_auth') === 'true';
  });
  const [history, setHistory] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('exu_do_ouro_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('exu_do_ouro_history', JSON.stringify(history));
  }, [history]);

  const [isVoltaCerta, setIsVoltaCerta] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [lossStreak, setLossStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isNextRight, setIsNextRight] = useState(true);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [casinoUrl, setCasinoUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [ballSize, setBallSize] = useState<BallSize>("standard");
  const prevHistoryLength = React.useRef(0);

  const handleLaunchCasino = React.useCallback((input: string) => {
    if (!input.trim()) return;
    let finalUrl = input.trim();

    // Check if it's a URL or a search term
    const isUrl = finalUrl.includes(".") && !finalUrl.includes(" ");

    if (isUrl) {
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
    } else {
      // Search term - use Google search with iframe-friendly param
      finalUrl = `https://www.google.com/search?q=${encodeURIComponent(finalUrl)}&igu=1`;
    }

    setIframeUrl(finalUrl);
  }, [setIframeUrl]);

  // Smooth scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Brain Analysis
  const analysis = useMemo(() => analyzeHistory(history, false, ballSize), [history, ballSize]);
  const { targets, biasMessage, stats, confidence, playSignal } = analysis;

  // Manage transient notifications
  useEffect(() => {
    if (isMuted) {
      if (notifications.length > 0) setNotifications([]);
      prevHistoryLength.current = history.length;
      return;
    }

    if (history.length > 0 && history.length > prevHistoryLength.current) {
      const newNotifs: AlertNotification[] = [];
      const timestamp = Date.now();

      const GERMINATION_PHASE = 28;
      const isGerminated = history.length >= GERMINATION_PHASE;

      if (isGerminated) {
        if (stats.terminalRepeat && stats.lastTerminalGroup) {
          newNotifs.push({
            id: `term-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "terminal",
            message: `ALERTA DE REPETIÇÃO: TERMINAL ${stats.lastTerminalGroup}`,
          });
        }

        if ((stats as any).somaAlert && (stats as any).somaTargetSum !== null) {
          newNotifs.push({
            id: `soma-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "soma" as any,
            message: `ALERTA DE SOMA: TENDÊNCIA NA SOMA ${(stats as any).somaTargetSum}`,
          });
        }

        if (stats.omegaAlert && stats.omegaTarget !== null) {
          newNotifs.push({
            id: `omega-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "omega",
            message: `CONVERGÊNCIA ÔMEGA DETECTADA: JOGAR NO ${stats.omegaTarget}`,
          });
        }

        if (stats.sequenceAlert && stats.sequenceTarget !== null) {
          newNotifs.push({
            id: `seq-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "sequence",
            message: `PADRÃO HISTÓRICO: O PRÓXIMO PODE SER ${stats.sequenceTarget}`,
          });
        }

        if (stats.timeMirrorAlert && (stats as any).timeMirrorTarget !== null) {
          const seqStr = (stats as any).timeMirrorSeq
            ? (stats as any).timeMirrorSeq.join(", ")
            : "";
          const len = (stats as any).timeMirrorLen;
          const type = (stats as any).timeMirrorType;
          const target = (stats as any).timeMirrorTarget;
          const neighbors = getNeighbors(target, 2).join(", ");
          newNotifs.push({
            id: `timeMirror-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "timeMirror",
            message: `ESPELHO HISTÓRICO: Padrão de ${len} números (${type}: ${seqStr}) se repetiu. JOGAR NO: ${target} (Cobrindo vizinhos: ${neighbors})`,
          });
        }

        if ((stats as any).zoneBiasAlert) {
          newNotifs.push({
            id: `zone-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "zone",
            message: `VIÉS DE ZONA EM: ${(stats as any).zoneBiasTarget.toUpperCase()}`,
          });
        }

        if ((stats as any).zonaFaltaAlert) {
          const isSuper = (stats as any).zonaFaltaSuper;
          const targets = (stats as any).zonaFaltaTargets;
          newNotifs.push({
            id: `zonaFalta-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "zonaFalta",
            message: isSuper 
              ? `🔥 SUPER CONFLUÊNCIA! Coluna e Dúzia em falta. ROXO FORTE nos alvos da interseção: ${targets.join(", ")}!`
              : `⚠️ ZONA EM FALTA: Atrasos longos ou repetição nas colunas/dúzias. Alvos marcados em roxo.`,
          });
        }

        if ((stats as any).doublePatternAlert && (stats as any).doublePatternTargets && (stats as any).doublePatternTargets.length > 0) {
          const targetsStr = (stats as any).doublePatternTargets.join(" e ");
          newNotifs.push({
            id: `double-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "sequence",
            message: `PADRÃO DE DUPLO RECENTE ALVO: ${targetsStr}`,
          });
        }

        if ((stats as any).streakAlert && (stats as any).streakTargets && (stats as any).streakTargets.length > 0) {
          const len = (stats as any).streakLength;
          const type = (stats as any).streakType;
          const targets = (stats as any).streakTargets;
          let targetsStr = targets.join(", ");
          if (type === "VIZINHOS" && targets.length > 0) {
            targetsStr = `Região do ${targets[Math.floor(targets.length/2)]} (${targets.join(", ")})`;
          }
          
          const msg = len >= 4 
            ? `🔥 ALTA CHANCE (4+ de ${type}): Sequência engatada. JOGAR EM: ${targetsStr}` 
            : `⚠️ AVISO (3 de ${type}): Padrão se formando. POSSÍVEL ALVO: ${targetsStr}`;
            
          newNotifs.push({
            id: `streak-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "sequence",
            message: msg,
          });
        }

        if (stats.quebraAlert && stats.quebraTarget !== null) {
          newNotifs.push({
            id: `quebra-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "terminal", // Reuse terminal type for styling or define new one if needed
            message: `${stats.quebraReason}: ALVO NO ${stats.quebraTarget}`,
          });
        }
      }

      // Alertas de chamadas (independente de Germination Phase para ser mais reativo)
      if ((stats as any).callsAlerts && (stats as any).callsAlerts.length > 0) {
        (stats as any).callsAlerts.forEach((alert: any) => {
          newNotifs.push({
            id: `calls-${timestamp}-${alert.called}`,
            type: "sequence",
            message: `O número ${history[0]} já chamou o ${alert.called} ${alert.count} vezes no histórico! Pode buscar de novo.`,
          });
        });
      }

      if (newNotifs.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifs]);

        // Auto dismiss after 5 seconds
        newNotifs.forEach((notif) => {
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
          }, 5000);
        });
      }
    }
    prevHistoryLength.current = history.length;
  }, [history.length, stats]);

  // Ballistics Engine (Dealer Signature Auto-Calibration)
  const ballistics = useMemo(() => {
    if (history.length < 2)
      return {
        active: false,
        targets: [],
        message: "AGUARDANDO DADOS BALÍSTICOS...",
        mainTarget: null,
      };

    const getIdx = (num: number) => ROULETTE_NUMBERS.indexOf(num);
    const distances: number[] = [];

    // SCAN HISTORY FOR DISPLACEMENT PATTERN:
    for (let i = 0; i < Math.min(history.length - 1, 8); i++) {
      const landIdx = getIdx(history[i]);
      const lastIdx = getIdx(history[i + 1]);

      const dist = (landIdx - lastIdx + 37) % 37;
      distances.push(dist);
    }

    // Average Dealer Force (Displacement mode)
    const avgDist =
      distances.length > 0
        ? Math.round(distances.reduce((a, b) => a + b, 0) / distances.length)
        : 0;

    // Current State: Start from the very last number landed
    const lastLandIdx = getIdx(history[0]);

    const predictedIdx = isNextRight
      ? (lastLandIdx + avgDist) % 37
      : (lastLandIdx - avgDist + 37) % 37;

    const mainTarget = ROULETTE_NUMBERS[predictedIdx];

    const bTargets = [];
    for (let i = -4; i <= 4; i++) {
      bTargets.push(ROULETTE_NUMBERS[(predictedIdx + i + 37) % 37]);
    }

    const displacementMsg =
      avgDist <= 5
        ? "LANÇAMENTO CURTO (MÃO)"
        : avgDist >= 32
          ? "REBORDA (360º FULL)"
          : avgDist > 18
            ? "LANÇAMENTO FORTE"
            : "LANÇAMENTO MÉDIO";

    return {
      active: true,
      mainTarget,
      targets: bTargets,
      message: `${displacementMsg}: ALVO NO ${mainTarget} (${avgDist} CASAS)`,
    };
  }, [history, isNextRight]);

  // COMBINE structural targets + ballistics targets to maximize hit rate
  const combinedTargets = useMemo(() => {
    let all = [...targets];
    if (ballistics.active) {
      all.push(...ballistics.targets);
    }
    return Array.from(new Set(all));
  }, [targets, ballistics]);

  const allHighlightedNumbers = useMemo(() => {
    const list = new Set<number>();
    ROULETTE_NUMBERS.forEach((num) => {
      const isTarget = combinedTargets.includes(num);
      const isQuebra = stats.quebraTarget !== null && getNeighbors(stats.quebraTarget, 1).includes(num);
      const isBallistics = ballistics.active && ballistics.targets.some((t) => getNeighbors(t, 1).includes(num));
      const isVacuum = stats.vacuumAlerts.some((v) => getNeighbors(v.num, 1).includes(num));
      const isSequence = stats.sequenceTarget !== null && getNeighbors(stats.sequenceTarget, 1).includes(num);
      const timeTarget = (stats as any).timeMirrorTarget;
      const isTimeMirror = timeTarget !== undefined && timeTarget !== null && getNeighbors(timeTarget, 2).includes(num);
      const somaTargetSum = (stats as any).somaTargetSum;
      const isSomaTarget = (stats as any).somaAlert && somaTargetSum !== null && (num < 10 ? num : Math.floor(num / 10) + (num % 10)) === somaTargetSum;
      const doubleTargets = (stats as any).doublePatternTargets || [];
      const isDoublePattern = doubleTargets.some((t: number) => getNeighbors(t, 1).includes(num));
      const streakTargets = (stats as any).streakTargets || [];
      const isStreak = streakTargets.some((t: number) => getNeighbors(t, 1).includes(num));
      const isOmega = stats.omegaTarget !== null && getNeighbors(stats.omegaTarget, 1).includes(num);
      const isCallsAlert = (stats as any).callsAlerts && (stats as any).callsAlerts.some((c: any) => getNeighbors(c.called, 1).includes(num));

      if (
        isTarget ||
        isQuebra ||
        isBallistics ||
        isVacuum ||
        isSequence ||
        isTimeMirror ||
        isSomaTarget ||
        isDoublePattern ||
        isStreak ||
        isCallsAlert ||
        isOmega
      ) {
        list.add(num);
      }
    });
    return Array.from(list);
  }, [combinedTargets, stats, ballistics]);
  const allHighlightedRef = React.useRef<number[]>([]);
  React.useEffect(() => {
    allHighlightedRef.current = allHighlightedNumbers;
  }, [allHighlightedNumbers]);

  const dismissSignal = React.useCallback(() => {
    setIsVoltaCerta(false);
    setWinStreak(0);
    setLossStreak(0);
  }, []);

  const addNumber = React.useCallback((num: number) => {
    const active = allHighlightedRef.current;
    if (active.length > 0) {
      if (active.includes(num)) {
        setIsVoltaCerta(false);
        setLossStreak(0);
        setWinStreak((s) => s + 1);
      } else {
        setWinStreak(0);
        setLossStreak((prev) => {
          const next = prev + 1;
          if (next >= 2) {
            setIsVoltaCerta(true);
          }
          return next;
        });
      }
    } else {
      setIsVoltaCerta(false);
      setWinStreak(0);
      setLossStreak(0);
    }
    setHistory((prev) => [num, ...prev].slice(0, 200));
    setIsNextRight((prev) => !prev);
  }, []);

  const addNumbers = React.useCallback((nums: number[]) => {
    setHistory((prev) => [...nums, ...prev].slice(0, 200));
    // If odd number of spins added, toggle direction
    if (nums.length % 2 !== 0) setIsNextRight((prev) => !prev);
  }, []);

  const resetHistory = React.useCallback(() => {
    setHistory([]);
    setIsVoltaCerta(false);
    setWinStreak(0);
    setLossStreak(0);
    setShowClearConfirm(false);
  }, []);

  const removeLast = React.useCallback(() => {
    setHistory((prev) => prev.slice(1));
    setIsNextRight((prev) => !prev);
  }, []);

  const dismissNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3b0870] via-[#240045] to-[#110022] text-white font-sans antialiased">
      {/* Main Viewport */}
      <main className="flex-1 relative p-2 md:p-4 pb-24">
        <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />

        <div className="flex items-center justify-between mb-4 relative z-10 px-2 md:px-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gold/30 rounded-full blur-lg animate-pulse" />
              <motion.div
                className="relative w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <Disc className="w-5 h-5 text-black/80" strokeWidth={2.5} />
                <div className="absolute inset-0 border-[3px] border-black/10 rounded-full scale-75" />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-serif font-black italic gold-text tracking-[0.15em] uppercase leading-none drop-shadow-sm">
                Exu do Ouro
              </h1>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="w-1 h-[1px] bg-gold/50" />
                <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">
                  Sistema de Elite
                </span>
                <span className="w-1 h-[1px] bg-gold/50" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col items-end mr-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  On-line
                </span>
              </div>
              <span className="text-[8px] text-white/20 uppercase tracking-tighter mt-0.5 font-bold">
                Protocolo V2.4
              </span>
            </div>

            <button
              onClick={() => setBallSize(prev => prev === 'standard' ? 'large' : prev === 'large' ? 'small' : 'standard')}
              className="px-3 h-9 rounded-full glass-panel flex items-center justify-center border-gold/30 transition-all duration-300 cursor-pointer shadow-lg hover:bg-gold/10 hover:shadow-gold/10"
              title="Ajustar Tamanho da Bola Física (15mm = Mais salto, 18mm = Padrão, 21mm = Mais inércia)"
            >
              <Disc className={cn("w-4 h-4 mr-1.5", ballSize === 'large' ? 'text-blue-400 scale-110' : ballSize === 'small' ? 'text-fuchsia-400 scale-90' : 'text-gold')} />
              <span className="text-[10px] font-bold text-white/80 tracking-widest">
                {ballSize === 'standard' && '18mm'}
                {ballSize === 'large' && '21mm'}
                {ballSize === 'small' && '15mm'}
              </span>
            </button>

            <button
              onClick={() => setIsMuted((prev) => !prev)}
              className={cn(
                "w-9 h-9 rounded-full glass-panel flex items-center justify-center border-gold/30 transition-all duration-300 cursor-pointer group shadow-lg",
                isMuted
                  ? "bg-red-500/10 border-red-500/30 shadow-red-500/5 rotate-12"
                  : "hover:bg-gold/10 hover:shadow-gold/10",
              )}
              title={isMuted ? "Ativar Notificações" : "Silenciar Notificações"}
            >
              {isMuted ? (
                <BellOff className="w-4 h-4 text-red-500 transition-all" />
              ) : (
                <Bell className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-full flex justify-center mb-1">
                <div className="glass-panel px-6 py-2 premium-border shadow-[0_0_20px_rgba(212,175,55,0.1)] inline-flex flex-col items-center">
                  <span className="text-[9px] font-black text-gold/60 uppercase tracking-[0.2em] mb-0.5">
                    Padrão Atual
                  </span>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xl font-serif font-black italic gold-text tracking-[0.2em] uppercase leading-none mt-1">
                      {stats.lastPattern || "---"}
                    </span>
                  </div>
                </div>
              </div>

              <PredictionBanner
                confidence={confidence}
                activeSector={stats.activeSector}
                ballistics={ballistics}
              />

              <VacuumTracker vacuumAlerts={stats.vacuumAlerts} />

              <AlertTracker stats={stats} />

              <div className="relative group mt-3">
                <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <RouletteWheel
                  targets={combinedTargets}
                  lastNumber={history[0]}
                  quebraTarget={stats.quebraTarget}
                  playSignal={playSignal}
                  isVoltaCerta={isVoltaCerta}
                  winStreak={winStreak}
                  ballisticsTargets={
                    ballistics.active ? ballistics.targets : EMPTY_ARRAY
                  }
                  omegaTarget={stats.omegaTarget}
                  vacuumAlerts={stats.vacuumAlerts}
                  sequenceTarget={stats.sequenceTarget}
                  timeMirrorTarget={(stats as any).timeMirrorTarget}
                  somaAlert={(stats as any).somaAlert}
                  somaTargetSum={(stats as any).somaTargetSum}
                  doublePatternTargets={(stats as any).doublePatternTargets || []}
                  streakTargets={(stats as any).streakTargets || []}
                  zonaFaltaTargets={(stats as any).zonaFaltaTargets || []}
                  zonaFaltaSuper={(stats as any).zonaFaltaSuper || false}
                  onDismissSignal={dismissSignal}
                />
              </div>

              <ManualControl
                isNextRight={isNextRight}
                setIsNextRight={setIsNextRight}
                removeLast={removeLast}
                resetHistory={resetHistory}
                showClearConfirm={showClearConfirm}
                setShowClearConfirm={setShowClearConfirm}
                history={history}
                addNumber={addNumber}
              />
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="max-w-6xl mx-auto space-y-6"
            >
              <NeuralArchitecture historyLength={history.length} />
              <DetailedStats stats={stats} />
            </motion.div>
          )}

          {activeTab === "history" && (
            <HistoryView
              history={history}
              onRemoveLast={removeLast}
              onClear={resetHistory}
              showClearConfirm={showClearConfirm}
              setShowClearConfirm={setShowClearConfirm}
            />
          )}
        </AnimatePresence>
        
        <div className={cn("mt-4 flex flex-col items-center w-full", activeTab !== "analysis" && "hidden")}>
          <IframeBrowser
            iframeUrl={iframeUrl}
            casinoUrl={casinoUrl}
            setCasinoUrl={setCasinoUrl}
            setIframeUrl={setIframeUrl}
            onLaunch={handleLaunchCasino}
          >
            <div className="absolute top-2 left-2 z-50 pointer-events-none origin-top-left scale-[0.3] sm:scale-[0.35] md:scale-[0.4] opacity-90 drop-shadow-2xl">
              <RouletteWheel
                targets={combinedTargets}
                lastNumber={history[0]}
                quebraTarget={stats.quebraTarget}
                playSignal={playSignal}
                isVoltaCerta={isVoltaCerta}
                winStreak={winStreak}
                ballisticsTargets={ballistics.targets}
                omegaTarget={stats.omegaTarget}
                vacuumAlerts={stats.vacuumAlerts}
                sequenceTarget={stats.sequenceTarget}
                timeMirrorTarget={(stats as any).timeMirrorTarget}
                somaAlert={(stats as any).somaAlert}
                somaTargetSum={(stats as any).somaTargetSum}
                doublePatternTargets={(stats as any).doublePatternTargets || []}
                streakTargets={(stats as any).streakTargets || []}
                zonaFaltaTargets={(stats as any).zonaFaltaTargets || []}
                zonaFaltaSuper={(stats as any).zonaFaltaSuper || false}
                onDismissSignal={dismissSignal}
              />
            </div>
          </IframeBrowser>
        </div>
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black to-transparent pointer-events-none z-[60]">
        <div className="max-w-lg mx-auto glass-panel p-1 flex justify-between pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Sliding Indicator */}
          <motion.div
            className="absolute top-1 bottom-1 bg-gold/10 rounded-xl border border-gold/20"
            initial={false}
            animate={{
              left: `${["analysis", "stats", "history"].indexOf(activeTab) * 33.33 + 0.5}%`,
              width: "32.33%",
            }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          />

          {(["analysis", "stats", "history"] as const).map((tab) => {
            const icons = {
              analysis: <LayoutDashboard className="w-3.5 h-3.5" />,
              stats: <PieChart className="w-3.5 h-3.5" />,
              history: <List className="w-3.5 h-3.5" />,
            };
            const labels = {
              analysis: "Oráculo",
              stats: "Dados",
              history: "Histórico",
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 flex flex-col items-center py-1 space-y-0.5 transition-colors rounded-xl relative z-10",
                  activeTab === tab
                    ? "text-gold"
                    : "text-white/30 hover:text-white/60",
                )}
              >
                {icons[tab]}
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {labels[tab]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Background Elements */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 p-8 opacity-10 pointer-events-none hidden lg:block">
        <div className="space-y-12">
          <div className="w-24 h-24 rounded-full border-2 border-gold rotate-45" />
          <div className="w-16 h-16 rounded-full border border-gold/50 -rotate-12" />
          <div className="w-20 h-20 rounded-full border-2 border-gold/30 rotate-90" />
        </div>
      </div>
    </div>
  );
}
