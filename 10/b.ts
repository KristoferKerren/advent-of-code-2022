namespace adventOfCode9a {
  function addToCrt(
    crtArray: string[],
    currentCycle: number,
    spritePosition: number
  ) {
    if (currentCycle >= 240) return;
    const spriteX = spritePosition % 40;
    const spriteY = Math.floor(spritePosition / 40);
    const crtX = currentCycle % 40;
    const crtY = Math.floor(currentCycle / 40);
    if (currentCycle > 3700) {
      console.log({
        spritePosition,
        spriteX,
        spriteY,
        currentCycle,
        crtX,
        crtY,
      });
    }
    if (true || spriteY === crtY) {
      if (spriteX >= 0 && spriteX <= 39 && Math.abs(crtX - spriteX) <= 1) {
        crtArray.push('#');
      } else if (
        spriteX - 1 >= 0 &&
        spriteX - 1 <= 39 &&
        Math.abs(crtX - spriteX) <= 1
      ) {
        crtArray.push('#');
      } else if (
        spriteX + 1 >= 0 &&
        spriteX + 1 <= 39 &&
        Math.abs(crtX + spriteX) <= 1
      ) {
        crtArray.push('#');
      } else {
        crtArray.push('.');
      }
    } else {
      crtArray.push('.');
    }
  }

  function logSprite(spritePosition: number) {
    console.log('--------------- Sprite position: ---------------');
    const x = spritePosition % 40;
    const y = Math.floor(spritePosition / 40);
    for (let i = 0; i <= 6; i++) {
      const array = Array<string>(40).fill('.');
      if (y === i) {
        if (x >= 0 && x <= 39) array[x] = '#';
        if (x - 1 >= 0 && x - 1 <= 39) array[x - 1] = '#';
        if (x + 1 >= 0 && x + 1 <= 39) array[x + 1] = '#';
      }
      console.log(array.join(''));
    }
    console.log('\n');
  }

  function logCRT(crtArray: string[]) {
    console.log('--------------- CRT: ---------------');
    const arrayCopy = [...crtArray];
    for (let i = 0; i <= 6; i++) {
      console.log(arrayCopy.splice(0, 40).join(''));
    }
    console.log('\n');
  }

  function parseInput() {
    const fs = require('fs');
    const fileName = isTestInput ? './10/input-example.txt' : './10/input.txt';

    let currentCycle = 0;
    let currentSpritePosition = 1;
    const crtArray: string[] = [];
    addToCrt(crtArray, currentCycle, currentSpritePosition);

    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((row: string) => {
        //console.log({ row, currentCycle, currentSpritePosition });
        if (row === 'noop') {
          currentCycle++;
          addToCrt(crtArray, currentCycle, currentSpritePosition);
        } else if (row.startsWith('addx ')) {
          const [, value] = row.split(' ');
          currentCycle++;
          addToCrt(crtArray, currentCycle, currentSpritePosition);
          currentSpritePosition += parseInt(value);
          currentCycle++;
          addToCrt(crtArray, currentCycle, currentSpritePosition);
        }
      });
    logCRT(crtArray);
  }

  const isTestInput = false;
  parseInput();
}
