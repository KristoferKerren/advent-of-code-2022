import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode6a {
  function getInputText() {
    const fs = require('fs');

    const fileName = './6/input.txt';

    return fs.readFileSync(fileName, 'utf8').replaceAll('\r', '');
  }

  function getFirstMarker(text: string): number {
    for (let i = 3; i < text.length; i++) {
      let isCorrectMarker = true;
      const subText = text.substring(i - 3, i + 1).split('');
      for (let ii = 0; ii < subText.length - 1; ii++) {
        if (subText.filter((char) => char === subText[ii]).length > 1) {
          isCorrectMarker = false;
        }
      }
      if (isCorrectMarker) return i + 1;
    }
    return -1;
  }

  const tests = new Map<string, number>();
  tests.set('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 7);
  tests.set('bvwbjplbgvbhsrlpgdmjqwftvncz', 5);
  tests.set('nppdvjthqldpwncqszvftbrmjlhg', 6);
  tests.set('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 10);
  tests.set('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 11);
  [...tests.entries()].forEach(([text, expected]) => {
    const res = getFirstMarker(text);
    if (res !== expected) {
      console.log(
        `ERROR!: ${text} should be ${expected} but was ${res} instead`
      );
    }
  });

  const text = getInputText();
  console.log(getFirstMarker(text));
}
