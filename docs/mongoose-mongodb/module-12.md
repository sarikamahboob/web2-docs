## 12-1 Avoid try-catch repetition , use catchAsync
- Higher Order Functions
  - a function that takes a function, do some tasks and return a function
- user.controllers.ts updated with the RequestHandler 
```js
import { NextFunction, Request, RequestHandler, Response } from "express"
import {  UserServices } from "./user.service"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"
const createStudent:RequestHandler = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const {password, student: studentData } = req.body
    // validation using zod
    // const zodParseData = studentValidationSchema.parse(studentData)

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
- student.controller.ts updatted with the higher order try catch function
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  NextFunction, Request,Response, RequestHandler } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.zod.validation'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}

const getAllStudents = catchAsync(async (req, res, next) => {
    const result = await StudentServices.getAllStudentsFromDB()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students are fetched successfully',
      data: result,
    })
})

const getSingleStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is retrieved successfully',
      data: result,
    })
})

const deleteStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is deleted successfully',
      data: result,
    })
})

const updateSingleStudent = catchAsync(async (req, res, next) => {
    const studentData = req.body
    // Partial validation using zod
    const zodParseData: any = studentValidationSchema
      .partial()
      .parse(studentData)
    const { studentId } = req.params
    const result = await StudentServices.updateSingleStudentFromDB(
      studentId,
      zodParseData,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is updated successfully',
      data: result,
    })
})

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateSingleStudent
}
```
## 12-2 Implement a shenabahini middleware
- make catchAsync higher order function in utils directory
```js
import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}

export default catchAsync;
```
- modify the student.controller.ts 
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  NextFunction, Request,Response, RequestHandler } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.zod.validation'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'

const getAllStudents = catchAsync(async (req, res, next) => {
    const result = await StudentServices.getAllStudentsFromDB()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students are fetched successfully',
      data: result,
    })
})

const getSingleStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is retrieved successfully',
      data: result,
    })
})

const deleteStudent = catchAsync(async (req, res, next) => {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is deleted successfully',
      data: result,
    })
})

const updateSingleStudent = catchAsync(async (req, res, next) => {
    const studentData = req.body
    // Partial validation using zod
    const zodParseData: any = studentValidationSchema
      .partial()
      .parse(studentData)
    const { studentId } = req.params
    const result = await StudentServices.updateSingleStudentFromDB(
      studentId,
      zodParseData,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'students is updated successfully',
      data: result,
    })
})

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateSingleStudent
}
```
- modify user.controller.ts
```js
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, RequestHandler, Response } from "express"
import {  UserServices } from "./user.service"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"

const createStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      const { password, student: studentData } = req.body
      const result = await UserServices.createStudentIntoDB(
        password,
        studentData,
      )
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'student is created successfully',
        data: result,
      })
  },
)

export const UserControllers = {
  createStudent
}
```
## 12-3 Implement validateRequest Middleware
- validateRequest.ts made in the middleware directory
```js
import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // validation using zod
      // if everything alright will go to the controller
      await schema.parseAsync({
        body: req.body,
      })
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validateRequest
```
- user.route.ts file modify
```js
import express from 'express'
import { UserControllers } from './user.controller'
import { StudentValidations } from '../student/student.zod.validation'
import validateRequest from '../../middleware/validateRequest'
const router = express.Router()
router.post(
  '/create-student',
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
)
export const UserRoutes = router
```
- student.zod.validation.ts file updated
```js
import { z } from 'zod'

// Username schema
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'first name is required' })
    .max(20, { message: 'first name can not be more than 20 characters' })
    .transform((value) => value.charAt(0).toUpperCase() + value.slice(1))
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      { message: 'First name must start with a capital letter' },
    ),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: 'last name is required' })
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'last name is not valid',
    }),
})

// Guardian schema
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  fatherOccupation: z
    .string()
    .min(1, { message: 'Father occupation is required' }),
  fatherContactNo: z
    .string()
    .min(10, { message: 'Father contact number is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
  motherOccupation: z
    .string()
    .min(1, { message: 'Mother occupation is required' }),
  motherContactNo: z
    .string()
    .min(10, { message: 'Mother contact number is required' }),
})

// Local Guardian schema
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, { message: 'Local guardian name is required' }),
  occupation: z
    .string()
    .min(1, { message: 'Local guardian occupation is required' }),
  contactNo: z
    .string()
    .min(10, { message: 'Local guardian contact number is required' }),
  address: z.string().min(1, { message: 'Local guardian address is required' }),
})

