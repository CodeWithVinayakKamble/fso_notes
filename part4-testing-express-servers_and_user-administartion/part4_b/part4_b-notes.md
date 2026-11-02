# Testing the backend

* Got one golden rule while doing coding warm-up 

    - **An async function runs 100% SYNCHRONOUSLY until it hits the first** **_`await keyword`_**.

---

1. Why Integration Testing?

    - Until now, whenever you wrote a new backend route or feature, how did you test it?

        * You started the server with `npm run dev`.

        * You opened the `browser` or clicked send in `Postman` / `VS Code REST client`.

        * You manually checked MongoDB Atlas to see if the document was inserted.

    ---

    * `In production engineering, manual testing is too slow and dangerous`. If you change one line in your authentication middleware, you might accidentally break 10 different routes without realizing it.

        * We need Automated Integration Tests that:

            * Start the Express app in memory.

            * Send real HTTP requests (GET /api/blogs, POST /api/blogs).

            * Assert that status codes, headers, and JSON responses match our specifications.

            * Run in 2 seconds every time we push code.
    
    ---

    * We need Automated Integration Tests that:

        * Start the Express app in memory.

        * Send real HTTP requests (GET /api/blogs, POST /api/blogs).

        * Assert that status codes, headers, and JSON responses match our specifications.

        * Run in 2 seconds every time we push code.

---

## Test Environment

* _Step 1_: **Isolating the Test Database (NODE_ENV)**

    ```md
    * **development**: when we run the app locally with npm run dev / nodemon.
    * **production**: when deployed live on the internet (e.g., Render).
    * **test**: when we run automated test suites (npm test)
    ```
    ---

    * Why do we care?
        - In test mode, we want our application to connect to a separate test database **(TEST_MONGODB_URI)** so our tests never accidentally erase or mess up our development or production data.

    ---

    * The Problem with Windows vs Linux/Mac (cross-env):

        - To tell Node which mode it is in, we set an environment variable named NODE_ENV.

            * On Linux/Mac: NODE_ENV=test node --test works.

            * On Windows PowerShell: NODE_ENV=test fails with an error (The term 'NODE_ENV' is not recognized)
    
    ---

    * solution (cross-env)

        1. install `cross-env` lib and --save-dev dev-dependency
        ---
        2. configure **scripts** in _package.json_
        ```json
        "scripts": {
        "start": "cross-env NODE_ENV=production node index.js",
        "dev": "cross-env NODE_ENV=development node --watch --inspect index.js",
        "test": "cross-env NODE_ENV=test node --test"
        }
        ```
        ---
        3. in .env define TEST_MONGODB_URI right below OG: MONGODB_URI
        ```
        MONGODB_URI=mongodb+srv://fso-vinayak:<passkey>url/notes-app?appName=notes-app

        <!-- Add testword before your app names before ? thats it -->
        TEST_MONGODB_URI=mongodb+srv://fso-vinayak:<passkey>url/testnotes-app?appName=notes-app

        PORT=3003
        ```
        ---
        4. In utils/config.js, update how MONGODB_URI is exported:

            ```js
            const MONGODB_URL = process.env.MONGODB_URI
            const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI

            const MONGODB_URI = process.env.NODE_ENV === 'test' ? TEST_MONGODB_URI : MONGODB_URL
            ```
---

## supertest - tool that helps to Testing API endpoints

* HTTP routes (GET /api/notes, POST /api/notes, status codes, headers, response JSON) we will test here

* How supertest works under the hood: ?

    * Normally, **Express needs app.listen(PORT)** to bind to a network port (e.g., 3003) so you can send requests from **Postman or a browser**.

    1. You pass your Express app object into supertest
    ```js
    const supertest = require('supertest')
    const app = require('../app')
    const api = supertest(app)
    ```

    2. supertest wraps the Express app into a virtual test server internally. It does NOT need index.js or app.listen()

    3. It allows you to write assertions on HTTP responses directly:
    ```js
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    ```
---

### Key Requirements in Modern Node (node:test):

* In the course's notes-backend, a test file for notes API (e.g. tests/note_api.test.js) has 3 main parts:

    1. **Setup & Imports**:

        * test, after, describe from node:test
        * assert from node:assert
        * mongoose (to close the connection when tests finish!)
        * app from ../app
        * supertest wrapping app into api

        ```js
        const mongoose = require('mongoose')
        const supertest = require('supertest')

        const app = require('../app')

        const api = supertest(app)

        ```
    
    ---

    2. **The Test Case**:

        * Marking the test callback function as async:

        ```js
        test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        ```

    ---

    3. Teardown (after):

        - When all tests finish, Mongoose is still holding an active open socket connection to MongoDB Atlas.
        If you don't close it, Node test runner will hang forever waiting for connections to close!
        We use after(async () => { await mongoose.connection.close() }) to cleanly disconnect from MongoDB when all tests in the file are done.

        ```js
        test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })

        after(async () => {
        await mongoose.connection.close()
        })
        ```
