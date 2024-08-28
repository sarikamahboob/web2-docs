const http = require('http');
const fs = require('fs');

// creating a server using raw node js
const server = http.createServer()

// listener
server.on('request', (req, res) => {
  console.log(req.url, req.method)
  if(req.url === "/read-file" && req.method === "GET");
  const readableStream = fs.createReadStream(process.cwd() + "/texts/read.txt")
  readableStream.on('data', (buffer) =>{
    res.statusCode = 200;
    res.write(buffer)
  })
  readableStream.on('end', () => {
    res.statusCode = 200;
    res.end('the streaming is over')
  })
  readableStream.on('error', (error) => {
    console.log(error)
    res.statusCode = 500;
    res.end('something went wrong!!!')
  })
})

server.listen(5000, () => {
  console.log(`server is listening on 5000`)
})