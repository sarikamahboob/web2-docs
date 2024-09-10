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