// Student schema
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .max(20, { message: 'Password cannot be more than 20 characters' }),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({
          message: "The gender field can only be 'male', 'female', or 'other'",
        }),
      }),
      dateOfBirth: z
        .date()
        .optional()
      email: z
        .string()
        .email({ message: 'Invalid email format' })
        .min(1, { message: 'Email is required' }),
      contactNo: z
        .string()
        .min(10, { message: 'Contact number must have at least 10 digits' }),
      emergencyContactNo: z.string().min(10, {
        message: 'Emergency contact number must have at least 10 digits',
      }),
      bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'O+', 'O-'], {
        errorMap: () => ({
          message:
            "Invalid blood group. It must be one of 'A+', 'A-', 'AB+', 'AB-', 'B+', 'O+', 'O-'",
        }),
      }),
      presentAddress: z
        .string()
        .min(1, { message: 'Present address is required' }),
      permanentAddress: z
        .string()
        .min(1, { message: 'Permanent address is required' }),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImage: z.string().optional(),
    }),
  }),
})
export const StudentValidations = {
  createStudentValidationSchema
}
```
## 12-4 Create Academic Semester Interface
- create id like this 
  - year-semester_code-4-digit-code
  - semester code 
    - 01- autumn
    - 02-summer
    - 03-fall
- academicSemester.interface.ts file
```js
export type TMonths = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'; 

export type TAcademicSemesterName =  'Autumn' | 'Summer' | 'Fall'

export type TAcademicSemesterCode =  '01' | '02' | '03'

export type TAcademicSemester = {
  name: TAcademicSemesterName,
  code: TAcademicSemesterCode,
  year: string,
  startMonth: TMonths
  endMonth: TMonths
}
```
## 12-5 Create Academic Semester Model
- academicSemester.constant.ts
```js
import { TAcademicSemesterCode, TAcademicSemesterName, TMonths } from "./academicSemester.interface";

export const Months:TMonths[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const AcademicSemesterName:TAcademicSemesterName[] = [ 'Autumn' , 'Summer' ,'Fall' ]

export const AcademicSemesterCode:TAcademicSemesterCode[] = [ '01' , '02' , '03' ] 
```
- academicSemester.model.ts file
```js
import { model, Schema } from "mongoose";
import { TAcademicSemester} from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: AcademicSemesterName
  },
  year: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    enum: AcademicSemesterCode
  },
  startMonth: {
    type: String,
    enum: Months,
    required: true,
  },
  endMonth: {
    type: String,
    enum: Months,
    required: true,
  },
}, {
  timestamps: true
})

export const AcademicSemesterModel = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)
```
## 12-6 Create Academic Semester Validation , route , controller
- in the routes directory file, add academicSemester route
```js
import {Router} from "express"
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";

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
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes
  }
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
```
- academicSemester.validation.ts file
```js
import { z } from "zod";
import { AcademicSemesterCode, AcademicSemesterName, Months } from "./academicSemester.constant";

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]),
    startMonth: z.enum([...Months] as [string, ...string[]]),
    endMonth: z.enum([...Months] as [string, ...string[]])
  })
})

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema
}
```
- academicSemester.route.ts file
```js
import express from "express"
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router()

router.post('/create-academic-semester', validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema) ,AcademicSemesterControllers.createAcademicSemester )

export const AcademicSemesterRoutes = router;
```
- academicSemester.controller.ts file
```js
import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { AcademicSemesterServices } from "./academicSemester.service"

const createAcademicSemester = catchAsync(async(req,res)=> {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic semester is created successfully',
    data: result
  })
})

export const AcademicSemesterControllers = {
  createAcademicSemester
}
```
## 12-7 Create Academic Semester service
```js
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload:TAcademicSemester) => {
  const result = await AcademicSemesterModel.create(payload);
  return result;
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB
}
```
## 12-8 Handle academic semester logical validation
- academicSemester.interface.ts file 
```js
export type TAcademicSemesterNameCodeMapper = {
  [key: string]: string
}
```
- academicSemester.constant.ts file
```js
export const academicSemesterNameCodeMapper:TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
}
```
- academicSemester.model.ts file pre hook added
```js
academicSemesterSchema.pre('save', async function(next){
  const isSemesterExists = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  })
  if(isSemesterExists) {
    throw new Error(`Semester is already exists!`)
  }
  next()
})

export const AcademicSemesterModel = model<TAcademicSemester>('AcademicSemester', academicSemesterSchema)
```
- academicSemester.service.ts
```js
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester} from "./academicSemester.interface";
import { AcademicSemesterModel } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload:TAcademicSemester) => {
  
  if(academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code!')
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB
}
```
- globalErrorHandler.ts file modified
```js
const globalErrorHandler = (err: any, req:Request, res: Response, next: NextFunction) => {
  const statusCode:any = 500
  const message = 'something went wrong!'
  return res.status(statusCode).json({ 
    success: false,
    message,
    error: err.message || err
  })
}
export default globalErrorHandler
```
## 12-9 Add admission semester into student interface , model and validation
- 