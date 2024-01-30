import { stat } from 'fs';
import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode21a {
  class State {
    constructor(
      public x: number,
      public y: number,
      public dir: 'E' | 'S' | 'W' | 'N'
    ) {}
  }

  function getMap(): { map: string[][]; instructions: string[] } {
    let instructions: string[] = [];
    const map: string[][] = [];
    let isMapRow = true;
    getInput(fileName).forEach((row) => {
      if (row.replaceAll(' ', '').length === 0) {
        isMapRow = false;
        return;
      }
      if (isMapRow) {
        map.push(row.split(''));
      } else {
        instructions = row
          .replaceAll('L', ';L;')
          .replaceAll('R', ';R;')
          .split(';');
      }
    });

    return { map, instructions };
  }

  function logMap() {
    map.forEach((r) => console.log(r.join('')));
  }

  const getValue = (x: number, y: number): string => {
    const yArr: string[] = map[y];
    if (!yArr) return ' ';
    if (!yArr[x]) return ' ';
    return yArr[x];
  };

  function nextStateAtEdge(state: State): undefined | false {
    let rowArray: string[] = [];
    let nextValue: string = '';
    if (state.dir === 'E') rowArray = [...map[state.y]];
    if (state.dir === 'W') rowArray = [...map[state.y]].reverse();
    if (state.dir === 'S') rowArray = [...map.map((r) => r[state.x])];
    if (state.dir === 'N') rowArray = [...map.map((r) => r[state.x])].reverse();

    const indexDot = rowArray.indexOf('.');
    const indexHash = rowArray.indexOf('#');
    const firstCharInd =
      indexDot === -1
        ? indexHash
        : indexHash === -1
        ? indexDot
        : Math.min(indexDot, indexHash);

    if (state.dir === 'E') nextValue = getValue(firstCharInd, state.y);
    if (state.dir === 'W')
      nextValue = getValue(rowArray.length - firstCharInd - 1, state.y);
    if (state.dir === 'S') nextValue = getValue(state.x, firstCharInd);
    if (state.dir === 'N')
      nextValue = getValue(state.x, rowArray.length - firstCharInd - 1);

    if (nextValue === '#') {
      return false;
    }

    if (state.dir === 'E') state.x = firstCharInd;
    if (state.dir === 'W') state.x = rowArray.length - firstCharInd - 1;
    if (state.dir === 'S') state.y = firstCharInd;
    if (state.dir === 'N') state.y = rowArray.length - firstCharInd - 1;
  }

  function nextStateAtCubeEdge(state: State): undefined | false {
    // Sketch of map with zones 1-6:
    //    111222
    //    111222
    //    111222
    //    333
    //    333
    //    333
    // 444555
    // 444555
    // 444555
    // 666
    // 666
    // 666

    let areaSize: number = 50;
    let newX: number = -1;
    let newY: number = -1;
    let newDir: 'E' | 'S' | 'W' | 'N' = 'E';
    let nextValue: string = '';
    // area = 1;
    if (
      state.x >= 1 * areaSize &&
      state.x < 2 * areaSize &&
      state.y >= 0 * areaSize &&
      state.y < 1 * areaSize
    ) {
      if (state.dir === 'W' && state.x === 1 * areaSize) {
        newX = 0;
        newY = 3 * areaSize - 1 - state.y;
        newDir = 'E';
      }
      if (state.dir === 'N' && state.y === 0 * areaSize) {
        newX = 0;
        newY = 2 * areaSize + state.x;
        newDir = 'E';
      }
    }
    //area = 2;
    if (
      state.x >= 2 * areaSize &&
      state.x < 3 * areaSize &&
      state.y >= 0 * areaSize &&
      state.y < 1 * areaSize
    ) {
      if (state.dir === 'N' && state.y === 0 * areaSize) {
        newX = state.x - 2 * areaSize;
        newY = 4 * areaSize - 1;
        newDir = 'N';
      }
      if (state.dir === 'E' && state.x === 3 * areaSize - 1) {
        newX = 2 * areaSize - 1;
        newY = 3 * areaSize - 1 - state.y;
        newDir = 'W';
      }
      if (state.dir === 'S' && state.y === 1 * areaSize - 1) {
        newX = 2 * areaSize - 1;
        newY = state.x - areaSize;
        newDir = 'W';
      }
    }
    // area 3:
    if (
      state.x >= 1 * areaSize &&
      state.x < 2 * areaSize &&
      state.y >= 1 * areaSize &&
      state.y < 2 * areaSize
    ) {
      if (state.dir === 'E' && state.x === 2 * areaSize - 1) {
        newX = state.y + areaSize;
        newY = 1 * areaSize - 1;
        newDir = 'N';
      }
      if (state.dir === 'W' && state.x === 1 * areaSize) {
        newX = state.y - areaSize;
        newY = 2 * areaSize;
        newDir = 'S';
      }
    }
    // area 4:
    if (
      state.x >= 0 * areaSize &&
      state.x < 1 * areaSize &&
      state.y >= 2 * areaSize &&
      state.y < 3 * areaSize
    ) {
      if (state.dir === 'N' && state.y === 2 * areaSize) {
        newX = 1 * areaSize;
        newY = state.x + areaSize;
        newDir = 'E';
      }
      if (state.dir === 'W' && state.x === 0 * areaSize) {
        newX = 1 * areaSize;
        newY = 3 * areaSize - 1 - state.y;
        newDir = 'E';
      }
    }
    // area 5:
    if (
      state.x >= 1 * areaSize &&
      state.x < 2 * areaSize &&
      state.y >= 2 * areaSize &&
      state.y < 3 * areaSize
    ) {
      if (state.dir === 'E' && state.x === 2 * areaSize - 1) {
        newX = 3 * areaSize - 1;
        newY = 3 * areaSize - 1 - state.y;
        newDir = 'W';
      }
      if (state.dir === 'S' && state.y === 3 * areaSize - 1) {
        newX = 1 * areaSize - 1;
        newY = 2 * areaSize + state.x;
        newDir = 'W';
      }
    }
    // area 6:
    if (
      state.x >= 0 * areaSize &&
      state.x < 1 * areaSize &&
      state.y >= 3 * areaSize &&
      state.y < 4 * areaSize
    ) {
      if (state.dir === 'E' && state.x === 1 * areaSize - 1) {
        newX = state.y - 2 * areaSize;
        newY = 3 * areaSize - 1;
        newDir = 'N';
      }
      if (state.dir === 'S' && state.y === 4 * areaSize - 1) {
        newX = state.x + 2 * areaSize;
        newY = 0;
        newDir = 'S';
      }
      if (state.dir === 'W' && state.x === 0 * areaSize) {
        newX = state.y - 2 * areaSize;
        newY = 0;
        newDir = 'S';
      }
    }

    nextValue = getValue(newX, newY);
    if (nextValue === '#') {
      return false;
    }

    state.x = newX;
    state.y = newY;
    state.dir = newDir;
  }

  function nextState(state: State, steps: number, task: '22a' | '22b'): State {
    for (let j = 1; j <= steps; j++) {
      const deltaX = state.dir === 'E' ? 1 : state.dir === 'W' ? -1 : 0;
      const deltaY = state.dir === 'S' ? 1 : state.dir === 'N' ? -1 : 0;
      const nextChar = getValue(state.x + deltaX, state.y + deltaY);
      if (nextChar === '.') {
        state.x += deltaX;
        state.y += deltaY;
      } else if (nextChar === '#') {
        j = steps;
      } else {
        if (task === '22a') {
          if (nextStateAtEdge(state) === false) {
            j = steps;
          }
        } else {
          if (nextStateAtCubeEdge(state) === false) {
            j = steps;
          }
        }
      }
    }
    return state;
  }

  const getFinalPassword = (state: State): number => {
    const facingVal =
      state.dir === 'E' ? 0 : state.dir === 'S' ? 1 : state.dir === 'W' ? 2 : 3;
    return 1000 * (state.y + 1) + 4 * (state.x + 1) + facingVal;
  };

  function solve(task: '22a' | '22b'): number {
    let currentState = new State(map[0].indexOf('.'), 0, 'E');

    instructions.forEach((i) => {
      //console.log({ instruction: i });
      if (i === 'R') {
        if (currentState.dir === 'E') currentState.dir = 'S';
        else if (currentState.dir === 'N') currentState.dir = 'E';
        else if (currentState.dir === 'W') currentState.dir = 'N';
        else if (currentState.dir === 'S') currentState.dir = 'W';
      } else if (i === 'L') {
        if (currentState.dir === 'E') currentState.dir = 'N';
        else if (currentState.dir === 'N') currentState.dir = 'W';
        else if (currentState.dir === 'W') currentState.dir = 'S';
        else if (currentState.dir === 'S') currentState.dir = 'E';
      } else {
        nextState(currentState, parseInt(i), task);
      }

      // if (i !== 'L' && i !== 'R') {
      //   console.log({ i, currentState });
      // }
    });
    return getFinalPassword(currentState);
  }

  const isTestInput = false;
  const fileName = isTestInput ? './22/input-example.txt' : './22/input.txt';

  const { map, instructions } = getMap();
  //logMap();

  console.log(`Result of 22a: ${solve('22a')}`);
  console.log(`Result of 22b: ${solve('22b')}`);
}
