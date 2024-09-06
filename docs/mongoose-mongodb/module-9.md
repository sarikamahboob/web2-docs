## 9-1 Introduction to validation
- if data validation is successful in mongoose then only data will go to the database
- there are 3 types validations in the mongoose
  -  builtin validation
  - custom validation
  - third party validation libraries (validator / zod / joi)
- student.model.ts
```js
import { Schema, model } from 'mongoose'
import { Guardian, LocalGuardian, Student, UserName } from './student.interface'

const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: [true, 'first name is required'] },
  middleName: { type: String },
  lastName: { type: String, required: [true, 'last name is required'] },
})

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
})

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
})

const studentSchema = new Schema<Student>({
  id: { type: String, unique: true, required: true },
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
  email: { type: String, required: true },
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
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})

export const StudentModel = model<Student>('Student', studentSchema)
```
## 9-2 How to do custom validation
- student.model.ts
  - custom validation added
```js
import { Schema, model } from 'mongoose'
import { Guardian, LocalGuardian, Student, UserName } from './student.interface'

const userNameSchema = new Schema<UserName>({
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
      message: `{VALUE} is not in capitalize format`
    },
  },
  middleName: { type: String },
  lastName: { type: String, required: [true, 'last name is required'] },
})

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
})

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
})

const studentSchema = new Schema<Student>({
  id: { type: String, unique: true, required: true },
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
  email: { type: String, required: true },
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
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})

export const StudentModel = model<Student>('Student', studentSchema)
```
- student.controller.ts
```js
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body
    const result = await StudentServices.createStudentIntoDB(studentData)
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error) {
     res.status(500).json({
       success: false,
       message: 'student data is not created!',
       error: error,
     })
  }
}
```
## 9-3 How to validate using validator and Joi package
- install third party library validator or joi for validation
```js
npm install validator
npm install -D @types/validator

npm install joi
```
- student.model.ts file using validator package
```js
import { Schema, model } from 'mongoose'
import { Guardian, LocalGuardian, Student, UserName } from './student.interface'
import validator from 'validator'

const userNameSchema = new Schema<UserName>({
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

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
})

const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
})

const studentSchema = new Schema<Student>({
  id: { type: String, unique: true, required: true },
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
    }
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
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})

export const StudentModel = model<Student>('Student', studentSchema)
```
## 9-4 How to validate using Joi
- student.controller.ts
```js
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body
    const { error, value } = studentValidationSchema.validate(studentData)
    if (error) {
       res.status(500).json({
         success: false,
         message: 'student data is not created!',
         error: error.details,
       })
    }
    const result = await StudentServices.createStudentIntoDB(value)
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'student data is not created!',
      error: error,
    })
  }
}
```
- student.joi.validation.ts
```js
import Joi from "joi"

// Joi schema for validating UserName
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .max(20)
    .regex(/^[A-Z][a-zA-Z]*$/, 'capitalize format')
    .messages({
      'string.empty': 'First name is required',
      'string.max': 'First name cannot be more than 20 characters',
      'string.pattern.name': '{#label} is not in capitalize format',
    }),
  middleName: Joi.string().allow(null, ''), // Optional field
  lastName: Joi.string()
    .required()
    .regex(/^[A-Za-z]+$/, 'alphabet only')
    .messages({
      'string.empty': 'Last name is required',
      'string.pattern.name':
        '{#label} is not valid, only alphabetic characters are allowed',
    }),
})

// Joi schema for validating Guardian
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': 'Father name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': 'Father occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.empty': 'Father contact number is required',
  }),
  motherName: Joi.string().required().messages({
    'string.empty': 'Mother name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': 'Mother occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'string.empty': 'Mother contact number is required',
  }),
})

// Joi schema for validating Local Guardian
const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Local guardian name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Local guardian occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Local guardian contact number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Local guardian address is required',
  }),
})

// Joi schema for validating the Student
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
  }),
  name: userNameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only':
      '{#label} is not valid. The gender field can only be "male", "female", or "other"',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.string().isoDate().optional(),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email is not valid',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency contact number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-')
    .messages({
      'any.only': '{#label} must be a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent address is required',
  }),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImage: Joi.string().uri().optional(),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#label} must be either "active" or "blocked"',
  }),
})

export default studentValidationSchema
```
## 9-5 How to validate using zod
- install zod
```js
npm install zod
```
- student.zod.validation.ts
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
const studentValidationSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'ID is required' }),
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
  presentAddress: z.string().min(1, { message: 'Present address is required' }),
  permanentAddress: z
    .string()
    .min(1, { message: 'Permanent address is required' }),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImage: z.string().optional(),
  isActive: z.enum(['active', 'blocked'], {
    errorMap: () => ({
      message: "Status must be either 'active' or 'blocked'",
    }),
  }),
})

