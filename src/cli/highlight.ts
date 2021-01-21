const readlineSync = require('readline-sync')

/**
 * @param {string} str   string to get highlighted sub-string from.
 * @return {Array}
 */
export function highlightCLI(str) {
  let key, start = 0, end = 1, length;
  if (end > str.length - 1) end = str.length

  console.log('\nLEFT:[Z]  RIGHT:[X]  HOLD:[SHIFT]  DONE:[SPACE]\n\n');
  while (true) {
    [str, length] = getSelected(str, start, end)
    console.log('\x1B[1A\x1B[K' + str);
    key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'zxZX ' });

    if (key.toLowerCase() == 'z') {
      if (key.toUpperCase() === key) {
        if (start > 0) start--
        else end--
      }
      else if (start > 0) { start--; end-- }
    }
    else if (key.toLowerCase() == 'x') {
      if (key.toUpperCase() === key) {
        if (end < length) end++
        else start++
      }
      else if (end < length) { start++; end++; }
    }
    else {
      break;
    }
  }

  return getSelected(str, start, end, true)[0]
}

const getSelected = (str, start, stop, returnBold = false) => {
  const list = str.replace(/\u001b.+?m/g, '').split('')
  const begining = getSection(list, 0, start),
    bold = getSection(list, start, stop),
    end = getSection(list, stop, list.length)

  if (returnBold) return [bold]
  return [begining + '\x1b[44m' + bold + '\x1b[0m' + end, (begining + bold + end).length]
}
const getSection = (str, start, end) => {
  if (str instanceof Array) return str.slice(start, end).join('')
  return str.split('').slice(start, end).join('')
}

// const theList = [
//   "this should be last",
//   'this goes before the other one',
//   'this goes after the other one',
//   "this should be #1",
//   "IDK where this one goes"
// ]

// const section = highlightCLI('nnyyyynnn')
// console.log(section);


// const yes = highlightCLI('nnyyyn')
// console.log(yes);