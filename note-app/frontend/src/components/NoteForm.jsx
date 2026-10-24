import { useState } from 'react'

const NoteForm = ({ createNote }) => {

  const [newNote, setNewNote] = useState('')

  const createNewNote = (event) => {
    event.preventDefault()

    createNote({
      content: newNote,
      important: Math.random() < 0.5
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create new note</h2>

      <form onSubmit={createNewNote}>

        <input
          type='text'
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
          placeholder='write note content here'
          id='note-input'
        />

        <button type="submit">save</button>

      </form>

    </div>
  )
}

export default NoteForm