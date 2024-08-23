# In-Depth Exploration of MongoDb Queries

## 5-0 Introduction of be a Mongoose Master

- Learning things
    - Mongodb basic queries
    - Powerful aggregation framework
    - Indexing for faster queries
    - express.js core concepts
    - Mongoose fundamentals
    - CRUD operations using Express, Mongoose and Typescript
- MongoDB
    - Mongodb is a NoSQL open source database storing data in JSON-like documents. NoSQL databases break from traditional relational models, ideal for managing vast data. MongoDB stands out for its scalability, flexibility and performance trusted by giants like Google, Facebook, and eBay.
- Why MongoDB
    - Scalable high performance & open source
    - Document oriented database
    - Cost effective solutions
    - Rich ecosystem of tools, documentation and community
- MongoDB vs Traditional databases
    - Data model - 
        - MongoDB - document oriented
        - Traditional databases - relational
    - Schema -
        - MongoDB - Flexible
        - Traditional databases - Rigid
    - Scalability - 
        - MongoDB - Horizontal & vertical
        - Traditional databases - Vertical
    - Performance -
        - MongoDB - optimized for unstructured or semi structured data
        - Traditional databases - optimized for structured queries
- RDMS 
    - Tables => Rows => Columns
- MongoDB
    - Collections => Documents  => Fields
- Features
    - JSON like documents (BSON)
    - Indexing
    - Aggregation framework
    - Security features
    - Free atlas database
    - Mongodb compass (GUI)
- Good choice for the projects like
    - E-commerce applications
    - Social media applications
    - Gaming applications
    - Mobile applications
    - Real Time applications

## 5-1-A Install MongoDB compass & No SQL Booster ( windows)

- Commands
    - show dbs [ will show all the dbs ]
    - use test [ will go to the test collection ]
    - db.getCollection("test").insertOne({name: "mongoose"}) 
        - Will insert the name 
    - db.getCollection("test").find()
        - Will showcase all the documents
- Mongo shell path set
    - Take the path first
        - C:\Program Files\MongoDB\Server\6.0\bin
    - Then go to the edit the system environment variables
        - Add the path
- From terminal to access the mongoose GUI terminal
    - mongosh
    - show dbs
    - use test

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
## 5-6 $exists, $type, $size
-  $exists operator matches documents that have the specified field.
```js
// syntax
{ field: { $exists: <boolean> } }

// example
// if there is phone field exits then it will fulfill the condition whether there is phone field exists or not. It wont see the value of the field
db.test
    .find({
        phone: { $exists: true }
    })
```
- $type operator selects documents if a field is of the specified type.
```js
// syntax-1
{ field: { $type: <BSON type> } }
```
```js
// syntax-2
{ field: { $type: [ <BSON type1> , <BSON type2>, ... ] } }
```
```js
// example-1
db.test
    .find({
        age: { $type: "number" }
    })

// example-2
db.test
    .find({
        friends: { $type: "array" }
    })
```
- $size operator matches any array with the number of elements specified by the argument. It only works for arrays.
```js
// syntax
{ field: { $size: value } }

// example-1
db.test
    .find({
        friends: { $size: 4 }
    })

// example-2
db.test
    .find({
        friends: { $size: 0 }
    })
```
## 5-7 $all , $elemMatch
- $all operator matches arrays that contain all elements specified in the query.
```js
// syntax
{ <field>: { $all: [ <value1> , <value2> ... ] } }

// example
// here interests is the array and 2 is the index number of cooking
db.test.find({"interests.2": "Cooking"})

// example-2
db.test.find({
    interests: { $all : [ "Travelling", "Cooking" ] }
})
```
- $elemMatch operator selects documents if element in the array field matches all the specified $elemMatch conditions.
```js 
// syntax
{ <field>: { $elemMatch: { <query1>, <query2>, ... } } }

// example-1
db.test.find({
    "skills.name" : "JAVASCRIPT"
})

// example-2
// skills is an array of object. $eleMatch matches the objects in the array 
db.test.find({
    skills: { $elemMatch: {
        name: "JAVASCRIPT",
        level: "Intermidiate"
    } }
})
```
## 5-8 $set, $addToSet, $push
- $set operator replaces the value of a field with the specified value.
```js
// syntax
{ $set: { <field1>: <value1>, ... } }

// example-1
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $set: {
            age: 80
        }
    }
)

// example-2
// interests was an array. after updateOne like this in the below example it replaced the whole value to a single value
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $set: {
            interests: "Gaming"
        }
    }
)

// example-3
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $set: {
            interests: [ "Reading", "Gaming" ]
        }
    }
)
```
- $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
```js
// syntax
{ $addToSet: { <field1>: <value1>, ... } }

//example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $addToSet: {
            interests: "Writing"
        }
    }
)

// in the below example the whole array will be added with the array of objects which will create array in array
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $addToSet: {
            interests: [ "reading", "playing" ]
        }
    }
)
```
- $each modifier is available for use with the $addToSet operator and the $push operator.
```js
// syntax
{ $addToSet: { <field>: { $each: [ <value1>, <value2> ... ] } } }

// example
// if we want to add more values in the array then we have to use $each operator
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $addToSet: {
            interests: { $each: [ "reading", "playing" ] }
        }
    }
)
```
- $push operator appends a specified value to an array.
```js
// syntax 
{ $push: { <field1>: <value1>, ... } }

// example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    {
        $push: {
            languages: { $each: [ "bengali", "english" ] }
        }
    }
)
```
- _*difference between $addToSet and $push operator is $addToSet wont give any duplicate value but $push will give.*_

