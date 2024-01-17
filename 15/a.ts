import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode15a {
  class Coord {
    constructor(public x: number = 0, public y: number = 0) {}
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

  function getSensors(): {
    sensors: Sensor[];
    minX: number;
    maxX: number;
    beaconCoords: Coord[];
  } {
    let minX: number = 99999999999;
    let maxX: number = -99999999999;
    const beaconCoords: Coord[] = [];
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
      minX = Math.min(...[minX, sensorX - sensor.manhattanDistance]);
      maxX = Math.max(...[maxX, sensorX + sensor.manhattanDistance]);
      const beaconCoord = new Coord(closestBeaconX, closestBeaconY);
      if (
        beaconCoords.findIndex(
          (bc) => bc.x === beaconCoord.x && bc.y === beaconCoord.y
        ) === -1
      ) {
        beaconCoords.push(new Coord(closestBeaconX, closestBeaconY));
      }

      return sensor;
    });
    return { sensors, minX, maxX, beaconCoords };
  }

  const isTestInput = false;
  const fileName = isTestInput ? './15/input-example.txt' : './15/input.txt';
  const y: number = isTestInput ? 10 : 2000000;

  // Solve 15a:
  let { sensors, minX, maxX, beaconCoords } = getSensors();
  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    const canBePresen = sensors.every((sensor) => {
      return (
        sensor.sensorCanBePresent(new Coord(x, y)) ||
        beaconCoords.findIndex((bc) => bc.x === x && bc.y === y) > -1
      );
    });
    count += !canBePresen ? 1 : 0;
  }

  console.log(count);
}
