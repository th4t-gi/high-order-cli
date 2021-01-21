const readlineSync = require('readline-sync')

/**
 * @param {string[]} list   list of any length to select from.
 * @param {Object} options  .
 * @return {Array}
 */
export function selectCLI(list, options) {
  let key, i = 0, selected = [];
  let { single } = options

  if (single) {
    console.log('\nUP:[W]  DOWN:[S]  SELECT:[SPACE]' + '\n'.repeat(list.length + 1));
  } else {
    console.log('\nUP:[W]  DOWN:[S]  SELECT:[A]  DONE:[SPACE]' + '\n'.repeat(list.length + 1));
  }

  while (true) {
    list = getSelected(list, i, selected)
    console.log('\x1B[1A\x1B[K'.repeat(list.length) + list.join('\n'));
    key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'wsa ' });
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
        return list[i]
      } else {
        list = list.map(val => val.replace(/\u001b.../g, '')).map(val => val.replace(/\[.\] /g, ''))
      }
      break;
    }
  }
  return selected.map((num) => list[num])
}

const getSelected = (list, index, selected) => {
  return list.map(val => val.replace(/\u001b.../g, ''))
    .map(val => val.replace(/\[.\] /g, ''))
    .map((val, i) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
    .map((val, i) => (selected.includes(i) ? '[*] ' + val : '[ ] ' + val))
}

// const theList = [
//   "this should be last",
//   'this goes before the other one',
//   'this goes after the other one',
//   "this should be #1",
//   "IDK where this one goes"
// ]

// const newList = selectCLI(theList)
// console.log(newList);