import { stat } from 'fs';
import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode24 {
  class Blizzard {
    constructor(
      public x: number,
      public y: number,
      public dir: 'up' | 'right' | 'down' | 'left'
    ) {}

    toString(): string {
      return `${this.x},${this.y}`;
    }
  }

  function logMap(currentX: number, currentY: number) {
    console.log('\n');
    for (let y = 0; y <= maxY; y++) {
      let row: string[] = [];
      for (let x = 0; x <= maxX; x++) {
        if (x === currentX && y === currentY) row.push('E');
        else if (y === 0) row.push(x === 1 ? '.' : '#');
        else if (y === maxY) row.push(x === maxX - 1 ? '.' : '#');
        else if (x === 0 || x === maxX) row.push('#');
        else {
          const nbrOfBlizzards = blizzards.filter(
            (b) => b.x === x && b.y === y
          ).length;
          if (nbrOfBlizzards === 0) row.push('.');
          else if (nbrOfBlizzards > 1) row.push(`${nbrOfBlizzards}`);
          else {
            const dir = blizzards.find((b) => b.x === x && b.y === y)!.dir;
            if (dir === 'up') row.push('^');
            if (dir === 'right') row.push('>');
            if (dir === 'down') row.push('v');
            if (dir === 'left') row.push('<');
          }
        }
      }
      console.log(row.join(''));
    }
    console.log('\n');
  }

  function getBlizzards(): {
    blizzards: Blizzard[];
    maxX: number;
    maxY: number;
  } {
    let maxY = -1;
    let maxX = -1;
    const blizzards: Blizzard[] = [];
    getInput(fileName).map((row, y) => {
      maxY++;
      maxX = -1;
      row.split('').forEach((val, x) => {
        maxX++;
        if (val === '^') blizzards.push(new Blizzard(x, y, 'up'));
        else if (val === '>') blizzards.push(new Blizzard(x, y, 'right'));
        else if (val === 'v') blizzards.push(new Blizzard(x, y, 'down'));
        else if (val === '<') blizzards.push(new Blizzard(x, y, 'left'));
      });
    });
    return { blizzards, maxX, maxY };
  }

  function takeStep() {
    blizzards.forEach((b) => {
      if (b.dir === 'up') {
        b.y--;
        if (b.y === 0) b.y = maxY - 1;
      } else if (b.dir === 'right') {
        b.x++;
        if (b.x === maxX) b.x = 1;
      } else if (b.dir === 'down') {
        b.y++;
        if (b.y === maxY) b.y = 1;
      } else if (b.dir === 'left') {
        b.x--;
        if (b.x === 0) b.x = maxX - 1;
      }
    });
  }

  const isAvailable = (
    x: number,
    y: number,
    addedCoords: string[],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    if (x === startX && y === startY) return true;
    if (x === endX && y === endY) return true;
    if (y <= 0 || x <= 0 || x >= maxX || y >= maxY) return false;
    if (addedCoords.includes(`${x},${y}`)) return false;
    const isAvailable = !blizzards.some((b) => b.x === x && b.y === y);
    if (isAvailable) addedCoords.push(`${x},${y}`);
    return isAvailable;
  };

  function getMinSteps(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): number {
    let paths: string[][] = [];
    paths.push([`${startX},${startY},start`]);
    let isFinished = false;
    let count = 0;

    while (!isFinished && count < 1000) {
      count++;
      takeStep();

      let addedCoords: string[] = [];
      const pathLenght = paths.length;
      for (let i = 0; i < pathLenght; i++) {
        const path = paths.shift()!;
        const [cX, cY] = path
          .at(-1)!
          .split(',')
          .map((c) => parseInt(c));

        if (cX === endX && cY === endY) {
          isFinished = true;
          return path.length - 1;
        }

        if (isAvailable(cX, cY + 1, addedCoords, startX, startY, endX, endY)) {
          paths.push([...path, `${cX},${cY + 1},down`]);
        }
        if (isAvailable(cX + 1, cY, addedCoords, startX, startY, endX, endY)) {
          paths.push([...path, `${cX + 1},${cY},right`]);
        }
        if (isAvailable(cX, cY, addedCoords, startX, startY, endX, endY)) {
          paths.push([...path, `${cX},${cY},wait`]);
        }
        if (isAvailable(cX - 1, cY, addedCoords, startX, startY, endX, endY)) {
          paths.push([...path, `${cX - 1},${cY},left`]);
        }
        if (isAvailable(cX, cY - 1, addedCoords, startX, startY, endX, endY)) {
          paths.push([...path, `${cX},${cY - 1},up`]);
        }
      }
    }
    return -1;
  }

  const isTestInput = false;
  const fileName = isTestInput ? './24/input-example.txt' : './24/input.txt';

  // Solve 24a:
  let { blizzards, maxX, maxY } = getBlizzards();
  const res24a = getMinSteps(1, 0, maxX - 1, maxY);

  // Solve 24b:
  ({ blizzards, maxX, maxY } = getBlizzards());
  const res24b_1 = getMinSteps(1, 0, maxX - 1, maxY);
  const res24b_2 = getMinSteps(maxX - 1, maxY, 1, 0) + 1;
  const res24b_3 = getMinSteps(1, 0, maxX - 1, maxY) + 1;

  console.log(`Result of 24a: ${res24a}`);
  console.log(`Result of 24b: ${res24b_1 + res24b_2 + res24b_3}`);
}
