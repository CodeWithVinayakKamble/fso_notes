# Structure of backend application, introduction to testing

## Project structure

* Once we make the changes to the directory structure of our project, we will end up with the following structure:

```bash
├── controllers
│   └── notes.js
├── dist
│   └── ...
├── models
│   └── note.js
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js  
├── app.js
├── index.js
├── package-lock.json
├── package.json
```

* Reason :- 
    - **"Structured Enterprise"** - Every single file has one single job (The Single Responsibility Principle).


* Structure :-
```
                    ┌──────────────────┐
                    │     .env         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ utils/config.js  │ ◄─── (Reads PORT & MONGODB_URI)
                    └────────┬─────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
     ▼                       ▼                       ▼
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  index.js   │     │     app.js      │     │ models/note.js   │
│(Listens on  │     │(Connects DB &   │     │(Schema & Model)  │
│    PORT)    │     │ Middlewares)    │     └────────┬─────────┘
└─────────────┘     └────────┬────────┘              │
                             │                       ▼
                             ├──────────────► ┌──────────────────┐
                             │                │controllers/notes.js
                             │                │(Route Handlers)  │
                             │                └──────────────────┘
                             ▼
                    ┌──────────────────┐
                    │utils/middleware.js
                    │(errorHandler &   │
                    │ unknownEndpoint) │
                    └──────────────────┘
```

---

## Tesing Node Appliactions

### Higher-order Funtion Importance

* In functional programming languages functions are values

    - function can be assigned to variables.
    - why and where this is very useful ??
        * Composition => allows us to take one function and put it into another function
        * compossed alot of small functions into bigger function
        ```js
        const average = (array) => {

            const reducer = (sum, item) => sum + item;

            return array.reduce(reducer, 0) / array.length
        }
        ```

## testing
* Node also has a built-in test library node:test, which is well suited to the needs of the course.
* configure scripts from package.json
```json
{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",

    "test": "node --test", // <==== add on this
    
    "lint": "eslint ."
  },
  // ...
}
```

---

* test 
* describe
* assert

---

* npm run test will run all .test.js files at once and will give summry of all so for specofile file see below above

* specific files test command

  * node --test tests/list_helper.test.js

  * node --test --test-name-pattern="dummy"

---

### 💡 The Golden Rule in Testing:

* Primitive values (numbers, strings, booleans): Use assert.strictEqual(result, 36).

* Objects and Arrays: Use assert.deepStrictEqual(result, expectedObject)!

---

* In JavaScript: 👉 A "Hash Map" is just a plain JavaScript Object {} (or new Map()) used as a Key-Value dictionary!

---
