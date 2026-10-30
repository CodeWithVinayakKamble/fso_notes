import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography } from '@mui/material'

const UserRegistration = ({ newUser }) => {

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const createUser = (event) => {
    event.preventDefault()

    newUser({ username, name, password })

  }

  return (
    <Box sx={{ maxWidth: 400, margin: '40px auto' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Create an Account
      </Typography>
      <form onSubmit={createUser}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </Box>
        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 1 }}>
          Sign Up
        </Button>
      </form>
      <Button fullWidth variant="text" onClick={() => navigate('/login')}>
        Already have an account? Log in
      </Button>
    </Box>
  )

}

export default UserRegistration