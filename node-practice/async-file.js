const fs = require('fs');

// reading text asynchronously
fs.readFile("./texts/read.txt", "utf-8", (error, data) => {
  if (error) throw Error('Error reading text', error);
  console.log(data)
  // writing text asynchronously
  // way-1
  const dataText1 = new Uint8Array(Buffer.from(data));
  fs.writeFile("./texts/write-async1.txt", dataText1, (error) => {
    if (error) throw Error('Error writing text', error);
  })
  // way-2
  fs.writeFile("./texts/write-async2.txt", data, "utf-8", (error) => {
    if (error) throw Error('Error writing text', error);
  })
})


