import { useNoteActions } from "../store"
import noteServices from '../services/notes'

const NoteForm = () => {
    const { add } = useNoteActions()

    const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        await add(content)
        event.target.reset()
    }

    return (
        <form onSubmit={addNote} >
            <input name="note" />
            <button type="submit">add</button>
        </form>
    )
}

export default NoteForm