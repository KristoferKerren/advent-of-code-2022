import { findGCD, findLCD, getInput, isEqual, memoize } from '../helpers';

namespace adventOfCode20 {
  class FileElement {
    constructor(
      public value: number,
      public originalIndex: number,
      public valueShort?: number
    ) {}
  }
  function getFile(multiplicator: number = 1): FileElement[] {
    const file = getInput(fileName).map(
      (char, i) => new FileElement(parseInt(char) * multiplicator, i)
    );

    file.forEach((f) => {
      f.valueShort = f.value % (file.length - 1);
    });

    return file;
  }

  function printValues() {
    console.log(file?.map((v) => v?.value).join(', '));
  }

  function mix(nbrOfTimes: number = 1) {
    for (let n = 1; n <= nbrOfTimes; n++) {
      for (let i = 0; i < file.length; i++) {
        const currentIndex = file.findIndex((e) => e?.originalIndex === i)!;
        const el = file.at(currentIndex)!;
        let newIndex = currentIndex + el?.valueShort!;
        file.splice(currentIndex, 1);
        while (newIndex <= 0) newIndex += file.length;
        while (newIndex > file.length) newIndex = newIndex % file.length;

        const leftArr = file.splice(0, newIndex);
        const rightArr = file;
        file = [...leftArr, el, ...rightArr];
      }
    }
  }

  function getRes() {
    const ind = file.findIndex((e) => e?.value === 0)!;
    const numbAt1000 = file[(1000 + ind) % file.length].value;
    const numbAt2000 = file[(2000 + ind) % file.length].value;
    const numbAt3000 = file[(3000 + ind) % file.length].value;
    return numbAt1000 + numbAt2000 + numbAt3000;
  }

  const isTestInput = false;
  const fileName = isTestInput ? './20/input-example.txt' : './20/input.txt';

  // Solve 20a
  let file = getFile();
  mix();
  console.log(`Result 20a: ${getRes()}`);

  //Solve 20b:
  file = getFile(811589153);
  mix(10);
  console.log(`Result 20b: ${getRes()}`);
}
