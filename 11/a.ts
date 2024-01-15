import { get } from 'http';
import { findGCD, findLCD, memoize } from '../helpers';

namespace adventOfCode11a {
  class Monkey {
    constructor(
      public items: number[] = [],
      public operationSign: 'times' | 'plus' = 'times',
      public operationAmount: number | 'old' = 'old',
      public testDivider: number = -1,
      public ifTrueMonkey: number = -1,
      public ifFalseMonkey: number = -1,
      public inspectations: number = 0
    ) {}
  }

  function getMonkeyMap(): Map<number, Monkey> {
    const fs = require('fs');
    const fileName = isTestInput ? './11/input-example.txt' : './11/input.txt';
    let monkey: Monkey = new Monkey();
    let monkeyNbr = -1;
    const monkeyMap = new Map<number, Monkey>();
    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((row: string) => {
        row = row.replaceAll(' ', '');
        if (row.startsWith('Monkey')) {
          monkeyNbr = parseInt(row.replace('Monkey', '').replace(':', ''));
        }
        if (row.startsWith('Starting')) {
          monkey.items = row
            .replace('Startingitems:', '')
            .split(',')
            .map((item) => parseInt(item));
        }
        if (row.startsWith('Operation')) {
          const operationSplit = row
            .replace('Operation:new=old', '')
            .replace('*', 'times ')
            .replace('+', 'plus ')
            .split(' ');
          monkey.operationSign = operationSplit[0] as 'times' | 'plus';
          const operationAmount = parseInt(operationSplit[1]);
          if (operationAmount) monkey.operationAmount = operationAmount;
        }
        if (row.startsWith('Test')) {
          monkey.testDivider = parseInt(row.replace('Test:divisibleby', ''));
        }
        if (row.startsWith('Iftrue')) {
          monkey.ifTrueMonkey = parseInt(
            row.replace('Iftrue:throwtomonkey', '')
          );
        }
        if (row.startsWith('Iffalse')) {
          monkey.ifFalseMonkey = parseInt(
            row.replace('Iffalse:throwtomonkey', '')
          );
          monkeyMap.set(monkeyNbr, monkey);
          monkey = new Monkey();
          monkeyNbr = -1;
        }
      });

    return monkeyMap;
  }

  function doNextRound(worryDivider: number) {
    [...monkeyMap.values()].forEach((monkey) => {
      const operation = monkey?.operationSign;
      while (monkey.items.length) {
        const item = monkey.items.shift()!;
        const operationAmount =
          monkey?.operationAmount === 'old' ? item : monkey?.operationAmount;
        let newWorryLevel: number =
          operation === 'times'
            ? item * operationAmount
            : item + operationAmount;
        if (worryDivider !== 1) {
          newWorryLevel = Math.floor(newWorryLevel / worryDivider);
        }
        newWorryLevel = newWorryLevel % lcd;
        const isTrue = newWorryLevel % monkey?.testDivider === 0;
        const throwToMonkey = isTrue
          ? monkey?.ifTrueMonkey
          : monkey?.ifFalseMonkey;
        monkeyMap.get(throwToMonkey)!.items.push(newWorryLevel);
        monkey.inspectations++;
      }
    });
  }

  const logMonkeys = (header: string) => {
    console.log(`\n--------- ${header} ----------\n`);
    [...monkeyMap.entries()].forEach(([monkeyNbr, monkey]) => {
      console.log(`-- Monkey ${monkeyNbr}: --`);
      monkey.items.forEach((item) => {
        console.log(item?.toString());
      });
      console.log(`Inspectations: ${monkey.inspectations}`);
    });
  };

  function doRounds(nbrOfRounds: number, worryDivider: number) {
    //logMonkeys('At start');
    for (let i = 1; i <= nbrOfRounds; i++) {
      if (i % 100 === 0) console.log(`${(100 * i) / nbrOfRounds}%`);
      doNextRound(worryDivider);
      //logMonkeys(`After rount ${i}`);
    }
  }

  function getTotalMonkeyBusiness() {
    const total: number[] = [];
    [...monkeyMap.entries()].forEach(([monkeyNbr, monkey]) => {
      total.push(monkey.inspectations);
    });

    console.log(total);
    return total
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((a, b) => a * b, 1);
  }

  const isTestInput = false;

  // // 11a:
  let monkeyMap: Map<number, Monkey> = getMonkeyMap();
  const lcd = findLCD([...monkeyMap.values()].map((m) => m.testDivider));
  doRounds(20, 3);
  console.log(`11a: ${getTotalMonkeyBusiness()}`);

  //11b:
  monkeyMap = getMonkeyMap();
  doRounds(10000, 1);
  console.log(`11b: ${getTotalMonkeyBusiness()}`);
}
