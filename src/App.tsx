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
import { analyzeHistory } from "./analyzer";
import { NumberScore } from "./analyzer_types";

type Tab = "analysis" | "stats" | "history";

interface AlertNotification {
  id: string;
  type: "vacuum" | "terminal" | "omega" | "sequence" | "zone" | "timeMirror";
  message: string;
}

const EMPTY_ARRAY: number[] = [];

export default function App() {
  const [history, setHistory] = useState<number[]>([]);
  const [isVoltaCerta, setIsVoltaCerta] = useState(false);
  const [winStreak, setWinStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("analysis");
  const [rotation, setRotation] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isNextRight, setIsNextRight] = useState(true);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [casinoUrl, setCasinoUrl] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const prevHistoryLength = React.useRef(0);

  const handleLaunchCasino = (input: string) => {
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
  };

  // Smooth scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Brain Analysis
  const analysis = useMemo(() => analyzeHistory(history), [history]);
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

      const GERMINATION_PHASE = 15;
      const isGerminated = history.length >= GERMINATION_PHASE;

      if (isGerminated) {
        if (stats.terminalRepeat && stats.lastTerminalGroup) {
          newNotifs.push({
            id: `term-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "terminal",
            message: `ALERTA DE REPETIÇÃO: TERMINAL ${stats.lastTerminalGroup}`,
          });
        }

        if (stats.vacuumAlerts.length > 0) {
          // Find the strongest vacuum specifically matching the latest number or top one
          const topVacuum = stats.vacuumAlerts[0];
          if (topVacuum.gap >= 25) {
            newNotifs.push({
              id: `vac-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
              type: "vacuum",
              message: `ALERTA DE VÁCUO: NÚMERO ${topVacuum.num} AGUARDADO (GAP: ${topVacuum.gap})`,
            });
          }
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
            ? (stats as any).timeMirrorSeq.join(" e ")
            : "";
          newNotifs.push({
            id: `timeMirror-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "timeMirror",
            message: `ESPELHO TEMPORAL (Repetição de ${seqStr}): JOGAR NO ${(stats as any).timeMirrorTarget} E VIZINHOS`,
          });
        }

        if ((stats as any).zoneBiasAlert) {
          newNotifs.push({
            id: `zone-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
            type: "zone",
            message: `VIÉS DE ZONA EM: ${(stats as any).zoneBiasTarget.toUpperCase()}`,
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
      const isTarget = combinedTargets.some((t) => {
        const mirrors = getMirrors(t);
        return mirrors.some((m) => getNeighbors(m, 1).includes(num));
      });
      const isQuebra =
        stats.quebraTarget !== null &&
        getMirrors(stats.quebraTarget).includes(num);
      const isBallistics =
        ballistics.active &&
        ballistics.targets.some((t) => getMirrors(t).includes(num));
      const isVacuum = stats.vacuumAlerts.some((v) =>
        getMirrors(v.num).includes(num),
      );
      const isSequence =
        stats.sequenceTarget !== null &&
        getMirrors(stats.sequenceTarget).includes(num);
      const timeTarget = (stats as any).timeMirrorTarget;
      const isTimeMirror =
        timeTarget !== undefined &&
        timeTarget !== null &&
        getMirrors(timeTarget).includes(num);
      const isOmega =
        stats.omegaTarget !== null &&
        getMirrors(stats.omegaTarget).includes(num);
      if (
        isTarget ||
        isQuebra ||
        isBallistics ||
        isVacuum ||
        isSequence ||
        isTimeMirror ||
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

  const addNumber = React.useCallback((num: number) => {
    const active = allHighlightedRef.current;
    if (active.length > 0) {
      if (active.includes(num)) {
        setIsVoltaCerta(false);
        setWinStreak((s) => s + 1);
      } else {
        setIsVoltaCerta(true);
        setWinStreak(0);
      }
    } else {
      setIsVoltaCerta(false);
      setWinStreak(0);
    }
    setHistory((prev) => [num, ...prev].slice(0, 200));
    setRotation((prev) => prev + 1440 + Math.random() * 360);
    setIsNextRight((prev) => !prev);
  }, []);

  const addNumbers = React.useCallback((nums: number[]) => {
    setHistory((prev) => [...nums, ...prev].slice(0, 200));
    setRotation((prev) => prev + 1440 + Math.random() * 360);
    // If odd number of spins added, toggle direction
    if (nums.length % 2 !== 0) setIsNextRight((prev) => !prev);
  }, []);

  const resetHistory = React.useCallback(() => {
    setHistory([]);
    setIsVoltaCerta(false);
    setWinStreak(0);
    setShowClearConfirm(false);
  }, []);

  const removeLast = React.useCallback(() => {
    setHistory((prev) => prev.slice(1));
    setIsNextRight((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel !rounded-none border-t-0 border-x-0 border-b-gold/20 px-4 md:px-6 h-16 flex items-center justify-between backdrop-blur-3xl overflow-hidden shadow-[0_4px_30px_rgba(212,175,55,0.1)]">
        {/* Animated Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full animate-[shimmer_4s_infinite] pointer-events-none" />

        {/* Subtle Bottom Glow Line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent blur-[0.5px]" />

        <div className="flex items-center space-x-4 relative z-10">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-gold/30 rounded-full blur-lg animate-pulse" />
            <motion.div
              className="relative w-11 h-11 rounded-full gold-gradient flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-white/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Disc className="w-6 h-6 text-black/80" strokeWidth={2.5} />
              <div className="absolute inset-0 border-[3px] border-black/10 rounded-full scale-75" />
            </motion.div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-serif font-black italic gold-text tracking-[0.15em] uppercase leading-none drop-shadow-sm">
              Exu do Ouro
            </h1>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="w-1.5 h-[1px] bg-gold/50" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">
                Sistema de Elite
              </span>
              <span className="w-1.5 h-[1px] bg-gold/50" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                On-line
              </span>
            </div>
            <span className="text-[8px] text-white/20 uppercase tracking-tighter mt-0.5 font-bold">
              Protocolo V2.4 Premium
            </span>
          </div>
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className={cn(
              "w-10 h-10 rounded-full glass-panel flex items-center justify-center border-gold/30 transition-all duration-300 cursor-pointer group shadow-lg",
              isMuted
                ? "bg-red-500/10 border-red-500/30 shadow-red-500/5 rotate-12"
                : "hover:bg-gold/10 hover:shadow-gold/10",
            )}
            title={isMuted ? "Ativar Notificações" : "Silenciar Notificações"}
          >
            {isMuted ? (
              <BellOff className="w-5 h-5 text-red-500 transition-all" />
            ) : (
              <Bell className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 relative p-2 md:p-4 pb-24">
        <NotificationSystem notifications={notifications} />

        <AnimatePresence mode="wait">
          {activeTab === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center space-y-4"
            >
              <PredictionBanner
                confidence={confidence}
                activeSector={stats.activeSector}
                ballistics={ballistics}
              />

              <VacuumTracker vacuumAlerts={stats.vacuumAlerts} />

              <AlertTracker stats={stats} />

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
                />
              </div>

              <IframeBrowser
                iframeUrl={iframeUrl}
                casinoUrl={casinoUrl}
                setCasinoUrl={setCasinoUrl}
                setIframeUrl={setIframeUrl}
                onLaunch={handleLaunchCasino}
              />

              <div className="w-full max-w-md glass-panel p-4 flex justify-around items-center premium-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />

                <div className="text-center relative z-10">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">
                    Último Número
                  </span>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black border-2 shadow-2xl transition-all duration-500",
                      history.length > 0
                        ? getNumberColor(history[0]) === "red"
                          ? "bg-red-600 border-red-400/40 shadow-red-900/40"
                          : getNumberColor(history[0]) === "black"
                            ? "bg-zinc-900 border-white/20 shadow-black/60"
                            : "bg-emerald-600 border-emerald-400/40 shadow-emerald-900/40"
                        : "bg-zinc-800 border-white/5",
                    )}
                  >
                    {history[0] ?? "--"}
                  </div>
                </div>

                <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="text-center relative z-10">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] block mb-2">
                    Padrão Atual
                  </span>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-serif font-black italic gold-text tracking-[0.2em] uppercase">
                      {stats.lastPattern || "---"}
                    </span>
                    <div className="h-1 w-6 bg-gold/30 rounded-full mt-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
      </main>

      {/* Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none z-[60]">
        <div className="max-w-lg mx-auto glass-panel p-1.5 flex justify-between pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Sliding Indicator */}
          <motion.div
            className="absolute top-1.5 bottom-1.5 bg-gold/10 rounded-xl border border-gold/20"
            initial={false}
            animate={{
              left: `${["analysis", "stats", "history"].indexOf(activeTab) * 33.33 + 0.5}%`,
              width: "32.33%",
            }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
          />

          {(["analysis", "stats", "history"] as const).map((tab) => {
            const icons = {
              analysis: <LayoutDashboard className="w-4 h-4" />,
              stats: <PieChart className="w-4 h-4" />,
              history: <List className="w-4 h-4" />,
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
                  "flex-1 flex flex-col items-center py-1.5 space-y-1 transition-colors rounded-xl relative z-10",
                  activeTab === tab
                    ? "text-gold"
                    : "text-white/30 hover:text-white/60",
                )}
              >
                {icons[tab]}
                <span className="text-[10px] font-black uppercase tracking-widest">
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
