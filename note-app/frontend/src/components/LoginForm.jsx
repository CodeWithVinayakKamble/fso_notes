import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const userValidator = (event) => {
    event.preventDefault()

    handleLogin({ username, password })

    setUsername('')
    setPassword('')

  }

  return (
    <Box sx={{ maxWidth: 400, margin: '40px auto' }}>
      
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>

      <form onSubmit={userValidator}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </Box>

        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 1 }}>
          login
        </Button>
      </form>

      <Button fullWidth variant="text" onClick={() => navigate('/user')}>
        Don't have an account? Sign up
      </Button>

    </Box>
  )
}

export default LoginForm