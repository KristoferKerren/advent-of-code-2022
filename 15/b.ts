import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode15b {
  class Coord {
    constructor(public x: number = 0, public y: number = 0) {}

    get tuningFreequency(): number {
      return this.x * 4000000 + this.y;
    }
  }

  class Sensor {
    constructor(public pos: Coord, public closestBeaconPos: Coord) {}

    get manhattanDistance(): number {
      return getManhattanDistance(this.pos, this.closestBeaconPos);
    }

    getMinYWhereSenscorCannotBePresent(x: number): number {
      const deltaX = Math.abs(this.pos.x - x);
      if (deltaX > this.manhattanDistance) return -1;
      return Math.max(minXandY, this.pos.y - (this.manhattanDistance - deltaX));
    }

    getMaxYWhereSenscorCannotBePresent(x: number): number {
      const deltaX = Math.abs(this.pos.x - x);
      if (deltaX > this.manhattanDistance) return -1;
      return Math.min(maxXandY, this.pos.y + (this.manhattanDistance - deltaX));
    }
  }

  const getManhattanDistance = (coord1: Coord, coord2: Coord): number => {
    return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
  };

  function getSensors(): Sensor[] {
    const sensors = getInput(fileName).map((row, i) => {
      const [sensorX, sensorY, closestBeaconX, closestBeaconY] = row
        .replace('Sensor at x=', '')
        .replaceAll(', y=', ',')
        .replace(': closest beacon is at x=', ',')
        .split(',')
        .map((nbr) => parseInt(nbr));
      const sensor = new Sensor(
        new Coord(sensorX, sensorY),
        new Coord(closestBeaconX, closestBeaconY)
      );
      return sensor;
    });
    return sensors;
  }

  const isTestInput = false;
  const fileName = isTestInput ? './15/input-example.txt' : './15/input.txt';
  const maxXandY: number = isTestInput ? 20 : 4000000;
  const minXandY: number = 0;

  // Solve 15b:
  let sensors = getSensors();
  for (let x = minXandY; x <= maxXandY; x++) {
    const cannotBePresenMinY = sensors
      .map((sensor) => {
        return sensor.getMinYWhereSenscorCannotBePresent(x);
      })
      .filter((y) => y > -1);
    const cannotBePresenMaxY = sensors
      .map((sensor) => {
        return sensor.getMaxYWhereSenscorCannotBePresent(x);
      })
      .filter((y) => y > -1);
    let limitsSorted = cannotBePresenMinY
      .map((minY, i) => {
        const maxY = cannotBePresenMaxY[i];
        return [minY, maxY];
      })
      .sort((a, b) => a[0] - b[0]);
    let currentMax = limitsSorted[0][1];
    for (var i = 1; i < limitsSorted.length; i++) {
      if (currentMax < limitsSorted[i][0] - 1) {
        currentMax = limitsSorted[i][1];
      } else {
        limitsSorted[i][0] = Math.min(
          limitsSorted[i - 1][0],
          limitsSorted[i][0]
        );
        limitsSorted[i][1] = Math.max(
          limitsSorted[i - 1][1],
          limitsSorted[i][1]
        );
        limitsSorted[i - 1] = [];
        currentMax = limitsSorted[i][1];
      }
    }
    limitsSorted = limitsSorted.filter((l) => l.length > 0);
    if (limitsSorted.length > 1) {
      const coord = new Coord(x, limitsSorted[0][1] + 1);
      console.log({ x, limitsSorted, coord });
      console.log(coord.tuningFreequency);
    }
  }
}
