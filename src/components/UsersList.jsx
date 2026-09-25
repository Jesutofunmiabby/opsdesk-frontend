import { useEffect, useState } from 'react'
import UserCard from './UserCard'
import './UsersList.css'

const USERS_URL = 'https://dummyjson.com/users?limit=12'

function UsersList() {
  // One of: 'loading' | 'success' | 'empty' | 'error'.
  const [status, setStatus] = useState('loading')
  const [users, setUsers] = useState([])
  // Bumped by Retry. It is a dependency of the effect, so changing it runs
  // the fetch again.
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Set if this effect is cleaned up before the request finishes, so a
    // late response cannot set state for a component that has moved on.
    let ignore = false

    async function loadUsers() {
      setStatus('loading')
      try {
        const response = await fetch(USERS_URL)
        // fetch only rejects on network failure, so a 404 or 500 arrives here
        // as a normal response. Without this check it would be treated as
        // success and then fail on the missing users field.
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data = await response.json()
        if (ignore) {
          return
        }
        // The API answers with an object; the list is inside its users field.
        const list = Array.isArray(data.users) ? data.users : []
        setUsers(list)
        setStatus(list.length > 0 ? 'success' : 'empty')
      } catch {
        if (ignore) {
          return
        }
        setStatus('error')
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [attempt])

  function handleRetry() {
    setAttempt((current) => current + 1)
  }

  if (status === 'loading') {
    return <p className="users-list__message">Loading users…</p>
  }

  if (status === 'error') {
    return (
      <div className="users-list__error">
        <p className="users-list__message">
          Sorry, we could not load the users.
        </p>
        <button
          type="button"
          className="users-list__retry"
          onClick={handleRetry}
        >
          Retry
        </button>
      </div>
    )
  }

  if (status === 'empty') {
    return <p className="users-list__message">No users to show just yet.</p>
  }

  return (
    <ul className="users-list">
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  )
}

export default UsersList
