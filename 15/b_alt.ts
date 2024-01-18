import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode15a {
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

    sensorCanBePresent(pos: Coord): boolean {
      return getManhattanDistance(pos, this.pos) > this.manhattanDistance;
    }
  }

  const getManhattanDistance = (coord1: Coord, coord2: Coord): number => {
    return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
  };

  function getSensors(): Sensor[] {
    return getInput(fileName).map((row, i) => {
      const [sensorX, sensorY, closestBeaconX, closestBeaconY] = row
        .replace('Sensor at x=', '')
        .replaceAll(', y=', ',')
        .replace(': closest beacon is at x=', ',')
        .split(',')
        .map((nbr) => parseInt(nbr));
      return new Sensor(
        new Coord(sensorX, sensorY),
        new Coord(closestBeaconX, closestBeaconY)
      );
    });
  }

  const canBePresent = (coord: Coord): boolean => {
    return sensors.every((sensor) => {
      return sensor.sensorCanBePresent(coord);
    });
  };

  const isTestInput = false;
  const fileName = isTestInput ? './15/input-example.txt' : './15/input.txt';
  const maxXandY: number = isTestInput ? 20 : 4000000;
  const minXandY: number = 0;

  // Solve 15b:
  let sensors = getSensors();
  let res = -1;
  sensors.forEach((sensor) => {
    if (res >= 0) return;
    const startX = Math.max(
      minXandY,
      sensor.pos.x - sensor.manhattanDistance - 1
    );
    const endX = Math.min(
      maxXandY,
      sensor.pos.x + sensor.manhattanDistance + 1
    );
    for (let x = startX; x <= endX; x++) {
      const deltaX = Math.abs(sensor.pos.x - x);
      const deltaY = sensor.manhattanDistance - deltaX + 1;
      const yPlus = sensor.pos.y + deltaY;
      const yMinus = sensor.pos.y - deltaY;
      if (yPlus >= minXandY && yPlus <= maxXandY) {
        if (canBePresent(new Coord(x, yPlus))) {
          res = new Coord(x, yPlus).tuningFreequency;
        }
      }
      if (
        res < 0 &&
        yMinus >= minXandY &&
        yMinus <= maxXandY &&
        yPlus !== yMinus
      ) {
        if (canBePresent(new Coord(x, yMinus))) {
          res = new Coord(x, yMinus).tuningFreequency;
        }
      }
    }
  });

  console.log(res);
}
