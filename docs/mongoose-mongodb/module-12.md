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