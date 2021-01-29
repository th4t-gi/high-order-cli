import { selectCLI, highlightCLI, reorderCLI, sortCLI } from "./index.js";

const list = ['one', 'two', 'three', 'four']
// const select = selectCLI(list, {})
// const highlight = highlightCLI("1-2-3-4-5")
// const reorder = reorderCLI(list)
const sort = sortCLI(list, list)


console.log(sort);

//TODO: Highlight - When holding shift, shrink highlight
//TODO: Select - Be able to go from first to last option
//TODO: Highlight - change color of highlight
//TODO: Sort - add limit and more than 9 categories