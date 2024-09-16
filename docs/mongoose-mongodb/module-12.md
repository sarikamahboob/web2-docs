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
        .string()
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
- academicSemester.validation.ts updated
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

const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterName] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    code: z.enum([...AcademicSemesterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  }),
})

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
}
```
- academicSemester.route.ts file updated
```js
import express from "express"
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middleware/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router()

router.post(
  '/create-academic-semester',
  validateRequest(AcademicSemesterValidations.createAcademicSemesterValidationSchema), AcademicSemesterControllers.createAcademicSemester
)

router.get(
  '/:semesterId',
  AcademicSemesterControllers.getSingleAcademicSemester,
)

router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
)

router.get('/', AcademicSemesterControllers.getAllAcademicSemesters)

export const AcademicSemesterRoutes = router;
```
- academicSemester.controller.ts file updated
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

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemestersFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic semester is retrieved successfully',
    data: result,
  })
})

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params
  const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic semester is retrieved successfully',
    data: result,
  })
})
 
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved succesfully',
    data: result,
  })
})

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
}
```
- academiSemester.service.ts file updated
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

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemesterModel.find()
  return result
}

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemesterModel.findById(semesterId)
  return result
}

const updateAcademicSemesterIntoDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>
) => {
  const semesterCode: TAcademicSemester | null =
    await AcademicSemesterModel.findById(semesterId)
  // if payload name and code both are wrong
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Name or Code')
  }
  // if payload name is wrong
  if (
    payload.name &&
    !payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== semesterCode?.code
  ) {
    throw new Error('Invalid Semester Name')
  }
  // if payload code is wrong
  const semesterNameByCode = Object.keys(academicSemesterNameCodeMapper).find(
    (key) =>
      academicSemesterNameCodeMapper[
        key as keyof typeof academicSemesterNameCodeMapper
      ] === payload.code,
  )
  if (
    !payload.name &&
    payload.code &&
    semesterNameByCode !== semesterCode?.name
  ) {
    throw new Error('Invalid Semester Code')
  }
  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: semesterId },
    payload,
    {
      new: true,
    },
  )
  return result
}

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
}
```
- student.interface.ts file updated with the admissionSemester
```js
export type TStudent = {
  id: string
  user: Types.ObjectId
  password: string
  name: TUserName
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: TGuardian
  localGuardian: TLocalGuardian
  profileImage?: string
  admissionSemester: Types.ObjectId
  isDeleted: boolean
}
```
- student.zod.validation.ts file updated with the admissionSemester
```js
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
      dateOfBirth: z.string().optional(),
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
      admissionSemester: z.string(),
      isDeleted: z.boolean(),
    }),
  }),
})
```
- student.model.ts file updated with admissionSemester 
```js
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
  dateOfBirth: { type: String },
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
  admissionSemester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicSemester'
  },
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
## 12-10 Implement generateStudentId() utility
- user.utils.ts file added to the user directory
```js
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
export const generateStudentId = (payload: TAcademicSemester) => {
  // first time will be 0000
  const currentId = (0).toString()
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId;
}
```
- user.service.ts file updated
```js
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData:Partial<TUser> = {}
  // if password is not given, use default password
  userData.password = password || config.default_pass as string
  // set student role
  userData.role = 'student';
  // find academic semester info 
  const admissionSemester:TAcademicSemester | null = await AcademicSemesterModel.findById(payload.admissionSemester)
  // set manually generated id
  userData.id = generateStudentId(admissionSemester!) 
  // create a user
  const newUser = await UserModel.create(userData)
  // create a student
  if(Object.keys(newUser).length) {
    // set id, _id as user
    payload.id = newUser.id //embedding id 
    payload.user = newUser._id // reference _id 

    const newStudent = await Student.create(payload)
    return newStudent
  }
}

export const UserServices = {
  createStudentIntoDB
}
```
## 12-11 Complete generateStudent() utility
- user.utils.ts file updated
```js
/* eslint-disable no-undefined */
import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { UserModel } from "./user.model";

const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne({
    role: 'student'
  }, {
    id: 1,
    _id: 0
  }).sort({
    createdAt: -1
  }).lean()
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
}

export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time will be 0000
  const currentId = await findLastStudentId() || (0).toString()
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId;
}
```
- user.service.ts file updated 
```js
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData:Partial<TUser> = {}
  // if password is not given, use default password
  userData.password = password || config.default_pass as string
  // set student role
  userData.role = 'student';
  // find academic semester info 
  const admissionSemester:TAcademicSemester | null = await AcademicSemesterModel.findById(payload.admissionSemester)
  // set manually generated id
  userData.id = await generateStudentId(admissionSemester!) 
  // create a user
  const newUser = await UserModel.create(userData)
  // create a student
  if(Object.keys(newUser).length) {
    // set id, _id as user
    payload.id = newUser.id //embedding id 
    payload.user = newUser._id // reference _id 

    const newStudent = await Student.create(payload)
    return newStudent
  }
}

export const UserServices = {
  createStudentIntoDB
}
```