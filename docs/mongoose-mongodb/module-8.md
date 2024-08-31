## 8-1 Introduction to mongoose
- a powerful object data modeling library of mongodb
  - client data will be validated by mongoose. If validation fails, data wont go to the database otherwise will go to the database
  - why should use mongoose
    - schema validation
    - model creation
    - data validation
    - querying
    - middleware support
    - population

## 8-2 Installing express, mongoose, typescript, dotenv ,cors
- 
```js
// initialize node
npm init -y
// install express
npm install express
// install mongoose
npm install mongoose --save 
// install typescript as dev dependency
npm install typescript --save-dev
// install cors
npm install cors
// install dotenv
npm install dotenv --save
// initialize typescript
tsc -init
// install node types 
npm install --save-dev @types/node
// install express types
npm install -D @types/express
// install cors types
npm i --save-dev @types/cors
// changes in ts config file
"rootDir": "./src", 
"outDir": "./dist", 
// add script in package.json
"build": "tsc",
```
## 8-3 Installing eslint, refactor code, fix errors using command
- in tsconfig.json we have to add this at the top before compiler options
```js
"include": ["src"], // which files to compile
"exclude": ["node_modules"],
```
- install the eslint plugin
```js
// install eslint plugin
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
// initialize the eslint config file
npx eslint --init
// add the script in package.json
"lint": "eslint 'src/**/*.{js,ts,tsx}'",
"lint:fix": "eslint 'src/**/*.{js,ts,tsx}' --fix",
```
- eslint.config.mjs file 
```js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"]
  },
  // {
  //   extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  // },
  // {
  //   languageOptions: {
  //     globals:
  //       { process: "readonly" },
  //   }
  // },
  {
    languageOptions: {
      globals: globals.node,
      parser: "@typescript-eslint/parser",
    },
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-undefined": "error",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
```
## 8-4 Install prettierts-node-dev,fix formatting issues
- installations
```js
// install prettier as dev dependency
npm install --save-dev prettier
// install this package for avoiding conflicts between perttier and eslint
npm install --save-dev eslint-config-prettier
// install ts node dev for developement process only
npm i ts-node-dev --save-dev
```
- create a file named .prettierrc.json
```js
{
  "semi": false, 
  "singleQuote": true
}
```
- add this script to the package.json file
```js
// for starting the server in production
"start:prod": "node ./dist/server.js",
// for compiling the ts file to js file
"start:dev": "npx ts-node-dev --respawn --transpile-only src/server.ts",
//for prettier
"prettier": "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
"prettier:fix" : "npx prettier --write src",
```
- add this scripts to the vscode setting.json file
```js
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true,
```
## 8-5 Software design pattern , mvc vs modular, create an interface
- Software design patterns are 2
  -  MVC
    - models
      - student.model.ts
      - admin.model.ts
    - views
      - template engine
        - ejs
        - handlebars
        - pugs
      - library/framework
        - react
        - vue
    - controllers
      - student.controller.ts
      - admin.controller.ts
    - routes
      - student.route.ts
      - admin.route.ts
    - interfaces
      - student.interface.ts
      - admin.interface.ts
  - modular
    - student
      - student.model.ts
      - student.interface.ts
      - student.controller.ts
      -  student.route.ts
      -  student.service.ts
    - admin
      - admin.model.ts
      - admin.interface.ts
      - admin.controller.ts
      -  admin.route.ts
      -  admin.service.ts
    - benefits
      - scalibility
      - maintainability
      - better refactoring
      - efficient development
    - pattern
      - interface => schema => model => DB query
      - interface => schema => model => routes =>  controller => service
- Rules/Principle
  - DRY - Dont Repeat Yourself
  - Fat Model / Thin Controller
- student.interface.ts file
```js
export type UserName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type Guardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

export type LocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
}

export type Student = {
  id: string
  name: UserName
  gender: 'male' | 'female' | 'other'
  dataOfBirth: string
  email: string
  contactNo: string
  emergencyContactNo: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress: string
  permanentAddress: string
  guardian: Guardian
  localGuardian: LocalGuardian
  profileImage?: string
  isActive: 'active' | 'inActive'
}
```
## 8-6 Create an schema for a student
- student.model.ts file
```js
import { Schema, model, connect } from 'mongoose'
import { Student } from './student.interface'

const StudentSchema = new Schema<Student>({
  id: {
    type: String,
  },
  name: {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
  },
  gender: ['male', 'female'],
  dateOfBirth: { type: String },
  email: { type: String, required: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B+', 'O+', 'O-'],
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: {
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String, required: true },
    fatherContactNo: { type: String, required: true },
    motherName: { type: String, required: true },
    motherOccupation: { type: String, required: true },
    motherContactNo: { type: String, required: true },
  },
  localGuardian: {
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
  },
  profileImage: { type: String },
  isActive: ['active', 'blocked'],
})
```
## 8-7 Refactor your schema
- student.model.ts file
  - made sub schema for cleaner schema look
```js
import { Schema, model } from 'mongoose'
import { Guardian, LocalGuardian, Student, UserName } from './student.interface'

const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
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
  id: { type: String },
  name: {
    type: userNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
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
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  profileImage: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
})

export const StudentModel = model<Student>('Student', studentSchema)
```
## 8-8 Create route , service and controller
- Client => <= route.ts => <= controller.ts => <= service.ts => <= database
- student.route.ts
```js
import express from "express"
import { StudentControllers } from "./student.controller"

const router = express.Router()
router.post("/create-student",  StudentControllers.createStudent)
export const StudentRoutes = router;
```
- student.controller.ts
```js
import { Request, Response } from 'express'
import { StudentServices } from './student.service'

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
    console.log('error in creating students', error)
  }
}

export const StudentControllers = {
  createStudent,
}
```
- student.service.ts
```js
import { Student } from "./student.interface"
import { StudentModel } from "./student.model"

const createStudentIntoDB = async (student: Student) => {
  const result = await StudentModel.create(student)
  return result
}

export const StudentServices = {
  createStudentIntoDB,
}
```
## 8-9 Insert a student data into mongoDB
- adding routes to the app.ts file 
```js
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { StudentRoutes } from './app/modules/student/student.route'

const app: Application = express()

// parsers
app.use(express.json())
app.use(cors())

// application routes
app.use("/api/v1/students", StudentRoutes)

app.get('/', (req: Request, res: Response) => {
  const a = 20
  res.send(a)
})

export default app
```
## 8-10 Create get student route
- student.route.ts 
```js
router.post("/create-student",  StudentControllers.createStudent)
router.post("/",  StudentControllers.getAllStudents)
router.get("/:studentId",  StudentControllers.getSingleStudent)
export const StudentRoutes = router;
```
- student.controller.ts 
```js
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()
    res.status(200).json({
      success: true,
      message: 'students are fetched successfully',
      data: result,
    })
  } catch (error) {
    console.log('error in fetching students', error)
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params
    const result = await StudentServices.getSingleStudentFromDB(studentId)
    res.status(200).json({
      success: true,
      message: 'students is retrieved successfully',
      data: result,
    })
  } catch (error) {
    console.log('error in retrieving students', error)
  }
}

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
}
```
- student.service.ts 
```js
const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
  return result
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({id})
  return result
}

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB
}
```
- before git push run this commands
```js
npm run lint
npm run prettier
```