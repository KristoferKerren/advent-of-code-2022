import { get } from 'http';
import { memoize } from '../helpers';

namespace adventOfCode7a {
  class Reference {
    constructor(
      public name: string = '',
      public parent?: Reference,
      public children: Reference[] | null = [],
      public size: number = 0,
      public isFile: boolean = false
    ) {}
  }

  function parseInput(): Map<string, Reference> {
    const fs = require('fs');

    const fileName = isTestInput ? './7/input-example.txt' : './7/input.txt';
    const references: Map<string, Reference> = new Map();
    let currentDir = '';
    fs.readFileSync(fileName, 'utf8')
      .replaceAll('\r', '')
      .split('\n')
      .forEach((row: string, i: number) => {
        if (row === '$ cd /') {
          references.set('/', new Reference('/'));
          currentDir = '/';
        } else if (row === '$ cd ..') {
          const dirs = currentDir.split('/').filter((dir) => dir !== '');
          currentDir = `/${dirs
            .slice(0, dirs.length - 1)
            .join('/')}/`.replaceAll('//', '/');
        } else if (row.startsWith('$ cd ')) {
          currentDir = `${currentDir}${row.split(' ').at(-1)}/`;
        } else if (row.startsWith('dir')) {
          const [_, dir] = row.split(' ');
          const parent = references.get(currentDir);
          const newRef = new Reference(dir, parent);
          references.get(`${currentDir}`)?.children?.push(newRef);
          references.set(`${currentDir}${dir}/`, newRef);
        } else if (!row.startsWith('$')) {
          const [size, fileName] = row.split(' ');
          const parent = references.get(currentDir);
          const newRef = new Reference(
            fileName,
            parent,
            null,
            parseInt(size),
            true
          );
          references.get(`${currentDir}`)?.children?.push(newRef);
          references.set(`${currentDir}${fileName}/`, newRef);
        }
      });

    return references;
  }

  const getRefSize = (ref: Reference): number => {
    if (ref.isFile) return ref.size;
    return (
      ref.children?.reduce((acc, child) => acc + getRefSize(child), ref.size) ||
      0
    );
  };

  function printDirs(ref: Reference, tabs: number = 0) {
    const tabsString = Array(tabs).fill('  ').join('');
    const description = ref.isFile ? `file` : 'dir';
    const size = getRefSize(ref);
    console.log(`${tabsString}${ref.name} (${description}, size=${size})`);
    ref.children?.forEach((child) => {
      printDirs(child, tabs + 1);
    });
  }

  const isTestInput = false;
  const refs = parseInput();
  // printDirs(refs.get('/')!);
  let tot = 0;
  [...refs.values()].forEach((ref) => {
    if (!ref.isFile) {
      const size = getRefSize(ref);
      tot += size <= 100000 ? size : 0;
    }
  });
  console.log(`7a: ${tot}`);

  const totalSize = 70000000;
  const neededSpace = 30000000;
  const unusedSpace = totalSize - getRefSize(refs.get('/')!);
  const directoriesSizes = [...refs.values()]
    .filter((ref) => !ref.isFile)
    .map((ref) => getRefSize(ref))
    .sort((a, b) => a - b);
  const freeSpace = directoriesSizes.find((size) => {
    return size >= neededSpace - unusedSpace;
  });
  console.log(`7b: ${freeSpace}`);
}
