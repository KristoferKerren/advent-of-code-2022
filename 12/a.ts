import { get } from 'http';
import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode12 {
  // class Path {
  //   constructor(public visited: string[] = []) {}
  // }

  function getMap() {
    const map: string[][] = [];
    let startCoord: string = '';
    getInput(fileName).forEach((row, y) => {
      map.push(row.split(''));
      if (row.includes('S')) {
        startCoord = `${row.indexOf('S')},${y}`;
      }
    });

    return { map, startCoord, maxY: map.length - 1, maxX: map[0].length - 1 };
  }

  const getCoords = (coord: string): { x: number; y: number } => {
    const [x, y] = coord.split(',').map((char) => parseInt(char));
    return { x, y };
  };

  const getValue = (coord: string): string => {
    const { x, y } = getCoords(coord);
    return map[y][x];
  };

  const checkCoord = (
    x: number,
    y: number,
    oldValue: string,
    visited: string[]
  ): boolean => {
    if (x < 0 || y < 0 || x > maxX || y > maxY) return false;
    const newValue = getValue(`${x},${y}`);
    if (visited.includes(`${x},${y}`)) return false;
    if (oldValue === 'S') return newValue === 'a';
    if (newValue === 'E') return oldValue === 'z';
    const charCodeDiff = newValue.charCodeAt(0) - oldValue.charCodeAt(0);
    return charCodeDiff <= 1;
  };

  function getNextPaths(visited: string[]): string[] {
    const currentPath = visited.at(-1)!;
    const { x, y } = getCoords(currentPath);
    const value = getValue(currentPath);
    const nextPaths: string[] = [];
    if (checkCoord(x + 1, y, value, visited)) nextPaths.push(`${x + 1},${y}`);
    if (checkCoord(x - 1, y, value, visited)) nextPaths.push(`${x - 1},${y}`);
    if (checkCoord(x, y + 1, value, visited)) nextPaths.push(`${x},${y + 1}`);
    if (checkCoord(x, y - 1, value, visited)) nextPaths.push(`${x},${y - 1}`);
    return nextPaths;
  }

  function solve12a() {
    const paths: string[][] = [];
    const minStepsMap: Map<string, number> = new Map();
    let minSteps = (maxX + 1) * (maxY + 1);
    paths.push([startCoord]);
    let i = 0;
    while (paths.length > 0) {
      i++;
      const path = paths.shift()!;
      const currentCoord = path.at(-1)!;
      const currentValue = getValue(currentCoord);
      const currentSteps = path.length - 1;
      if (
        !minStepsMap.get(currentCoord) ||
        minStepsMap.get(currentCoord)! > currentSteps
      )
        minStepsMap.set(currentCoord, currentSteps);
      else continue;
      if (currentSteps > minSteps) {
        continue;
      }
      if (currentValue === 'E') {
        minSteps = Math.min(minSteps, currentSteps);
      } else {
        getNextPaths(path).forEach((p) => {
          paths.push([...path, p]);
        });
      }
    }
    console.log(`Solution 12a: ${minSteps}`);
  }

  function solve12b() {
    const paths: string[][] = [];
    const minStepsMap: Map<string, number> = new Map();
    let minSteps = (maxX + 1) * (maxY + 1);
    paths.push([startCoord]);
    map.forEach((row, y) => {
      row.forEach((el, x) => {
        if (el === 'a') paths.push([`${x},${y}`]);
      });
    });
    let i = 0;
    while (paths.length > 0) {
      i++;
      const path = paths.shift()!;
      const currentCoord = path.at(-1)!;
      const currentValue = getValue(currentCoord);
      const currentSteps = path.length - 1;
      if (
        !minStepsMap.get(currentCoord) ||
        minStepsMap.get(currentCoord)! > currentSteps
      )
        minStepsMap.set(currentCoord, currentSteps);
      else continue;
      if (currentSteps > minSteps) {
        continue;
      }
      if (currentValue === 'E') {
        minSteps = Math.min(minSteps, currentSteps);
      } else {
        getNextPaths(path).forEach((p) => {
          paths.push([...path, p]);
        });
      }
    }
    console.log(`Solution 12b: ${minSteps}`);
  }

  const isTestInput = false;
  const fileName = isTestInput ? './12/input-example.txt' : './12/input.txt';
  const { map, startCoord, maxY, maxX } = getMap();

  solve12a();
  solve12b();
}
