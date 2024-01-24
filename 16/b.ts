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
      public meHistory: string[] = [],
      public elephantHistory: string[] = []
    ) {}
  }

  const getReleasePressure = (openedValves: string[]): number => {
    return openedValves
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

  const isTestInput = false;
  const fileName = isTestInput ? './16/input-example.txt' : './16/input.txt';
  const valvetMap = getValvets();

  const nbrOfOpenableValves = [...valvetMap.values()].filter(
    (v) => v.isOpenable
  ).length;
  let maxReleasePressure = 0;
  let maxOpened: number = 0;
  let maxcompleted: number = 0;

  let paths: Path[] = [new Path(0, [], ['AA'], ['AA'])];
  for (let i = 0; i <= 26; i++) {
    maxReleasePressure = Math.max(
      ...paths.map((p) => p.releasedPressure),
      maxReleasePressure
    );
    paths = paths.filter((p) => {
      return maxReleasePressure - p.releasedPressure < 30;
    });
    maxOpened = Math.max(...paths.map((p) => p.openedValves.length), maxOpened);
    paths = paths.filter((p) => {
      return maxOpened - p.openedValves.length < 3;
    });
    const pathsLength = paths.length;
    for (let pathI = 0; pathI < pathsLength; pathI++) {
      const path = paths.shift()!;
      const deltaReleasePressure = getReleasePressure(path.openedValves);
      path.releasedPressure += deltaReleasePressure;
      if (path.openedValves.length === nbrOfOpenableValves) {
        maxcompleted = Math.max(
          maxcompleted,
          path.releasedPressure + deltaReleasePressure * (25 - i)
        );
        continue;
      }
      const valveName = path.meHistory.at(-1)!;
      const elephantValveName = path.elephantHistory.at(-1)!;
      const valve = valvetMap.get(valveName)!;
      const elephantValve = valvetMap.get(elephantValveName)!;

      // Case 1: both me and elephant open valves
      if (
        valveName !== elephantValveName &&
        valve?.isOpenable &&
        elephantValve?.isOpenable &&
        !path.openedValves.includes(valveName) &&
        !path.openedValves.includes(elephantValveName)
      ) {
        paths.push(
          new Path(
            path.releasedPressure,
            [...path.openedValves, valveName, elephantValveName],
            [...path.meHistory],
            [...path.elephantHistory]
          )
        );
      }

      // Case 2: I open valves, elephant moves
      if (valve?.isOpenable && !path.openedValves.includes(valveName)) {
        elephantValve.tunnelsTo.forEach((to) => {
          if (
            path.openedValves.at(-1)! === elephantValveName ||
            to !== path.elephantHistory.at(-2)!
          ) {
            paths.push(
              new Path(
                path.releasedPressure,
                [...path.openedValves, valveName],
                [...path.meHistory],
                [...path.elephantHistory, to]
              )
            );
          }
        });
      }

      // Case 3: Elephant open valves,I move
      if (
        elephantValve?.isOpenable &&
        !path.openedValves.includes(elephantValveName)
      ) {
        valve.tunnelsTo.forEach((to) => {
          if (
            path.openedValves.at(-1)! === valveName ||
            to !== path.meHistory.at(-2)!
          ) {
            paths.push(
              new Path(
                path.releasedPressure,
                [...path.openedValves, elephantValveName],
                [...path.meHistory, to],
                [...path.elephantHistory]
              )
            );
          }
        });
      }

      // Case 4: Both moves
      valve.tunnelsTo.forEach((meTo) => {
        if (
          path.openedValves.at(-1)! === valveName ||
          meTo !== path.meHistory.at(-2)!
        ) {
          elephantValve.tunnelsTo.forEach((elephantTo) => {
            if (
              path.openedValves.at(-1)! === elephantValveName ||
              elephantTo !== path.elephantHistory.at(-2)!
            ) {
              paths.push(
                new Path(
                  path.releasedPressure,
                  [...path.openedValves],
                  [...path.meHistory, meTo],
                  [...path.elephantHistory, elephantTo]
                )
              );
            }
          });
        }
      });
    }

    console.log({
      i,
      maxReleasePressure,
      maxcompleted,
    });
  }
  console.log({ maxReleasePressure, maxcompleted, maxOpened });
}
