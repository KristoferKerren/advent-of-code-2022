import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode3b {
  class Round {
    constructor(public groups: string[]) {}

    get common(): string[] {
      if (!this.groups.length) return [];
      const common: string[] = [];
      for (const char of this.groups[0]) {
        if (common.includes(char)) continue;
        let isInAll = true;
        for (var i = 1; i < this.groups.length; i++) {
          if (!this.groups[i].includes(char)) {
            isInAll = false;
          }
        }
        if (isInAll) {
          common.push(char);
        }
      }
      return common;
    }

    get priorities(): number[] {
      return this.common.map(toPriority);
    }

    get sumPriorities(): number {
      if (this.priorities.length === 0) return 0;
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
    const rounds: string[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n');

    const groups: Round[] = [];
    [...rounds].forEach((row: string, i) => {
      if ((i + 1) % 3 === 0) groups.push(new Round(rounds.slice(i - 2, i + 1)));
    });
    return groups;
  }

  const isTestInput = false;
  const rounds = getRounds()
    .map((r) => r.sumPriorities)
    .reduce((a, b) => a + b);
  console.log(rounds);
}
