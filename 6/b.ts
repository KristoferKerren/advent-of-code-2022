namespace adventOfCode6b {
  function getInputText() {
    const fs = require('fs');

    const fileName = './6/input.txt';

    return fs.readFileSync(fileName, 'utf8').replaceAll('\r', '');
  }

  function getFirstMarker(text: string): number {
    for (let i = 13; i < text.length; i++) {
      let isCorrectMarker = true;
      const subText = text.substring(i - 13, i + 1).split('');
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
  tests.set('mjqjpqmgbljsphdztnvjfqwrcgsmlb', 19);
  tests.set('bvwbjplbgvbhsrlpgdmjqwftvncz', 23);
  tests.set('nppdvjthqldpwncqszvftbrmjlhg', 23);
  tests.set('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 29);
  tests.set('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 26);

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
