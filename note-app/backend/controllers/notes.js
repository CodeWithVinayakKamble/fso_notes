const notesRouter = require('express').Router()
const Note = require('../models/note')
const { userExtractor } = require('../utils/middleware')


// ================================== //
// HTTP GET Router
// ================================== //

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

// ================================== //
// HTTP POST Router
// ================================== //
notesRouter.post('/', userExtractor, async (request, response) => {

  const body = request.body

  const user = request.user

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



// ================================== //
// HTTP POST Router
// ================================== //
// Because 204 No Content sends no body (.end()), you don't even need to save the result into a variable deleteId! 
notesRouter.delete('/:id', userExtractor, async (request, response) => {

  const user = request.user

  const noteId = request.params.id
  const note = await Note.findById(noteId)

  if (!note) {
    return response.status(404).json({ error: "Note not found" })
  }

  if (!note.user || user._id.toString() !== note.user.toString()) {
    return response.status(403).json({ error: "only the creator can delete a note" })
  }

  await Note.findByIdAndDelete(noteId)
  response.status(204).end()

})

// ============================================== //

notesRouter.put('/:id', userExtractor, async (request, response) => {

  const user = request.user
  const noteId = request.params.id
  const note = await Note.findById(noteId)

  if (!note) {
    return response.status(404).json({ error: "Note not found" })
  }

  if (!note.user || user._id.toString() !== note.user.toString()) {
    return response.status(403).json({ error: "only the creator can modify the note" })
  }

  const { content, important } = request.body

  const oldNoteWithUpdatedContent = {
    content: content,
    important: important
  }

  // {new:"true"} is depreciated , Use `returnDocument: 'after'` instead Mongoose still supports { new: true } for backward compatibility
  const updatedNote = await Note.findByIdAndUpdate(noteId, oldNoteWithUpdatedContent, { returnDocument: 'after', runValidators: true, context: 'query' })

  response.json(updatedNote)


})

module.exports = notesRouter
