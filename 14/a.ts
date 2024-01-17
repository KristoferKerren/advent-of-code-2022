import { get } from 'http';
import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode14 {
  function getLines(): { map: Map<string, 'rock' | 'sand'>; maxY: number } {
    const map: Map<string, 'rock' | 'sand'> = new Map();
    let maxY = 0;
    getInput(fileName).forEach((row, i) => {
      const rockCoords = row.split(' -> ');
      rockCoords.forEach((rockCoord, i) => {
        if (i === 0) return;
        const [x1, y1] = rockCoord.split(',').map((nbr) => parseInt(nbr));
        const [x2, y2] = rockCoords[i - 1]
          .split(',')
          .map((nbr) => parseInt(nbr));
        maxY = Math.max(maxY, y1, y2);
        if (y1 === y2) {
          for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            map.set(`${x},${y1}`, 'rock');
          }
        }
        if (x1 === x2) {
          for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            map.set(`${x1},${y}`, 'rock');
          }
        }
      });
    });
    return { map, maxY };
  }

  const getNextCoord = (
    coord: string,
    maxY: number,
    maxYIsFloor: boolean = false
  ): string | null => {
    const [x, y] = coord.split(',').map((nr) => parseInt(nr));
    if (y === maxY) {
      return maxYIsFloor ? coord : null;
    }
    if (!map.get(`${x},${y + 1}`)) {
      return getNextCoord(`${x},${y + 1}`, maxY, maxYIsFloor);
    }
    if (!map.get(`${x - 1},${y + 1}`)) {
      return getNextCoord(`${x - 1},${y + 1}`, maxY, maxYIsFloor);
    }
    if (!map.get(`${x + 1},${y + 1}`)) {
      return getNextCoord(`${x + 1},${y + 1}`, maxY, maxYIsFloor);
    }
    return coord;
  };

  const isTestInput = false;
  const fileName = isTestInput ? './14/input-example.txt' : './14/input.txt';

  const [startX, startY] = [500, 0];

  // Solve 14a:
  let { map, maxY } = getLines();
  let count14a = 0;
  let nextSantCoord = getNextCoord(`${startX},${startY}`, maxY, false);
  while (nextSantCoord !== null) {
    map.set(nextSantCoord, 'sand');
    count14a++;
    nextSantCoord = getNextCoord(`${startX},${startY}`, maxY, false);
  }
  console.log(count14a);

  // Solve 14b:
  map = getLines().map;
  let count14b = 1;
  nextSantCoord = getNextCoord(`${startX},${startY - 1}`, maxY + 1, true);
  while (nextSantCoord !== `${startX},${startY}`) {
    map.set(nextSantCoord!, 'sand');
    count14b++;
    nextSantCoord = getNextCoord(`${startX},${startY - 1}`, maxY + 1, true);
  }
  console.log(count14b);
}
