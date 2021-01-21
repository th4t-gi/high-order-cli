const readlineSync = require('readline-sync')

/**
 * @param {string[]} list   list of any length to reorder.
 * @return {Array}
 */
export function reorderCLI(list) {
  let key, i = 0;

  console.log('\nUP:[W]  DOWN:[S]  HOLD:[SHIFT]  DONE:[SPACE]' + '\n'.repeat(list.length + 1));

  while (true) {
    list = getSelected(list, i)
    console.log('\x1B[1A\x1B[K'.repeat(list.length) + list.join('\n'));
    key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'wsWS ' });

    if (key.toLowerCase() == 'w') {
      if (key.toUpperCase() === key && i > 0) {
        [list[i - 1], list[i]] = [list[i], list[i - 1]]
      }
      if (i > 0) i--
    }
    else if (key.toLowerCase() == 's') {
      if (key.toUpperCase() === key && i < list.length - 1) {
        [list[i], list[i + 1]] = [list[i + 1], list[i]]
      }
      if (i < list.length - 1) i++
    }
    else {
      break;
    }
  }

  return list.map(val => val.replace(/\u001b.../g, ''))
}

const getSelected = (list, index) => {
  list = list.map(val => val.replace(/\u001b.../g, ''))
  return list.map((val, i) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
}

// const theList = [
//   "this should be last",
//   'this goes before the other one',
//   'this goes after the other one',
//   "this should be #1",
//   "IDK where this one goes"
// ]

// const newList = reorderCLI(theList)
// console.log(newList);