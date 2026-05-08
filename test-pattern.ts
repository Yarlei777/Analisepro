const fullMirrors: Record<number, number> = {
  12: 21, 21: 12,
  13: 31, 31: 13,
  23: 32, 32: 23,
  6: 9, 9: 6,
  16: 19, 19: 16,
  26: 29, 29: 26,
};

function getEquivs(n: number): number[] {
  return fullMirrors[n] !== undefined ? [n, fullMirrors[n]] : [n];
}

function findPattern(history: number[]) {
  if (history.length < 7) return null;
  const curr = history.slice(0, 3);
  
  const alerts: any[] = [];

  for (let i = 1; i <= history.length - 4; i++) {
    const window = history.slice(i, i + 4);
    
    let matchedIndices = new Set<number>();
    let allMatched = true;
    for (let c of curr) {
      const equivs = getEquivs(c);
      let foundMatch = false;
      for (let j = 0; j < 4; j++) {
        if (!matchedIndices.has(j) && equivs.includes(window[j])) {
          matchedIndices.add(j);
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
         allMatched = false;
         break;
      }
    }
    
    if (allMatched && matchedIndices.size === 3) {
       let targetIndex = -1;
       for (let j = 0; j < 4; j++) {
          if (!matchedIndices.has(j)) {
             targetIndex = j;
             break;
          }
       }
       if (targetIndex !== -1) {
          alerts.push({
             window,
             target: window[targetIndex],
             index: i
          });
       }
    }
  }
  return alerts;
}

const h = [10, 26, 9,  10, 0, 5, 29, 6, 10]; // last 3 are 10,26,9. Mirror of 26 is 29, mirror of 9 is 6. Window [10, 29, 6, 10] at the end should match!
console.log("Current:", h.slice(0, 3));
console.log(findPattern(h));
