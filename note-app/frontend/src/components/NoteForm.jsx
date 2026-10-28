import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NoteForm = ({ createNote }) => {

  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()

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
      <h2>create a new note</h2>

      <form onSubmit={createNewNote}>

        <input
          type='text'
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
          placeholder='write note content here'
          id='note-input'
          required
        />

        <button type="submit">save</button>

      </form>

    </div>
  )
}

export default NoteForm