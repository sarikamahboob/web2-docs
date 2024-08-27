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
- The following aggregation operation uses the $group stage to count the number of documents in the collection.
```js
// syntax
db.collection.aggregate( [ { $group : { _id : "$item" } } ] )

// example
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" }
        }
    },
])
```
- $max returns the maximum value.
```js
// syntax
{ $max: <expression> }

// examples
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" }
        }
    },
])
```
- $min returns the minimum value. 
```js
// syntax
{ $min: <expression> }

// examples
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" },
            minSalary: { $min: "$salary" },
        }
    },
])
```
- $avg returns the average value of the numeric values.
```js
// syntax
{ $avg: <expression> }

// examples
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" },
            minSalary: { $min: "$salary" },
            avgSalary: { $avg: "$salary" },
        }
    },
])
```
- using $project to modify the name 
```js
// examples
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" },
            minSalary: { $min: "$salary" },
            avgSalary: { $avg: "$salary" },
        }
    },
    // stage-2
    {
        $project: {
            totalSalary: 1,
            maxSalary: 1,
            minimumSalary: "$minSalary",
            avarageSalary: "$avgSalary",
        }
    }
])
```
- $subtract subtracts two numbers to return the difference, or two dates to return the difference in milliseconds, or a date and a number in milliseconds to return the resulting date
```js
// syntax
{ $subtract: [ <expression1>, <expression2> ] }

// examples
db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" },
            minSalary: { $min: "$salary" },
            avgSalary: { $avg: "$salary" },
        }
    },
    // stage-2
    {
        $project: {
            totalSalary: 1,
            maxSalary: 1,
            miimumSalary: "$minSalary",
            avarageSalary: "$avgSalary",
            rangeBetweenMaxAndMIn: {$subtract: ["$maxSalary", "$minSalary"]}
        }
    }
])
```
## 6-5 Explore $group with $unwind aggregation stage
- $unwind deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
```js
// syntax
{ $unwind: <field path> }

// example-1
db.test.aggregate([
    // stage-1
    {
        $unwind: "$friends"
    },
    // stage-2
    {
        $group: { 
            _id: "$friends", 
            count: {$sum: 1}
        }
    }
])
// example-2
db.test.aggregate([
    // stage-1
    {
        $unwind: "$interests"
    },
    // stage-2
    {
        $group: {
            _id: "$age",
            interestsPerAge: { $push: "$interests" }
        }
    }
])
```
## 6-6 $bucket, $sort, and $limit aggregation stage
- $bucket categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries and outputs a document per each bucket. Each output document contains an _id field whose value specifies the inclusive lower bound of the bucket. The output option specifies the fields included in each output document.

- $bucket only produces output documents for buckets that contain at least one input document.
```js
// syntax
{
  $bucket: {
      groupBy: <expression>,
      boundaries: [ <lowerbound1>, <lowerbound2>, ... ],
      default: <literal>,
      output: {
         <output1>: { <$accumulator expression> },
         ...
         <outputN>: { <$accumulator expression> }
      }
   }
}

// examples-1
db.test.aggregate([
    // stage-1
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [20, 40, 60, 80],
            default: "80 up aged persons",
            output: {
                count: { $sum: 1 },
                personName: { $push: "$name" }
            }
        }
    },
])

// example-2
db.test.aggregate([
    // stage-1
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [20, 40, 60, 80],
            default: "80 up aged persons",
            output: {
                count: { $sum: 1 },
                personName: { $push: "$$ROOT" }
            }
        }
    },
])

// example-3
// always use sort before limit
db.test.aggregate([
    // stage-1
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [20, 40, 60, 80],
            default: "80 up aged persons",
            output: {
                count: { $sum: 1 },
                personName: { $push: "$$ROOT" }
            }
        }
    },
    // stage-2
    {
        $sort: { count: -1 }
    },
    // stage-3
    {
        $limit: 2,
    },
    // stage-4
    {
        $project: {
            count: 1
        }
    }
])
```
## 6-7 $facet, multiple pipeline aggregation stage
- The $facet stage allows us to create multi-faceted aggregations which characterize data across multiple dimensions, or facets, within a single aggregation stage. Multi-faceted aggregations provide multiple filters and categorizations to guide data browsing and analysis.
```js
// syntax
{ $facet:
    {
      <outputField1>: [ <stage1>, <stage2>, ... ],
      <outputField2>: [ <stage1>, <stage2>, ... ],
      ...

    }
}

// examples
db.test.aggregate([
    // stage-1
    {
        $facet: {
            // pipleline-1
            "friendsCount": [
                // stage-1
                { $unwind: "$friends" },
                // stage-2
                {
                    $group:
                    {
                        _id: "$friends",
                        count: { $sum: 1 }
                    },
                }
            ],
            // pipleline-2
            "educationCount": [
                // stage-1
                { $unwind: "$education" },
                // stage-2
                {
                    $group:
                    {
                        _id: "$education",
                        count: { $sum: 1 }
                    },
                }
            ],
            // pipleline-3
            "skillsCount": [
                // stage-1
                { $unwind: "$skills" },
                {
                    $group: {
                        _id: "$skills",
                        count: { $sum: 1 }
                    }
                }
            ]
        }
    },
])
```
## 6-8 $lookup stage, embedding vs referencing.mp4
- Embededdedd
    - one to one relationships
    - frequent reading data
    -  atomic updates
    - reduced network overhead
    - small data size
- Referencing
    - one to many relationships
    - many to many
    - frequent writing
    - big data size
    - scalability
    - flexibility

- $lookup performs a left outer join to a collection in the same database to filter in documents from the "joined" collection for processing. The $lookup stage adds a new array field to each input document. The new array field contains the matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.
```js
// syntax
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}

// examples
db.orders.aggregate([
    {
        $lookup: {
               from: "test",
               localField: "userId",
               foreignField: "_id",
               as: "user"
             }
    }
])
```
## 6-9 What is indexing, COLLSCAN vs IXSCAN
- With indexing we can do faster query in database.
    - normal scan is called the COLSCAN. 
    -  while do the index, that time it is called IXSCAN
- by default, mongodb provides a unique id and make an index of that unique id
- indexing will consume memories. For big data sets we will use indexing
```js
// example-1
// do ixscan
db.test.find({_id : ObjectId("6406ad63fc13ae5a40000065")}).explain("executionStats")

// example-2
// do collscan
db.test.find({email : "mdangl1@odnoklassniki.ru"}).explain("executionStats")

// example-3
// doing indexing on email 
db.getCollection("massive-data").createIndex({
    email: 1
})
```
## 6-10 Explore compound index and text index
- for removing indexing
```js
// example-1
db.getCollection("massive-data").dropIndex({
    email: 1
})
```
- compound indexes collect and sort data from two or more fields in each document in a collection.
```js
// examples
db.getCollection("massive-data").createIndex({
    gender: -1,
    age: 1
})
```
- search index creation. this is called text indexing
```js
// examples
db.getCollection("massive-data").createIndex({
    about: "text"
})
```
- search document by a word
```js
// examples
db.getCollection("massive-data").find({
    $text: { $search: "dolor" }
}).project({
    about: 1
})
```
-
```js
// syntax

// examples

```
-
```js
// syntax

// examples

```