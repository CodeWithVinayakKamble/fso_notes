## Creating User

*  Users have a unique username, a name and something called a passwordHash.

* The password hash is the output of a **one-way hash function applied to the user's password**

* It is never wise to store unencrypted plain text passwords in the database!
    - never ever save users password as it is plainText into db for security reasons user hashing techniques and save hashword into db

* Pacakge called bcrypt

* Let's define a separate router for dealing with users in a new controllers/users.js file

* The password sent in the request is not stored in the database. We store the hash of the password that is generated with the bcrypt.hash function.

* Mongoose validations do not detect the index violation, and instead of ValidationError they return an **error of type MongoServerError**. 


    * **ValidationError** and **CastError** are created by Mongoose (in JavaScript on your laptop).

    * **But unique**: true creates a Unique Index directly inside the MongoDB database engine.

    * When you try to insert a username that already exists (like "root"):

        - MongoDB Atlas stops the insert.
        - MongoDB throws its official database error:
    
    * MongoServerError: E11000 duplicate key error collection: notes-app.users index: username_1 dup key: { username: "root" }

    * (E11000 is MongoDB's official code for duplicate key violations!)

---

## Side-by-Side:

* When you pass a JavaScript Object { error: '...' }:
```js

// 1. Explicit & Standard (BEST PRACTICE ✅)
response.status(400).json({ error: 'expected `username` to be unique' })

// 2. Generic Sender (Calls .json under the hood)
response.status(400).send({ error: 'expected `username` to be unique' })

```

* Is there a difference when passing an Object?

> When you pass an Object { error: '...' }, **response.send()** **internally calls response.json() anyway**! So in terms of output on the network wire, they produce the exact same JSON.

* Why do Senior Developers ALWAYS use .json() in REST APIs?

    1. **Explicit Intent**: It tells anyone reading your code: "This is a JSON REST API endpoint."

    2. **Prevents Accidental HTML Bugs**:

        * If someone accidentally writes **response.send("Something went wrong")** **(a plain string)**, **Express sends it as text/html**, which can break React/Axios frontend apps expecting JSON!

        * If you write **response.json("Something went wrong")**, **it always sends valid JSON with Content-Type: application/json**.


    3. **Supertest Compatibility**: Your automated tests explicitly check .expect('Content-Type', /application\/json/). Using .json() guarantees that header is always set.

