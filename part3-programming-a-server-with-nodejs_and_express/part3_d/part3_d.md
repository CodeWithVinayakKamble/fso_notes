# Validation and ESLint

## Validation in regex for phonenumber

* eg. 09-1234556 and 040-22334455 are valid phone numbers

* eg. 1234556, 1-22334455 and 10-22-334455 are invalid

```regex

  /  ^   \d{2,3}   -   \d+   $  /
  │  │      │      │    │    │  │
  │  │      │      │    │    └──┴── End of string & regex wrapper
  |  |      |      |    |
  │  │      │      │    └────────── One or more digits (second part)
  |  |      |      |
  │  │      │      └─────────────── Must have a single hyphen "-"
  |  |      |
  │  │      └────────────────────── 2 or 3 digits (first part)
  |  |
  └──┴───────────────────────────── Start of string & regex wrapper

```

# 📖 Regex Breakdown & Reference Guide

## 1. Breakdown of `/^\d{2,3}-\d+$/`

| Symbol | Name | Meaning | Example Match |
| :--- | :--- | :--- | :--- |
| **`/ ... /`** | Delimiters | Encloses the regular expression in JavaScript | `/pattern/` |
| **`^`** | Start Anchor | Asserts the start of the string (no leading characters allowed) | Starts right at beginning |
| **`\d`** | Digit Class | Matches any single digit from `0` to `9` | `0`, `4`, `9` |
| **`{2,3}`** | Range Quantifier | Matches the preceding token between **2 and 3 times** | `09` (2 digits), `040` (3 digits) |
| **`-`** | Literal Character | Matches the exact hyphen character `-` | `-` |
| **`\d+`** | Plus Quantifier | Matches **1 or more digits** | `1234556`, `22334455` |
| **`$`** | End Anchor | Asserts the end of the string (no trailing characters allowed) | Ends right after digits |

---

## 3. General Regex Cheat Sheet

| Token | Meaning | Example |
| :--- | :--- | :--- |
| `\d` | Any digit `[0-9]` | `\d` matches `7` |
| `\D` | Any non-digit | `\D` matches `a`, `@` |
| `\w` | Any word character `[a-zA-Z0-9_]` | `\w` matches `A`, `3`, `_` |
| `\s` | Any whitespace (space, tab, newline) | `\s` matches ` ` |
| `.` | Any character (except newline) | `.` matches `x`, `9`, `%` |
| `*` | 0 or more times | `a*` matches `""`, `"a"`, `"aaa"` |
| `+` | 1 or more times | `a+` matches `"a"`, `"aaa"` |
| `?` | 0 or 1 time (optional) | `https?` matches `http`, `https` |
| `{n}` | Exactly `n` times | `\d{4}` matches `2026` |
| `{n,m}` | Between `n` and `m` times | `\d{2,4}` matches `99`, `9999` |
| `[abc]` | Any character inside brackets | `[abc]` matches `a`, `b`, or `c` |
| `[^abc]` | Any character NOT inside brackets | `[^abc]` matches `x`, `1` |
| `(a\|b)` | Either `a` or `b` | `(cat\|dog)` matches `cat` or `dog` |

---

## 4. Usage in Mongoose Schema

```javascript
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
});
```

##  ⚙️ How .test(v) works:

validator: function(v) { return /^\d{2,3}-\d+$/.test(v) }

* v is the value the user typed in the phone number box.

* .test(v) runs the regex.

* If it matches the pattern ➡️ returns true (Mongoose saves it).

* If it does NOT match ➡️ returns false (Mongoose rejects it with your custom message!).

---

## 1. What is ESLint? (The Big Picture)

* ESLint is the automated Style & Quality Inspector for JavaScript:

* ESLint is the automated Style & Quality Inspector for JavaScript:

    * It reads your code without running it.

    * It catches hidden bugs (like unused variables or accidental global variables).

    * It enforces clean formatting rules (e.g. "In this company, we always use single quotes and 2 spaces")
---

### The 4 Simple Steps to Set Up ESLint from Scratch:

* Step 1: install the Tools 

    * **npm install _eslint_ _@eslint/js_ _globals_ _@stylistic/eslint-plugin-js_ --save-dev**
    <!-- npm install eslint @eslint/js globals @stylistic/eslint-plugin-js --save-dev -->

        * **eslint**: The main inspection engine.

        * **@eslint/js**: Recommended default JavaScript rules.

        * **globals**: Tells ESLint that Node variables (like process.env and require) are allowed.

        * **@stylistic/eslint-plugin-js**: Rules for visual formatting (spaces, quotes, semicolons).

        * **--save-dev**: Tells npm this is only a development tool (not needed in live production).
---

* Step 2: The Rules File (eslint.config.mjs)

    * You create a single file named **eslint.config.mjs** in your project root. Think of this file like a Rulebook:

    ```js

    import globals from "globals";
    import js from "@eslint/js";
    import stylisticJs from "@stylistic/eslint-plugin-js";

    export default [
    js.configs.recommended, // 1. Use standard recommended JS rules
    {
        files: ["**/*.js"],
        languageOptions: {
        sourceType: "commonjs", // 2. We use CommonJS (require/exports)
        globals: {
            ...globals.node,      // 3. Allow Node globals (process, require, etc.)
        },
        ecmaVersion: "latest",
        },
        plugins: {
        "@stylistic/js": stylisticJs,
        },
        rules: {
        "@stylistic/js/indent": ["error", 2],        // Rule: Indent with 2 spaces
        "@stylistic/js/quotes": ["error", "single"],  // Rule: Use single quotes ' '
        "@stylistic/js/semi": ["error", "never"],     // Rule: No semicolons at end of lines
        "eqeqeq": "error",                            // Rule: Always use === instead of ==
        "no-trailing-spaces": "error",                // Rule: No useless spaces at end of lines
        "object-curly-spacing": ["error", "always"],  // Rule: { name: 'Dan' } instead of {name:'Dan'}
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-console": "off",                          // Rule: console.log is allowed in backend!
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],       // Rule: Do not inspect the frontend build or node_modules!
    },
    ];

    ```
---

* 📜 Step 3: Add the lint command in package.json
```json
"scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "lint": "eslint ." // <====
}
```

* 🔍 Step 4: Run the Inspector!
    * npm run lint

### Magic of eslint

1. *  ESLint tells you what to fix:

* When you run npm run lint, ESLint acts like a helpful guide.

```bash

index.js:15:3  error  Expected indentation of 2 spaces but found 4  @stylistic/js/indent

index.js:20:10 error  Strings must use singlequote                  @stylistic/js/quotes

```
* It tells you the exact file, exact line number, and what rule needs fixing.

---

2. * Auto-Fixing (The Magic Trick! ✨):

run:-
```bash
npx eslint . --fix
```
* ESLint will automatically fix spaces, quotes, and semicolons across your entire project in 1 second!


    