export default studentValidationSchema
```
- student.controller.ts
```js
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body
    // validation using zod
    const zodParseData = studentValidationSchema.parse(studentData)

    // validation using joi
    // const { error, value } = studentValidationSchema.validate(studentData)
    // if (error) {
    //    res.status(500).json({
    //      success: false,
    //      message: 'student data is not created!',
    //      error: error.details,
    //    })
    // }

    const result = await StudentServices.createStudentIntoDB(zodParseData)
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'student data is not created!',
      error: error,
    })
  }
}
```
## 9-6 Implement a custom instance method
- Static methods 
  - schema => statics => model => call on model
- Instance methods
  - schema => methods => model => instance => call on instance
- in mongoose there are built-in static and instance methods
```js
// this is built-in static method
studentModel.create()

// this is built-in instance method
const student = new StudentModel()
student.save()
```
- making a custom instance method
- student.interface.ts file
```js
import { Model } from "mongoose"

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type TStudent = {
  id: string
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
  isActive: 'active' | 'blocked'
}

export type StudentMethod = {
  isUserExist(id:string): Promise<TStudent | null>
}
export type StudentModel = Model<TStudent, Record<string, never> , StudentMethod>;
```
- student.model.ts file
```js
import { Schema, model } from 'mongoose'
import {  StudentModel, StudentMethod, TGuardian, TLocalGuardian, TUserName, TStudent,} from './student.interface'
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

const studentSchema = new Schema<TStudent, StudentModel, StudentMethod>({
  id: { type: String, unique: true, required: true },
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
    }
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
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})

studentSchema.methods.isUserExist = async (id: string) => {
  const existingUser = await Student.findOne({id});
  return existingUser;
}
export const Student = model<TStudent, StudentModel>('Student', studentSchema)
```
- student.controller.ts file
```js
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body
    // validation using zod
    const zodParseData = studentValidationSchema.parse(studentData)

    // validation using joi
    // const { error, value } = studentValidationSchema.validate(studentData)
    // if (error) {
    //    res.status(500).json({
    //      success: false,
    //      message: 'student data is not created!',
    //      error: error.details,
    //    })
    // }

    const result = await StudentServices.createStudentIntoDB(zodParseData)
    res.status(200).json({
      success: true,
      message: 'student is created successfully',
      data: result,
    })
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'student data is not created!',
      error: error,
    })
  }
}
```
- student.service.ts file
```js
import { TStudent } from './student.interface'
import { Student } from './student.model'

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student) // built-in static method
  const student = new Student(studentData) // create an instance
  if(await student.isUserExist(studentData.id)) {
    throw new Error(`user already exists`)
  }
  const result = student.save() // built-in instance method
  return result
}

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
  return result
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
}
```
## 9-7 Implement a custom static method
- student.interface.ts
```js
import { Model } from "mongoose"

export type TUserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type TStudent = {
  id: string
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
  isActive: 'active' | 'blocked'
}

/***for creating a custom static method***/
export interface StudentModel extends Model<TStudent> {
  isUserExist(id: string): Promise<TStudent | null>
}

```
- student.model.ts
```js
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
  id: { type: String, unique: true, required: true },
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
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})
studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
```
- student.service.ts
```js
import { TStudent } from './student.interface'
import { Student } from './student.model'


const createStudentIntoDB = async (studentData: TStudent) => {
  if (await Student.isUserExist(studentData.id)) { 
    throw new Error(`user already exists`)
  }
  const result = await Student.create(studentData) // built-in static method
  // const student = new Student(studentData) // create an instance
  // if(await student.isUserExist(studentData.id)) {
  //   throw new Error(`user already exists`)
  // }
  // const result = student.save() // built-in instance method
  return result
}
```
## 9-8 Implement mongoose middleware part
- mongoose middleware is known as `mongoose hooks`
  - document middleware
  - query middleware
  - aggregation middleware
```js
npm i bcrypt
npm install --save @types/bcrypt
```
- add password to the student.interface.ts
```js
export type TStudent = {
  id: string
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
  isActive: 'active' | 'blocked'
}
```
- add password in the student.zod.validation.ts
```js
const studentValidationSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'ID is required' }),
  password: z.string().min(1, { message: 'Password is required' }).max(20, { message: 'Password cannot be more than 20 characters' }),
})
```
- add password in the student.model.ts and make mongoose pre hook middleware
```js
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true, required: [true, 'ID is required'] },
  password: { type: String, required: [true, 'password is required'], maxlength: [20, 'password cannot be more than 20 characters'] },
})

