const readlineSync = require('readline-sync')

/**
 * @param {string[]} list   list of any length to select from.
 * @param {Object} options  .
 * @return {Array}
 */
function sortCLI(list, categories) {
  let key, i = 0;
  let sorted = Array(list.length)

  const catList = categories.map((val, i) => (i + 1).toString() + " - " + val)
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
  let cat = Object.fromEntries(categories.map(key => [key, []]));
  sorted.forEach((c, i) => {
    cat[categories[c]].push(list[i])
  });
  return cat
}

const getSelected = (list, index = null, sorted = null) => {
  list = list.map(val => val.replace(/\u001b.../g, '')).map(val => val.replace(/ -( \d)?/, ''))
  if (index == null && sorted == null) return list
  list = list.map((val, i) => (sorted[i] + 1) ? val + ' - ' + (sorted[i] + 1) : val + ' -')
  return list.map((val, i) => (i === index) ? '\x1B[1m' + val + '\x1B[0m' : val)
}

// console.log(readlineSync.keyInPause('what does this do? '))
const theList = [
  'giraffe',
  'computer',
  'car',
  'pig',
  'bacon',
  "IDK where this one goes",
  'markism'
]
const categories = [
  'animals',
  'tech',
  'food',
  'ideas'
]

// const newList = sortCLI(theList, categories)
// console.log(newList);
// console.log(newList);
// console.log(newList);