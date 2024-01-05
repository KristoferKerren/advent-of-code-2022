import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode4a {
  class Step {
    constructor(
      public moveAmount: number,
      public from: number,
      public to: number
    ) {}
  }

  function parseInput(): { stacks: Map<number, string[]>; steps: Step[] } {
    const fs = require('fs');

    const fileName = isTestInput ? './5/input-example.txt' : './5/input.txt';

    const stacks = new Map<number, string[]>();
    const steps: Step[] = [];
    const cratesRows: string[] = [];
    const stepsRows: string[] = [];
    const crateNbrRow: string[] = [];
    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((row: string) => {
        if (row.startsWith(' 1 ')) crateNbrRow.push(row);
        if (crateNbrRow.length === 0) cratesRows.unshift(row);
        if (row.startsWith('move ')) stepsRows.push(row);
      });

    let ind = 1;
    crateNbrRow[0].split('').forEach((char: string, i: number) => {
      if (char !== ' ') {
        stacks.set(ind, []);
        cratesRows.forEach((row: string) => {
          if (row[i].match(/[a-z]/i)) {
            stacks.get(ind)?.push(row[i]);
          }
        });
        ind++;
      }
    });

    stepsRows.forEach((row: string) => {
      const stepInfo = row
        .replace('move ', '')
        .replace(' from ', ' ')
        .replace(' to ', ' ')
        .split(' ');
      steps.push(
        new Step(
          parseInt(stepInfo[0]),
          parseInt(stepInfo[1]),
          parseInt(stepInfo[2])
        )
      );
    });

    return { stacks, steps };
  }

  const isTestInput = false;
  const { stacks, steps } = parseInput();

  steps.forEach((step: Step) => {
    const fromStack = stacks.get(step.from) ?? [];
    const toStack = stacks.get(step.to) ?? [];
    toStack.push(...fromStack.splice(-step.moveAmount));
  });
  let result = [...stacks.values()]
    .map((stack: string[]) => stack.at(-1))
    .join('');
  console.log({ result });
}
