import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode17a {
  class RockCoord {
    constructor(public x: number, public y: number) {}
  }

  class Rock {
    constructor(
      public elements: RockCoord[],
      public deltaX: number,
      public deltaY: number
    ) {}
  }

  function getRock(index: number): Rock {
    switch (index % 5) {
      case 1:
        return new Rock(
          [
            new RockCoord(0, 0),
            new RockCoord(1, 0),
            new RockCoord(2, 0),
            new RockCoord(3, 0),
          ],
          4,
          1
        );
      case 2:
        return new Rock(
          [
            new RockCoord(1, 0),
            new RockCoord(0, -1),
            new RockCoord(1, -1),
            new RockCoord(2, -1),
            new RockCoord(1, -2),
          ],
          3,
          3
        );
      case 3:
        return new Rock(
          [
            new RockCoord(0, 0),
            new RockCoord(1, 0),
            new RockCoord(2, 0),
            new RockCoord(2, -1),
            new RockCoord(2, -2),
          ],
          3,
          3
        );
      case 4:
        return new Rock(
          [
            new RockCoord(0, 0),
            new RockCoord(0, -1),
            new RockCoord(0, -2),
            new RockCoord(0, -3),
          ],
          1,
          4
        );
      case 5:
      default:
        return new Rock(
          [
            new RockCoord(0, 0),
            new RockCoord(0, -1),
            new RockCoord(1, 0),
            new RockCoord(1, -1),
          ],
          2,
          2
        );
    }
  }

  function getLeftRight(): string[] {
    return getInput(fileName).join().split('');
  }

  function getRelativeTopY(relativeTo: number): number[] {
    const res: number[] = [];

    for (let x = 0; x < 7; x++) {
      let y = relativeTo;
      while (!coords.has(`${x},${y}`) && y <= 0) {
        //console.log(`${x},${y}`);
        y++;
      }
      res.push(relativeTo - y + 1);
    }
    return res;
  }

  function print(startY: number, endY: number) {
    console.log({ startY, endY });
    console.log('This is the rocks:\n\n');
    for (let y = endY; y <= startY; y++) {
      const els = '.......'
        .split('')
        .map((el, x) => {
          return coords.has(`${x},${y}`) ? '#' : el;
        })
        .join('');
      console.log(`|${els}|`);
    }
    console.log('----------');
  }

  function getTowerheight(nbrOfRocks: number): number {
    let currentYMax = 0;
    let leftOrRightIndex = 0;
    let cycleDeltaYMax = 0;
    let nbrOfCycles = 0;
    const cycleFinder: Map<string, string> = new Map();

    for (let stoneNbr = 1; stoneNbr <= nbrOfRocks; stoneNbr++) {
      const rock = getRock(stoneNbr);
      let hasStopped = false;
      let x = 2;
      let y = currentYMax - 3;
      let internalCount = 0;

      while (!hasStopped) {
        if (nbrOfCycles === 0) {
          const leftOrRightIndexKey = leftOrRightIndex % leftOrRight.length;
          const stoneNbrKey = stoneNbr % 5;
          const deltaY: number = currentYMax - y;
          const relativeTopKey = getRelativeTopY(currentYMax).join(',');
          const key = `stone:${stoneNbrKey};lorInd:${leftOrRightIndexKey},ic:${internalCount},x:${x},dy:${deltaY},rty:${relativeTopKey}`;
          if (!cycleFinder.has(key)) {
            cycleFinder.set(
              key,
              `currentYMax:${currentYMax},stoneNbr:${stoneNbr}`
            );
          } else {
            const [lastCurrentYMax, lastStoneNbr] = cycleFinder
              .get(key)!
              .replace('currentYMax:', '')
              .replace('stoneNbr:', '')
              .split(',')
              .map((C) => parseInt(C));
            cycleDeltaYMax = Math.abs(currentYMax - lastCurrentYMax);
            const deltaStoneNbr = stoneNbr - lastStoneNbr;
            nbrOfCycles = Math.floor((nbrOfRocks - stoneNbr) / deltaStoneNbr);
            stoneNbr += deltaStoneNbr * nbrOfCycles;
          }
        }
        internalCount++;
        const lOrChar = leftOrRight[leftOrRightIndex++ % leftOrRight.length];
        const shouldGoRight =
          lOrChar === '>' &&
          x + rock.deltaX < 7 &&
          !rock.elements.some((re) =>
            coords.has(`${re.x + x + 1},${re.y + y}`)
          );
        const shouldGoLeft =
          lOrChar === '<' &&
          x > 0 &&
          !rock.elements.some((re) =>
            coords.has(`${re.x + x - 1},${re.y + y}`)
          );
        if (shouldGoRight) x++;
        if (shouldGoLeft) x--;
        hasStopped = rock.elements.some((re) => {
          return re.y + y === 0 || coords.has(`${re.x + x},${re.y + y + 1}`);
        });
        if (hasStopped) {
          currentYMax = Math.min(y - rock.deltaY, currentYMax);
          rock.elements.forEach((re) => {
            coords.add(`${re.x + x},${re.y + y}`);
          });
        }
        y++;
      }
    }
    return -currentYMax + nbrOfCycles * cycleDeltaYMax;
  }

  const isTestInput = false;
  const fileName = isTestInput ? './17/input-example.txt' : './17/input.txt';
  const leftOrRight = getLeftRight();
  const coords: Set<string> = new Set();

  //Solve 17a
  console.log(getTowerheight(2022));

  //Solve 17b
  console.log(getTowerheight(1000000000000));
}
