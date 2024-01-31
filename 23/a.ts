import { stat } from 'fs';
import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode23 {
  class Coord {
    constructor(public x: number, public y: number) {}

    toString(): string {
      return `${this.x},${this.y}`;
    }
  }

  function logMap() {
    for (let y = -5; y <= 10; y++) {
      let row: string[] = [];
      for (let x = -5; x <= 10; x++) {
        row.push(coords.has(`${x},${y}`) ? '#' : '.');
      }
      console.log(row.join(''));
    }
  }

  function getInitialCoords(): Map<string, string> {
    const coords: Map<string, string> = new Map();
    getInput(fileName).map((row, y) => {
      row.split('').forEach((val, x) => {
        if (val === '#') coords.set(new Coord(x, y).toString(), '');
      });
    });
    return coords;
  }

  const getRes23a = (): number => {
    let minX: number = 9999999;
    let maxX: number = -9999999;
    let minY: number = 9999999;
    let maxY: number = -999999;
    [...coords.keys()].forEach((coord) => {
      const [x, y] = coord.split(',').map((n) => parseInt(n));
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    return (maxX - minX + 1) * (maxY - minY + 1) - coords.size;
  };

  const isTestInput = false;
  const fileName = isTestInput ? './23/input-example.txt' : './23/input.txt';

  let coords = getInitialCoords();
  //logMap();
  const allDirs: ('N' | 'S' | 'W' | 'E')[] = [
    'N',
    'S',
    'W',
    'E',
    'N',
    'S',
    'W',
  ];

  let i = 0;
  while (true) {
    const dirs = allDirs.slice(i % 4, (i % 4) + 4);
    if (i === 10) {
      console.log(`Result of 23a: ${getRes23a()}`);
    }
    i++;
    [...coords.keys()].forEach((coord) => {
      dirs.forEach((dir) => {
        if (coords.get(coord)) return;
        const [x, y] = coord.split(',').map((n) => parseInt(n));
        const surrCoords = [
          `${x - 1},${y - 1}`,
          `${x},${y - 1}`,
          `${x + 1},${y - 1}`,
          `${x - 1},${y}`,
          `${x + 1},${y}`,
          `${x - 1},${y + 1}`,
          `${x},${y + 1}`,
          `${x + 1},${y + 1}`,
        ];
        if (!surrCoords.some((c) => coords.has(c))) return;

        let checkCoords: string[];
        if (dir === 'N' || dir === 'S') {
          checkCoords = [x - 1, x, x + 1].map(
            (_x) => `${_x},${dir === 'N' ? y - 1 : y + 1}`
          );
        } else {
          checkCoords = [y - 1, y, y + 1].map(
            (_y) => `${dir === 'W' ? x - 1 : x + 1},${_y}`
          );
        }
        if (!checkCoords.some((c) => coords.has(c))) {
          coords.set(coord, checkCoords[1]);
        }
      });
    });

    let anyElfHasMoved = false;
    const newCoords: Map<string, string> = new Map();
    [...coords.entries()].forEach((coordEntry) => {
      const [fromCoord, toCoord] = coordEntry;
      if (!toCoord) newCoords.set(fromCoord, '');
      else {
        const oneExists =
          [...coords.values()].filter((tc) => tc === toCoord).length === 1;
        if (oneExists) {
          anyElfHasMoved = true;
          newCoords.set(toCoord, '');
        } else {
          newCoords.set(fromCoord, '');
        }
      }
    });
    coords = newCoords;
    if (!anyElfHasMoved) {
      console.log(`Result of 23b: ${i}`);
      break;
    }
  }
}
