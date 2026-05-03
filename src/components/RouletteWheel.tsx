import React, { useMemo } from "react";
import {
  ROULETTE_NUMBERS,
  getNumberColor,
  getMirrors,
  getNeighbors,
} from "../constants";
import { cn } from "../lib/utils";
import { Zap, AlertCircle } from "lucide-react";

interface RouletteWheelProps {
  targets: number[];
  lastNumber?: number;
  quebraTarget?: number | null;
  playSignal?: "red" | "yellow" | "green" | string | boolean;
  isVoltaCerta?: boolean;
  winStreak?: number;
  ballisticsTargets?: number[];
  omegaTarget?: number | null;
  vacuumAlerts?: { num: number; gap: number }[];
  sequenceTarget?: number | null;
  timeMirrorTarget?: number | null;
  somaAlert?: boolean;
  somaTargetSum?: number | null;
  doublePatternTargets?: number[];
  streakTargets?: number[];
  zonaFaltaTargets?: number[];
  zonaFaltaSuper?: boolean;
  onDismissSignal?: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = React.memo(
  ({
    targets,
    lastNumber,
    quebraTarget,
    playSignal = "red",
    isVoltaCerta = false,
    winStreak = 0,
    ballisticsTargets = [],
    omegaTarget = null,
    vacuumAlerts = [],
    sequenceTarget = null,
    timeMirrorTarget = null,
    somaAlert = false,
    somaTargetSum = null,
    doublePatternTargets = [],
    streakTargets = [],
    zonaFaltaTargets = [],
    zonaFaltaSuper = false,
    onDismissSignal,
  }) => {
    // Racetrack geometry constants
    const R = 105;
    const H = 430;
    const W = 62; // Track thickness
    const Cx = 170;
    const Cy_top = 145;
    const Cy_bottom = Cy_top + H;
    const innerR = R - W / 2; // 74

    const arcL = (Math.PI * R) / 2;
    const totalL = 2 * Math.PI * R + 2 * H;
    const segmentL = totalL / 37;

    // Helper to place text items exactly along the center of the track segments
    const getTrackXY = (d: number, r: number) => {
      d = ((d % totalL) + totalL) % totalL;
      if (d <= arcL) {
        const a = -Math.PI / 2 + (d / arcL) * (Math.PI / 2);
        return { x: Cx + r * Math.cos(a), y: Cy_top + r * Math.sin(a) };
      }
      d -= arcL;
      if (d <= H) return { x: Cx + r, y: Cy_top + d };
      d -= H;
      if (d <= arcL) {
        const a = 0 + (d / arcL) * (Math.PI / 2);
        return { x: Cx + r * Math.cos(a), y: Cy_bottom + r * Math.sin(a) };
      }
      d -= arcL;
      if (d <= arcL) {
        const a = Math.PI / 2 + (d / arcL) * (Math.PI / 2);
        return { x: Cx + r * Math.cos(a), y: Cy_bottom + r * Math.sin(a) };
      }
      d -= arcL;
      if (d <= H) return { x: Cx - r, y: Cy_bottom - d };
      d -= H;

      const a = Math.PI + (d / arcL) * (Math.PI / 2);
      return { x: Cx + r * Math.cos(a), y: Cy_top + r * Math.sin(a) };
    };

    const getPoint = (distance: number) => getTrackXY(distance, R);
    const getInner = (distance: number) => getTrackXY(distance, innerR);

    // Exact gaps dividing the racetrack
    const jeuR = getInner(2.5 * segmentL);
    const jeuL = getInner(32.5 * segmentL);

    const voiR = getInner(7.5 * segmentL);
    const voiL = getInner(27.5 * segmentL);

    const orpR = getInner(10.5 * segmentL);
    const orpL = getInner(22.5 * segmentL);

    // Safe path using 4 quarter-arcs to prevent any 180deg SVG rendering bugs
    const trackPath = `
    M ${Cx},${Cy_top - R} 
    A ${R},${R} 0 0 1 ${Cx + R},${Cy_top} 
    L ${Cx + R},${Cy_bottom} 
    A ${R},${R} 0 0 1 ${Cx},${Cy_bottom + R} 
    A ${R},${R} 0 0 1 ${Cx - R},${Cy_bottom} 
    L ${Cx - R},${Cy_top} 
    A ${R},${R} 0 0 1 ${Cx},${Cy_top - R} 
    Z
  `;

    const svgContent = useMemo(() => {
      return (
        <>
          <defs>
            <linearGradient
              id="feltGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1e1c18" />
              <stop offset="50%" stopColor="#2c2a26" />
              <stop offset="100%" stopColor="#1a1815" />
            </linearGradient>

            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8d6e1d" />
              <stop offset="30%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#8d6e1d" />
            </linearGradient>

            <filter id="innerShadow">
              <feOffset dx="0" dy="2" />
              <feGaussianBlur stdDeviation="3" result="offset-blur" />
              <feComposite
                operator="out"
                in="SourceGraphic"
                in2="offset-blur"
                result="inverse"
              />
              <feFlood floodColor="black" floodOpacity="0.8" result="color" />
              <feComposite
                operator="in"
                in="color"
                in2="inverse"
                result="shadow"
              />
              <feComposite operator="over" in="shadow" in2="SourceGraphic" />
            </filter>

            <filter id="glowYellow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowGreen">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glowPurple">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Inner track realistic casino felt background */}
          <g filter="url(#innerShadow)">
            <rect
              x={Cx - innerR}
              y={Cy_top}
              width={innerR * 2}
              height={Cy_bottom - Cy_top}
              fill="url(#feltGradient)"
            />
            <path
              d={`M ${Cx - innerR},${Cy_top} A ${innerR},${innerR} 0 0 1 ${Cx + innerR},${Cy_top} Z`}
              fill="url(#feltGradient)"
            />
            <path
              d={`M ${Cx - innerR},${Cy_bottom} A ${innerR},${innerR} 0 0 0 ${Cx + innerR},${Cy_bottom} Z`}
              fill="url(#feltGradient)"
            />
          </g>

          {/* Decorative lines and borders for felt regions */}
          <g stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" fill="none">
            {/* Divider for Voisins / Orphelins */}
            <line x1={voiL.x} y1={voiL.y} x2={voiR.x} y2={voiR.y} />
            {/* Divider for Orphelins / Tiers */}
            <line x1={orpL.x} y1={orpL.y} x2={orpR.x} y2={orpR.y} />
            {/* Curved divider for Jeu Zero */}
            <path d={`M ${jeuL.x},${jeuL.y} A ${innerR},${innerR} 0 0 0 ${jeuR.x},${jeuR.y}`} />
            
            {/* Thick inner border to separate felt from numbers */}
            <path
              d={`
                M ${Cx},${Cy_top - innerR} 
                A ${innerR},${innerR} 0 0 1 ${Cx + innerR},${Cy_top} 
                L ${Cx + innerR},${Cy_bottom} 
                A ${innerR},${innerR} 0 0 1 ${Cx},${Cy_bottom + innerR} 
                A ${innerR},${innerR} 0 0 1 ${Cx - innerR},${Cy_bottom} 
                L ${Cx - innerR},${Cy_top} 
                A ${innerR},${innerR} 0 0 1 ${Cx},${Cy_top - innerR} 
                Z
              `}
            />
          </g>

          <g className="font-sans font-black tracking-widest uppercase" style={{ WebkitFontSmoothing: "antialiased" }}>
            <text
              x={Cx}
              y={Cy_top + 30}
              fill="#ffffff"
              fontSize="14"
              textAnchor="middle"
              opacity="0.9"
            >
              JEU ZERO
            </text>
            <text
              x={Cx}
              y={Cy_top + 160}
              fill="#ffffff"
              fontSize="16"
              textAnchor="middle"
              opacity="0.9"
            >
              VOISINS
            </text>
            <text
              x={Cx}
              y={Cy_top + 300}
              fill="#ffffff"
              fontSize="15"
              textAnchor="middle"
              opacity="0.9"
            >
              ORPHELINS
            </text>
            <text
              x={Cx}
              y={Cy_bottom - 20}
              fill="#ffffff"
              fontSize="15"
              textAnchor="middle"
              opacity="0.9"
            >
              TIERS
            </text>
          </g>

          {/* The Track Base Borders - Realistic Rim */}
          <path
            d={trackPath}
            pathLength={totalL}
            fill="none"
            stroke="#1c1917"
            strokeWidth={W + 12}
          />
          <path
            d={trackPath}
            pathLength={totalL}
            fill="none"
            stroke="url(#goldRim)"
            strokeWidth={W + 6}
            strokeOpacity="0.8"
          />
          <path
            d={trackPath}
            pathLength={totalL}
            fill="none"
            stroke="#111111"
            strokeWidth={W + 2}
          />
          {/* White separator background for the grid look */}
          <path
            d={trackPath}
            pathLength={totalL}
            fill="none"
            stroke="#ffffff"
            strokeWidth={W}
            strokeOpacity="0.25"
          />

          {/* Array of Colored Segments */}
          {ROULETTE_NUMBERS.map((num, i) => {
            const color = getNumberColor(num);
            const fillColor =
              color === "red"
                ? "#bf1516" // Vibrant casino red
                : color === "black"
                  ? "#18181b" // Very dark gray
                  : "#2e7d32"; // Rich casino green

            // A gap of 1.5 forces the white line background to show through as dividers
            const drawLength = segmentL - 1.5; 

            let start = i * segmentL - drawLength / 2;
            let end = i * segmentL + drawLength / 2;

            start = ((start % totalL) + totalL) % totalL;
            end = ((end % totalL) + totalL) % totalL;

            let dashArrayObj;
            if (start > end) {
              dashArrayObj = `${end} ${start - end} ${totalL - start}`;
            } else {
              dashArrayObj = `0 ${start} ${end - start} ${totalL - end}`;
            }

            return (
              <g key={`segment-group-${num}`}>
                <path
                  d={trackPath}
                  pathLength={totalL}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth={W}
                  strokeDasharray={dashArrayObj}
                  strokeDashoffset={0}
                  strokeLinecap="butt"
                />
              </g>
            );
          })}

          {/* Overlay Texts and Target Highlights */}
          {ROULETTE_NUMBERS.map((num, i) => {
            const { x, y } = getPoint(i * segmentL);

            const isTarget = targets.includes(num);
            const isQuebra = quebraTarget !== null && getNeighbors(quebraTarget, 1).includes(num);
            const isBallistics = ballisticsTargets.some((t) => getNeighbors(t, 1).includes(num));
            const isVacuum = vacuumAlerts.some((v) => getNeighbors(v.num, 1).includes(num));
            const isSequence = sequenceTarget !== null && getNeighbors(sequenceTarget, 1).includes(num);
            const isTimeMirror = timeMirrorTarget !== null && getNeighbors(timeMirrorTarget, 2).includes(num);
            const isSomaTarget = somaAlert && somaTargetSum !== null && (num < 10 ? num : Math.floor(num / 10) + (num % 10)) === somaTargetSum;
            const isDoublePattern = doublePatternTargets.some((t) => getNeighbors(t, 1).includes(num));
            const isStreak = streakTargets.some((t) => getNeighbors(t, 1).includes(num));

            const isOmega = omegaTarget !== null && getNeighbors(omegaTarget, 3).includes(num);
            const isLast = lastNumber === num;
            const isLastNeighbor = lastNumber !== undefined && getNeighbors(lastNumber, 1).includes(num) && !isLast;

            const isAnyYellowTarget =
              isTarget ||
              isQuebra ||
              isBallistics ||
              isVacuum ||
              isSequence ||
              isTimeMirror ||
              isSomaTarget ||
              isDoublePattern ||
              isStreak ||
              isLast ||
              isLastNeighbor;

            // Se for super confluência, ilumina tudo do alvo (que são apenas a intersecção)
            // Se for apenas uma dúzia ou coluna, ilumina de roxo apenos os alvos que já acenderiam por outras análises
            const isZonaFaltaFocus = zonaFaltaSuper 
              ? zonaFaltaTargets.includes(num)
              : (isAnyYellowTarget && zonaFaltaTargets.includes(num));

            return (
              <g key={`text-${num}`}>
                {/* Zonas em Falta Override Highlight */}
                {isZonaFaltaFocus && (
                  <g filter="url(#glowPurple)">
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="rgba(168, 85, 247, 0.4)"
                      stroke="#a855f7"
                      strokeWidth="3"
                      className="pointer-events-none"
                    />
                  </g>
                )}

                {/* Last Result Highlight (Subtle) */}
                {isLast && !isZonaFaltaFocus && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="rgba(255, 255, 255, 0.15)"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="1.5"
                    className="pointer-events-none"
                  />
                )}

                {/* Omega Highlight (Softer Blue) */}
                {isOmega && !isZonaFaltaFocus && (
                  <g filter="url(#glowGreen)">
                    <circle
                      cx={x}
                      cy={y}
                      r="18"
                      fill="rgba(56, 189, 248, 0.15)"
                      stroke="rgba(56, 189, 248, 0.6)"
                      strokeWidth="2"
                      className="pointer-events-none"
                    />
                  </g>
                )}

                {/* Orange Highlight for Quebra/Robbery */}
                {isQuebra && !isOmega && !isZonaFaltaFocus && (
                  <g filter="url(#glowYellow)">
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="rgba(249, 115, 22, 0.3)"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      className="pointer-events-none"
                    />
                  </g>
                )}

                {/* General Target Highlight with Neon Green Glow */}
                {isAnyYellowTarget && !isOmega && !isQuebra && !isZonaFaltaFocus && (
                  <g filter="url(#glowYellow)">
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="rgba(57, 255, 20, 0.3)"
                      stroke="#39ff14"
                      strokeWidth="2.5"
                      className="pointer-events-none"
                    />
                  </g>
                )}

                {/* Precise Text Render */}
                <text
                  x={x}
                  y={y}
                  fill="white"
                  fontSize={isZonaFaltaFocus ? "19" : isOmega ? "19" : isQuebra ? "16" : isAnyYellowTarget ? "16" : "13"}
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  className={cn(
                    "pointer-events-none transition-all duration-300",
                    isZonaFaltaFocus
                      ? "fill-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,1)]"
                      : isOmega
                        ? "fill-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]"
                        : isQuebra
                          ? "fill-orange-400 brightness-150 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                          : isAnyYellowTarget
                            ? "fill-yellow-400 brightness-150 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                            : "opacity-90 font-extrabold",
                  )}
                >
                  {num}
                </text>
              </g>
            );
          })}
        </>
      );
    }, [
      targets.join(","),
      lastNumber,
      quebraTarget,
      ballisticsTargets.join(","),
      omegaTarget,
      JSON.stringify(vacuumAlerts),
      sequenceTarget,
      timeMirrorTarget,
      somaAlert,
      somaTargetSum,
    ]);

    return (
      <div className="relative w-full max-w-[340px] mx-auto aspect-[34/74] flex items-center justify-center select-none lg:max-h-[85vh]">
        {/* Play Signal Lightning Bolt */}{" "}
        <div
          className={cn(
            "absolute -right-6 sm:-right-8 top-[5%] flex flex-col items-center gap-0.5 transition-all duration-500 z-20 cursor-pointer",
            !isVoltaCerta && winStreak !== 2
              ? "opacity-20"
              : "opacity-100 scale-100",
          )}
          onClick={onDismissSignal}
        >
          {" "}
          <div
            className={cn(
              "w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-lg backdrop-blur-sm",
              winStreak === 2
                ? "bg-amber-500/20 border-amber-500/60 text-amber-400 animate-bounce cursor-pointer"
                : !isVoltaCerta
                  ? "bg-red-500/10 border-red-500/20 text-red-500/40"
                  : "bg-emerald-500/20 border-emerald-500/60 text-emerald-400 animate-bounce cursor-pointer",
            )}
          >
            {" "}
            <Zap
              className={cn(
                "w-5 h-5 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_currentColor]",
                winStreak === 2
                  ? "fill-amber-400"
                  : isVoltaCerta && "fill-emerald-400",
              )}
            />{" "}
          </div>{" "}
          <div className="flex flex-col items-center mt-1">
            {" "}
            <span
              className={cn(
                "text-[7px] sm:text-[9px] font-black uppercase tracking-widest",
                winStreak === 2
                  ? "text-amber-400"
                  : !isVoltaCerta
                    ? "text-red-500/60"
                    : "text-emerald-400",
              )}
            >
              {" "}
              {winStreak === 2 ? "PADRÃO" : "VOLTA"}{" "}
            </span>{" "}
            <span
              className={cn(
                "text-[8px] sm:text-[10px] font-black uppercase tracking-tighter whitespace-nowrap px-1.5 py-0.5 rounded border mt-0.5",
                winStreak === 2
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-black/50 border-white/10 text-white/90",
              )}
            >
              {" "}
              {winStreak === 2
                ? "PAGAMENTO"
                : isVoltaCerta
                  ? "CERTA!"
                  : "SCAN"}{" "}
            </span>{" "}
          </div>{" "}
        </div>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 340 740"
          className="drop-shadow-2xl"
        >
          {svgContent}
        </svg>
      </div>
    );
  },
);
