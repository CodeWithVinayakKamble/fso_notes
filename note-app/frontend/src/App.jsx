import { useEffect, useState } from "react";
import noteServices from './services/notes.js'
import Note from './components/Note.jsx'
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";
import loginServices from "./services/login.js";


const App = () => {

    // React States
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    // Fetching data from fake JSON-Server
    useEffect(() => {
        noteServices
            .getAll()
            .then(defaultData => setNotes(defaultData))
    }, []);

    // Fetching token from loaclStorage
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteServices.setToken(user.token)
        }
    }, [])

    // logic of toggle imp or !imp by axios.put() method
    const toggleImportanceOf = (id) => {
        const note = notes.find(n => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteServices
            .update(id, changedNote)
            .then(updatedNote => setNotes(notes.map(note => note.id === id ? updatedNote : note)))
            .catch(error => {
                setErrorMessage(`Note '${note.content}' was already removed from server`)
                setTimeout(() => { setErrorMessage(null) }, 5000);

                // It removed the ghost item from React's state using .filter() so the screen synced back with reality!
                setNotes(notes.filter(n => n.id !== id))
            })

    };


    // Logic for adding notes to the server
    const addNote = (event) => {
        event.preventDefault();

        const newObject = {
            content: newNote,
            important: Math.random() < 0.5
        };

        // Adding Note to the server (fake-db) and to the local-machine via axios.POST() Method
        noteServices
            .create(newObject)
            .then(addedNote => {
                setNotes([...notes, addedNote]);
                setNewNote('')
            })
    };

    // Logic for delete notes from server
    const deleteNoteOf = (id) => {
        let confirmation = window.confirm('Delete Note ?')
        if (confirmation) {
            noteServices
                .remove(id)
                .then(response => {
                    setNotes(notes.filter(n => n.id !== id))
                })
        }
    }

    // HTML Input Locked into React State
    const handleNoteChange = (event) => {
        setNewNote(event.target.value);
    };

    // ==== Filteration on Importance === //
    // Logic - (Firstly its matching notes with showAll is true its finding true notes if did not got else block comes on game for filteration)
    const notesToShow = showAll ? notes : notes.filter(note => note.important === true);

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Logged in with username : ', username)
        try {
            const user = await loginServices.login({ username, password })
            window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
            noteServices.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            setErrorMessage('Wrong Credentials')
            setTimeout(() => { setErrorMessage(null) }, 3000)
        }
    }

    const handleLogOut = () => {
        setUser(null)
        window.localStorage.removeItem('loggedNoteappUser')
    }

    const loginForm = () => (
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
                    <input type="text"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)} />
                </label>
            </div>

            <button type="submit" >Login</button>
        </form>
    )

    const noteForm = () => (
        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange} />
            <button type="submit">Save</button>
        </form>
    )

    return (
        <div>
            <h1 className="title">Notes app</h1>
            <Notification message={errorMessage} />
            <h2>Login</h2>
            {!user && loginForm()}
            {user && (
                <div>
                    <p>{user.name} logged in</p>
                    <button type="button" onClick={() => handleLogOut()}>Log Out</button>
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