import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode2a {
  class Round {
    constructor(
      public opponent: 'rock' | 'paper' | 'scissors',
      public result: 'lost' | 'draw' | 'won',
      public you?: 'rock' | 'paper' | 'scissors'
    ) {
      if (
        (opponent === 'rock' && result === 'won') ||
        (opponent === 'paper' && result === 'draw') ||
        (opponent === 'scissors' && result === 'lost')
      ) {
        this.you = 'paper';
      } else if (
        (opponent === 'scissors' && result === 'won') ||
        (opponent === 'rock' && result === 'draw') ||
        (opponent === 'paper' && result === 'lost')
      ) {
        this.you = 'rock';
      } else if (
        (opponent === 'paper' && result === 'won') ||
        (opponent === 'scissors' && result === 'draw') ||
        (opponent === 'rock' && result === 'lost')
      ) {
        this.you = 'scissors';
      }
    }

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
    if (str === 'A') return 'rock';
    if (str === 'B') return 'paper';
    if (str === 'C') return 'scissors';
    throw new Error('Invalid input');
  }

  function fromStringResult(str: string): 'lost' | 'draw' | 'won' {
    if (str === 'X') return 'lost';
    if (str === 'Y') return 'draw';
    if (str === 'Z') return 'won';
    throw new Error('Invalid input');
  }

  function getRounds(): Round[] {
    const fs = require('fs');

    const fileName = isTestInput ? './3/input-example.txt' : './3/input.txt';
    const rounds: Round[] = fs
      .readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .map((row: string) => {
        const opponent = fromString(row.split(' ')[0]);
        const result = fromStringResult(row.split(' ')[1]);
        return new Round(opponent, result);
      });

    return rounds;
  }

  const isTestInput = false;
  const rounds = getRounds()
    .map((r) => r.points)
    .reduce((a, b) => a + b);
  console.log(rounds);
}