// pre save middleware/hook
// will work on create() and save()
studentSchema.pre('save', async function(next) {
  // hashing password and save into database
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
  next()
})

// post save middleware/hook
studentSchema.post('save', function() {
  console.log(this, 'post hook: we saved the data')
})

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
```
- add environmental variable to the .env
```js
BCRYPT_SALT_ROUNDS=12
```
- add the environment variable to the config
```js
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS
}
```
## 9-9 How to implement delete data in another way
- add isDeleted in the student.interface.ts file
```js
export type TStudent = {
  id: string
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
  isActive: 'active' | 'blocked',
  isDeleted: boolean
}
```
- add isDeleted in the student.zod.validation.ts file
```js
const studentValidationSchema = z.object({
  isDeleted: z.boolean(),
})
export default studentValidationSchema
```
- add isDeleted in the student.model.ts
```js
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true, required: [true, 'ID is required'] },
  isDeleted: {
    type: Boolean,
    default: false,
  }
})
```
- add delete route to the student.route.ts file
```js
import express from 'express'
import { StudentControllers } from './student.controller'

const router = express.Router()

router.post('/create-student', StudentControllers.createStudent)
router.get('/', StudentControllers.getAllStudents)
router.get('/:studentId', StudentControllers.getSingleStudent)
router.delete('/:studentId', StudentControllers.deleteStudent)

export const StudentRoutes = router
```
- add service to the student.service.ts file
```js
import { TStudent } from './student.interface'
import { Student } from './student.model'

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne(
    { id },
    { isDeleted: true }
  )
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB
}
```
- add deleteStudent function to the student.controller.ts
```js
const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.deleteStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'students is deleted successfully',
      data: result,
    })
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'student data is not created!',
      error: error,
    })
  }
}

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent
}
```
## 9-10 How to implement query middlewares
- add query middlewares to the student.model.ts
```js
/*** query middleware ***/
studentSchema.pre('find', function(next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function(next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

// [ {$match:{isDeleted: {$ne: true}}}, {$match:{id: '123456'}} ]

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
- modify the getSingleStudentFromDB so that deleted students not get retrieved when calling student by id 
```js
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id })
  const result = await Student.aggregate([
    { $match: { id: id }}
  ])
  return result
}

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne(
    { id },
    { isDeleted: true }
  )
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB
}
```
## 9-11 Mongoose Virtuals and Module Summary
- mongoose virtuals
  - we will take a field which is not exists in the database but we can derived that field from the existing field
  - we can use this if suppose we don't need data to be stored in the database but we have to show that only in this case
- add virtuals to the student.model.ts
```js
const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, unique: true, required: [true, 'ID is required'] },
},{
  toJSON: {
    virtuals: true
  }
})

/*** mongoose virtual ***/ 
studentSchema.virtual('fullName').get(function () {
  return this.name.firstName + ' ' + this.name.middleName + ' ' + this.name.lastName
})
```
- for updating student patch route add to the student.route.ts
```js
router.patch('/:studentId', StudentControllers.updateSingleStudent)
```
- student.controller.ts file update for updating a student
```js
const updateSingleStudent = async (req: Request, res: Response) => {
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
  } catch (error:any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'student data is not created!',
      error: error,
    })
  }
}

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateSingleStudent
}
```
- student.service.ts file update for updating a student
```js
const updateSingleStudentFromDB = async (id: string, data:any) => {
  const result = await Student.updateOne(
    { id },
    data
  )
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateSingleStudentFromDB
}
```
- updated the app.ts file
```js
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'

const app: Application = express()

// parsers
app.use(express.json())
app.use(cors())

// application routes
app.use('/api/v1/students', StudentRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

export default app
```
## Deploy with vercel
- download vercel cli first
```js
npm i -g vercel
```
- make a file in the root and add the configurations in the file
```js
// for making a file command
touch vercel.json

// configurations
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```
- login the vercel from CLI
```js
vercel login
```
- deploy the app now 
```js
// use this command to deploy the app
vercel
```
- after changing in the application and again deploy to the vercel
```js
// commands
npm run build
vercel --prod
```