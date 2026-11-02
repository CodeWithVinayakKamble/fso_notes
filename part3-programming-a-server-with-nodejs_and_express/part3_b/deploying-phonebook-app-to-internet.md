# Deploying PhoneBook App to Internet

## phonebook (frontend) - react in part2/phonebook running on PORT : 5173

## phonebook (backend) - index.js in part3/phonebook-backend running on PORT : 3001

* By above refrences this is not the case of _`SOP`_(__same-origin-policy__) , this is the pure
_`CORS`_(__cross-origin-resouce-sharing__).

* so we have solution for this.

    * Connect React Frontend to Express Backend :- 

        * Backend :-

            1. In your part3 phonebook-backend project : **npm install cors**

            2. In index.js, add cors near the top:
                ```js
                const express = require('express');
                const cors = require('cors');
                const morgan = require('morgan');

                const app = express();

                <!-- Middlware -->
                app.use(cors()) ==> Instantly attaches the Access-Control-Allow-Origin
                app.use(express.json());
                app.use(
                    morgan(':method :url :status :res[content-length] - :response-time ms :body')
                );
                ```
            
            3. Start your backend on port 3001: **npm run dev**

        ---

        * Frontend :-

            1. In your part2/phonebook React project:

                * Open src/services/persons.js.

                * Update your baseUrl to point to your live Express backend
                ```js
                const baseUrl = 'http://localhost:3001/api/persons'; <== this new backend server url
                ```

            2. Start React on port 5173 : **npm run dev**
    
    ---

    * Full-Stack Production Build :-

        * Now we are going to compile your React app into a static dist folder and serve it directly from Express on Port 3001!

            * frontend :-
                 
                1. In your React Frontend (part2/phonebook):

                    - Open src/services/persons.js and change baseUrl to a Relative URL:
                    ```js
                    const baseUrl = '/api/persons'; // 👈 Relative URL!
                    ```

                2. Generate the Production Build:

                    * _In your React terminal (inside part2/phonebook) run_: **npm run build** ,
                    Vite will compile your entire **React app into** a brand-new **folder called dist**!

            ---
            * Backend :-

                1. Copy dist into your Backend:

                    - Copy that entire dist folder from part2/phonebook and paste it directly into your phonebook-backend folder _(right next to index.js and package.json)_.

                2. Tell Express to Serve the dist folder:

                    - Open phonebook-backend/index.js and add this 1 line right under your middleware:

                        ```js
                        app.use(express.static('dist'));
                        ```
    
    ---

    * The 4-Step Deployment Checklist:

        * Step 1: Pre-Flight Safety Checks (in phonebook-backend/index.js)

            1. Static Middleware is active:
            ```js
            app.use(express.static('dist'));
            ```
            2. Dynamic Cloud Port is set:
            ```js
            const PORT = process.env.PORT || 3001; // 👈 Must use process.env.PORT!
            ```

        ---

        * Step 2: Make sure dist is in your Backend Folder

            * Verify that the compiled dist folder from React is sitting inside your phonebook-backend folder (right next to index.js).

            * ⚠️ Make sure dist is NOT in your backend .gitignore so Git uploads it!

        ---

        * Step 3: Push phonebook-backend to GitHub

            - In your phonebook-backend terminal:
            ```bash
            git add .
            git commit -m "Deploy full-stack phonebook"
            git push
            ```
        ---

        
        * Step 4: Deploy on Render.com
            1. Sign in to https://render.com with GitHub.
            2. Click "New +" -> "Web Service" -> select your repository.
            3. Set "Root Directory" to: `part3/phonebook-backend`
            4. Set Build Command: `npm install`
            5. Set Start Command: `npm start`
            6. Select Free Tier ($0) and click "Deploy Web Service"!

---






