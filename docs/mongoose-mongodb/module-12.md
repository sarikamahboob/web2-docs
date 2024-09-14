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
        .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
          message: 'Invalid date of birth format',
        }),
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