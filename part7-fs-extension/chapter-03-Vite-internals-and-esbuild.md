# Chapter 3: Vite Internals & esbuild

> **Core Takeaway:** Modern browsers cannot natively parse JSX, TypeScript, or hundreds of separate `node_modules` CommonJS files efficiently. Build tools handle **bundling**, **transpilation**, **minification**, and **developer experience (HMR)** automatically.

---

## 1. The Evolution: Webpack → Create React App → Vite

* **Webpack:** Dominant bundler of the 2010s. Powerful, still found in legacy/enterprise codebases, but complex to configure and slow on large projects because it bundles everything *before* starting the dev server.
* **Create React App (CRA):** Hid Webpack's complexity, now deprecated.
* **Vite:** The modern industry standard. Instant startup, near-zero config, fast Hot Module Replacement (HMR).

---

## 2. How Vite Works Under the Hood (Two Modes)

Vite splits its work cleanly between **speed** (`esbuild`, written in Go) and **bundle quality** (`Rollup`):

| Mode | Command | Engine | How It Works |
| :--- | :--- | :--- | :--- |
| **Development** | `npm run dev` | **Native ESM + esbuild** | Does **NOT** bundle your source files. Serves your files directly to the browser as native ES modules so startup is instant. Uses `esbuild` *only* to pre-bundle `node_modules` (converting CommonJS packages to ESM and merging hundreds of tiny files). |
| **Production** | `npm run build` | **Rollup + esbuild** | Uses **Rollup** for bundling, code-splitting, and **tree-shaking** (stripping unused exports). Uses **esbuild** for fast JSX/TS transpilation and minification. |

> **Why not use `esbuild` for production bundling too?** Rollup still produces better-optimized chunks, stronger code splitting, and has a richer plugin ecosystem for complex production dependency graphs.

---

## 3. Core Concepts (Don't Confuse These!)

| Term | What It Does | Example |
| :--- | :--- | :--- |
| **Bundling** | Starts at an entry point (`src/main.jsx`), recursively follows all `import`s, and merges app code + libraries into optimized files in `dist/`. | `dist/assets/index-e92ae01e.js` |
| **Transpilation** | Converts **syntax** browsers cannot parse into standard JavaScript. | `<App />` → `React.createElement(App, null)` |
| **Polyfill** | Injects missing **runtime features/APIs** into older browsers that understand the syntax but lack the implementation. | Adding `Promise` support for older browsers |
| **Tree Shaking** | Statically analyzes `import`/`export` and removes dead/unused code from the final production bundle. | Importing 1 function from a giant library only ships that 1 function |
| **HMR (Hot Module Replacement)** | Swaps edited modules live in the browser without refreshing the page or wiping out React state. | Editing CSS or JSX while keeping form inputs filled |

---

## 4. Understanding `esbuild` Directly (Manual Setup Without Vite)

To see what a bundler does without Vite's abstraction layer, you can bundle a React app using `esbuild` directly:

```bash
npm install react react-dom
npm install --save-dev esbuild
```

`package.json` scripts:
```json
{
  "scripts": {
    "build": "esbuild src/main.jsx --bundle --minify --sourcemap --outfile=dist/main.js --jsx=automatic",
    "serve": "npx serve dist",
    "dev": "esbuild src/main.jsx --bundle --outfile=dist/main.js --jsx=automatic --servedir=./dist --watch"
  }
}
```

### What Each Flag Does:
* `--bundle` — Follow all imports from `src/main.jsx` into one file.
* `--jsx=automatic` — Transpile JSX automatically (no Babel config needed!).
* `--minify` — Strip whitespace/comments and shorten variable names (shrinks React bundle from ~1.1 MB → ~190 KB).
* `--sourcemap` — Generate `dist/main.js.map` so DevTools maps errors back to original `.jsx` lines.
* `--watch` + `--servedir=./dist` — Rebuild on file save and serve `dist/` (note: requires manual browser refresh; no HMR like Vite).

---

## 5. Minification & Source Maps (Security Rule!)

* **Minification:** Removes whitespace/comments and shortens identifiers so users download smaller files faster. Vite uses `esbuild` for JS minification and a built-in CSS minifier.
* **Source Maps (`.js.map`):** Translates unreadable minified stack traces back to exact line numbers in `App.jsx`.
  * Enabled automatically in **development**.
  * Optional in **production** via `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
})
```

> ⚠️ **Production Security Warning:** Because a source map contains your original unminified source code, **avoid exposing `.map` files on public production servers**. Real production teams upload source maps privately to error trackers (like **Sentry**) instead.

---

## 6. `vite.config.js` Essentials

Vite works out-of-the-box for most apps, but real-world projects commonly customize `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Automatically opens the browser
    proxy: {
      // Forwards /api/* to the backend to avoid CORS issues in dev
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

### Useful Ecosystem Plugins:
* `@vitejs/plugin-react` — JSX transformation + Fast Refresh (HMR).
* `@vitejs/plugin-legacy` — Transpiles + injects polyfills for older browsers.
* `vite-plugin-svgr` — Import `.svg` files directly as React components.
* `rollup-plugin-visualizer` — Visualizes what is taking up space in your production bundle.

---

## 7. Legacy Browsers & Polyfills

By default, Vite targets modern browsers that support native ES modules (Chrome 87+, Firefox 78+, Safari 14+, Edge 88+).

To support older browsers (using Babel + automatic polyfills):
```bash
npm install --save-dev @vitejs/plugin-legacy
```

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
*Check browser feature compatibility anytime at [caniuse.com](https://caniuse.com/) or MDN.*

---

## 8. Environment Variables (`.env`)

Vite loads `.env` files automatically depending on the command:
* `npm run dev` → loads `.env` and `.env.development`
* `npm run build` → loads `.env` and `.env.production`

**Example `.env`:**
```env
VITE_BACKEND_URL=http://localhost:3001/api/notes
```

**Usage in React code:**
```js
const backendUrl = import.meta.env.VITE_BACKEND_URL
```

> 🔒 **Security Rule:** Only variables prefixed with **`VITE_`** are exposed to the frontend bundle. Variables without `VITE_` are stripped out so backend secrets are never leaked to the browser. Always add sensitive `.env.production` files to `.gitignore` and commit a `.env.example` template instead.

---

## 9. CSS, CSS Modules & Sass

* **Standard CSS:** Just `import './index.css'` (injected via `<style>` with HMR in dev; extracted to a single minified `.css` file in prod).
* **CSS Modules (Scoped CSS):** Any file ending in `.module.css` automatically scopes class names to that component:
  ```jsx
  import styles from './App.module.css'
  const App = () => <div className={styles.container}>Hello Vite</div>
  ```
* **Sass (`.scss`):** Just run `npm install --save-dev sass` — zero plugin or config needed!
