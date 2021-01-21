import readlineSync from 'readline-sync';
// const highlightCLI = require("./highlight"),
//   selectCLI = require("./select"),
//   reorderCLI = require("./reorder")

/**
* @param {string[]} list   list of any length to reorder.
* @return {Array}
*/
export function reorderCLI(list: string[]): string[] {

  const getSelected = (list: string[], index: number) => {
    list = list.map(val => val.replace(/\u001b.../g, ''))
    return list.map((val, i) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
  }

  let key: string, i = 0;

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


/**
 * @param {string[]} list   list of any length to select from.
 * @param {Object} options  .
 * @return {Array}
 */
export function selectCLI(list: string[], options: { single: boolean; }): string | string[] {
  options = options || { single: false }
  const getSelected = (list: any[], index: number, selected: string | any[]) => {
    return list.map((val: string) => val.replace(/\u001b.../g, ''))
      .map((val: string) => val.replace(/\[.\] /g, ''))
      .map((val: string, i: any) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
      .map((val: string, i: any) => (selected.includes(i) ? '[*] ' + val : '[ ] ' + val))
  }

  const strip = (str: string) => str.replace(/\u001b.../g, '').replace(/\[.\] /g, '')

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
        return strip(list[i])
      } else {
        list = list.map((val: any) => strip(val))
      }
      break;
    }
  }
  return selected.map((num) => list[num])
}


/**
 * @param {string} str   string to get highlighted sub-string from.
 * @return {Array}
 */
export function highlightCLI(str: string): string {

  const getSelected = (str: string, start: number, stop: number, returnBold = false): [string, number?] => {
    const list = str.replace(/\u001b.+?m/g, '').split('')
    const begining = getSection(list, 0, start),
      bold = getSection(list, start, stop),
      end = getSection(list, stop, list.length)

    if (returnBold) return [bold]
    return [begining + '\x1b[44m' + bold + '\x1b[0m' + end, (begining + bold + end).length]
  }
  const getSection = (str: string | string[], start: number, end: number) => {
    if (str instanceof Array) return str.slice(start, end).join('')
    return str.split('').slice(start, end).join('')
  }

  let key: string, start = 0, end = 3, length: number;
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

export function sortCLI(list: string[], categories: string[]): { [cat: string]: string[] } {

  const getSelected = (list: any[], index = null, sorted = null) => {
    list = list.map((val: string) => val.replace(/\u001b.../g, '')).map((val: string) => val.replace(/ -( \d)?$/, ''))
    if (index == null && sorted == null) return list
    list = list.map((val: string, i: string | number) => (sorted[i] + 1) ? val + ' - ' + (sorted[i] + 1) : val + ' -')
    return list.map((val: string, i: any) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
  }

  let key: string, i = 0;
  let sorted = Array(list.length)

  const catList = categories.map((val: string, i: number) => (i + 1).toString() + " - " + val)
  console.log('\nUP:[W]  DOWN:[S]  SORT: NUMBERS  DONE:[SPACE]\n' + catList.join('\n') + '\n'.repeat(list.length + 1));

  while (true) {
    list = getSelected(list, i, sorted)
    console.log('\x1B[1A\x1B[K'.repeat(list.length) + list.join('\n'));
    key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'ws$<1-9> ' });
    if (key === 'w') {
      if (i > 0) i--
    } else if (key === 's') {
      if (i < list.length - 1) i++
    } else if (key.match(/\d/)) {
      sorted[i] = parseInt(key) - 1
    }
    else {
      list = getSelected(list)
      break;
    }
  }
  let cat = Object.fromEntries(categories.map((key: any) => [key, []]));
  sorted.forEach((c, i) => {
    cat[categories[c]].push(list[i])
  });
  return cat
}

// exports = {
//   highlightCLI,
//   selectCLI,
//   reorderCLI,
//   sortCLI
// }