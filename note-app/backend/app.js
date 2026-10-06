// ================================== //
// Imports & Dependencies
// ================================== //
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { requestLogger, tokenExtractor, unknownEndpoint, errorHandler } = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

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

app.use(cors())                     // Enable Cross-origin resourse sharing
app.use(express.json())             // It parses incoming raw text (strings) from the network into a JavaScript Object on request.body

app.use(requestLogger)              // Log the incoming request FIRST
app.use('/api/users', userRouter)   // User Registration
app.use('/api/login', loginRouter)  // User Authentication for JWT token
app.use(tokenExtractor)             // Json-Web-Token_Extractor
app.use('/api/notes', notesRouter)  // Notes App

app.use(unknownEndpoint)            // Fallback for unmatched URLs
app.use(errorHandler)               // Centralized error handling system

module.exports = app

