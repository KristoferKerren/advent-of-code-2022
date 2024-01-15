import { get } from 'http';
import { findGCD, findLCD, getInput, memoize } from '../helpers';

namespace adventOfCode13 {
  function getPacketPairs() {
    const comp: any[][] = [];
    let pair: string[] = [];
    getInput(fileName).forEach((row, i) => {
      if (row === '') {
        comp.push(pair);
        pair = [];
      } else {
        pair.push(toPacket(row));
      }
    });
    if (pair.length === 2) comp.push(pair);
    return comp;
  }

  function getPacketList(dividerPackets: string[]) {
    const comp: any[] = [];
    getInput(fileName).forEach((row, i) => {
      if (row !== '') {
        comp.push(toPacket(row));
      }
    });
    dividerPackets.forEach((dp) => comp.push(toPacket(dp)));
    return comp;
  }

  const toPacket = (text: string): any => {
    if (!text.includes('[') && !text.includes(',')) {
      return parseInt(text) || -1;
    }

    let level = 0;
    let minLevel = 100000;
    let parsedText = text
      .split('')
      .map((char) => {
        level += char === '[' ? 1 : char === ']' ? -1 : 0;
        if (char === ',') minLevel = Math.min(minLevel, level);
        return char;
      })
      .map((char) => {
        level += char === '[' ? 1 : char === ']' ? -1 : 0;
        if (char === ',' && level === minLevel) {
          return ';';
        }
        return char;
      })
      .join('');
    parsedText = parsedText.substring(minLevel, parsedText.length - minLevel);
    if (!parsedText.includes(';')) {
      return [toPacket(parsedText.substring(1, parsedText.length - 1))];
    }
    return parsedText.split(';').map((t) => toPacket(t));
  };

  const compareArrays = (
    arr1: number[] | number,
    arr2: number[] | number
  ): 'leftIsLarger' | 'equal' | 'rightIsLarger' => {
    if (typeof arr1 === 'number' && typeof arr2 === 'number') {
      return arr1 > arr2
        ? 'leftIsLarger'
        : arr2 > arr1
        ? 'rightIsLarger'
        : 'equal';
    }
    if (typeof arr1 !== 'number' && typeof arr2 === 'number') {
      if (arr2 === -1) return 'leftIsLarger';
      return compareArrays(arr1, [arr2]);
    }
    if (typeof arr1 === 'number' && typeof arr2 !== 'number') {
      if (arr1 === -1) return 'rightIsLarger';
      return compareArrays([arr1], arr2);
    }
    for (let i = 0; i < (arr1 as (number | number[])[]).length; i++) {
      if (!(arr2 as (number | number[])[])[i]) return 'leftIsLarger';
      const comp = compareArrays(
        (arr1 as (number | number[])[])[i],
        (arr2 as (number | number[])[])[i]
      );
      if (comp !== 'equal') return comp;
    }
    if ((arr2 as any[]).length > (arr1 as any[]).length) return 'rightIsLarger';
    return 'equal';
  };

  const pairIsInRightOrder = (pair: any[][]): boolean => {
    if (pair.length !== 2) throw new Error('Not a pair');
    return compareArrays(pair[0], pair[1]) !== 'leftIsLarger';
  };

  const isTestInput = false;
  const fileName = isTestInput ? './13/input-example.txt' : './13/input.txt';

  // Solve 13a:
  const compPairs = getPacketPairs();
  let sum = 0;
  compPairs.forEach((c, i) => {
    if (pairIsInRightOrder(c)) sum += i + 1;
  });
  console.log(sum);

  // Solve 13b:
  const comps = getPacketList(['[[2]]', '[[6]]']);
  let dividerIndexes: number[] = [];
  comps
    .sort((a, b) => (compareArrays(a, b) === 'rightIsLarger' ? -1 : 1))
    .forEach((comp, i) => {
      if (
        comp.length === 1 &&
        comp[0].length === 1 &&
        (comp[0][0] === 2 || comp[0][0] === 6)
      ) {
        dividerIndexes.push(i + 1);
      }
    });
  console.log(dividerIndexes[0] * dividerIndexes[1]);
}
