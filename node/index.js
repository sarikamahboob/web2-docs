/*****************************/
// local modules
// way-1
const myModule = require('./local-1');
console.log(myModule.add(2,3), myModule.a)
// way-2
const {add, a} = require('./local-1');
const {add: add2, a: a2} = require('./local-2');
console.log(add(2,3), a)
console.log(add2(2, 3, 5), a2)

/*****************************/
// built in modules
const path = require('path');
console.log(path.dirname("/home/barikoi/Desktop/Practice/next-level/node/index.js"))
console.log(path.parse("/home/barikoi/Desktop/Practice/next-level/node/index.js"))
console.log(path.join("/home/barikoi/Desktop/Practice/next-level/node/", "local-1.js"))
