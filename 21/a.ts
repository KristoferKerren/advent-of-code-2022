import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode21 {
  class Monkey {
    constructor(public job?: string, public number?: number) {}
  }

  function getMonkeys(): Map<string, Monkey> {
    const map = new Map<string, Monkey>();
    getInput(fileName).forEach((row) => {
      const [name, jobOrNumber] = row.replaceAll(' ', '').split(':');
      const num = parseInt(jobOrNumber);
      if (Number.isNaN(num)) map.set(name, new Monkey(jobOrNumber));
      else map.set(name, new Monkey(undefined, num));
    });

    return map;
  }

  const parseToNum = (job: string): number | undefined => {
    const [first, second] = job
      .replace('+', ';')
      .replace('-', ';')
      .replace('*', ';')
      .replace('/', ';')
      .split(';')
      .map((name) => monkeys.get(name)?.number);
    if (first && second) {
      if (job.includes('+')) return first + second;
      if (job.includes('-')) return first - second;
      if (job.includes('*')) return first * second;
      if (job.includes('/')) return first / second;
    }
    return undefined;
  };

  const isTestInput = false;
  const fileName = isTestInput ? './21/input-example.txt' : './21/input.txt';

  // Solve 21a
  let monkeys = getMonkeys();

  while (monkeys.get('root')?.number === undefined) {
    console.log(
      `${
        [...monkeys.values()].filter((m) => m.number === undefined).length
      } has no number`
    );
    [...monkeys.values()]
      .filter((m) => m.number === undefined)
      .forEach((m) => {
        if (m.job) {
          m.number = parseToNum(m.job);
        }
      });
  }

  console.log(`Result fo 21a: ${monkeys.get('root')?.number}`);
}
