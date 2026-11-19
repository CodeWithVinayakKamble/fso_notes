# Miscellaneous

##  concurrently
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "build": "npm run build --prefix client",
    "start": "NODE_ENV=production npm start --prefix server"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

* The dev script uses concurrently(opens in a new tab), a small utility that runs multiple commands at the same time and merges their output into a single terminal stream. Without it you would have to open two separate terminals, one for the backend and one for the frontend.

* prevention for using older versions of dependencies if not updated leads security threats
npm install -g npm-check-updates

* Commit the lock file (package-lock.json) and use **npm ci** instead of **npm install** in CI/production environments, so that the exact previously verified dependency versions and their integrity hashes are used.