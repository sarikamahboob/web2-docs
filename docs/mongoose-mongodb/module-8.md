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
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  {rules: {
    "@typescript-eslint/no-unused-vars": "error",
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
```
## 8-4 Install prettierts-node-dev,fix formatting issues
- installations
```js
// install prettier as dev dependency
npm install --save-dev prettier
```
- create a file named .prettierrc.json
