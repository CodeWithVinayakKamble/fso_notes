const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// ================================== //
// Route Handlers
// ================================== //

// ============================================== //

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

// ============================================== //

notesRouter.get('/:id', async (request, response) => {

  const id = request.params.id
  const note = await Note.findById(id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }

})

// ============================================== //

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


notesRouter.post('/', async (request, response) => {

  const body = request.body

  // The helper function getTokenFrom isolates the token from the authorization header.The validity of the token is checked with jwt.verify.The method also decodes the token, or returns the Object which the token was based on.
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)


  // The object decoded from the token contains the username and id fields, which tell the server who made the request.

  // If the object decoded from the token does not contain the user's identity (decodedToken.id is undefined), error status code 401 unauthorized is returned and the reason for the failure is explained in the response body.
  if (!decodedToken.id) {
    return response.status(401).json({ error: "Invalid Token" })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})


// ============================================== //

// Because 204 No Content sends no body (.end()), you don't even need to save the result into a variable deleteId! 
notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Note.findByIdAndDelete(id)
  response.status(204).end()

})

// ============================================== //

notesRouter.put('/:id', async (request, response) => {

  const id = request.params.id
  const { content, important } = request.body

  const oldNoteWithUpdatedContent = {
    content: content,
    important: important
  }

  // {new:"true"} is depreciated , Use `returnDocument: 'after'` instead Mongoose still supports { new: true } for backward compatibility
  const updatedNote = await Note.findByIdAndUpdate(id, oldNoteWithUpdatedContent, { returnDocument: 'after', runValidators: true, context: 'query' })

  response.json(updatedNote)


})

module.exports = { notesRouter }
