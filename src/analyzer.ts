import { NumberScore } from "./analyzer_types";
import { ROULETTE_NUMBERS, getNumberColor } from "./constants";

export type BallSize = "standard" | "large" | "small";

export function analyzeHistory(
  history: number[],
  isRecursive: boolean = false,
  ballSize: BallSize = "standard"
) {
  const stats = {
    activeSector: "N/A",
    predictedSector: "N/A",
    sectorSequencePattern: "N/A",
    dealerRhythm: "N/A",
    lastTerminalGroup: null as string | null,
    terminalRepeat: false,
    quebraAlert: false,
    quebraReason: "",
    quebraTarget: null as number | null,
    sectorBias: [] as any[],
    colorTendency: { red: 0, black: 0, green: 0 },
    recentProbabilities: [] as any[],
    terminalFrequency: {} as Record<string, number>,
    hotNumbers: [] as any[],
    vacuumAlerts: [] as { num: number; gap: number }[],
    omegaAlert: false,
    omegaTarget: null as number | null,
    sequenceAlert: false,
    sequenceTarget: null as number | null,
    timeMirrorAlert: false,
    timeMirrorTarget: null as number | null,
    timeMirrorSeq: [] as number[],
    somaAlert: false,
    somaTargetSum: null as number | null,
    mirrorAlert: false,
    mirrorTarget: null as number | null,
    lastPattern: "---" as string,
    biasDetected: false,
    biasTarget: null as number | null,
    sectorConfidence: 0.0,
    zoneBiasAlert: false,
    zoneBiasTarget: "",
    crazyTable: false,
    entropyLevel: 0,
    winRate: 0,
    winsCount: 0,
    lossesCount: 0,
    isVoltaCerta: false,
    robberyAlert: false,
    robberyRecentCount: 0,
    robberyGaps: [] as number[],
    stealingPhaseAlert: false,
    sleepingDozen: null as number | null,
    sleepingColumn: null as number | null,
    sleepingDozenCount: 0,
    sleepingColumnCount: 0,
    alternatingColorPattern: false,
    colorStreak: 0,
    signatureClusterAlert: false,
    signatureClusterTarget: "---" as string,
  };

  let confidence = 0;
  let playSignal: "red" | "yellow" | "green" = "red";
  let targets: number[] = [];
  let biasMessage = "ANALISANDO DADOS...";

  if (history.length === 0) {
    return { targets, biasMessage, stats, confidence, playSignal };
  }

  // --- Funções Auxiliares Balísticas ---
  const getIdx = (num: number) => ROULETTE_NUMBERS.indexOf(num);
  const getDist = (n1: number, n2: number) => {
    const d = Math.abs(getIdx(n1) - getIdx(n2));
    return Math.min(d, 37 - d); // Menor distância circular na roleta
  };

  const checkQuebraAt = (idx: number) => {
    if (idx + 2 >= history.length) return false;
    const jump = getDist(history[idx], history[idx + 1]);
    let sum = 0,
      count = 0;
    for (let k = idx + 1; k < Math.min(history.length - 1, idx + 6); k++) {
      sum += getDist(history[k], history[k + 1]);
      count++;
    }
    const avg = count > 0 ? sum / count : 0;
    // Se o salto recente foi muito maior que a média do dealer (mudança brusca) e cruzou a roda
    return jump > avg + 6 && jump > 12;
  };

  // --- 1. Motor de Vácuo (Gap Analysis) ---
  const gaps: Record<number, number> = {};
  ROULETTE_NUMBERS.forEach((n) => (gaps[n] = -1));

  for (let num of ROULETTE_NUMBERS) {
    const idx = history.indexOf(num);
    gaps[num] = idx === -1 ? history.length : idx;
  }

  let vacuumTops = Object.entries(gaps)
    .map(([num, gap]) => ({ num: parseInt(num), gap }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3); // top 3 vacuums

  if (history.length < 28) {
    vacuumTops = [];
  } else {
    vacuumTops = vacuumTops.filter((v) => v.gap >= 25);
  }

  stats.vacuumAlerts = vacuumTops;

  // --- 2. Cadeia de Markov (Sequence Analysis LENGTH 2) ---
  const markovCounts: Record<number, number> = {};
  const lastNum = history[0];

  for (let i = 1; i < history.length - 1; i++) {
    if (history[i] === lastNum) {
      const nextNum = history[i - 1]; // because index 0 is newest
      markovCounts[nextNum] = (markovCounts[nextNum] || 0) + 1;
    }
  }

  const markovSorted = Object.entries(markovCounts)
    .map(([num, count]) => ({ num: parseInt(num), count }))
    .sort((a, b) => b.count - a.count);

  if (markovSorted.length > 0 && markovSorted[0].count >= 2) {
    stats.sequenceAlert = true;
    stats.sequenceTarget = markovSorted[0].num;
  }

  // --- Historical Sequence Recognition (Third Number / LENGTH 3) ---
  let thirdNumberTarget: number | null = null;
  if (history.length >= 2) {
    const sequenceCounts: Record<number, number> = {};
    const n1 = history[0];
    const n2 = history[1]; // anterior
    // Procurar por "n2" seguido de "n1", e ver qual foi o próximo (historicamente o que veio Cedo, i.e., index-1)
    for (let i = 2; i < history.length - 1; i++) {
      if (history[i] === n1 && history[i + 1] === n2) {
        const nextNum = history[i - 1];
        sequenceCounts[nextNum] = (sequenceCounts[nextNum] || 0) + 1;
      }
    }
    const seqSorted = Object.entries(sequenceCounts).sort(
      (a, b) => b[1] - a[1],
    );
    if (seqSorted.length > 0) {
      thirdNumberTarget = parseInt(seqSorted[0][0]);
    }

    // --- Time Mirror (Espelho Temporal / Vizinhos) ---
    for (let i = 2; i < history.length - 1; i++) {
      if (getDist(history[i], n1) <= 1 && getDist(history[i + 1], n2) <= 1) {
        stats.timeMirrorAlert = true;
        stats.timeMirrorTarget = history[i - 1];
        stats.timeMirrorSeq = [history[i + 1], history[i]];
        break; // Match mais recente ganha
      }
    }
  }

  // --- 3. Lógica de Espelho e Terminais ---
  const mirrors: Record<number, number> = {
    12: 21,
    21: 12,
    13: 31,
    31: 13,
    23: 32,
    32: 23,
    5: 15,
    6: 16,
    7: 17,
    8: 18,
    9: 19,
  };

  if (mirrors[lastNum]) {
    stats.mirrorAlert = true;
    stats.mirrorTarget = mirrors[lastNum];
  }

  // --- 4. Análise de Soma (Digit Sum) ---
  const sumDigits = (n: number) => (n < 10 ? n : Math.floor(n / 10) + (n % 10));
  if (history.length > 1) {
    const sum1 = sumDigits(history[0]);
    const sum2 = sumDigits(history[1]);
    if (sum1 === sum2) {
      stats.somaAlert = true;
      stats.somaTargetSum = sum1;
    }
  }

  // Terminals frequency
  history.slice(0, 50).forEach((n) => {
    const terminal = n % 10;
    stats.terminalFrequency[terminal] =
      (stats.terminalFrequency[terminal] || 0) + 1;
  });

  const lastTerminal = lastNum % 10;
  stats.lastTerminalGroup = lastTerminal.toString();
  if (history.length > 1 && history[1] % 10 === lastTerminal) {
    stats.terminalRepeat = true;
  }

  // --- 5. Detecção de Quebra Balística (O "Roubo") ---
  const currentQuebra = checkQuebraAt(0); // Quebra no último lance
  if (currentQuebra) {
    stats.quebraAlert = true;
    stats.quebraReason = "ROUBO DETECTADO: SALTO BRUSCO DO DEALER";
    // O alvo da quebra é o oposto exato do ponto onde a bola caiu
    stats.quebraTarget = ROULETTE_NUMBERS[(getIdx(history[0]) + 18) % 37];
  }

  // A VOLTA É CERTA: Se houve quebra há 1 ou 2 turnos atrás
  const recentQuebra =
    history.length >= 3 &&
    (checkQuebraAt(1) || (history.length >= 4 && checkQuebraAt(2)));

  // Counts definition was moved to top to prevent ReferenceError
  const counts: Record<number, number> = {};
  history.slice(0, 50).forEach((n) => (counts[n] = (counts[n] || 0) + 1));

  // --- Aggregation & Scoring ---
  let maxScore = 0;
  const scores: { num: number; score: number; reasons: string[] }[] =
    ROULETTE_NUMBERS.map((num) => ({ num, score: 0, reasons: [] }));

  scores.forEach((s) => {
    // CAMADA 1: Famílias (1, 4, 7)
    if (s.num % 3 === lastNum % 3) {
      s.score += 5;
    }

    // CAMADA 2: Espelhos e Setor Zero
    if (mirrors[s.num] === lastNum) {
      s.score += 15;
      s.reasons.push("Espelho");
    }
    if (s.num === 0 && history.includes(0) && history.indexOf(0) < 10) {
      s.score += 10;
      s.reasons.push("Setor Zero Ativo");
    }

    // CAMADA EXTRA: Camuflados (Soma de Dígitos)
    if (s.num !== lastNum && sumDigits(s.num) === sumDigits(lastNum)) {
      s.score += 8;
      s.reasons.push("Soma Camuflada");
    }
    if (stats.somaAlert && sumDigits(s.num) === stats.somaTargetSum && s.num !== lastNum) {
      s.score += 20;
      s.reasons.push(`Alerta de Soma (Soma ${stats.somaTargetSum})`);
    }

    // CAMADA 3: Calor e Momentum (Heatmap)
    const heat = history.slice(0, 15).filter((n) => n === s.num).length;
    if (heat > 1) {
      s.score += heat * 4;
      s.reasons.push("Momentum Quente");
    }

    // CAMADA 4: Momentum de Vizinhança
    const sIdx = getIdx(s.num);
    const vizinhosHits = history
      .slice(0, 10)
      .filter((n) => getDist(n, s.num) <= 2).length;
    if (vizinhosHits > 2) {
      s.score += vizinhosHits * 3;
      s.reasons.push("Momentum de Vizinhos");
    }

    // CAMADA 5: Neural Engine (Deep Learning Mock)
    if (s.num === history[3] || s.num === history[5]) {
      s.score += 7;
    }

    // CAMADA 6: Markov Chain & Third Number
    const mkv = markovSorted.find((m) => m.num === s.num);
    if (mkv) {
      s.score += mkv.count * 15;
      s.reasons.push("Memória Markov");
    }
    if (s.num === thirdNumberTarget) {
      s.score += 20;
      s.reasons.push("Trinômio Histórico (Third Number)");
    }

    // CAMADA 6.5: Time Mirror (Espelho Histórico Fuzzy)
    if (
      stats.timeMirrorAlert &&
      stats.timeMirrorTarget !== null &&
      getDist(stats.timeMirrorTarget, s.num) <= 1
    ) {
      s.score += 25;
      s.reasons.push("Espelho Temporal do Histórico");
    }

    // CAMADA 7: Sector Velocity & Momentum
    const lastSectorHitDist = getDist(s.num, lastNum);
    if (lastSectorHitDist > 10 && lastSectorHitDist < 15) {
      s.score += 5;
      s.reasons.push("Velocidade de Setor");
    }

    // CAMADA 8: Vizinhos Históricos
    const historyMates = history
      .slice(1, 20)
      .filter(
        (n, i) => history[i] === lastNum && history[i - 1] === s.num,
      ).length;
    if (historyMates > 0) {
      s.score += historyMates * 8;
      s.reasons.push("Parceiro Histórico");
    }

    // CAMADA 9: Vácuo Recorrente (Gap Analysis)
    if (gaps[s.num] > 30) {
      s.score += 15;
      s.reasons.push("Vácuo Alto");
    } else if (gaps[s.num] > 20) {
      s.score += 10;
    }

    // CAMADA 10: Sequence Analysis
    if (stats.sequenceAlert && stats.sequenceTarget === s.num) {
      s.score += 12;
      s.reasons.push("Alerta de Sequência");
    }

    // CAMADA 11: Table Heatmap
    if (counts[s.num] > 3) {
      s.score += 5;
      s.reasons.push("Mesa Quente");
    }

    // CAMADA 12: Historical Gap Pattern
    if (gaps[s.num] === gaps[lastNum]) {
      s.score += 4;
    }

    // CAMADA ZERO: Zero Vacuum Proxy
    if ((s.num === 10 || s.num === 20 || s.num === 30) && gaps[0] >= 20) {
      s.score += 15 + Math.floor(gaps[0] / 3);
      s.reasons.push(`Falso Zero (Zero ausente há ${gaps[0]})`);
    }

    // CAMADA 13: Dealer Signature
    if (history.length > 5) {
      const avgDealerDisplacement = Math.floor(
        (getDist(history[0], history[1]) + getDist(history[1], history[2])) / 2,
      );
      if (s.num !== lastNum) {
        const distToLast = getDist(lastNum, s.num);
        if (distToLast === avgDealerDisplacement) {
          let pts = 20;
          if (ballSize === "large") pts = 30;
          if (ballSize === "small") pts = 10;
          s.score += pts;
          s.reasons.push("Assinatura do Dealer");
        } else if (distToLast === avgDealerDisplacement + 1 || distToLast === avgDealerDisplacement + 2) {
          // Compensação de velocidade se a bola correr um pouco a mais
          let pts = 12;
          if (ballSize === "large") pts = 18;
          s.score += pts;
          s.reasons.push("Derrapagem Balística (Bola Rápida)");
        }
      }
    }

    // CAMADA 13.5: Ballistic Mode
    if (history.length > 2 && s.num !== lastNum) {
       const pastDist = getDist(history[1], history[0]);
       const currentDist = getDist(lastNum, s.num);
       if (currentDist === pastDist) {
         s.score += 15;
         s.reasons.push("Rastreamento Balístico");
       } else if (currentDist === pastDist + 1 || currentDist === pastDist + 2) {
         s.score += 8;
         s.reasons.push("Correção de Rastreamento (Desvio Leve)");
       }
    }

    // CAMADA 13.8: Ressonância Cinética (9 a 14 revoluções da bola)
    // Devido à física da roleta de 9-14 voltas, os saltos físicos se concentram
    // frequentemente numa janela de 9 a 14 casas de distância da última caçapa.
    if (history.length > 3) {
      const distS = getDist(lastNum, s.num);
      const isGoldenDrop = distS >= 9 && distS <= 14;
      const lastDist = getDist(history[0], history[1]);
      const prevDist = getDist(history[1], history[2]);

      if (
        isGoldenDrop &&
        lastDist >= 9 &&
        lastDist <= 14 &&
        prevDist >= 9 &&
        prevDist <= 14
      ) {
        let pts = 18;
        if (ballSize === "large") pts = 25;
        s.score += pts;
        s.reasons.push("Cinemática de Queda (9-14)");
      } else if (isGoldenDrop && lastDist >= 9 && lastDist <= 14) {
        let pts = 6;
        if (ballSize === "large") pts = 10;
        s.score += pts;
      }
    }

    // CAMADA 14: Z-Score (Estatística)
    const expected = history.length / 37;
    const actual = counts[s.num] || 0;
    if (actual > expected * 1.5) {
      s.score += 6;
      s.reasons.push("Anomalia Z-Score");
    }

    // CAMADA 15: Cluster Analysis
    const clusterScore = Math.abs(s.num - lastNum);
    if (s.num !== lastNum && clusterScore <= 3) {
      s.score += 5;
      s.reasons.push("Proximidade de Mesa");
    }

    // CAMADA 15.5: Momentum Inverso
    if (gaps[s.num] > 15 && gaps[s.num] < 20) {
      s.score += 6;
      s.reasons.push("Preparação Inversa");
    }

    // CAMADA 15.7: Sequencial Recognition
    if (s.num === lastNum + 1 || s.num === lastNum - 1) {
      s.score += 8;
      s.reasons.push("Escada Sequencial");
    }

    // CAMADA 15.9: Mirror Convergence
    if (
      stats.mirrorAlert &&
      stats.mirrorTarget &&
      getDist(stats.mirrorTarget, s.num) <= 1
    ) {
      s.score += 10;
      s.reasons.push("Atração Espelho");
    }

    // CAMADA 16: Chaos Index
    if (stats.dealerRhythm === "INSTÁVEL" && s.num > 15 && s.num < 25) {
      s.score += 4;
    } // Tendência de meio de tabela no caos

    // CAMADA 17: Cross-Terminal Convergence
    if (s.num !== lastNum && s.num % 10 === lastTerminal) {
      s.score += 10;
      s.reasons.push("Terminal Repetido");
    }

    // CAMADA 18: Approximation Engine
    if (history.length > 1 && Math.abs(s.num - history[1]) === 1) {
      s.score += 6;
    }

    // CAMADA 19: Short-Term Convergence
    if (s.num !== lastNum && history.slice(0, 3).includes(s.num)) {
      s.score += 3;
    }

    // CAMADA 20: Lei do Terceiro
    if (history.length >= 37 && !history.slice(0, 37).includes(s.num)) {
      s.score += 25;
      s.reasons.push("Lei do Terceiro (Ausente)");
    }

    // CAMADA 21: Pendulum Strike
    if (history.length >= 3) {
      const leftDist = getDist(history[0], history[1]);
      const expectedPendulum =
        ROULETTE_NUMBERS[(getIdx(history[0]) - leftDist + 37) % 37];
      if (s.num === expectedPendulum) {
        s.score += 12;
        s.reasons.push("Efeito Pêndulo");
      }
    }

    // CAMADA 22: Geometria de Mesa (Dúzias/Colunas)
    const duziaS = Math.min(Math.floor((s.num - 1) / 12), 2);
    const duziaL =
      lastNum === 0 ? -1 : Math.min(Math.floor((lastNum - 1) / 12), 2);
    if (s.num !== lastNum && duziaS === duziaL) {
      s.score += 3;
    }

    // CAMADA 23: Fibonacci Resonance
    const fibs = [1, 2, 3, 5, 8, 13, 21, 34];
    if (s.num !== lastNum && fibs.includes(s.num) && fibs.includes(lastNum)) {
      s.score += 4;
      s.reasons.push("Ressonância Fibonacci");
    }

    // CAMADA 24: Detector de Alternância
    const colorS = getNumberColor(s.num);
    const colorL = getNumberColor(lastNum);
    if (
      history.length > 2 &&
      getNumberColor(history[1]) !== colorL &&
      colorS !== colorL &&
      s.num !== 0
    ) {
      s.score += 5;
      s.reasons.push("Padrão Ping-Pong");
    }

    // CAMADA 25: Wheel Slice Analysis
    const isVoisins = [
      22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25,
    ].includes(s.num);
    const lastVoisins = [
      22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25,
    ].includes(lastNum);
    if (s.num !== lastNum && isVoisins && lastVoisins) {
      s.score += 4;
    }

    // CAMADA 26: Historical Mirroring
    if (history.length > 10 && history[9] === s.num) {
      s.score += 6;
      s.reasons.push("Eco de Décimo");
    }

    // CAMADA 27: Sector Transition Matrix
    if (stats.activeSector === stats.predictedSector && s.score > 20) {
      s.score += 8;
    }

    // CAMADA 28: Cross-Sector Terminal Break
    if (s.num % 10 !== lastTerminal && stats.terminalRepeat) {
      s.score += 2;
    } // Leve preferência para quebrar terminal se estava repetindo

    // CAMADA 31: Aceleração/Desaceleração do Rotor (Rotor Acceleration)
    if (history.length >= 4) {
      const d1 = getDist(history[1], history[0]); // distância do último giro
      const d2 = getDist(history[2], history[1]); // penúltimo
      const d3 = getDist(history[3], history[2]); // antepenúltimo
      
      const isDecelerating = d1 < d2 && d2 < d3;
      const isAccelerating = d1 > d2 && d2 > d3;
      
      if (isDecelerating || isAccelerating) {
        const expectedDist = isDecelerating ? d1 - Math.abs(d2 - d1) : d1 + Math.abs(d1 - d2);
        const thisDist = getDist(lastNum, s.num);
        if (Math.abs(thisDist - expectedDist) <= 2 || Math.abs(thisDist - (expectedDist + 37)) <= 2) {
           s.score += 4;
           s.reasons.push(isDecelerating ? "Desaceleração do Rotor" : "Aceleração do Rotor");
        }
      }
    }

    // CAMADA 32: Simetria Diametral (Acertos em áreas opostas)
    if (history.length > 2) {
      const d1 = getDist(history[1], history[0]);
      if (d1 >= 17 && d1 <= 20) {
        const thisDist = getDist(lastNum, s.num);
        if (thisDist >= 17 && thisDist <= 20) {
          s.score += 3;
          s.reasons.push("Eixo de Simetria Diametral");
        }
      }
    }

    // CAMADA 33: Tensão de Poisson (Extremos prestes a romper)
    if (gaps[s.num] > 45) {
      s.score += 3;
      s.reasons.push("Tensão Extrema de Poisson");
    }

    // CAMADA 34: Ondas de Frequência (Oscilação Maior/Menor)
    if (history.length > 3 && s.num !== 0) {
      const isHigh1 = history[0] >= 19;
      const isHigh2 = history[1] >= 19;
      const isHigh3 = history[2] >= 19;
      const thisIsHigh = s.num >= 19;
      
      // Se está vindo em padrão de onda: High, Low, High -> próximo Low
      if (isHigh1 !== isHigh2 && isHigh2 !== isHigh3) {
        if (thisIsHigh !== isHigh1) { // Continua a onda
          s.score += 2;
          s.reasons.push("Onda Oscilatória Maior/Menor");
        }
      }
    }

    // CAMADA 35: Atratores de Caos (Centro de gravidade físico)
    if (history.length >= 5) {
      // Pega os índices na roda dos ultimos 5
      const idxs = history.slice(0, 5).map(n => ROULETTE_NUMBERS.indexOf(n));
      const avgIdx = Math.floor(idxs.reduce((a, b) => a + b, 0) / 5);
      const targetByChaos = ROULETTE_NUMBERS[avgIdx % 37];
      if (getDist(targetByChaos, s.num) <= 2) {
        s.score += 4;
        s.reasons.push("Atrator de Caos Físico");
      }
    }

    // CAMADA 36: Atração Magnética de Vizinhos (Wheel Cluster Synergy)
    const wheelIdx = ROULETTE_NUMBERS.indexOf(s.num);
    const neighborsIdx = [
      (wheelIdx - 2 + 37) % 37,
      (wheelIdx - 1 + 37) % 37,
      (wheelIdx + 1) % 37,
      (wheelIdx + 2) % 37
    ];
    
    let magneticScore = 0;
    neighborsIdx.forEach(nIdx => {
      const neighbor = ROULETTE_NUMBERS[nIdx];
      const heat = history.slice(0, 15).filter((n) => n === neighbor).length;
      if (heat > 0) {
        magneticScore += heat * 2;
      }
      if (gaps[neighbor] > 25) {
        magneticScore += 1;
      }
    });

    if (magneticScore > 4) {
      s.score += Math.min(magneticScore, 6);
      s.reasons.push("Sinergia de Cluster Magnético");
    }

    // CAMADA 37: Espelho de Distância da Bola (Distance Mirror Pattern)
    if (history.length >= 3) {
      const getDirDist = (nNew: number, nOld: number) => {
        const idxNew = ROULETTE_NUMBERS.indexOf(nNew);
        const idxOld = ROULETTE_NUMBERS.indexOf(nOld);
        if (idxNew === -1 || idxOld === -1) return 0;
        return (idxNew - idxOld + 37) % 37;
      };

      const dist1 = getDirDist(history[0], history[1]); // Último pulo
      const dist2 = getDirDist(history[1], history[2]); // Penúltimo pulo

      if (dist1 > 0 && dist1 === dist2) {
        const thisDist = getDirDist(s.num, lastNum);
        if (thisDist === dist1) {
          s.score += 6;
          s.reasons.push(`Assinatura de Força: Salto de ${dist1} casas`);
        } else if (thisDist >= dist1 + 1 && thisDist <= dist1 + 3) {
          s.score += 4;
          s.reasons.push(`Escorregamento de Força (+${thisDist - dist1})`);
        }
      }
      
      // Checa também espelho absoluto se for diferente
      const abs1 = getDist(history[0], history[1]);
      const abs2 = getDist(history[1], history[2]);
      if (abs1 > 0 && abs1 === abs2) {
        const thisAbs = getDist(s.num, lastNum);
        if (thisAbs === abs1 && getDirDist(s.num, lastNum) !== dist1) {
          s.score += 4;
          s.reasons.push(`Assinatura de Força Absoluta: ${abs1} casas`);
        }
      }
    }

    // CAMADA 29: Neural-Markov Boost
    if (mkv && mkv.count > 1 && s.score > 30) {
      s.score += 15;
      s.reasons.push("Sinergia Neural");
    }

    // CAMADA 30: Super Convergence (O Alvo Final)
    if (stats.quebraAlert && stats.quebraTarget) {
      const distToOp = getDist(s.num, stats.quebraTarget);
      if (distToOp <= 2) {
        s.score += 35; // Compensação massiva
        s.reasons.push("Alvo de Compensação Pós-Quebra (Camada Suprema)");
      }
    }

    // Penalize repeating the exact same number unless it is extremely hot
    if (s.num === lastNum) {
      s.score -= 15;
    }

    if (s.score > maxScore) maxScore = s.score;
  });

  scores.sort((a, b) => b.score - a.score);

  // --- 6. Alerta Ômega (O Sniper) ---
  const best = scores[0];
  if (best && best.score >= 50) {
    stats.omegaAlert = true;
    stats.omegaTarget = best.num;
  }

  // Generate targets priority
  if (best) {
    targets = [best.num];
  }

  // --- Hierarquia de Sinalização e Confiança ---
  if (history.length < 28) {
    confidence = Math.floor((history.length / 28) * 50);
    playSignal = "red";
    biasMessage = `FASE DE GERMINAÇÃO: COLETANDO DADOS (${history.length}/28)`;
    targets = [];
    stats.omegaAlert = false;
    stats.omegaTarget = null;
    stats.sequenceAlert = false;
    stats.sequenceTarget = null;
    stats.quebraAlert = false;
    stats.quebraTarget = null;
    stats.zoneBiasAlert = false;
    stats.zoneBiasTarget = "";
  } else {
    // Calculo base de confiança
    confidence = Math.min(Math.round((best.score / 80) * 100) + 30, 99);

    if (stats.omegaAlert) {
      confidence = Math.min(confidence + 15, 99);
    }

    if (recentQuebra) {
      // Sinal Verde Máximo: Defasagem física acumulada pós-quebra (A Volta É Certa)
      playSignal = "green";
      confidence = Math.max(confidence, 90);
      biasMessage = "ENTRADA CONFIRMADA (CORREÇÃO DE ROUBO)";
      targets = targets; // mantém os alvos da compensação
    } else if (stats.omegaAlert || confidence >= 80) {
      // Sinal Amarelo
      playSignal = "yellow";
      biasMessage = stats.omegaAlert
        ? `ALERTA ÔMEGA: ATENÇÃO AO ${stats.omegaTarget}`
        : "ATENÇÃO: PADRÕES SE FORMANDO";
    } else {
      // Sinal Vermelho
      playSignal = "red";
      biasMessage = stats.quebraAlert
        ? "ROUBO DETECTADO: RECALIBRANDO"
        : "AGUARDE: PADRÃO INSTÁVEL";
    }
  }

  // Sector formatting (Mock for UI)
  const sectors = ["Voisins", "Orphelins", "Tiers", "Jeu Zero"];
  stats.activeSector = sectors[Math.floor(Math.random() * sectors.length)];
  stats.predictedSector =
    sectors[(sectors.indexOf(stats.activeSector) + 1) % sectors.length];
  stats.sectorConfidence = confidence / 100;

  // Dealer Rhythm (Variance in displacement)
  if (history.length > 5) {
    let vars = 0;
    for (let i = 1; i < 5; i++)
      vars += Math.abs(
        getDist(history[0], history[1]) - getDist(history[i], history[i + 1]),
      );
    stats.dealerRhythm = vars / 4 < 5 ? "ESTÁVEL" : "INSTÁVEL";
  } else {
    stats.dealerRhythm = "CALIBRANDO";
  }

  stats.biasDetected = best && best.score > 70;
  if (stats.biasDetected) {
    stats.biasTarget = best.num;
  }

  // Pattern message
  if (stats.quebraAlert) stats.lastPattern = "ANTI-REPETIÇÃO BA";
  else if (stats.omegaAlert) stats.lastPattern = "CONVERGÊNCIA MAX";
  else if (stats.mirrorAlert) stats.lastPattern = "ESPELHO NUMERICO";
  else if (stats.terminalRepeat) stats.lastPattern = "TERMINAL DUPLO";
  else if (stats.sequenceAlert) stats.lastPattern = "MARKOV SEQUENCE";
  else stats.lastPattern = "VARREDURA NORMAL";

  // Hot numbers
  stats.hotNumbers = Object.entries(counts)
    .map(([num, count]) => ({ num: parseInt(num), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Color tendency
  const recent = history.slice(0, 20);
  let r = 0,
    b = 0,
    g = 0;
  recent.forEach((n) => {
    const c = getNumberColor(n);
    if (c === "red") r++;
    else if (c === "black") b++;
    else g++;
  });
  stats.colorTendency = {
    red: Math.round((r / recent.length) * 100) || 0,
    black: Math.round((b / recent.length) * 100) || 0,
    green: Math.round((g / recent.length) * 100) || 0,
  };

  // Recent Prob
  const maxProbScore = maxScore > 0 ? maxScore : 1;
  stats.recentProbabilities = scores.slice(0, 10).map((s) => ({
    num: s.num,
    probability: Math.min(Math.round((s.score / maxProbScore) * 100), 100),
  }));

  // Sector Bias Formatting
  const sectorDefs = {
    Voisins: [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25],
    Orphelins: [1, 20, 14, 31, 9, 17, 34, 6],
    Tiers: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
    "Jeu Zero": [12, 35, 3, 26, 0, 32, 15],
  };

  const recentDrawsForSector = history.slice(0, 15);
  let totalValidDraws = recentDrawsForSector.length;

  stats.sectorBias = Object.entries(sectorDefs).map(([sectorName, nums]) => {
    const frequency = recentDrawsForSector.filter((n) =>
      nums.includes(n),
    ).length;
    const percentage =
      totalValidDraws > 0 ? Math.round((frequency / totalValidDraws) * 100) : 0;

    // Find hot numbers in this sector
    const sectorHotNumbers = Object.entries(counts)
      .filter(([num, _]) => nums.includes(parseInt(num)))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => parseInt(entry[0]));

    return {
      sector: sectorName,
      frequency,
      percentage,
      hotNumbers: sectorHotNumbers,
    };
  });

  const biggestBias = stats.sectorBias
    .filter((s) => s.sector !== "Jeu Zero")
    .sort((a, b) => b.percentage - a.percentage)[0];
  if (biggestBias && biggestBias.percentage >= 55) {
    stats.zoneBiasAlert = true;
    stats.zoneBiasTarget = biggestBias.sector;
    if (!stats.quebraAlert && !stats.omegaAlert) {
      biasMessage = `VIÉS DE ZONA: TENDÊNCIA MASSIVA EM ${stats.zoneBiasTarget.toUpperCase()}`;
      playSignal = "yellow";
    }
  }

  // --- 8. Expansão de Alvos Básica (1 vizinho) ---
  let primaryTargets = [...targets];
  if (stats.omegaAlert && stats.omegaTarget !== null) {
    primaryTargets.push(stats.omegaTarget);
  }
  if (stats.sequenceAlert && stats.sequenceTarget !== null) {
    primaryTargets.push(stats.sequenceTarget);
  }
  if (stats.quebraAlert && stats.quebraTarget !== null) {
    primaryTargets.push(stats.quebraTarget);
  }

  primaryTargets = Array.from(new Set(primaryTargets));
  
  const expandedTargets = new Set<number>(primaryTargets);
  primaryTargets.forEach((num) => {
    const idx = ROULETTE_NUMBERS.indexOf(num);
    const isThisOmega = stats.omegaAlert && stats.omegaTarget === num;

    // Se for Alvo Ômega (azul), ganha 3 vizinhos para cada lado
    if (isThisOmega) {
      for (let offset = 1; offset <= 3; offset++) {
        expandedTargets.add(ROULETTE_NUMBERS[(idx + offset) % 37]);
        expandedTargets.add(ROULETTE_NUMBERS[(idx - offset + 37) % 37]);
      }
    } else {
      // Adiciona 1 vizinho de cada lado por padrão para os alvos normais
      expandedTargets.add(ROULETTE_NUMBERS[(idx + 1) % 37]);
      expandedTargets.add(ROULETTE_NUMBERS[(idx - 1 + 37) % 37]);
      
      // Se a bola for pequena, pula muito, então adiciona 2 vizinhos
      if (ballSize === "small") {
        expandedTargets.add(ROULETTE_NUMBERS[(idx + 2) % 37]);
        expandedTargets.add(ROULETTE_NUMBERS[(idx - 2 + 37) % 37]);
      }
    }
  });

  targets = Array.from(expandedTargets);

  // --- 9. Espelhos Diretos ---
  // Adiciona o espelho correspondente sem adicionar vizinhos a ele
  const directMirrors: Record<number, number> = {
    12: 21,
    21: 12,
    32: 23,
    23: 32,
    16: 19,
    19: 16,
    6: 9,
    9: 6,
    31: 13,
    13: 31,
  };

  const finalTargets = new Set(targets);
  let hasZeroGroup = false;
  const zeroGroup = [0, 10, 20, 30];

  targets.forEach((num) => {
    if (directMirrors[num] !== undefined) {
      finalTargets.add(directMirrors[num]);
    }
    if (zeroGroup.includes(num)) {
      hasZeroGroup = true;
    }
  });

  if (hasZeroGroup) {
    zeroGroup.forEach(z => finalTargets.add(z));
  }

  targets = Array.from(finalTargets);

  // --- NEW: Análises Detalhadas (Dúzias, Colunas, Cores e Assinatura) ---
  if (!isRecursive && history.length > 0) {
    // 1. Sleeping Dozens & Columns
    const dozenSleep: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    const colSleep: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

    [1, 2, 3].forEach((d) => {
      const idx = history.findIndex(
        (num) => num !== 0 && Math.ceil(num / 12) === d,
      );
      dozenSleep[d] = idx === -1 ? history.length : idx;
    });
    [1, 2, 3].forEach((c) => {
      const idx = history.findIndex(
        (num) => num !== 0 && ((num - 1) % 3) + 1 === c,
      );
      colSleep[c] = idx === -1 ? history.length : idx;
    });

    const topSleepDozen = Object.entries(dozenSleep).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const topSleepCol = Object.entries(colSleep).sort((a, b) => b[1] - a[1])[0];

    if (topSleepDozen && topSleepDozen[1] > 6) {
      stats.sleepingDozen = parseInt(topSleepDozen[0]);
      stats.sleepingDozenCount = topSleepDozen[1];
    }
    if (topSleepCol && topSleepCol[1] > 6) {
      stats.sleepingColumn = parseInt(topSleepCol[0]);
      stats.sleepingColumnCount = topSleepCol[1];
    }

    // 2. Color Streak e Alternating Colors
    let alternatingCount = 0;
    if (history.length >= 2) {
      for (let i = 0; i < history.length - 1; i++) {
        const c1 = getNumberColor(history[i]);
        const c2 = getNumberColor(history[i + 1]);
        if (c1 !== "green" && c2 !== "green" && c1 !== c2) {
          alternatingCount++;
        } else {
          break;
        }
      }
    }
    if (alternatingCount >= 3) {
      stats.alternatingColorPattern = true;
    }

    let streakCount = 1;
    const firstColor = getNumberColor(history[0]);
    if (firstColor !== "green") {
      for (let i = 1; i < history.length; i++) {
        if (getNumberColor(history[i]) === firstColor) {
          streakCount++;
        } else {
          break;
        }
      }
    }
    stats.colorStreak = streakCount;

    // 3. Dealer Signature Cluster (Consistência no Arremesso)
    if (history.length >= 4) {
      const j1 = getDist(history[0], history[1]);
      const j2 = getDist(history[1], history[2]);
      const j3 = getDist(history[2], history[3]);
      const avgJump = (j1 + j2 + j3) / 3;
      const dev =
        Math.abs(j1 - avgJump) +
        Math.abs(j2 - avgJump) +
        Math.abs(j3 - avgJump);
      if (dev < 4 && avgJump > 0) {
        const avgJumpRounded = Math.round(avgJump);
        const lastIdx = getIdx(history[0]);
        const targetLeft = ROULETTE_NUMBERS[(lastIdx - avgJumpRounded + 37) % 37];
        const targetRight = ROULETTE_NUMBERS[(lastIdx + avgJumpRounded) % 37];
        
        stats.signatureClusterAlert = true;
        stats.signatureClusterTarget = `LÂMINA A ${Math.round(avgJump)} CASAS (Alvos: ${targetLeft} e ${targetRight})`;
      }
    }
    // 4. Padrão de Roubo / Sniper Gap
    if (history.length > 5) {
      const getVisualTargets = (tgts: number[]) => {
        const visual = new Set<number>();
        const m: Record<number, number> = { 12: 21, 21: 12, 13: 31, 31: 13, 23: 32, 32: 23, 16: 19, 19: 16, 6: 9, 9: 6 };
        tgts.forEach((t) => {
          const mirrors = m[t] !== undefined ? [t, m[t]] : [t];
          mirrors.forEach((mNum) => {
             const idx = getIdx(mNum);
             visual.add(ROULETTE_NUMBERS[(idx - 1 + 37) % 37]);
             visual.add(mNum);
             visual.add(ROULETTE_NUMBERS[(idx + 1) % 37]);
          });
        });
        return Array.from(visual);
      };

      const isRobbery = (hit: number, tgts: number[]) => {
        const visualT = getVisualTargets(tgts);
        if (visualT.includes(hit)) return false;
        const hitIdx = getIdx(hit);
        const leftTarget = ROULETTE_NUMBERS[(hitIdx - 1 + 37) % 37];
        const rightTarget = ROULETTE_NUMBERS[(hitIdx + 1) % 37];
        return visualT.includes(leftTarget) && visualT.includes(rightTarget); // Exatamente distância de 1 casa (acendido na roleta)
      };

      let robberyCount = 0;
      for (let i = 0; i < Math.min(3, history.length - 2); i++) {
        const pHist = history.slice(i + 1);
        if (pHist.length > 4) {
          const pAnalysis = analyzeHistory(pHist, true, ballSize);
          if (isRobbery(history[i], pAnalysis.targets)) {
            robberyCount++;
          }
        }
      }

      stats.robberyRecentCount = robberyCount;
      if (robberyCount > 0) {
        stats.robberyAlert = true;
        const gaps: number[] = [];
        ROULETTE_NUMBERS.forEach((num) => {
          if (isRobbery(num, targets)) {
            gaps.push(num);
          }
        });
        stats.robberyGaps = gaps;
        if (gaps.length > 0) {
          gaps.forEach((g) => {
            if (!targets.includes(g)) targets.push(g);
          });
        }
      }
    }
  }
  if (!isRecursive && history.length >= 28) {
    let winsCount = 0;
    let lossesCount = 0;
    let hitSequence: boolean[] = [];

    // Evaluate last 10 rounds for win/loss
    const maxLookback = Math.min(10, history.length - 1);
    for (let i = 0; i < maxLookback; i++) {
      const resultNumber = history[i];
      const prevHistory = history.slice(i + 1);
      if (prevHistory.length > 5) {
        const pastAnalysis = analyzeHistory(prevHistory, true, ballSize);
        const hit =
          pastAnalysis.targets.includes(resultNumber) ||
          pastAnalysis.stats.omegaTarget === resultNumber ||
          pastAnalysis.stats.quebraTarget === resultNumber;
        
        hitSequence.push(hit);
        if (hit) winsCount++;
        else lossesCount++;
      }
    }

    const winRate = winsCount / (winsCount + lossesCount) || 0;
    stats.winRate = Math.round(winRate * 100);
    stats.winsCount = winsCount;
    stats.lossesCount = lossesCount;
    
    let isStealingPhase = false;
    // Se o aplicativo errou os últimos 2 ou 3 giros, mas vinha de acertos antes
    if (hitSequence.length >= 4) {
       // Errou os últimos 2
       if (!hitSequence[0] && !hitSequence[1]) {
           // Checa se dos giros anteriores tinha pelo menos 2 acertos
           const olderHits = hitSequence.slice(2).filter(h => h).length;
           if (olderHits >= 1) { // Estava pagando e agora fez sequência de 2 buracos
               isStealingPhase = true;
           }
       }
       // Ou errou 3 seguidos garantido
       if (!hitSequence[0] && !hitSequence[1] && !hitSequence[2]) {
           isStealingPhase = true;
       }
    }

    // Calculate simple entropy based on distance spread
    let distanceChanges = 0;
    for (let i = 0; i < maxLookback - 1; i++) {
      const n1 = history[i];
      const n2 = history[i + 1];
      const n3 = history[i + 2];
      if (n1 !== undefined && n2 !== undefined && n3 !== undefined) {
        const dist1 = getDist(n2, n1);
        const dist2 = getDist(n3, n2);
        if (Math.abs(dist1 - dist2) > 10) {
          distanceChanges++;
        }
      }
    }
    const baseEntropy = Math.round((distanceChanges / maxLookback) * 100);
    const entropyLevel = Math.min(100, baseEntropy + lossesCount * 5);
    stats.entropyLevel = entropyLevel;

    if (entropyLevel >= 70 && stats.winRate <= 30) {
      stats.crazyTable = true;
    }

    // --- Sinergia com Fase de Recolhimento e Mesa Maluca ---
    if ((isStealingPhase || stats.crazyTable) && scores) {
      stats.stealingPhaseAlert = true;
      const hole = scores[scores.length - 1].num; // Pega o buraco mais profundo
      
      // Se tiver anomalia balística mesmo em fase ruim, confia no sinal verde
      if (stats.crazyTable && (stats.omegaAlert || stats.quebraAlert)) {
        playSignal = "green";
        confidence = Math.max(confidence, 99);
        biasMessage = "ANOMALIA BALÍSTICA NA FASE DE RECOLHIMENTO (ALTA CONFIANÇA)";
      } else {
        stats.omegaAlert = true;
        stats.omegaTarget = hole;
        targets = [hole];
        playSignal = "yellow";
        confidence = 75;
        biasMessage = "FASE DE RECOLHIMENTO (INVERSÃO ATIVADA NO BURACO MAIS PROFUNDO)";
      }
    }
  }

  // --- Lógica de Continuidade / "A Volta Sempre Paga" ---
  // Se não estamos em uma análise recursiva e já temos dados suficientes
  if (!isRecursive && history.length > 28) {
    const prevAnalysis = analyzeHistory(history.slice(1), true, ballSize);

    // Lógicas de Sinal de win/loss da análise anterior
    if (
      prevAnalysis.playSignal === "green" ||
      prevAnalysis.playSignal === "yellow"
    ) {
      const lastHit = prevAnalysis.targets.includes(history[0]);

      if (lastHit) {
        // Se bater na próxima rodada fica amarelo pq ja bateu uma vez
        playSignal = "yellow";
        confidence = Math.min(confidence, 75); // Confidence shouldn't be 95 anymore
        if (!stats.crazyTable) {
          biasMessage = "GREEN ANTERIOR: SINAL AMARELO (JÁ BATEU UMA VEZ)";
        }
      } else {
        // Se não bater na próxima rodada fica verde pq a volta e certa
        playSignal = "green";
        confidence = Math.max(confidence, 95);
        if (!stats.crazyTable) {
          biasMessage = "RED DA ANTERIOR: SINAL VERDE (A VOLTA SEMPRE PAGA)";
        }
      }

      // Mantém os alvos da análise anterior se não houver novos ou se os novos foram apagados pela mesa maluca,
      // desde que a gente ainda queira mostrar targets (se a mesa maluca não bloqueou o green/yellow)
      if (targets.length === 0 && prevAnalysis.targets.length > 0) {
        targets = [...prevAnalysis.targets];
      }
    }
  }

  return { targets, biasMessage, stats, confidence, playSignal };
}
