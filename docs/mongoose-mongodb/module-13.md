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
const academicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Faculty must be string'
  }),
})
export const AcademicSemesterValidations = {
  academicFacultyValidationSchema
}
```
## 13-3 Create Academic faculty routes, controllers and services