---

### Quick Check:
* Look at that regex in **.expect('Content-Type', /application\/json/)**. Do you remember why the course uses a Regular Expression /application\/json/ instead of an exact string 'application/json'?

Think back to Part 3 when we inspected response headers! What extra text does Express append to Content-Type?

* `raw header that Express sends back when you return JSON:`

    - `Content-Type: application/json; charset=utf-8`
    * Notice the extra part: **; charset=utf-8**.

* Why Regex /application\/json/ is used: ??

    - If you use an exact string:

        ```js
        .expect('Content-Type', 'application/json') // ❌ FAILS!
        ```

        * Because **'application/json'** **is NOT strictly equal to** **'application/json; charset=utf-8'**.

    - If you use a Regular Expression:

        ```js
        expect('Content-Type', /application\/json/) // ✅ PASSES!
        ```

        * Because the regex only checks: "Does the header contain the text application/json?"

        * It ignores whatever comes after the semicolon (like charset=utf-8).
---

## All set hit npm test

* quick note about npm

    * npm run "custom script" => dev/lint/lint:fix this custom made so we need use npm run dev , lint

    * npm start , test => start and test are built in shortcuts we need hit hit just npm test or start

---

## Running test one by one

* When you run npm test, it runs every single test file in your project (average.test.js, reverse.test.js, note_api.test.js).

* solution => 

    * **npm test -- --test-only**

    * **npm test -- tests/note_api.test.js**
        - The following command only runs the tests found in the tests/note_api.test.js file:

    * **npm test -- --test-name-pattern="a specific note is within the returned notes"**
        - The --test-name-pattern option can be used for running tests with a specific name:

    * **npm run test -- --test-name-pattern="notes"**
        - The **provided argument can refer** to the **name of the test** or the **describe block**. It **can also contain just a part of the name**. The following command will **run all** of the tests **that contain notes in their name**:

    * **npx cross-env NODE_ENV=test node index.js** - to run test server
---

## async/await

* I am going refactor all controllers/notes.js all network request with syntax async/await its replaace all promise chnaing ugly part and make code more readable and undertandable

* E.g

    ```js 
    <!-- Old way promise chaning -->
    notesRouter.get('/', (request, response) => {
    Note.find({})
        .then(notes => {
        response.json(notes)
        })
    })

    <!-- New Way  -->
    notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
    })
    ```

---

## Refactor routes with async/await

* gold-standard engineering practice called Regression Prevention / Test-Driven Refactoring:

    - do not blindly made changes do simultaneously like if you are going refactor .get(Note.find({})) made test case for it test it with test cases then only refactor other routes same pattern for all.

---

## optimizing the beforEach function

### The Problem in our current beforeEach:

* Look at how we wrote beforeEach earlier:
    ```js
    beforeEach(async () => {
    await Note.deleteMany({})

    let noteObject = new Note(initialNotes[0])
    await noteObject.save()

    noteObject = new Note(initialNotes[1])
    await noteObject.save()
    })
    ```

* What if initialNotes had 100 notes? Writing await noteObject.save() 100 times manually is impossible!

---

### The Question: How to save an array of notes cleanly?

* You might think: "Can we use initialNotes.forEach(async (note) => { ... })?"

* The course warns: NO! **forEach does NOT work with async/await!**

---

### Why?
* forEach does not wait for promises to finish. It fires all the saves and moves on immediately before the database actually finishes saving!

---

### The Solution: Promise.all
* We create an array of Mongoose objects, turn them into save promises, and wait for all of them together:

```js
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes
    .map(note => new Note(note))
  
  const promiseArray = noteObjects
    .map(note => note.save())
  
  await Promise.all(promiseArray)
})
```

* **How Promise.all works**:

    * **noteObjects**: Creates Mongoose document instances for each item in initialNotes.

    * **promiseArray**: Calls .save() on each document, creating an array of pending Promises.

    * **await Promise.all(promiseArray)**: Executes all save operations in parallel and waits until every single one is done!

* (Alternative bonus tip: You can also use a standard for...of loop with await, or await Note.insertMany(initialNotes)—both are also great!).


---

### **In production grade code try{...}catch{...} not needed anymore** in express 5 versioning because modern javascript and express 5 handle it just we have made in utils its 4(params) => (error,request,response,next) rest all erros get catch by express and passed to the error handler middlerware

---