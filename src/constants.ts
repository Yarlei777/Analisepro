export const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
export const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
export const getNumberColor = (num: number) => {
  if (num === 0) return "green";
  return RED_NUMBERS.includes(num) ? "red" : "black";
};

export const getMirrors = (n: number) => {
  const m: Record<number, number> = {
    12: 21,
    21: 12,
    13: 31,
    31: 13,
    23: 32,
    32: 23,
    16: 19,
    19: 16,
    6: 9,
    9: 6,
  };
  return m[n] !== undefined ? [n, m[n]] : [n];
};

export const getNeighbors = (n: number, count: number = 1) => {
  const idx = ROULETTE_NUMBERS.indexOf(n);
  if (idx === -1) return [n];
  const neighbors = [];
  for (let i = -count; i <= count; i++) {
    neighbors.push(
      ROULETTE_NUMBERS[
        (idx + i + ROULETTE_NUMBERS.length) % ROULETTE_NUMBERS.length
      ],
    );
  }
  return neighbors;
};

export const AI_LAYERS = [
  { id: 1, name: "Famílias (1, 4, 7)", type: "standard" },
  { id: 2, name: "Espelhos e Setor Zero", type: "standard" },
  { id: "EXT", name: "Camuflados", type: "standard" },
  { id: "CALL", name: "Chamadas Frequentes", type: "standard" },
  { id: 3, name: "Calor e Momentum", type: "standard" },
  { id: 4, name: "Momentum de Vizinhança", type: "standard" },
  { id: 5, name: "Neural Engine", type: "neural" },
  { id: 6, name: "Markov Chain & 3rd", type: "neural" },
  { id: "6.5", name: "Time Mirror", type: "neural" },
  { id: 7, name: "Sector Velocity", type: "standard" },
  { id: 8, name: "Vizinhos Históricos", type: "standard" },
  { id: 9, name: "Vácuo Recorrente", type: "standard" },
  { id: 10, name: "Sequence Analysis", type: "standard" },
  { id: 11, name: "Table Heatmap", type: "standard" },
  { id: 12, name: "Historical Gap Pattern", type: "standard" },
  { id: "ZRO", name: "Zero Vacuum Proxy", type: "extreme" },
  { id: 13, name: "Dealer Signature", type: "neural" },
  { id: "13.5", name: "Ballistic Mode", type: "neural" },
  { id: "13.8", name: "Ressonância Cinética", type: "extreme" },
  { id: 14, name: "Z-Score", type: "standard" },
  { id: 15, name: "Cluster Analysis", type: "standard" },
  { id: "15.5", name: "Momentum Inverso", type: "standard" },
  { id: "15.7", name: "Sequencial Recognition", type: "neural" },
  { id: "15.9", name: "Mirror Convergence", type: "standard" },
  { id: 16, name: "Chaos Index", type: "extreme" },
  { id: 17, name: "Cross-Terminal", type: "standard" },
  { id: 18, name: "Approximation Engine", type: "standard" },
  { id: 19, name: "Short-Term Conv.", type: "standard" },
  { id: 20, name: "Lei do Terceiro", type: "standard" },
  { id: 21, name: "Pendulum Strike", type: "neural" },
  { id: 22, name: "Table Geometry", type: "standard" },
  { id: 23, name: "Fibonacci Resonance", type: "extreme" },
  { id: 24, name: "Alternation Detector", type: "standard" },
  { id: 25, name: "Wheel Slice Analysis", type: "standard" },
  { id: 26, name: "Historical Mirroring", type: "standard" },
  { id: 27, name: "Sector Matrix", type: "neural" },
  { id: 28, name: "Cross-Sector Term", type: "standard" },
  { id: 29, name: "Neural-Markov Boost", type: "extreme" },
  { id: 30, name: "Super Convergence", type: "omega" },
  { id: 31, name: "Rotor Acceleration", type: "standard" },
  { id: 32, name: "Simetria Diametral", type: "neural" },
  { id: 33, name: "Tensão de Poisson", type: "extreme" },
  { id: 34, name: "Ondas de Frequência", type: "standard" },
  { id: 35, name: "Atratores de Caos", type: "neural" },
  { id: 36, name: "Atração Magnética", type: "omega" },
  { id: 37, name: "Distance Mirror", type: "neural" },
  { id: 38, name: "Padrão de Duplo", type: "standard" },
  { id: 39, name: "Sequência Ocorrência", type: "omega" },
];
