## 13-1 Intro to module bug fixing
- Academic faculty
  - Faculty of Engineering
    - Deparment of Electrical Engineering
    - Department of Computer Science and Engineering
  - Faculty of Business Administration
    - Department of Finance
    - Department of Marketing
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
  return lastStudent?.id ? lastStudent.id : undefined;
}

export const generateStudentId = async (payload: TAcademicSemester) => {
  // first time will be 0000
  let currentId = (0).toString()
  const lastStudentId = await findLastStudentId()
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4)
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6)
  const currentSemesterCode = payload?.code
  const currentSemesterYear = payload?.year
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6)
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId;
}
```
## 13-2 Create AcademicFaculty interface , model ,and validation
- academicFaculty.interface.ts file created inside the academicFaculty directory
```js
export type TAcademicFaculty = {
  name: string;
}
```
- academicFaculty.model.ts file created inside the academicFaculty directory
```js
import { model, Schema } from 'mongoose'
import { TAcademicFaculty } from './academicFaculty.interface'

const academicFacultySchema = new Schema<TAcademicFaculty>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
}, {
  timestamps: true,
})

export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
)
```
- academicFaculty.validation.ts file created inside the academicFaculty directory
```js
import { z } from "zod"
const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string',
    }),
  }),
})
const updatecademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Faculty must be string',
    }),
  }),
})
export const AcademicFacultyValidations = {
  createAcademicFacultyValidationSchema,
  updatecademicFacultyValidationSchema,
}

```
## 13-3 Create Academic faculty routes, controllers and services
- academicFaculty.route.ts file created inside the academicFaculty directory
```js
import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AcademicFacultyControllers } from './academicFaculty.controller'
import { AcademicFacultyValidations } from './academicFaculty.validation'

const router = express.Router()

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
)

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty)

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.updatecademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
)

router.get('/', AcademicFacultyControllers.getAllAcademicFaculties)

export const AcademicFacultyRoutes = router
```
- academicFaculty.controller.ts file created inside the academicFaculty directory
```js
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicFacultyServices } from './academicFaculty.service'


const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic faculty is created successfully',
    data: result,
  })
})

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic faculties are retrieved successfully',
    data: result,
  })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result =
    await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic faculty is retrieved successfully',
    data: result,
  })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    facultyId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty is updated succesfully',
    data: result,
  })
})

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
}
```
- academicFaculty.service.ts file created inside the academicFaculty directory
```js
import { TAcademicFaculty } from "./academicFaculty.interface"
import { AcademicFaculty } from "./academicFaculty.model"


const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload)
  return result
}

const getAllAcademicFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find()
  return result
}

const getSingleAcademicFacultyFromDB = async (facultyId: string) => {
  const result = await AcademicFaculty.findById(facultyId)
  return result
}

const updateAcademicFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate(
    { _id: facultyId },
    payload,
    {
      new: true,
    },
  )
  return result
}

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
}
```
## 13-4 Test Academic Faculty Routes using Postman
- in the route folder in index file route added for academic faculty
```js
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
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
]
```
## 13-5 Create Academic Department interface , model , validation ,service
- academicDepartment.interface.ts file created inside the academicSemester directory
```js
import { Types } from "mongoose"
export type TAcademicDepartment = {
  name: string,
  academicFaculty: Types.ObjectId
}
```
- academicDepartment.model.ts file created inside the academicSemester directory
```js
import { model, Schema } from 'mongoose'
import { TAcademicDepartment } from './academicDepartment.interface'
const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    }
  },
  {
    timestamps: true,
  },
)

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
)
```
- academicDepartment.validation.ts file created inside the academicSemester directory
```js
import { z } from 'zod'

const createAcademicDepartmentValidationSchema = z.object({
   body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be string',
      required_error: 'Faculty is required',
    }),
  }),
})

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be string',
        required_error: 'Academic Department Name is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic Faculty must be string',
        required_error: 'Academic Faculty is required',
      })
      .optional(),
  }),
})

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
}
```
## 13-6 Create Academic Department controller , route and test using postman
- academicDepartment.service.ts file created inside the academicSemester directory
```js
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload)
  return result
}

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find()
  return result
}

const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
  const result = await AcademicDepartment.findById(departmentId)
  return result
}

const updateAcademicDepartmentIntoDB = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: departmentId },
    payload,
    {
      new: true,
    },
  )
  return result
}

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
}
```
- academicDepartment.controller.ts file created inside the academicSemester directory
```js
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicDepartmentServices } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic department is created successfully',
    data: result,
  })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic departments are retrieved successfully',
    data: result,
  })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'academic department is retrieved successfully',
    data: result,
  })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      departmentId,
      req.body,
    )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is updated succesfully',
    data: result,
  })
})

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
}
```
- academicDepartment.route.ts file created inside the academicSemester directory
```js
import express from 'express'
import validateRequest from '../../middleware/validateRequest'
import { AcademicDepartmentValidations } from './academicDepartment.validation'
import { AcademicDepartmentControllers } from './academicDepartment.controller'

const router = express.Router()

router.post(
  '/create-academic-department',
  validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
  AcademicDepartmentControllers.createAcademicDepartment,
)

router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartment,
)

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
)

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments)

export const AcademicDepartmentRoutes = router
```
- in the route folder in index file route added for academic department
```js
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
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
]
```