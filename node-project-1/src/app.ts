import express, { NextFunction, Request, Response } from "express"
const app = express()

// parser
app.use(express.json())
app.use(express.text())

// router
const userRouter = express.Router();
const courseRouter = express.Router();

app.use("/api/v1/users", userRouter)
app.use("/api/v1/courses", courseRouter)

userRouter.get('/create-user', (req: Request, res: Response) => {
  const user = req.body
  res.json({
    success: true,
    message: "user is created successfully",
    data: user
  })
})

courseRouter.post('/create-course', (req: Request, res: Response) => {
  // http://localhost:3000/api/v1/courses/create-course
  const course = req.body
  res.json({
    success: true,
    message: "user is created successfully",
    data: course
  })
})

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, req.method, req.hostname)
  next()
}

// get all
app.get('/', logger, (req: Request, res: Response, next: NextFunction) => {
  // query params
  // http://localhost:3000?email=sarika@gmail.com&name=sarika
  console.log(req, req.query.name, req.query.email)
  try {
    res.send('Hello world')
  } catch (error) {
    console.log({error})
    next(error)
  }
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

// catch the error routes
app.all('*', (req: Request, res: Response) => {
  res.status(400).json({
    success: false,
    message: 'route is not found'
  })
})

// catch all the errors in the request
app.use((error:any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  if (error) {
    res.status(400).json({
      success: false,
      message: 'something went wrong'
    })
  }
})

export default app;