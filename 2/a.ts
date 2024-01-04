import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode2a {
  class Round {
    constructor(
      public opponent: 'rock' | 'paper' | 'scissors',
      public you: 'rock' | 'paper' | 'scissors'
    ) {}

    get points() {
      const pointsFromYou =
        this.you === 'rock' ? 1 : this.you === 'paper' ? 2 : 3;
      const pointsFromOutcome =
        (this.you === 'rock' && this.opponent === 'scissors') ||
        (this.you === 'paper' && this.opponent === 'rock') ||
        (this.you === 'scissors' && this.opponent === 'paper')
          ? 6
          : this.you === this.opponent
          ? 3
          : 0;

      return pointsFromYou + pointsFromOutcome;
    }
  }

  function fromString(str: string): 'rock' | 'paper' | 'scissors' {
    if (str === 'A' || str === 'X') return 'rock';
    if (str === 'B' || str === 'Y') return 'paper';
    if (str === 'C' || str === 'Z') return 'scissors';
    throw new Error('Invalid input');
  }

  function getRounds(): Round[] {
    const fs = require('fs');

    const fileName = isTestInput ? './2/input-example.txt' : './2/input.txt';
    const rounds: Round[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((row: string) => {
        const [opponent, you] = row.split(' ').map(fromString);
        return new Round(opponent, you);
      });

    return rounds;
  }

  const isTestInput = false;
  const rounds = getRounds()
    .map((r) => r.points)
    .reduce((a, b) => a + b);
  console.log(rounds);
}
