import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode1a {
  class Elf {
    constructor(public foodCalories: number[] = []) {}

    get totalCalories(): number {
      return this.foodCalories.reduce((a, b) => a + b, 0);
    }
  }

  function getElves(): Elf[] {
    const fs = require('fs');

    const fileName = isTestInput ? './1/input-example.txt' : './1/input.txt';
    const elves: Elf[] = [];
    let newElf = new Elf();
    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((cal: string) => {
        if (cal === '') {
          elves.push(newElf);
          newElf = new Elf();
        } else {
          newElf.foodCalories.push(parseInt(cal));
        }
      });

    return elves;
  }

  const isTestInput = false;
  const elves = getElves();
  const top3 = elves
    .map((e) => e.totalCalories)
    .sort((a, b) => b - a)
    .slice(0, 3);
  console.log(top3.reduce((a, b) => a + b));
}
