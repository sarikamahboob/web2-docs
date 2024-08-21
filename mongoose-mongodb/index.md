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
## 5-4 $in, $nin, implicit and condition
- **implicit-and** when two expressions are separated by a comma
```js
// syntax
{ field: { condition1, condition2 } }

// example-1
// age is greater then 18 but less than 30
db.test.find({ age: { $gt: 18, $lt: 30 } }, { age: 1 }).sort({ age: 1 })

//example-2
db.test
    .find(
        { gender: 'Female', age: { $gte: 18, $lte: 30 } },
        { age: 1, gender: 1 }
    )
    .sort({ age: 1 })
```
- $in this in operator matches any of the values specified in an array.
```js
// syntax
{ field: { $nin: [ <value1>, <value2> ... <valueN> ] } }

// example
db.test
    .find(
        { gender: 'Female', age: { $in: [18, 20, 22, 24] } },
        { age: 1, gender: 1 }
    )
    .sort({ age: 1 })
```
- $nin this matches none of the values specified in an array.
```js
// syntax
{ field: { $nin: [ <value1>, <value2> ... <valueN> ] } }

// example
db.test
    .find(
        { gender: 'Female', age: { $nin: [18, 20, 22, 24] } },
        { age: 1, gender: 1 }
    )
    .sort({ age: 1 })
```
- using $in and $nin both
```js
// example
db.test
    .find(
        { 
            gender: 'Female', 
            age: { $nin: [18, 20, 22, 24] } ,
            interests: { $in : ["Cooking", "Gaming"] }
        },
        { age: 1, gender: 1, interests: 1 }
    )
    .sort({ age: 1 })
```

## 5-5 $and, $or, implicit vs explicit
- $and operator joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
```js
//syntax
{ $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }

// example
db.test
    .find(
        {
            $and: [
                { gender: "Female" },
                { age: { $ne: 15 } },
                { age: { $lte: 30 } },
            ]
        },
        { age: 1 }
    )
    .sort({ age: 1 })
```
- $or operator joins query clauses with a logical OR returns all documents that match the conditions of either clause. This is called explicit or.
```js
//syntax
{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }

// example-1
db.test
    .find(
        {
            $or: [
                { interests: "Travelling" },
                { interests: "Cooking" },
                { interests: "Gaming" },
            ]
        },
        { interests: 1 }
    )
// example-2 
// array of objects in an array
db.test
    .find(
        {
            $or: [
               {"skills.name" : "JAVASCRIPT"},
               {"skills.name" : "PYTHON"},
            ]
        },
        { "skills.name": 1 }
    )
```
- use $in operator as the **implicit or**.
```js
// example
db.test
    .find(
        {
            "skills.name" : { $in : ["JAVASCRIPT" , "PYTHON"] },
        },
        { "skills.name": 1 }
    )
```
- $not this not operator inverts the effect of a query expression and returns documents that do not match the query expression.
```js
// syntax
{ field: { $not: { <operator-expression> } } }

// example
// age is not greater than or equal to 18
db.test
    .find(
        {
            age: { $not: { $gte: 18 } }
        },
        { age: 1 }
    )
```
- $nor this nor operator joins query clauses with a logical NOR returns all documents that fail to match both clauses.
```js
// syntax
{ $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }

// example
db.test
    .find(
        {
            $nor: [{ age: 8 }, { age: 20 }, { age: 59 }]
        },
        { age: 1 }
    )
    .sort({ age: 1 })
```
