import { useState } from 'react'

const UserRegistration = ({ newUser }) => {

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const createUser = (event) => {
    event.preventDefault()

    newUser({ username, name, password })

  }

  return (
    <>
      <h2>User Registration</h2>

      <form onSubmit={createUser}>

        <div>
          <label>
            Username :
            <input type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Name :
            <input type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Password :
            <input type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </label>
        </div>

        <button type="submit">Sign up</button>

      </form>

    </>
  )
}

export default UserRegistration