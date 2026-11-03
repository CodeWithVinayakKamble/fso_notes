import { useNoteActions } from "./store"

const NoteForm = () => {
    const { add } = useNoteActions()

    const generateId = () => Number((Math.random() * 1000000).toFixed(0))
    const importance = () => (Math.random() < 0.5)

    const addNote = (event) => {
        event.preventDefault()
        const content = event.target.note.value
        add({ id: generateId(), content, important: importance() })
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