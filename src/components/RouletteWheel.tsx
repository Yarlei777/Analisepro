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
  }) => {
    // Racetrack geometry constants
    const R = 80;
    const H = 420;
    const W = 46; // Track thickness
    const Cx = 170;
    const Cy_top = 130;
    const Cy_bottom = Cy_top + H;
    const innerR = R - W / 2; // 57

    const arcL = (Math.PI * R) / 2;
    const totalL = 2 * Math.PI * R + 2 * H;
    const segmentL = totalL / 37;

    // Helper to place text items exactly along the center of the track segments
    const getTrackPoint = (distance: number, offsetRadius: number) => {
      let d = distance % totalL;
      if (d < 0) d += totalL;

      // 1. Top Right Arc
      if (d <= arcL) {
        const a = -Math.PI / 2 + (d / arcL) * (Math.PI / 2);
        return {
          x: Cx + offsetRadius * Math.cos(a),
          y: Cy_top + offsetRadius * Math.sin(a),
        };
      }
      d -= arcL;

      // 2. Right Straight
      if (d <= H) {
        return { x: Cx + offsetRadius, y: Cy_top + d };
      }
      d -= H;

      // 3. Bottom Right Arc
      if (d <= arcL) {
        const a = 0 + (d / arcL) * (Math.PI / 2);
        return {
          x: Cx + offsetRadius * Math.cos(a),
          y: Cy_bottom + offsetRadius * Math.sin(a),
        };
      }
      d -= arcL;

      // 4. Bottom Left Arc
      if (d <= arcL) {
        const a = Math.PI / 2 + (d / arcL) * (Math.PI / 2);
        return {
          x: Cx - offsetRadius * Math.cos(a),
          y: Cy_bottom - offsetRadius * Math.sin(a),
        };
      }
      d -= arcL;

      // 5. Left Straight
      if (d <= H) {
        return { x: Cx - offsetRadius, y: Cy_bottom - d };
      }
      d -= H;

      // 6. Top Left Arc
      const a = Math.PI + (d / arcL) * (Math.PI / 2);
      return {
        x: Cx - offsetRadius * Math.cos(a),
        y: Cy_top - offsetRadius * Math.sin(a),
      };
      // Wait, the Top Left Curve angle and offset logic needs to correctly map
      // to the (Cx, Cy_top) origin. Using standard logic.
    };

    // Re-write getTrackPoint with absolute pure logic to avoid Math flaws on corners
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
              <stop offset="0%" stopColor="#0a1d17" />
              <stop offset="50%" stopColor="#0d261e" />
              <stop offset="100%" stopColor="#071510" />
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

          {/* Decorative lines for felt regions */}
          <g stroke="#ffffff" strokeOpacity="0.1" fill="none">
            <path d={`M ${jeuL.x},${jeuL.y} L ${jeuR.x},${jeuR.y}`} />
            <path d={`M ${voiL.x},${voiL.y} L ${voiR.x},${voiR.y}`} />
            <path d={`M ${orpL.x},${orpL.y} L ${orpR.x},${orpR.y}`} />
          </g>

          <g className="font-serif italic font-bold tracking-widest uppercase">
            <text
              x={Cx}
              y={105}
              fill="#d4af37"
              fontSize="13"
              textAnchor="middle"
              opacity="0.6"
            >
              Jeu Zero
            </text>
            <text
              x={Cx}
              y={220}
              fill="#ffffff"
              fontSize="12"
              textAnchor="middle"
              opacity="0.2"
            >
              Voisins
            </text>
            <text
              x={Cx}
              y={380}
              fill="#ffffff"
              fontSize="12"
              textAnchor="middle"
              opacity="0.2"
            >
              Orphelins
            </text>
            <text
              x={Cx}
              y={510}
              fill="#ffffff"
              fontSize="12"
              textAnchor="middle"
              opacity="0.2"
            >
              Tiers
            </text>
          </g>

          {/* The Track Base Borders - Realistic Rim */}
          <path
            d={trackPath}
            fill="none"
            stroke="#1c1917"
            strokeWidth={W + 12}
          />
          <path
            d={trackPath}
            fill="none"
            stroke="url(#goldRim)"
            strokeWidth={W + 6}
            strokeOpacity="0.8"
          />
          <path
            d={trackPath}
            fill="none"
            stroke="#000000"
            strokeWidth={W + 2}
          />

          {/* Array of Colored Segments */}
          {ROULETTE_NUMBERS.map((num, i) => {
            const color = getNumberColor(num);
            const fillColor =
              color === "red"
                ? "#991b1b"
                : color === "black"
                  ? "#09090b"
                  : "#065f46";

            const drawLength = segmentL - 0.5; // Thin gap between blocks

            let offset = drawLength / 2 - i * segmentL;
            while (offset < 0) offset += totalL;
            offset = offset % totalL;

            return (
              <g key={`segment-group-${num}`}>
                <path
                  d={trackPath}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth={W}
                  strokeDasharray={`${drawLength} ${totalL - drawLength}`}
                  strokeDashoffset={offset}
                />
                {/* Subtle bevel effect on segments */}
                <path
                  d={trackPath}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={W - 4}
                  strokeDasharray={`${drawLength} ${totalL - drawLength}`}
                  strokeDashoffset={offset}
                  strokeOpacity="0.5"
                />
              </g>
            );
          })}

          {/* Overlay Texts and Target Highlights */}
          {ROULETTE_NUMBERS.map((num, i) => {
            const { x, y } = getPoint(i * segmentL);

            const isTarget = targets.some((t) => {
              const mirrors = getMirrors(t);
              return mirrors.some((m) => getNeighbors(m, 1).includes(num));
            });
            const isQuebra =
              quebraTarget !== null && getMirrors(quebraTarget).includes(num);
            const isBallistics = ballisticsTargets.some((t) =>
              getMirrors(t).includes(num),
            );
            const isVacuum = vacuumAlerts.some((v) =>
              getMirrors(v.num).includes(num),
            );
            const isSequence =
              sequenceTarget !== null &&
              getMirrors(sequenceTarget).includes(num);
            const isTimeMirror =
              timeMirrorTarget !== null &&
              getMirrors(timeMirrorTarget).includes(num);

            const isOmega =
              omegaTarget !== null && getMirrors(omegaTarget).includes(num);

            const isLast = lastNumber === num;
            const isLastNeighbor =
              lastNumber !== undefined &&
              getNeighbors(lastNumber, 2).includes(num) &&
              !isLast;

            const isAnyYellowTarget =
              isTarget ||
              isQuebra ||
              isBallistics ||
              isVacuum ||
              isSequence ||
              isTimeMirror ||
              isLast ||
              isLastNeighbor;

            return (
              <g key={`text-${num}`}>
                {/* Omega Highlight (Neon Green) */}
                {isOmega && (
                  <g filter="url(#glowGreen)">
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="rgba(52, 211, 153, 0.3)"
                      stroke="#34d399"
                      strokeWidth="3.5"
                      className="pointer-events-none animate-pulse"
                    />
                  </g>
                )}

                {/* General Target Highlight with Yellow Glow */}
                {isAnyYellowTarget && !isOmega && (
                  <g filter="url(#glowYellow)">
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="rgba(250, 204, 21, 0.4)"
                      stroke="#facc15"
                      strokeWidth="2.5"
                      className="pointer-events-none animate-pulse"
                    />
                  </g>
                )}

                {/* Precise Text Render */}
                <text
                  x={x}
                  y={y}
                  fill="white"
                  fontSize={isOmega ? "19" : isAnyYellowTarget ? "16" : "13"}
                  fontWeight="900"
                  fontFamily="Inter, sans-serif"
                  textAnchor="middle"
                  alignmentBaseline="central"
                  className={cn(
                    "pointer-events-none transition-all duration-300",
                    isOmega
                      ? "fill-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,1)]"
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
    ]);

    return (
      <div className="relative w-full max-w-[320px] mx-auto aspect-[34/70] flex items-center justify-center select-none lg:max-h-[80vh]">
        {/* Play Signal Lightning Bolt */}{" "}
        <div
          className={cn(
            "absolute -right-6 sm:-right-8 top-[5%] flex flex-col items-center gap-0.5 transition-all duration-500 z-20",
            !isVoltaCerta && winStreak < 3
              ? "opacity-20"
              : "opacity-100 scale-100",
          )}
        >
          {" "}
          <div
            className={cn(
              "w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-lg backdrop-blur-sm",
              winStreak >= 3
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
                winStreak >= 3
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
                winStreak >= 3
                  ? "text-amber-400"
                  : !isVoltaCerta
                    ? "text-red-500/60"
                    : "text-emerald-400",
              )}
            >
              {" "}
              {winStreak >= 3 ? "PADRÃO" : "VOLTA"}{" "}
            </span>{" "}
            <span
              className={cn(
                "text-[8px] sm:text-[10px] font-black uppercase tracking-tighter whitespace-nowrap px-1.5 py-0.5 rounded border mt-0.5",
                winStreak >= 3
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-black/50 border-white/10 text-white/90",
              )}
            >
              {" "}
              {winStreak >= 3
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
          viewBox="0 0 340 700"
          className="drop-shadow-2xl"
        >
          {svgContent}
        </svg>
      </div>
    );
  },
);
