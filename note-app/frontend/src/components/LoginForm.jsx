import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div>
      <h2>Login</h2>

      <form onSubmit={userValidator}>
        <div>
          <label>
            username
            <input type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" >login</button>
      </form>

      <button type='button' onClick={() => navigate('/user')}>sign up</button>

    </div>
  )
}

export default LoginForm