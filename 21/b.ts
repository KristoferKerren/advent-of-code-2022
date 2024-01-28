import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode21 {
  class Monkey {
    constructor(public job?: string, public number?: number) {}
  }

  function getMonkeys(): Map<string, Monkey> {
    const map = new Map<string, Monkey>();
    getInput(fileName).forEach((row) => {
      let [name, jobOrNumber] = row.replaceAll(' ', '').split(':');
      if (name === 'root') {
        jobOrNumber = jobOrNumber
          .replace('+', '=')
          .replace('-', '=')
          .replace('*', '=')
          .replace('/', '=');
      }
      const num = parseInt(jobOrNumber);
      if (name === 'humn') {
        jobOrNumber = '';
      }
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
      .replace('=', ';')
      .split(';')
      .map((name) => monkeys.get(name)?.number);
    if (first && second) {
      if (job.includes('+')) return first + second;
      if (job.includes('-')) return first - second;
      if (job.includes('*')) return first * second;
      if (job.includes('/')) return first / second;
      if (job.includes('=')) {
        console.log(
          `First: ${first}, Second: ${second}, diff: ${first - second}`
        );
        return first - second;
      }
    }
    return undefined;
  };

  const checkNumber = (humanNumber: number): number => {
    const human = monkeys.get('humn')!;
    human.number = humanNumber;
    let i = 0;
    while (monkeys.get('root')?.number === undefined && i < 100000) {
      i++;
      [...monkeys.values()]
        .filter((m) => m.number === undefined)
        .forEach((m) => {
          if (m.job) {
            m.number = parseToNum(m.job);
          }
        });
    }
    return monkeys.get('root')?.number || -1;
  };

  const isTestInput = false;
  const fileName = isTestInput ? './21/input-example.txt' : './21/input.txt';

  // Solve 21b
  // const yValues: number[] = [];
  // const deltaYValues: number[] = [];
  // for (let i = 1; i <= 10; i++) {
  //   monkeys = getMonkeys();
  //   yValues.push(checkNumber(i));
  //   if (i > 1) {
  //     deltaYValues.push(yValues.at(-1)! - yValues.at(-2)!);
  //   }
  // }
  // const k =
  //   deltaYValues.reduce((sum, value) => sum + value, 0) / deltaYValues.length;
  // const m = yValues[0] - k * 1;
  // const x = -m / k;
  // console.log({ yValues, deltaYValues, k, m, x, y: k * x + m });
  // monkeys = getMonkeys();
  let monkeys = getMonkeys();
  console.log(Math.floor(checkNumber(3469704905529)));
}
