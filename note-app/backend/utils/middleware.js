// ================================== //
// Immports
// ================================== //

const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

// ================================== //
// Morgan Logger / Built-In Logger
// ================================== //
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// ================================== //
// Fallback for UnknownEndpoints
// ================================== //
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// ================================== //
// Error Handler
// ================================== //
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })

  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })

  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

// ================================== //
// JWT Token Extractor
// ================================== //
const tokenExtractor = (request, response, next) => {

  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

// ================================== //
// Ready Made user Who made Request so User Extractor
// ================================== //
const userExtractor = async (request, response, next) => {

  const token = request.token
  if (!token) {
    return response.status(401).json({ error: "Token Missing" })
  }

  // The helper function getTokenFrom isolates the token from the authorization header.The validity of the token is checked with jwt.verify.The method also decodes the token, or returns the Object which the token was based on.
  const decodedToken = jwt.verify(token, SECRET)
  // The object decoded from the token contains the username and id fields, which tell the server who made the request.

  // If the object decoded from the token does not contain the user's identity (decodedToken.id is undefined), error status code 401 unauthorized is returned and the reason for the failure is explained in the response body.
  if (!decodedToken.id) {
    return response.status(401).json({ error: "Invalid Token" })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: "Invalid User" })
  }

  request.user = user
  next()
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor }