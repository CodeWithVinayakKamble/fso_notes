# End-to-end testing by using playWright

1. E2E Tests Do Not Import Application Code (Black Box Testing)

    - npm init playwright@latest

        * Language: JavaScript
        * Test directory: tests (default)
        * Add GitHub Actions workflow: No / False / n
        * Install Playwright browsers: Yes / True / y

2. configure playwright.config.js

    * worker:1,

    * use{
        baseURL: 'http://localhost:5173'
    }

    * remove every thing from 

        projects:{
            keep only chromium
        }

3. configure package.json
```json
{
    "test": "playwright test",
    "test:report":"playwright show-report",
}
```

4. configure in note-app's backend package.json scripts
"start:test":"cross-env NODE_ENV=test node --watch index.js"

5. npm test -- --project chromium

## things to keep in mind

- AI

    * **{ page }**: This is a Playwright fixture. It automatically opens an isolated browser tab for this test.

    * **await page.goto('')**: Because you set baseURL in playwright.config.js, this navigates straight to http://localhost:5173.

    * **page.getByText('Notes')**: Locates an element containing the word "Notes" (like your main heading).

    * **await expect(locator).toBeVisible()**: Unlike Jest/Vitest, Playwright assertions are asynchronous (await). Playwright will continuously check the DOM for a few seconds waiting for the text to appear before throwing an error.

---

## do things before test getting start
* live frontend 
* live backend 
* then hit npm test at note-app/notes-e2e

## option to run single test or one by one
* npm test -- -g "login fails with wrong password"


## Chunk 4: Playwright Codegen (The Test Recorder)

* If you aren't sure what selector to write for a complex button or dropdown, Playwright can write the code for you:

* npx playwright codegen http://localhost:5173

* Opens a browser and a code recorder.

* As you click buttons and type into inputs with your mouse and keyboard, Playwright automatically generates the exact test code in the recorder window!

* You can copy and paste that code directly into your test file.