import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode18 {
  class Cube {
    constructor(public x: number, public y: number, public z: number) {}

    toString(): string {
      return `${this.x},${this.y},${this.z}`;
    }
  }

  function getCubes(): Cube[] {
    return getInput(fileName).map((row) => {
      const [x, y, z] = row.split(',').map((c) => parseInt(c));
      return new Cube(x, y, z);
    });
  }

  function fillAirHoles() {
    cubes.forEach((c) => {
      let surrAirCubes = getSurrAirCubes(new Cube(c.x + 1, c.y, c.z));
      cubes.push(...surrAirCubes);
      surrAirCubes = getSurrAirCubes(new Cube(c.x - 1, c.y, c.z));
      cubes.push(...surrAirCubes);
      surrAirCubes = getSurrAirCubes(new Cube(c.x, c.y + 1, c.z));
      cubes.push(...surrAirCubes);
      surrAirCubes = getSurrAirCubes(new Cube(c.x, c.y - 1, c.z));
      cubes.push(...surrAirCubes);
      surrAirCubes = getSurrAirCubes(new Cube(c.x, c.y, c.z + 1));
      cubes.push(...surrAirCubes);
      surrAirCubes = getSurrAirCubes(new Cube(c.x, c.y, c.z - 1));
      cubes.push(...surrAirCubes);
    });
  }

  const getSurrAirCubes = (cube: Cube): Cube[] => {
    if (isCube(cube) || outerCubes.has(cube.toString())) {
      return [];
    }
    const surrAirCube: Set<string> = new Set();
    surrAirCube.add(cube.toString());
    let newlyAdded = 1;
    const cubeMaxLimit = 4000;
    while (surrAirCube.size < cubeMaxLimit && newlyAdded > 0) {
      const lastSize = surrAirCube.size;
      const arr = [...surrAirCube.values()];
      for (let i = arr.length - newlyAdded; i < arr.length; i++) {
        const [x, y, z] = arr[i].split(',').map((c) => parseInt(c));
        const xPlus = new Cube(x + 1, y, z);
        const xMinus = new Cube(x - 1, y, z);
        const yPlus = new Cube(x, y + 1, z);
        const yMinus = new Cube(x, y - 1, z);
        const zPlus = new Cube(x, y, z + 1);
        const zMinus = new Cube(x, y, z - 1);
        if (!isCube(xPlus)) surrAirCube.add(xPlus.toString());
        if (!isCube(xMinus)) surrAirCube.add(xMinus.toString());
        if (!isCube(yPlus)) surrAirCube.add(yPlus.toString());
        if (!isCube(yMinus)) surrAirCube.add(yMinus.toString());
        if (!isCube(zPlus)) surrAirCube.add(zPlus.toString());
        if (!isCube(zMinus)) surrAirCube.add(zMinus.toString());
      }
      newlyAdded = surrAirCube.size - lastSize;
    }

    if (surrAirCube.size >= cubeMaxLimit) {
      outerCubes.add(cube.toString());
      return [];
    }

    return Array.from(surrAirCube.values()).map((c) => {
      const [x, y, z] = c.split(',').map((c) => parseInt(c));
      return new Cube(x, y, z);
    });
  };

  const isCube = (cube: Cube): boolean => {
    return cubes.some(
      (c) => cube.x === c.x && cube.y === c.y && cube.z === c.z
    );
  };

  function getSurfaceCount(): number {
    return cubes.reduce((tally, c) => {
      let surfaceCount = 0;
      if (!isCube(new Cube(c.x + 1, c.y, c.z))) surfaceCount++;
      if (!isCube(new Cube(c.x - 1, c.y, c.z))) surfaceCount++;
      if (!isCube(new Cube(c.x, c.y + 1, c.z))) surfaceCount++;
      if (!isCube(new Cube(c.x, c.y - 1, c.z))) surfaceCount++;
      if (!isCube(new Cube(c.x, c.y, c.z + 1))) surfaceCount++;
      if (!isCube(new Cube(c.x, c.y, c.z - 1))) surfaceCount++;
      return tally + surfaceCount;
    }, 0);
  }

  const isTestInput = false;
  const fileName = isTestInput ? './18/input-example.txt' : './18/input.txt';
  let cubes: Cube[];

  // 18a:
  cubes = getCubes();
  console.log(`The answer to 18a is ${getSurfaceCount()}`);

  // 18b:
  cubes = getCubes();
  const outerCubes = new Set<string>();
  fillAirHoles();
  console.log(`The answer to 18b is ${getSurfaceCount()}`);
}
