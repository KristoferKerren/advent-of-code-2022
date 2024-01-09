import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode9a {
  function check(currentCycle: number, currentX: number): number {
    if ((currentCycle - 20) % 40 === 0) {
      //console.log({ currentCycle, currentX });
      return currentX * currentCycle;
    }
    return 0;
  }

  function parseInput() {
    const fs = require('fs');
    const fileName = isTestInput ? './10/input-example.txt' : './10/input.txt';

    let currentCycle = 0;
    let currentX = 1;
    let sum = 0;
    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((row: string) => {
        //console.log({ row, currentCycle, currentX });
        const thisIsTheeeX = currentX;
        if (row === 'noop') {
          currentCycle++;
          sum += check(currentCycle, thisIsTheeeX);
        } else if (row.startsWith('addx ')) {
          const [, value] = row.split(' ');
          currentCycle++;
          sum += check(currentCycle, thisIsTheeeX);
          currentX += parseInt(value);
          currentCycle++;
          sum += check(currentCycle, thisIsTheeeX);
        }
      });
    console.log(sum);
  }

  const isTestInput = false;
  parseInput();
}
