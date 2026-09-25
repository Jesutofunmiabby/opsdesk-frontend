import { useFetch } from '../hooks/useFetch'
import UserCard from './UserCard'
import './UsersList.css'

const USERS_URL = 'https://dummyjson.com/users?limit=12'

// The API answers with an object; the list is inside its users field. Defined
// at module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectUsers(body) {
  return Array.isArray(body.users) ? body.users : []
}

function UsersList() {
  const { data: users, status, retry } = useFetch(USERS_URL, selectUsers)

  if (status === 'loading') {
    return <p className="users-list__message">Loading users…</p>
  }

  if (status === 'error') {
    return (
      <div className="users-list__error">
        <p className="users-list__message">
          Sorry, we could not load the users.
        </p>
        <button type="button" className="users-list__retry" onClick={retry}>
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
