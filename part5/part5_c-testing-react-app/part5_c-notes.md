# Testing React app

---

## testing library for react (--save-dev)


1. npm i vitest jsdom 
2. npm i @testing-library/react @testing-library/jest-dom
3. npm install @testing-library/user-event

## configuration package.json

```json
{
    "test":"vitest run"
}
```

## testSetup.js at root folder

## vite.config.js configuration
```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})
```

## 3. Update eslint.config.js:

* Add a block so ESLint knows that Vitest globals (test, expect, describe) are valid in test files:
```js
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
```

## 2. Why ESLint STILL needs to know:

* ESLint does not talk to Vitest, and it never reads vite.config.js! ESLint only reads the plain text in your files.

* When ESLint scans Note.test.jsx, it sees:

```js
test('renders content', () => {
  ...
  expect(element).toBeDefined()
})
```

* ESLint panics and says:

* "Where did test and expect come from? You never imported them! Did you make a typo for an undefined variable?"

* Adding globals: { ...globals.vitest } in eslint.config.js tells ESLint:

* "Relax ESLint, in .test.jsx files, test and expect are globally provided by Vitest — don't flag them as errors."

### So:
* vite.config.js tells Vitest to run them.
* eslint.config.js tells ESLint not to complain about them.

## testSetup at root testSetup.js
```js
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import '@testing-library/jest-dom/vitest'


afterEach(() => {
    cleanup()
})
```

### test files in src/components/... Note.test.jsx

## npm install --save-dev @testing-library/user-event
* userEvent (installed via npm install --save-dev @testing-library/user-event) to simulate realistic user clicks and keystrokes.

### vi.fn() is Vitest's tool to create a Mock Function (a fake function with a memory).

* If you use a normal JavaScript function:
```js
const normalFunc = () => {
  console.log('clicked')
}
```

* If you pass normalFunc into <Note toggleImportance={normalFunc} /> and click the button... How do you write a test asserting that it was called? You can't! A normal JavaScript function does not remember how many times it was executed.

### If you use vi.fn():
```js
const mockHandler = vi.fn()
```

* Vitest creates a special function that keeps a diary of everything that happens to it:

* Every time it gets called, it records it in mockHandler.mock.calls.

  * If you click the button once → mockHandler.mock.calls.length becomes 1.
  * If you click the button twice → mockHandler.mock.calls.length becomes 2.
  * If the button was never clicked → mockHandler.mock.calls.length is 0.

So:
```js
expect(mockHandler.mock.calls).toHaveLength(1)
```
