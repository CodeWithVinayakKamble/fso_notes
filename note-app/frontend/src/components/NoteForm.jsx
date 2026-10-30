import { useState } from 'react'
import { TextField, Button } from '@mui/material'

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

      <h2>create a new note</h2>

      <form onSubmit={createNewNote}>

        <TextField
          label='note content'
          type='text'
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
          placeholder='write note content here'
          id='note-input'
          required
        />
        <div>
          <Button type="submit" variant='contained' style={{ marginBlockStart: 10 }}>save</Button>
        </div>
      </form>

    </div>
  )
}

export default NoteForm