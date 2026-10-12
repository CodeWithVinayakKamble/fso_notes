// ===================================== //
// Imports
// ===================================== //
import { useEffect, useState } from "react";
import noteServices from './services/notes.js'
import Note from './components/Note.jsx'
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";
import loginServices from "./services/login.js";


const App = () => {

    // ===================================== //
    // React States
    // ===================================== //
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);
    const [notification, setNotification] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    // ===================================== //
    // Fetching allNotes from server/backend
    // ===================================== //
    useEffect(() => {
        noteServices
            .getAll()
            .then(getAllNotes => setNotes(getAllNotes))
    }, []);

    // ===================================== //
    // Fetching user and its Token from localStorage
    // ===================================== //
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteServices.setToken(user.token)
        }
    }, [])

    // ===================================== //
    // Http update(put) Request
    // ===================================== //
    const toggleImportanceOf = async (id) => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        try {
            const updatedNote = await noteServices.update(id, changedNote)
            setNotes(notes.map(note => note.id === id ? updatedNote : note))
            setNotification({ message: 'importance toggled', type: 'success' })
            setTimeout(() => { setNotification(null) }, 3000)
        } catch (error) {
            setNotification({ message: `${error.response.data.error}`, type: 'error' })
            setTimeout(() => { setNotification(null) }, 3000)
        }
    };

    // ===================================== //
    // Http post Request to adding note to server/db
    // ===================================== //
    const addNote = async (event) => {
        event.preventDefault()

        try {
            const newObject = {
                content: newNote,
                important: Math.random() < 0.5
            }

            const savedNote = await noteServices.create(newObject)
            setNotes([...notes, savedNote])
            setNewNote('')
            setNotification({ message: `${savedNote.content} created successfully`, type: 'success' })
            setTimeout(() => { setNotification(null) }, 3000)
        } catch (error) {
            setNotification({ message: `${error.response.data.error}`, type: 'error' })
            setTimeout(() => { setNotification(null) }, 3000)
        }
    };

    // ===================================== //
    // Http Delete Request
    // ===================================== //
    const deleteNoteOf = async (id) => {
        try {
            const confirmation = window.confirm('Delete Note ?')
            if (confirmation) {
                await noteServices.remove(id)
                setNotes(notes.filter(note => note.id !== id))
                setNotification({ message: 'Note Deleted', type: 'success' })
                setTimeout(() => { setNotification(null) }, 3000)
            }
        } catch (error) {
            setNotification({ message: `${error.response.data.error}`, type: 'error' })
            setTimeout(() => { setNotification(null) }, 3000)

        }
    }

    // ================================== //
    // ==== Filteration on Importance === //
    // ================================== //
    const notesToShow = showAll ? notes : notes.filter(note => note.important === true);


    // ================================== //
    // Login
    // ================================== //
    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Logged in with username : ', username)
        try {
            const user = await loginServices.login({ username, password })
            window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
            noteServices.setToken(user.token)
            setUser(user)
            setNotification({ message: `${username} Logged in successfully`, type: 'success' })
            setTimeout(() => { setNotification(null) }, 3000);
            setUsername('')
            setPassword('')
        } catch (error) {
            setNotification({ message: 'Wrong Credentials', type: 'error' })
            setTimeout(() => { setNotification(null) }, 3000)
        }
    }

    const handleLogOut = () => {
        setUser(null)
        window.localStorage.removeItem('loggedNoteappUser')
        noteServices.setToken(null)
        setNotification({ message: `${user.username} Logged out successfully`, type: 'success' })
        setTimeout(() => { setNotification(null) }, 3000);
    }

    const loginForm = () => (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Username :
                        <input type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password :
                        <input type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)} />
                    </label>
                </div>

                <button type="submit" >Login</button>
            </form>

        </div>
    )

    const noteForm = () => (
        <form onSubmit={addNote}>
            <input value={newNote} onChange={({ target }) => setNewNote(target.value)} />
            <button type="submit">Save</button>
        </form>
    )

    return (
        <div>
            <h1 className="title">Notes app</h1>
            <Notification notification={notification} />
            {!user && loginForm()}
            {user && (
                <div>
                    <p>{user.name} logged in<button type="button" onClick={() => handleLogOut()}>Log Out</button>
                    </p>
                    {noteForm()}
                </div>
            )}

            <br />

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    Show {showAll ? 'important' : 'all'}
                </button>
            </div>

            <ul>
                {notesToShow.map(note => {
                    const { id } = note
                    return (
                        <Note key={id} note={note} toggleImportance={() => toggleImportanceOf(id)} deleteNoteHandler={deleteNoteOf} />
                    )
                })}
            </ul>

            <Footer />

        </div>
    )
}

export default App;