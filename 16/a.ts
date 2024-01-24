import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode16a {
  class Valvet {
    constructor(public flowRate: number, public tunnelsTo: string[]) {}

    get isOpenable(): boolean {
      return this.flowRate > 0;
    }
  }

  class Path {
    constructor(
      public releasedPressure: number = 0,
      public openedValves: string[] = [],
      public history: string[] = []
    ) {}
  }

  const getReleasePressure = (openedValves: string[]): number => {
    return openedValves
      .filter((p) => !p.includes('went To'))
      .map((v) => valvetMap.get(v)?.flowRate!)
      .reduce((tally, sum) => tally + sum, 0);
  };

  function getValvets(): Map<string, Valvet> {
    const map = new Map<string, Valvet>();
    getInput(fileName).forEach((row, i) => {
      const [name, flowRate, tunnelsTo] = row
        .replace('Valve ', '')
        .replace(' has flow rate=', ';')
        .replace(' tunnel leads to valve ', '')
        .replace(' tunnels lead to valves ', '')
        .replaceAll(', ', ',')
        .split(';');
      map.set(name, new Valvet(parseInt(flowRate), tunnelsTo.split(',')));
    });
    return map;
  }

  const isTestInput = true;
  const fileName = isTestInput ? './16/input-example.txt' : './16/input.txt';
  const valvetMap = getValvets();

  const nbrOfOpenableValves = [...valvetMap.values()].filter(
    (v) => v.isOpenable
  ).length;
  let maxReleasePressure = 0;

  let paths: Path[] = [new Path(0, [], ['AA'])];
  for (let i = 0; i <= 30; i++) {
    const maxOpenedValves = Math.max(
      ...paths.map((p) => p.openedValves.length)
    );
    maxReleasePressure = Math.max(
      ...paths.map((p) => p.releasedPressure),
      maxReleasePressure
    );
    const pathsLength = paths.length;
    for (let pathI = 0; pathI < pathsLength; pathI++) {
      const path = paths.shift()!;
      path.releasedPressure += getReleasePressure(path.openedValves);
      if (path.openedValves.length === nbrOfOpenableValves) {
        paths.push(path);
        continue;
      }
      if (maxOpenedValves - path.openedValves.length > 2) {
        continue;
      }
      if (maxReleasePressure - path.releasedPressure > 100) {
        continue;
      }
      const valveName = path.history.at(-1)!;
      const valve = valvetMap.get(path.history.at(-1)!)!;
      if (valve?.isOpenable && !path.openedValves.includes(valveName)) {
        paths.push(
          new Path(
            path.releasedPressure,
            [...path.openedValves, valveName],
            [...path.history]
          )
        );
      }
      valve.tunnelsTo.forEach((to) => {
        if (
          path.openedValves.at(-1)! !== valveName &&
          to === path.history.at(-2)!
        ) {
          return;
        }
        if (path.history.filter((p) => p === to).length >= 5) {
          return;
        }
        paths.push(
          new Path(
            path.releasedPressure,
            [...path.openedValves, `went To ${to}`],
            [...path.history, to]
          )
        );
      });
    }
    console.log(maxReleasePressure);
  }
}
