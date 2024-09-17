## 11-1 What is SDLC, How will we start our project
- Minimum viable product
  - An MVP is the simplest version of a product that can be built to sell to the market. It's used to attract early customers and validate a product idea early in the development cycle. 
- 3 types of roles in the University Management System
  - faculty
    - login
    - give student mark
  - see class schedules
  - student
    - login
    - course enroll
  - admin
    - login
    - course offer
    - create account
    - start semester registration
    - add course
    - add semester
- 2 things need to done this university project
  - Authentication
  - Management
- How software should start
  - SDLC ( Software Development Life Cycle)
    - Planning
    - Analyze
    - Design
    - Implementation
    - Testing & Integration
    - Maintenance
- How it goes
  - Analyze
    - who should do the analysis
      - product owner
      - project manager
      - business analyst
    - what things need to be done
      - product requirements document (PRD)
      - business requirements document (BRD)
      - software requirements specification (SRS)
      - functional requirements document (FRD)
  - Design
    - who should do the design
      - system architect
      - UI/UX designer
    - what things need to be done
      - system design of software
      - high level design document
      - low level design document
      - database schema
  - Development
    - who should do the development
      - frontend developer
      - backend developer
      - full-stack developer
    - what things need to be done
      - backend development
      - frontend development
      - api integration
      - database schema
  - Testing
    - who should do the testing
      - solution architect
      - SQAn engineer
      - tester
    -  what things need to be done
      - test plan
      - test case
      - test scripts
      - defects report
  - Deployment
    - who should do the deployment
      - database administrator
      - devops
    - what things need to be done
      - release notes
      - installation guides
      - configuration guides
  - Maintenance
    - who should do the maintenance
      - support engineer
      - tester
      - developer
    - what things need to be done
      - change request
      - bug reports
      - patch release
- How will start this project
  - requirements analysis
  - er diagram
  - api endpoints
  - wireframe
## 11-2 Requirement Analysis of PH University Management
- Functional Requirements:
  - Authentication
     - Student
      - Students can login and logout securely
      - Students can update their password
    - Faculty
      - Faculty can login and logout securely
      - Faculty can update their password
    - Admin
      - Admin can login and logout securely
      - Admin can update their password
- Profile Management:
  - Student
    - Students can manage and update their profile
    - Students can update certain fields
  - Faculty
    - Faculty can manage and update their profile
    - Faculty can update certain fields
  - Admin
    - Admin can manage and update their profile
    - Admin can update certain fields
- Academic Process:
  - Student
    - Students can enroll i offered courses for a specific semester
    - Students can view their class schedules
    - Students can see their grades
    - Students can view notce board and events
  - Faculty
    - Faculty can manage students grades
    - Faculty can access students personal and academic information
  - Admin
    - Admin can manage multiple processes:
      - Semester
      - Course
      - Offered Course
      - Section
      - Room
      - Building
- User Management:
  - Admin 
    - Admin can manage multiple accounts
    - Admin can block/unblock user
    - Admin can change user password
## 11-3 Modeling Data for PH University Management
- User
  - _id
  - id (generated custom id)
  - password
  - needsPasswordChange
  - role
  - status
  - isDeleted
  - createdAt
  - updatedAt
- Student 
  - _id
  - id (generated custom id)
  - name
  - gender
  - dateOfBirth
  - email
  - contactNo
  - emergencyContactNo
  - presentAddress
  - permanentAddress
  - guardian
  - localGuardian
  - profileImage
  - academicDepartment
  - isDeleted
  - createdAt
  - updatedAt
- Faculty
  - _id
  - id (generated custom id)
  - designation
  - name
  - gender
  - dateOfBirth
  - email
  - contactNo
  - emergencyContactNo
  - presentAddress
  - permanentAddress
  - profile image
  - academicFaculty
  - academicDepartment
  - isDeleted
  - createdAt
  - updatedAt
- Admin
  - _id
  - id (generated custom id)
  - designation
  - name
  - gender
  - dateOfBirth
  - email
  - contactNo
  - emergencyContactNo
  - presentAddress
  - permanentAddress
  - profile image
  - managementDepartment
  - isDeleted
  - createdAt
  - updatedAt
- Academic Semester
  - name
  - year
  - code 
  - startMonth
  - endMonth
- Academic Faculty
  - _id
  - name
  - createdAt
  - updatedAt
- Academic Department
  - _id
  - name
  - academicFaculty
  - createdAt
  - updatedAt
## 11-4 Design Schema and ER Diagram
- embedding and referencing 
  - mongodb can embed upto 16mb but there is no limitations for referencing
  - if any data is possibly grow in the future, we can reference that data 
  - embedding pros and cons
    - pros
      - faster reading
      - update all data with single query
      - less expensive lookup
    - cons
      - slow writing
      - update query can be complex
      - limited size
      - data duplicacy
  - referencing pros and cons
    - pros
      - faster writing
      - avoid data duplicacy
      - scalabilty
    - cons
      - slow reading
      - expensive lookup

