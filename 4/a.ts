import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode4a {
  function parseInput(): number {
    const fs = require('fs');

    const fileName = isTestInput ? './4/input-example.txt' : './4/input.txt';
    const input = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((row: string) => {
        return row.split(',').map((h) => h.split('-').map((n) => parseInt(n)));
      })
      .filter((h: number[][]) => {
        if (
          h.at(0)!.at(0)! >= h.at(1)!.at(0)! &&
          h.at(0)!.at(1)! <= h.at(1)!.at(1)!
        )
          return true;
        if (
          h.at(1)!.at(0)! >= h.at(0)!.at(0)! &&
          h.at(1)!.at(1)! <= h.at(0)!.at(1)!
        )
          return true;
        return false;
      }).length;

    return input;
  }

  const isTestInput = false;
  const input = parseInput();
  console.log(input);
}
