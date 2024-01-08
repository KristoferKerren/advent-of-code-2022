import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode8a {
  function parseInput(): number[][] {
    const fs = require('fs');

    const fileName = isTestInput ? './8/input-example.txt' : './8/input.txt';
    const treeMap = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((r: string) => r.split('').map((c: string) => parseInt(c)));
    return treeMap;
  }

  const isVisible = (x: number, y: number): boolean => {
    if (x === 0 || x === maxX || y === 0 || y === maxY) return true;
    if (treeMap[y].slice(0, x).every((val) => val < treeMap[y][x]!)) {
      return true;
    }
    if (treeMap[y].slice(x + 1).every((val) => val < treeMap[y][x]!)) {
      return true;
    }
    if (
      getCol(x)
        .slice(0, y)
        .every((val) => val < treeMap[y][x]!)
    ) {
      return true;
    }
    if (
      getCol(x)
        .slice(y + 1)
        .every((val) => val < treeMap[y][x]!)
    ) {
      return true;
    }
    return false;
  };

  const getScenicPoint = (x: number, y: number): number => {
    let left = 0;
    let right = 0;
    let up = 0;
    let down = 0;
    // Look left:
    const leftArray = treeMap[y].slice(0, x);
    for (let i = leftArray.length - 1; i >= 0; i--) {
      left++;
      if (leftArray[i] >= treeMap[y][x]) break;
    }
    // Look right:
    const rightArray = treeMap[y].slice(x + 1);
    for (let i = 0; i < rightArray.length; i++) {
      right++;
      if (rightArray[i] >= treeMap[y][x]) break;
    }
    // Look up:
    const upArray = getCol(x).slice(0, y);
    for (let i = upArray.length - 1; i >= 0; i--) {
      up++;
      if (upArray[i] >= treeMap[y][x]) break;
    }
    // Look down:
    const downArray = getCol(x).slice(y + 1);
    for (let i = 0; i < downArray.length; i++) {
      down++;
      if (downArray[i] >= treeMap[y][x]) break;
    }
    return left * right * up * down;
  };

  const getCol = (x: number): number[] => {
    return treeMap.map((row) => row[x]);
  };

  const isTestInput = false;
  const treeMap = parseInput();
  const maxY = treeMap.length - 1;
  const maxX = treeMap[0].length - 1;

  const totalCount = treeMap.reduce((acc, row, yInd) => {
    return (
      acc +
      row.reduce((rowAcc, col, xInd) => {
        return rowAcc + (isVisible(xInd, yInd) ? 1 : 0);
      }, 0)
    );
  }, 0);

  let maxScenicPoint = 0;
  treeMap.forEach((row, yInd) => {
    maxScenicPoint = Math.max(
      maxScenicPoint,
      ...row.map((col, xInd) => getScenicPoint(xInd, yInd))
    );
  });

  console.log(`8a: ${totalCount}`);
  console.log(`8b: ${maxScenicPoint}`);
}
