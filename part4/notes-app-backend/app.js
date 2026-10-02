// ================================== //
// Imports & Dependencies
// ================================== //
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes').notesRouter
const userRouter = require('./controllers/users').userRouter
// ================================== //
// App Initialization
// ================================== //
const app = express()

// ================================== //
// Data base connection init
// ================================== //
logger.info('connecting to MongoDB Atlas...')

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => logger.error('error connection to MongoDB:', err.message))
//


// ================================== //
// Pre-Route Middlewares
// ================================== //
app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)   // 1. Log the incoming request FIRST

app.use('/api/users', userRouter)   // 2. Users
app.use('/api/notes', notesRouter)  // 2. Notes

app.use(middleware.unknownEndpoint) // 3. Fallback for unmatched URLs

app.use(middleware.errorHandler)    // 4. Centralized error handling

module.exports = app