## 11-5 How to make ER Diagram for PH University Management
- [lucid chart er diagram](https://lucid.app/lucidchart/99f8d59f-9140-4723-9f5f-c569e7f51714/edit?view_items=1RG_ylWKUYa7&invitationId=inv_7937b89e-9335-497f-a5f6-c1170537caac)

## 11-6 Create API Endpoints for PH University Management
- user:
  - users/create-student (POST)
  - users/create-faculty (POST)
  - users/create-admin (POST)
- student:
  - students/ (GET)
  - students/:id (GET)
  - students/:id (PATCH)
  - students/:id (DELETE)
  - students/my-profile (GET)
- faculty:
  - faculties/ (GET)
  - faculties/:id (GET)
  - faculties/:id (PATCH)
  - faculties/:id (DELETE)
  - faculties/my-profile (GET)
- admin:
  - admins/ (GET)
  - admins/:id (GET)
  - admins/:id (PATCH)
  - admins/:id (DELETE)
  - admins/my-profile (GET)
- auth:
  - auth/login (POST)
  - auth/refresh-token (POST)
  - auth/change-password (POST)
  - auth/forget-password (POST)
  - auth/reset-password (POST)

## 11-7 Create user interface ,model and validation
- user.interface.ts
```js
export type TUser = {
  id: string
  password: string
  needsPasswordChange: boolean
  role: 'admin' | 'student' | 'faculty'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}
```
- user.model.ts
```js
import { model, Schema } from "mongoose"
import { TUser } from "./user.interface"

const userSchema = new Schema<TUser>({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  needsPasswordChange: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'faculty'],
  },
  status: {
    type: String,
    enum: ['in-progress', 'blocked'],
    default: 'in-progress',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

export const UserModel = model<TUser>('User', userSchema)
```
- user.validation.ts
```js
import { z } from 'zod'

const userSchemaValidation = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string'
    })
    .max(20, { message: 'password can not be more than 20 characters' })
    .optional(),
})
// export default userSchemaValidation
export const UserValidation = {
  userSchemaValidation,
}
```
## 11-8 Refactor user validation , student route ,controller and service
## 11-9 Refactor user controller and service
- add env variable
```js
DEFAULT_PASS=phuniversity!@#
```
- update the config file
```js
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
}
```
- user.interface.ts file update
```js
export type TUser = {
  id: string
  password: string
  needsPasswordChange: boolean
  role: 'admin' | 'student' | 'faculty'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export type NewUser = {
  role: string
  password: string
  id: string
}
```
## 11-10 Create User as Student
- app.ts
```js
// application routes
app.use('/api/v1/students', StudentRoutes)
app.use('/api/v1/users', UserRoutes)
```
- user.route.ts
```js
import express from 'express'
import { UserControllers } from './user.controller'

const router = express.Router()
router.post('/create-student', UserControllers.createStudent)
export const UserRoutes = router
```
- student.interface.ts
```js
import { Model, Types } from "mongoose"
export type TStudent = {
  id: string
  user: Types.ObjectId
  password: string
  name: TUserName
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: Date
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImage?: string
  isDeleted: boolean
}
```
- student.model.ts
```js
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true, required: [true, 'ID is required'] },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User'
  },
  password: { type: String, required: [true, 'password is required'], maxlength: [20, 'password cannot be more than 20 characters'] },
  name: { type: userNameSchema, required: true },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "{VALUE} is not valid. The gender field can only be of the following: 'male', 'female', 'other'",
    },
    required: true,
  },
  dateOfBirth: { type: Date },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B+', 'O+', 'O-'],
  },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: { type: guardianSchema, required: true },
  localGuardian: { type: localGuardianSchema, required: true },
  profileImage: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{
  toJSON: {
    virtuals: true
  }
})
```
- user.controller.ts
```js
import { Request, Response } from "express"
import {  UserServices } from "./user.service"
const createStudent = async (req: Request, res: Response) => {
  try {
    const {password, student: studentData } = req.body
    // validation using zod
    // const zodParseData = studentValidationSchema.parse(studentData)

    const result = await UserServices.createStudentIntoDB(password,studentData )
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'student data is not created!',
      error: error,
    })
  }
}
export const UserControllers = {
  createStudent
}
```
- user.service.ts
```js
import config from "../../config"
import { TStudent } from "../student/student.interface"
import { Student } from "../student/student.model"
import { TUser } from "./user.interface"
import { UserModel } from "./user.model"
const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData:Partial<TUser> = {}
  // if password is not given, use default password
  userData.password = password || config.default_pass as string
  // set student role
  userData.role = 'student';
  // set manually generated id
  userData.id = '2030100001'
  // create a user
  const newUser = await UserModel.create(userData)
  // create a student
  if(Object.keys(newUser).length) {
    // set id, _id as user
    studentData.id = newUser.id //embedding id 
    studentData.user = newUser._id // reference _id 

    const newStudent = await Student.create(studentData)
    return newStudent
  }
}
export const UserServices = {
  createStudentIntoDB
}
```
## 11-11 Fix bugs and setup basic global error handler
- app.ts globalErrorHandler added
```js
// application routes
app.use('/api/v1/students', StudentRoutes)
app.use('/api/v1/users', UserRoutes)

app.use(globalErrorHandler)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the project')
})

export default app
```
- in middleware globalErrorHandler file added
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"

const globalErrorHandler = (err: any, req:Request, res: Response, next: NextFunction) => {
  const statusCode:any = 500
  const message = 'something went wrong!'
  return res.status(statusCode).json({ 
    success: false,
    message,
    error: err
  })
}

export default globalErrorHandler
```
- user.model.ts
```js
import { model, Schema } from "mongoose"
import { TUser } from "./user.interface"
import bcrypt from "bcrypt";
import config from '../../config';

const userSchema = new Schema<TUser>({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  needsPasswordChange: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'faculty'],
  },
  status: {
    type: String,
    enum: ['in-progress', 'blocked'],
    default: 'in-progress',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  // hashing password and save into database
  const user = this
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
  next()
})

