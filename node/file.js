const fs = require('fs');

// read a file text
const readText = fs.readFileSync("./texts/read.txt", "utf-8")

// write a file text
const writtenText = fs.writeFileSync("./texts/write.txt", readText + 'This is my written text')
