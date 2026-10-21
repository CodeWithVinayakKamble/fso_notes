import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
}

export default LoginForm