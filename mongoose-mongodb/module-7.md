## 7-1 What is nodejs , a high level overview of node.js
- javascript was invented to do the interactivity with the browser
- node.js runs the javascript in the server side 
- google created the v8 engine for chrome to run the javascript in the browser
- node js was initially developed by the Ryan Dahl in 2009
- node js modules
  - operating system module (os)
  - file system module (fs)
  - path module (path)
  - http module (http)
  - url module (url)
  - utilities module (util)
- why node js is popular ?
  - we can use javascript on the server side
  - build highly scalable backend applications
  - it is single threaded, event driven and works non-blocking I/O 
  - perfect building data intensive, streaming application
- cons of using node js
  - highly cpu intensive tasks
- node js depends on the v8 engine and libuv
- node js runtime is based on v8 engine written in C++ and javascript. Without v8 node js would never understand javascript code. V8 is the most important dependencies of node js
- libuv is an open source library written on C++ which focuses on asynchronous I/O and gives node access to Computer OS, file systems, networking etc.
- libuv implements 2 important parts of node js
  - event loop 
    - executes callback functions
    - network I/O
  - thread pool
   - cpu intensive tasks
   - file access
   - file compression
   - cryptography
- node js works in single thread so when intensive tasks will come it will give the tasks to the thread pool and after the thread pool work done, the single thread will give back the task to the client

## 7-2 What is module, commonjs vs esm
- a module is an isolated and reusable block of code that has its own scope
  - we can use function scope (IIFE) to make the block scope
- node js now supports esm module
  - commonjs
    - require 
    - export / module.exports
    - .js
  - esm
    - import
    - export default
    - .mjs
- modular system
  - local methods (we create)
  - built in modules (come with nodejs)
  - third party modules (created by others)
- local-1.js
```js
const add = (param1, param2) => {
  return param1 + param2
}
const a = 10;

module.exports = {
  add ,
  a
}
```
- local-2.js
```js
const add = (param1, param2, param3) => {
  return param1 + param2 + param3;
} 
const a = 20;

module.exports = {
  add,
  a
}
```
- index.js
```js
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
```
## 7-3 File System Module , synchronous vs asynchronous
- read text from a file
  - here utf-8 using for encoding
```js
const fs = require('fs');

// read a file text
const readText = fs.readFileSync("./texts/read.txt", "utf-8")
console.log(readText)
```
- write text to a file
```js 
const fs = require('fs');

// read a file text
const readText = fs.readFileSync("./texts/read.txt", "utf-8")

// write a file text
// here writtenText will give undefined output but will write in the file
const writtenText = fs.writeFileSync("./texts/write.txt", readText + 'This is my written text')
```
- readFileSync and writeFileSync are two blocking methods. If someone request this methods until the read and write operations are completed, it will block other operations. So thats why we have to use asynchronous methods.
```js
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
```
## 7-5 Stream and buffer, create your own server
- streams are objects in node js that lets the user read data from a source or write data to a destination in a continuous manner
- stream is used to process a data piece by piece which is called buffer
  - it is better in terms of user experience
  - needs short memory storage as it do not complete whole process at once 
- different types of streams
  - readable stream - a stream where we can read data ( ex. http req, fs.readStream)
  - writable stream - a stream where we can write data (ex. http response, fs.writeStream)
  - duplex stream - a stream for both read and write
  - transform stream - a stream where we can reshape data
```js
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
```
## 7-6 Installing express, typescript
- fast, unopinionated, minimalist web framework for node.js
```js
// initialize package json file
npm init -y
// install express
bun add express
// install typescript as dev dependency
bun add -D typescript
// initialize typescript
npx tsc --init
// install node type as dev dependency
bun add -D @types/node
// install express type as dev dependency
bun add -D @types/express
```
- app.ts
```js
import express from "express"
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app;
```
- server.ts
```js
import { Server } from "http";
import app from "./app";

const PORT = 3000;
let server: Server;

async function bootstrap() {
  server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })

}
bootstrap()
```
## 7-7 What is parsers, request and response object
- in tsconfig.json change the directories
  - tsc command for make the ts file to js
```js
"module": "commonjs",    
"rootDir": "./src/",  
"outDir": "./dist"
```
```js
// install nodemon
bun add nodemon
// add the script in the package.json file
"start:dev": "nodemon ./dist/server.js",
// for auto typescript compilation
tsc -w
```
- app.ts file
```js
import express, { Request, Response } from "express"
const app = express()

//parser
app.use(express.json()) // will parse the json file
app.use(express.text()) // will parse the text file

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!')
})

app.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  // res.send('got data')
  res.json({
    message: "successfully received data"
  })
})

export default app;
```
## 7-8 middleware in express.js
- app.ts file 
  - middleware works as a middle man between requests and responses
```js
import express, { NextFunction, Request, Response } from "express"
const app = express()

// parser
app.use(express.json())
app.use(express.text())

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, req.method, req.hostname)
  next()
}

// get all
app.get('/', logger, (req: Request, res: Response) => {
  // query params
  // http://localhost:3000?email=sarika@gmail.com&name=sarika
  console.log(req, req.query.name, req.query.email)
  res.send('Hello world!')
})

// get by id ( from params )
app.get('/:userId/:subId', logger, (req: Request, res: Response) => {
  // http://localhost:3000/56/72
  console.log(req.params.userId, req.params.subId)
  res.send('Hello world!')
})

// post data
app.post('/', logger, (req: Request, res: Response) => {
  // http://localhost:3000/
  console.log(req.body)
  // res.send('got data')
  res.json({
    message: "successfully received data"
  })
})

export default app;
```
## 7-9 Routing in express.js

