import React from 'react';
import { ROULETTE_NUMBERS, getNumberColor } from '../constants';
import { cn } from '../lib/utils';
import { Zap, AlertCircle } from 'lucide-react';

interface RouletteWheelProps {
  targets: number[];
  lastNumber?: number;
  quebraTarget?: number | null;
  playSignal?: 'red' | 'yellow' | 'green' | string | boolean;
  ballisticsTargets?: number[];
  omegaTarget?: number | null;
  vacuumAlerts?: { num: number; gap: number }[];
  sequenceTarget?: number | null;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  targets, 
  lastNumber, 
  quebraTarget, 
  playSignal = 'red',
  ballisticsTargets = [],
  omegaTarget = null,
  vacuumAlerts = [],
  sequenceTarget = null
}) => {
  // Racetrack geometry constants
  const R = 80;
  const H = 420;
  const W = 46; // Track thickness
  const Cx = 170;
  const Cy_top = 130;
  const Cy_bottom = Cy_top + H;
  const innerR = R - W / 2; // 57
  
  const arcL = Math.PI * R / 2;
  const totalL = 2 * Math.PI * R + 2 * H;
  const segmentL = totalL / 37;

  // Helper to place text items exactly along the center of the track segments
  const getTrackPoint = (distance: number, offsetRadius: number) => {
    let d = distance % totalL;
    if (d < 0) d += totalL;
    
    // 1. Top Right Arc
    if (d <= arcL) {
      const a = -Math.PI / 2 + (d / arcL) * (Math.PI / 2);
      return { x: Cx + offsetRadius * Math.cos(a), y: Cy_top + offsetRadius * Math.sin(a) };
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
      return { x: Cx + offsetRadius * Math.cos(a), y: Cy_bottom + offsetRadius * Math.sin(a) };
    }
    d -= arcL;
    
    // 4. Bottom Left Arc
    if (d <= arcL) {
      const a = Math.PI / 2 + (d / arcL) * (Math.PI / 2);
      return { x: Cx - offsetRadius * Math.cos(a), y: Cy_bottom - offsetRadius * Math.sin(a) };
    }
    d -= arcL;

    // 5. Left Straight
    if (d <= H) {
      return { x: Cx - offsetRadius, y: Cy_bottom - d };
    }
    d -= H;
    
    // 6. Top Left Arc
    const a = Math.PI + (d / arcL) * (Math.PI / 2);
    return { x: Cx - offsetRadius * Math.cos(a), y: Cy_top - offsetRadius * Math.sin(a) }; 
    // Wait, the Top Left Curve angle and offset logic needs to correctly map 
    // to the (Cx, Cy_top) origin. Using standard logic. 
  };

  // Re-write getTrackPoint with absolute pure logic to avoid Math flaws on corners
  const getTrackXY = (d: number, r: number) => {
    d = (d % totalL + totalL) % totalL;
    if (d <= arcL) {
      const a = -Math.PI / 2 + (d / arcL) * (Math.PI / 2);
      return { x: Cx + r * Math.cos(a), y: Cy_top + r * Math.sin(a) };
    } d -= arcL;
    if (d <= H) return { x: Cx + r, y: Cy_top + d }; d -= H;
    if (d <= arcL) {
      const a = 0 + (d / arcL) * (Math.PI / 2);
      return { x: Cx + r * Math.cos(a), y: Cy_bottom + r * Math.sin(a) };
    } d -= arcL;
    if (d <= arcL) {
      const a = Math.PI / 2 + (d / arcL) * (Math.PI / 2);
      return { x: Cx + r * Math.cos(a), y: Cy_bottom + r * Math.sin(a) };
    } d -= arcL;
    if (d <= H) return { x: Cx - r, y: Cy_bottom - d }; d -= H;
    
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

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-[34/70] flex items-center justify-center select-none lg:max-h-[80vh]">
      {/* Play Signal Lightning Bolt */}
      <div className={cn(
        "absolute -right-6 sm:-right-8 top-[5%] flex flex-col items-center gap-0.5 transition-all duration-500 z-20",
        playSignal === 'red' ? "opacity-20" : "opacity-100 scale-100"
      )}>
        <div className={cn(
          "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-all duration-500 shadow-lg backdrop-blur-sm",
          playSignal === 'red' ? "bg-red-500/10 border-red-500/20 text-red-500/40" :
          playSignal === 'yellow' ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-500 animate-pulse" :
          "bg-emerald-500/20 border-emerald-500/60 text-emerald-400 animate-bounce"
        )}>
          <Zap className={cn(
            "w-3.5 h-3.5 sm:w-5 sm:h-5 drop-shadow-[0_0_5px_currentColor]",
            playSignal === 'green' && "fill-emerald-400"
          )} />
        </div>
        <div className="flex flex-col items-center">
          <span className={cn(
            "text-[5px] sm:text-[7px] font-black uppercase tracking-widest",
            playSignal === 'red' ? "text-red-500/60" :
            playSignal === 'yellow' ? "text-yellow-500" :
            "text-emerald-400"
          )}>
            SINAL
          </span>
          <span className="text-[7px] sm:text-[8px] font-black text-white/70 uppercase tracking-tighter whitespace-nowrap bg-black/40 px-1 py-0 rounded border border-white/5">
            {playSignal === 'red' ? 'SCAN' : playSignal === 'yellow' ? 'READY' : 'GO!'}
          </span>
        </div>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 340 700" className="drop-shadow-2xl">
        <defs>
          <linearGradient id="feltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.8" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>

          <filter id="glowGold">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowRed">
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
          <rect x={Cx - innerR} y={Cy_top} width={innerR * 2} height={Cy_bottom - Cy_top} fill="url(#feltGradient)" />
          <path d={`M ${Cx - innerR},${Cy_top} A ${innerR},${innerR} 0 0 1 ${Cx + innerR},${Cy_top} Z`} fill="url(#feltGradient)" />
          <path d={`M ${Cx - innerR},${Cy_bottom} A ${innerR},${innerR} 0 0 0 ${Cx + innerR},${Cy_bottom} Z`} fill="url(#feltGradient)" />
        </g>

        {/* Decorative lines for felt regions */}
        <g stroke="#ffffff" strokeOpacity="0.1" fill="none">
          <path d={`M ${jeuL.x},${jeuL.y} L ${jeuR.x},${jeuR.y}`} />
          <path d={`M ${voiL.x},${voiL.y} L ${voiR.x},${voiR.y}`} />
          <path d={`M ${orpL.x},${orpL.y} L ${orpR.x},${orpR.y}`} />
        </g>
        
        <g className="font-serif italic font-bold tracking-widest uppercase">
          <text x={Cx} y={105} fill="#d4af37" fontSize="13" textAnchor="middle" opacity="0.6">Jeu Zero</text>
          <text x={Cx} y={220} fill="#ffffff" fontSize="12" textAnchor="middle" opacity="0.2">Voisins</text>
          <text x={Cx} y={380} fill="#ffffff" fontSize="12" textAnchor="middle" opacity="0.2">Orphelins</text>
          <text x={Cx} y={510} fill="#ffffff" fontSize="12" textAnchor="middle" opacity="0.2">Tiers</text>
        </g>

        {/* The Track Base Borders - Realistic Rim */}
        <path d={trackPath} fill="none" stroke="#1c1917" strokeWidth={W + 12} />
        <path d={trackPath} fill="none" stroke="url(#goldRim)" strokeWidth={W + 6} strokeOpacity="0.8" />
        <path d={trackPath} fill="none" stroke="#000000" strokeWidth={W + 2} />
        
        {/* Array of Colored Segments */}
        {ROULETTE_NUMBERS.map((num, i) => {
          const color = getNumberColor(num);
          const fillColor = color === 'red' ? '#991b1b' : color === 'black' ? '#09090b' : '#065f46';
          
          const drawLength = segmentL - 0.5; // Thin gap between blocks
          
          let offset = (drawLength / 2) - i * segmentL;
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
          
          const getMirrors = (n: number) => {
            const m: Record<number, number> = { 12: 21, 21: 12, 13: 31, 31: 13, 23: 32, 32: 23, 16: 19, 19: 16, 6: 9, 9: 6 };
            return m[n] !== undefined ? [n, m[n]] : [n];
          };

          const getNeighbors = (n: number) => {
            const idx = ROULETTE_NUMBERS.indexOf(n);
            if (idx === -1) return [n];
            return [
              ROULETTE_NUMBERS[(idx - 1 + ROULETTE_NUMBERS.length) % ROULETTE_NUMBERS.length],
              n,
              ROULETTE_NUMBERS[(idx + 1) % ROULETTE_NUMBERS.length]
            ];
          };

          const isTarget = targets.some(t => {
            const mirrors = getMirrors(t);
            return mirrors.some(m => getNeighbors(m).includes(num));
          });
          const isQuebra = quebraTarget !== null && getMirrors(quebraTarget).includes(num);
          const isBallistics = ballisticsTargets.some(t => getMirrors(t).includes(num));
          const isVacuum = vacuumAlerts.some(v => getMirrors(v.num).includes(num));
          const isSequence = sequenceTarget !== null && getMirrors(sequenceTarget).includes(num);
          
          const isOmega = omegaTarget !== null && getMirrors(omegaTarget).includes(num);
          const isAnyTarget = isTarget || isQuebra || isBallistics || isVacuum || isSequence;
          
          const isLast = lastNumber === num;

          return (
            <g key={`text-${num}`}>
              {/* Omega Highlight (Neon Red) */}
              {isOmega && (
                <g filter="url(#glowRed)">
                   <circle
                    cx={x}
                    cy={y}
                    r="20"
                    fill="rgba(239, 68, 68, 0.3)"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    className="pointer-events-none animate-pulse"
                  />
                </g>
              )}

              {/* General Target Highlight with Gold Glow */}
              {isAnyTarget && !isOmega && (
                <g filter="url(#glowGold)">
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="rgba(212, 175, 55, 0.4)"
                    stroke="#d4af37"
                    strokeWidth="2.5"
                    className="pointer-events-none animate-pulse"
                  />
                </g>
              )}
              
              {/* Last Number Highlight */}
              {isLast && !isAnyTarget && !isOmega && (
                <circle
                  cx={x}
                  cy={y}
                  r="14"
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />
              )}

              {/* Precise Text Render */}
              <text
                x={x}
                y={y}
                fill="white"
                fontSize={isOmega ? "19" : isAnyTarget ? "16" : "13"}
                fontWeight="900"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
                alignmentBaseline="central"
                className={cn(
                  "pointer-events-none transition-all duration-300",
                  isOmega ? "fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]" :
                  isAnyTarget ? "fill-gold brightness-150 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "opacity-90 font-extrabold"
                )}
              >
                {num}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
