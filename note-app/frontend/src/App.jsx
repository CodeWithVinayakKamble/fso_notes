// ===================================== //
// Imports
// ===================================== //

// ==== dependencies ==== //
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useMatch, Navigate, useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'


// ==== Components ==== //
import Notification from './components/Notification.jsx'
import Footer from './components/Footer.jsx'
import NoteForm from './components/NoteForm.jsx'
import Home from './components/Home.jsx'
import NoteList from './components/NoteList.jsx'
import Note from './components/Note.jsx'
import UserRegistration from './components/UserRegistration.jsx'


// ==== Services ==== //
import noteServices from './services/note.js'
import loginServices from './services/login.js'
import userServices from './services/user.js'
import LoginForm from './components/LoginForm.jsx'



const App = () => {

  // ===================================== //
  // React States
  // ===================================== //
  const [notification, setNotification] = useState(null)
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // ===================================== //
  // Fetching allNotes from server/backend
  // ===================================== //
  useEffect(() => {
    noteServices
      .getAll()
      .then(getAllNotes => setNotes(getAllNotes))
  }, [])

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
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    try {
      const updatedNote = await noteServices.update(id, changedNote)
      setNotes(notes.map(note => note.id === id ? { ...updatedNote, user: note.user } : note))
    } catch (error) {
      setNotification({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => { setNotification(null) }, 3000)
    }
  }

  // ===================================== //
  // Http post Request to adding note to server/db
  // ===================================== //
  const addNote = async (newNoteObject) => {

    try {
      const savedNote = await noteServices.create(newNoteObject)
      setNotes([...notes, { ...savedNote, user }])
      navigate('/notes')
      setNotification({ message: `${savedNote.content} created successfully`, type: 'success' })
      setTimeout(() => { setNotification(null) }, 3000)
    } catch (error) {
      setNotification({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => { setNotification(null) }, 3000)
    }
  }

  // ===================================== //
  // Http Delete Request
  // ===================================== //
  const deleteNoteOf = async (id) => {
    try {
      await noteServices.remove(id)
      setNotes(notes.filter(note => note.id !== id))
      navigate('/notes')
      setNotification({ message: 'Note Deleted', type: 'success' })
      setTimeout(() => { setNotification(null) }, 3000)

    } catch (error) {
      setNotification({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => { setNotification(null) }, 3000)

    }
  }



  // ================================== //
  // Login/Log-out Logic
  // ================================== //
  const handleLogin = async ({ username, password }) => {

    try {
      const user = await loginServices.login({ username, password })
      console.log('Logged in with username : ', username)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      noteServices.setToken(user.token)
      navigate('/notes')
      setNotification({ message: `${username} Logged in successfully`, type: 'success' })
      setTimeout(() => { setNotification(null) }, 3000)
    } catch (error) {
      setNotification({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => { setNotification(null) }, 3000)
    }
  }

  const handleLogOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
    noteServices.setToken(null)
    setNotification({ message: `${user.username} Logged out successfully`, type: 'success' })
    setTimeout(() => { setNotification(null) }, 3000)
  }

  const handleRegistartion = async ({ username, name, password }) => {
    try {
      await userServices.create({ username, name, password })

      const user = await loginServices.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteServices.setToken(user.token)
      setUser(user)
      navigate('/notes')
      setNotification({ message: `Welcome ${user.name}`, type: 'success' })
      setTimeout(() => { setNotification(null) }, 3000)
    } catch (error) {
      setNotification({ message: `${error.response.data.error}`, type: 'error' })
      setTimeout(() => { setNotification(null) }, 3000)
    }
  }

  const match = useMatch(`/notes/:id`)
  const note = match ? notes.find(note => note.id === match.params.id) : null

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>

      <AppBar position="static">

        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }} >

          <Typography variant='h6' component='div' sx={{ marginInlineEnd: 3, fontWeight: 'bold' }} >
            Notes App
          </Typography>

          <div>
            <Button color='inherit' component={Link} to='/' sx={style} >home</Button>

            <Button color='inherit' component={Link} to="/notes" sx={style} >notes</Button>

            {user &&
              <Button color='inherit' component={Link} to='/create' sx={style} >new note</Button>
            }

            {user ? (
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={handleLogOut}
                sx={{ borderColor: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: 'white' } }}
              >
                logout
              </Button>
            ) :
              (
                <Button color="inherit" component={Link} to="/login" sx={style}>
                  login
                </Button>
              )

            }

          </div>


        </Toolbar>

      </AppBar>

      <Notification notification={notification} />


      <Routes>

        <Route path='/' element={<Home />} />

        <Route path='/notes'
          element={<NoteList
            notes={notes}
            user={user}
          />
          }
        />

        <Route path='/notes/:id'
          element={
            <Note
              note={note}
              activeUser={user}
              toggleImportance={toggleImportanceOf}
              deleteNoteHandler={deleteNoteOf}
            />
          }
        />

        <Route path='/login' element={user ? <Navigate replace to={'/notes'} /> : <LoginForm handleLogin={handleLogin} />} />

        <Route path='/create' element={user ? <NoteForm createNote={addNote} /> : <Navigate replace to='/login' />} />

        <Route path='/user' element={user ? <Navigate replace to='/notes' /> : <UserRegistration newUser={handleRegistartion} />} />

      </Routes>

      <Footer />

    </Container>
  )
}

export default App