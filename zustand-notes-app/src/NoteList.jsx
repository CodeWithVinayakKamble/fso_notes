import Note from "./Note";
import { useNotes } from "./store";


const NoteList = () => {
    const notes = useNotes()
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