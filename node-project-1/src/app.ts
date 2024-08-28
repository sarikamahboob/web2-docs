import express, { NextFunction, Request, Response } from "express"
const app = express()

// parser
app.use(express.json())
app.use(express.text())

// router
const userRouter = express.Router();
app.use("/", userRouter)
userRouter.get(
  '/api/v1/users/create-user', 
  (req: Request, res: Response) => {
    const user = req.body
    console.log(user)
    res.json({
      success: true,
      message: "user is created successfully",
      data: user
    })
  }
)

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