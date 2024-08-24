# Mastering MongoDB Aggregation and Indexing

## 6-0 Introduction of powerful aggregation framework
- Aggregation is a way of processing a large number of documents in a collection by means of passing them through different stages.
- The stages make up is known as a pipeline.
- The stages in a pipeline can filter, sort, group, reshape and modify documents that pass through the pipeline.
```js
// syntax
db.collection.aggregate(
    [
        //stage 1
        {}, => pipeline
        //stage 2
        {}, => pipeline
        //stage 3
        {}, => pipeline
    ]
)

// Data Flow
Collection => stage 1 => stage 2 => stage 3 => Final Output

//example
db.cousins.aggregate(
    [
        // filter out the cousings who have an exam
        { $match: { hasExam: { $ne: true } } },
        // filter out cousins who have a budget less than 500
        { $match: { budget: { $gte: 500 } } },
        //filter out cousins who are sick
        { $match: { isSick: false } },
        // sort by 
        { $sort: { age: -1 } },
        // limit by 2
        { $limit: 2 },
        // calculate the budget
        {
            $group: {
                _id: "null",
                totalBudget: { $sum: "$budget" },
                cousins: { $push: "$name" }
            }
        }
    ]
)
```
## 6-1 $match , $project aggregation stage
- $match filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
```js
// syntax
{ $match: { <query> } }

// example-1
// both command give the same result
db.test.find({})

db.test.aggregate([])

// example-2
// both command give the same result
db.test.find({
    gender: 'Male'
}) 
db.test.aggregate(
    [
        //stage-1
        { $match: { gender: "Male" } }
    ]
)

// example-3
// both command give the same result
db.test.find({
    gender: 'Male',
    age: { $lt: 30 }
})
db.test.aggregate(
    [
        //stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } }
    ]
)

// example-4
// both command give the same result
db.test.find({
        gender: 'Male',
        age: { $lt: 30 }
    })
    .project({
        name: 1,
        gender: 1,
        age: 1
    })
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $project: { name: 1, gender: 1, age: 1 } }
    ]
)

// this below example will give the empty array because in the first stage we only take the name and gender but in the second stage want the gender and age. As we did not take the age in the first stage,second stage don't have the age, as it causes empty array.
db.test.aggregate(
    [
        // stage-1
        { $project: { name: 1, gender: 1 } },
        // stage-2
        { $match: { gender: "Male", age: { $lt: 30 } } },
    ]
)
```
## 6-2 $addFields , $out , $merge aggregation stage
- $addFields adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields. $addFields wont modify the original documents.
```js
// syntax
{ $addFields: { <newField>: <expression>, ... } }

// example-1
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript" } },
        // stage-3
        { $project: { course: 1 } }
    ]
)
// example-2
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript", eduTech: "Programming Hero" } },
        // stage-3
        { $project: { course: 1, eduTech: 1 } }
    ]
)
```
- $out takes the documents returned by the aggregation pipeline and writes them to a specified collection. We can specify the output database.
  - The $out stage must be the last stage in the pipeline. The $out operator lets the aggregation framework return result sets of any size.
```js
// syntax
{ $out: "<output-collection>" } 

// example-1
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript", eduTech: "Programming Hero" } },
        // stage-3
        { $project: { course: 1, eduTech: 1 } },
        // stage-4
        { $out: "course-students" }
    ]
)
// example-2
// will add all the fields now
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript", eduTech: "Programming Hero", month: 6 } },
        // stage-3
        // { $project: { course: 1, eduTech: 1 } },
        // stage-4
        { $out: "course-students" }
    ]
)
```
- $merge writes the results of the aggregation pipeline to a specified collection. The $merge operator must be the last stage in the pipeline.
```js
// syntax
{ $merge: <collection> } 

// example
// not all the documents will be modified as there is conditions in the stage 1
db.test.aggregate(
    [
        // stage-1
        { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript", eduTech: "Programming Hero", month: 6 } },
        // stage-3
        { $project: { course: 1, eduTech: 1 } },
        // stage-4
        { $merge: "test" }
    ]
)
// now all the documents will be modified as there is no conditions
db.test.aggregate(
    [
        // stage-1
        // { $match: { gender: "Male", age: { $lt: 30 } } },
        // stage-2
        { $addFields: { course: "javascript", eduTech: "Programming Hero", month: 6 } },
        // stage-3
        { $project: { course: 1, eduTech: 1 } },
        // stage-4
        { $merge: "test" }
    ]
)
```
## 6-3 $group , $sum , $push aggregation stage
- The $group stage separates documents into groups according to a "group key". The output is one document for each unique group key. 
```js
// syntax
{
 $group:
  {
    _id: <expression>, // Group key
    <field1>: { <accumulator1> : <expression1> },
    ...
  }
}

// example-1
// in $gender, $ refers the field name
db.test.aggregate(
    [
        // stage-1
        { $group: { _id: "$gender"} }
    ]
)
// if want to group by an array of objects
db.test.aggregate(
    [
        // stage-1
        { $group: { _id: "$address.country"} }
    ]
)
```
- $sum returns a sum of numerical values. Ignores non-numeric values.
```js
// syntax
{ $sum: <expression> }

// example-1
db.test.aggregate(
    [
        // stage-1
        {
            $group: {
                _id: "$address.country",
                count: { $sum: 1 }
            }
        }
    ]
)
// example-2
db.test.aggregate(
    [
        // stage-1
        {
            $group: {
                _id: "$gender",
                count: { $sum: 1 }
            }
        }
    ]
)
```
- $push returns an array of all values that result from applying an expression to documents.
```js
// syntax
{ $push: <expression> }

// example-1
db.test.aggregate(
    [
        // stage-1
        {
            $group: {
                _id: "$address.country",
                count: { $sum: 1 },
                showName: { $push: "$name" }
            }
        }
    ]
)

// example-2
// $$ROOT value will show the full document
db.test.aggregate(
    [
        // stage-1
        {
            $group: {
                _id: "$address.country",
                count: { $sum: 1 },
                showName: { $push: "$$ROOT" }
            }
        }
    ]
)

// example-3
db.test.aggregate(
    [
        // stage-1
        {
            $group: {
                _id: "$address.country",
                count: { $sum: 1 },
                fullDoc: { $push: "$$ROOT" }
            }
        },
        // stage-2
        {
            $project: {
                "fullDoc.name": 1,
                "fullDoc.email": 1,
                "fullDoc.phone": 1,
            }
        }
    ]
)
```
## 6-4 explore more about $group & $project