// set empty string after saving password
userSchema.post('save', function(doc,next) {
  doc.password = ''
  next()
})

export const UserModel = model<TUser>('User', userSchema)

```
- student.model.ts 
```js
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Schema, model } from 'mongoose'
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface'
import validator from 'validator'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    trim: true,
    maxlength: [20, 'first name can not be more than 20'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1)
        return firstNameStr === value
      },
      message: `{VALUE} is not in capitalize format`,
    },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: `{VALUE} is not valid`,
    },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
})

/***creating a custom static method ***/
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true, required: [true, 'ID is required'] },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    unique: true,
    ref: 'User'
  },
  name: { type: userNameSchema, required: true },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        "{VALUE} is not valid. The gender field can only be of the following: 'male', 'female', 'other'",
    },
    required: true,
  },
  dateOfBirth: { type: Date },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B+', 'O+', 'O-'],
  },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: { type: guardianSchema, required: true },
  localGuardian: { type: localGuardianSchema, required: true },
  profileImage: { type: String },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{
  toJSON: {
    virtuals: true
  }
})

/*** mongoose virtual ***/ 
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
})

/*** query middleware ***/
studentSchema.pre('find', function(next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})
studentSchema.pre('findOne', function(next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({$match: {isDeleted: {$ne: true}}})
  next()
})

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
```
- user.controller.ts
```js
import { NextFunction, Request, Response } from "express"
import {  UserServices } from "./user.service"
const createStudent = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const {password, student: studentData } = req.body
    const result = await UserServices.createStudentIntoDB(password,studentData )
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const UserControllers = {
  createStudent
}
```
- student.controller.ts
```js
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.zod.validation'

const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()
    res.status(200).json({
      success: true,
      message: 'students are fetched successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'students is retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'students is deleted successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const updateSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const studentData = req.body
    // Partial validation using zod
    const zodParseData: any = studentValidationSchema.partial().parse(studentData);
    const { studentId } = req.params
    const result = await StudentServices.updateSingleStudentFromDB(studentId, zodParseData)
    res.status(200).json({
      success: true,
      message: 'students is updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateSingleStudent
}
```
## 11-12 Create not found route & sendResponse utility
- notFound.ts file made in the utils directory
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found',
    error: '',
  })
}
export default notFound
```
- app.ts
```js
app.use(globalErrorHandler)
app.use(notFound)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the project')
})

export default app
```
- for response made a global response file
```js
import { Response } from "express";

type TResponse<T> = {
  statusCode: number,
  success: boolean,
  message?: string,
  data: T,
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || '',
    data: data.data,
  })
}

export default sendResponse;
```
- user.controller.ts
```js
const createStudent = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const {password, student: studentData } = req.body
    const result = await UserServices.createStudentIntoDB(password,studentData )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const UserControllers = {
  createStudent
}
```
## 11-13 Create index route and module summary
- app.ts updated
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
 
import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'
import { UserRoutes } from './app/modules/user/user.route'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import notFound from './app/middleware/notFound'
import router from './app/routes'

const app: Application = express()

// parsers
app.use(express.json())
app.use(cors())

// application routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the project')
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
```
- in app folder, routes folder made with a index file and all the routes are sorted there
```js
import {Router} from "express"
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))
export default router
```
