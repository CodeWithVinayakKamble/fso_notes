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
            '@stylistic/js/linebreak-style': ['error', 'windows'], //
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