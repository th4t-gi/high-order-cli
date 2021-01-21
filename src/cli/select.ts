import { keyIn } from 'readline-sync';

export function selectCLI(list: string[], options: { single: boolean; } = {single: false}): string | string[] {
  let key: string, i = 0, selected = [];
  let { single } = options

  if (single) {
    console.log('\nUP:[W]  DOWN:[S]  SELECT:[SPACE]' + '\n'.repeat(list.length + 1));
  } else {
    console.log('\nUP:[W]  DOWN:[S]  SELECT:[A]  DONE:[SPACE]' + '\n'.repeat(list.length + 1));
  }

  while (true) {
    list = getSelected(list, i, selected)
    console.log('\x1B[1A\x1B[K'.repeat(list.length) + list.join('\n'));
    key = keyIn('', { hideEchoBack: true, mask: '', limit: 'wsa ' });
    if (key === 'w') {
      if (i > 0) i--
    } else if (key === 's') {
      if (i < list.length - 1) i++
    } else if (key === 'a' && !single) {
      if (selected.includes(i)) {
        selected = selected.filter(val => val !== i)
      } else {
        selected.push(i)
      }
    }
    else {
      if (single) {
        return strip(list[i])
      } else {
        list = list.map((val: any) => strip(val))
      }
      break;
    }
  }
  return selected.map((num) => list[num])
}

const getSelected = (list: any[], index: number, selected: number[]) => {
  return list.map((val: string) => val.replace(/\u001b.../g, ''))
    .map((val: string) => val.replace(/\[.\] /g, ''))
    .map((val: string, i: number) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
    .map((val: string, i: number) => (selected.includes(i) ? '[*] ' + val : '[ ] ' + val))
}

const strip = (str: string) => str.replace(/\u001b.../g, '').replace(/\[.\] /g, '')


// const theList = [
//   "this should be last",
//   'this goes before the other one',
//   'this goes after the other one',
//   "this should be #1",
//   "IDK where this one goes"
// ]

// const newList = selectCLI(theList)
// console.log(newList);