## 5-9 $unset, $pop, $pull, $pullAll
- $unset operator deletes a particular field.
```js
// syntax
{ $unset: { <field1>: "", ... } }

// example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $unset: { interests: "" } }
)
```
- $pop operator removes the first or last element of an array. Pass $pop a value of -1 to remove the first element of an array and 1 to remove the last element in an array.
```js
// syntax
{ $pop: { <field>: <-1 | 1> , ... } }

// example-1
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $pop: { friends : -1 } }
)

// example-2
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $pop: { friends : 1 } }
)
```
- $pull operator removes from an existing array all instances of a value or values that match a specified condition.
```js
// syntax
{ $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }

// example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $pull: { friends : "Mir Hussain" } }
)
```
- $pullAll operator removes all instances of the specified values from an existing array. Unlike the $pull operator that removes elements by specifying a query, $pullAll removes elements that match the listed values.
```js
// syntax
{ $pullAll: { <field1>: [ <value1>, <value2> ... ], ... } }

// example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $pullAll: { languages : [ "bengali", "english" ] } }
)
```
## 5-10 More about $set, how to explore documentation
- using $set to  modify the objects in an array
```js
// syntax
{ $set: { <field1>: <value1>, ... } }

// example
db.test.updateOne(
    { _id: ObjectId("6406ad63fc13ae5a40000069") },
    { $set: { 
        "address.city": "dhaka",
        "address.postalCode" : "1216",
        "address.country" : "bangladesh"
    } }
)
```
- the positional $ operator identifies an element in an array to update without explicitly specifying the position of the element in the array.
```js
// syntax
{ "<array>.$" : value }

// example-1
db.test.updateOne(
    { 
        _id: ObjectId("6406ad63fc13ae5a40000069") ,
        "education.major" : "Education"
    },
    {
        $set : {
            "education.$.major" : "CSE"
        }
    }
)

// example-2
db.test.updateOne(
    { 
        _id: ObjectId("6406ad63fc13ae5a40000069") ,
        "education.major" : "CSE"
    },
    {
        $set : {
            "education.$.major" : "EEE"
        }
    }
)
```
- $inc operator increments a field by a specified value.
```js
// syntax
{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }

// example
// age will increase by 5
db.test.updateOne(
    { 
        _id: ObjectId("6406ad63fc13ae5a40000069") ,
    },
    {
        $inc : {
            age: 5
        }
    }
)
```
## 5-11 delete documents, drop collection and how to explore by yourself
- deleteOne method will delete a document
```js
// example
db.test.deleteOne(
    { 
        _id: ObjectId("6406ad63fc13ae5a40000069") ,
    }
)
```
- db.createCollection creates a new collection
```js
// syntax
db.createCollection(name, options)

// example
db.createCollection("posts")

//insert document
db.posts.insertOne({ test: "testing" })
```
- drop method removes a collection or view from the database. The method also removes any indexes associated with the dropped collection. The method provides a wrapper around the drop command.
```js
db.collection.drop( { writeConcern: <document> } )

// example
db.posts.drop( { writeConcern: { w: 1 } } )
```

