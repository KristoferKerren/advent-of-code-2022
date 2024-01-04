import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode3a {
  class Round {
    constructor(public first: string, public second: string) {}

    get common(): string[] {
      const common: string[] = [];
      for (const char of this.first) {
        for (var i = 0; i < this.second.length; i++) {
          if (char === this.second[i] && !common.includes(char)) {
            common.push(char);
          }
        }
      }
      return common;
    }

    get priorities(): number[] {
      return this.common.map(toPriority);
    }

    get sumPriorities(): number {
      return this.priorities.reduce((a, b) => a + b);
    }
  }

  function toPriority(char: string): number {
    if (char === char.toLocaleLowerCase()) {
      return char.charCodeAt(0) - 96;
    } else {
      return char.charCodeAt(0) - 64 + 26;
    }
  }

  function getRounds(): Round[] {
    const fs = require('fs');

    const fileName = isTestInput ? './3/input-example.txt' : './3/input.txt';
    const rounds: Round[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((row: string) => {
        const length = row.length;
        return new Round(row.slice(0, length / 2), row.slice(length / 2));
      });

    return rounds;
  }

  const isTestInput = false;
  const rounds = getRounds()
    .map((r) => r.sumPriorities)
    .reduce((a, b) => a + b);
  console.log(rounds);
}
