// ===================================== //
// Imports
// ===================================== //
import { useEffect, useState, useRef } from "react";
import noteServices from './services/notes.js'
import Note from './components/Note.jsx'
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";
import loginServices from "./services/login.js";
import LoginForm from "./components/LoginForm.jsx";
import Togglable from "./components/Togglable.jsx";
import NoteForm from "./components/NoteForm.jsx";


const App = () => {

    // ===================================== //
    // React States
    // ===================================== //
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [notification, setNotification] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const noteFormRef = useRef()
    const togglable1 = useRef()
    const togglable2 = useRef()
    const togglable3 = useRef()

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
    const addNote = async (newNoteObject) => {

        try {
            noteFormRef.current.toggleVisibility()
            const savedNote = await noteServices.create(newNoteObject)
            setNotes([...notes, savedNote])
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
    // Login/Log-out Logic
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

    return (
        <div>
            <h1 className="title">Notes app</h1>
            <Notification notification={notification} />
            {!user && (
                <Togglable buttonLabel='Log in'>
                    <LoginForm
                        handleLogin={handleLogin}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword} />
                </Togglable>
            )}
            {user && (
                <div>
                    <p>{user.name} logged in<button type="button" onClick={handleLogOut}>Log Out</button></p>
                    <Togglable buttonLabel="new Note" ref={noteFormRef}>
                        <NoteForm createNote={addNote} />
                    </Togglable>
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