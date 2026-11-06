import Note from "./Note";
import { useFilteredNotes } from "./store";


const NoteList = () => {
    const notes = useFilteredNotes()
    return (
        <ul>
            {
                notes.map(note => (
                    <Note key={note.id} note={note} />
                ))
            }
        </ul>
    )
}

export default NoteList