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

  const moveTail = (currentTail: Coord, currentHead: Coord): Coord => {
    const xDiff = currentHead.x - currentTail.x;
    const yDiff = currentHead.y - currentTail.y;
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
        return new Coord(currentHead.x - 1, currentHead.y);
      }
      if (xDiff === -2) {
        return new Coord(currentHead.x + 1, currentHead.y);
      }
    }
    if (Math.abs(yDiff) === 2 && Math.abs(xDiff) === 1) {
      if (yDiff === 2) {
        return new Coord(currentHead.x, currentHead.y - 1);
      }
      if (yDiff === -2) {
        return new Coord(currentHead.x, currentHead.y + 1);
      }
    }
    console.log('Something seems weird?');
    console.log({ currentHead, currentTail });
    return currentTail;
  };

  function parseInput() {
    const fs = require('fs');
    const fileName = isTestInput ? './9/input-example.txt' : './9/input.txt';

    let currenHead = new Coord(0, 0);
    let currentTail = new Coord(0, 0);
    const headPositions: Set<string> = new Set();
    const tailPositions: Set<string> = new Set();
    headPositions.add(currenHead.toString());
    tailPositions.add(currentTail.toString());

    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((motion: string) => {
        const [dir, steps] = motion.split(' ');
        for (let i = 0; i < parseInt(steps); i++) {
          currenHead = moveHead(currenHead, dir);
          headPositions.add(currenHead.toString());
          currentTail = moveTail(currentTail, currenHead);
          tailPositions.add(currentTail.toString());
          //console.log({ currenHead, currentTail });
        }
      });

    console.log({ head: headPositions.size, tail: tailPositions.size });
  }

  const isTestInput = false;
  parseInput();
}
