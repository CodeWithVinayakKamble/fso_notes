// ==== dependecies ==== //
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NoteList = ({ notes, user, }) => {

    const [showAll, setShowAll] = useState(true)
    const navigate = useNavigate()

    // ================================== //
    // ==== Filteration on Importance === //
    // ================================== //
    const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

    return (
        <>
            <h1 className='title'>Notes</h1>

            {user && (<button className='createNoteBtn' type='button' onClick={() => navigate('/create')}>create note</button>)}

            <br />

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>

            <ul>
                {notesToShow.map(note => {
                    return (
                        <li key={note.id}>
                            <Link to={`/notes/${note.id}`}>{note.content} by ~ {note?.user?.username}</Link>
                        </li>
                    )
                })}
            </ul>

        </>
    )
}

export default NoteList