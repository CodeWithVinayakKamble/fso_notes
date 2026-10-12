import { useState } from "react"

const NoteForm = ({ createNote }) => {

    const [newNote, setNewNote] = useState('new note')

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
                    value={newNote}
                    onChange={({ target }) => setNewNote(target.value)}
                />

                <button type="submit">Save</button>

            </form>

        </div>
    )
}

export default NoteForm