## 5-2 insert,insertOne, find, findOne, field filtering, project

- insertOne to insert a document
```js
db.test.insertOne({name: "java"}) 
```
- insertMany to insert multiple document
```js
db.test.insertMany([
    { name: "javascript" },
    { name: "tailwind" }
])
```
- to find one document
```js
db.test.findOne({age: 17})
db.test.findOne({company: 'Demimbu'})
```
- to find multiple documents
```js
db.test.find({gender: 'Male'})
```
- name: 1 and email:1, this things are called **field filtering**. Will only show these fields from the specific documents
```js
db.test.find(
    {gender: 'Male'},
    {name: 1, email: 1, gender: 1}
)
```
another way of doing **field filtering** using porject. We have to use porject for find, can't use for findOne
```js
db.test
  .find({ gender: 'Male' })
  .project({ name: 1, gender: 1, email: 1 })
```
- using the **field filtering** on findOne
```js
db.test.findOne({ gender: 'Male' }, {name: 1})
```
## 5-3 $eq, $neq, $gt, $lt, $gte, $lte
- $eq this equal operator matches values that are equal to a specified value.
```js
// syntax
{ <field>: { $eq: <value> } }

// example
db.test.find({ gender: {$eq: "Male"}})
db.test.find({ age: {$eq: 17}})
```
- $ne this not equal operator matches all values that are not equal to a specified value.
```js
// syntax
{ field: { $ne: value } }

// example
db.test.find({ age: {$ne: 17}})
```
- $gt this greater than operator matches values that are greater than a specified value.
```js
// syntax
{ field: { $gt: value } }

// example
db.test.find({ age: {$gt: 17}})
```
- $gte this greater than or equal operator matches values that are greater than or equal to a specified value.
```js
// syntax
{ field: { $gte: value } }

// example
db.test.find({ age: {$gte: 17}}).sort({age:1})
```
- $lt this less than operator matches values that are less than a specified value.
```js
// syntax
{ field: { $gte: value } }

// example
db.test.find({ age: {$lt: 17}})
```
- $lte this less than or equal operator matches  values that are less than or equal to a specified value.
```js
// syntax
{ field: { $gte: value } }

// example
db.test.find({ age: {$lte: 17}})
```