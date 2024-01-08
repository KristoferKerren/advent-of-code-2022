import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode9a {
  class Coord {
    constructor(public x: number, public y: number) {}

    toString(): string {
      return `${this.x},${this.y}`;
    }
  }

  const moveHead = (coord: Coord, dir: string): Coord => {
    switch (dir) {
      case 'U':
        return new Coord(coord.x, coord.y + 1);
      case 'D':
        return new Coord(coord.x, coord.y - 1);
      case 'R':
        return new Coord(coord.x + 1, coord.y);
      case 'L':
        return new Coord(coord.x - 1, coord.y);
      default:
        throw new Error(`Unknown direction: ${dir}`);
    }
  };

  const moveTail = (currentTail: Coord, headOrPreviousTail: Coord): Coord => {
    const xDiff = headOrPreviousTail.x - currentTail.x;
    const yDiff = headOrPreviousTail.y - currentTail.y;
    if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1) {
      return currentTail;
    }
    if (xDiff === 0) {
      if (yDiff === 2) {
        return new Coord(currentTail.x, currentTail.y + 1);
      }
      if (yDiff === -2) {
        return new Coord(currentTail.x, currentTail.y - 1);
      }
    }
    if (yDiff === 0) {
      if (xDiff === 2) {
        return new Coord(currentTail.x + 1, currentTail.y);
      }
      if (xDiff === -2) {
        return new Coord(currentTail.x - 1, currentTail.y);
      }
    }
    if (Math.abs(xDiff) === 2 && Math.abs(yDiff) === 1) {
      if (xDiff === 2) {
        return new Coord(headOrPreviousTail.x - 1, headOrPreviousTail.y);
      }
      if (xDiff === -2) {
        return new Coord(headOrPreviousTail.x + 1, headOrPreviousTail.y);
      }
    }
    if (Math.abs(yDiff) === 2 && Math.abs(xDiff) === 1) {
      if (yDiff === 2) {
        return new Coord(headOrPreviousTail.x, headOrPreviousTail.y - 1);
      }
      if (yDiff === -2) {
        return new Coord(headOrPreviousTail.x, headOrPreviousTail.y + 1);
      }
    }
    if (Math.abs(yDiff) === 2 && Math.abs(xDiff) === 2) {
      if (yDiff === 2 && xDiff === 2) {
        return new Coord(headOrPreviousTail.x - 1, headOrPreviousTail.y - 1);
      }
      if (yDiff === 2 && xDiff === -2) {
        return new Coord(headOrPreviousTail.x + 1, headOrPreviousTail.y - 1);
      }
      if (yDiff === -2 && xDiff === 2) {
        return new Coord(headOrPreviousTail.x - 1, headOrPreviousTail.y + 1);
      }
      if (yDiff === -2 && xDiff === -2) {
        return new Coord(headOrPreviousTail.x + 1, headOrPreviousTail.y + 1);
      }
    }
    console.log('Something seems weird?');
    console.log({ headOrPreviousTail, currentTail });
    return currentTail;
  };

  function parseInput() {
    const fs = require('fs');
    const fileName = isTestInput ? './9/input-example-b.txt' : './9/input.txt';

    let currenHead = new Coord(0, 0);
    const currentTails: Coord[] = Array.from(
      { length: 9 },
      () => new Coord(0, 0)
    );
    const headPositions: Set<string> = new Set();
    const tailPositions: Set<string>[] = Array.from(
      { length: 9 },
      () => new Set()
    );
    headPositions.add(currenHead.toString());
    tailPositions.forEach((t, i) => t.add(currentTails[i].toString()));

    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((motion: string) => {
        const [dir, steps] = motion.split(' ');
        //console.log(`------------ ${dir} ${steps} ------------`);
        for (let i = 0; i < parseInt(steps); i++) {
          currenHead = moveHead(currenHead, dir);
          headPositions.add(currenHead.toString());
          currentTails.forEach((currentTail, i) => {
            const currentTailPre = new Coord(currentTail.x, currentTail.y);
            const headOrPreviousTail =
              i === 0 ? currenHead : currentTails[i - 1];
            currentTail = moveTail(currentTail, headOrPreviousTail);
            currentTails[i] = currentTail;
            tailPositions.at(i)!.add(currentTail.toString());
            // console.log({ i, currentTailPre, currentTail, headOrPreviousTail });
          });
        }
      });

    console.log({ head: headPositions.size, tail: tailPositions.at(-1)?.size });
  }

  const isTestInput = false;
  parseInput();
}
