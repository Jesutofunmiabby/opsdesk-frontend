import { useUsers } from '../hooks/useUsers'
import UserCard from './UserCard'
import './UserList.css'

// The users from the API, with a message while they load, if there are none,
// or if the request fails.
function UserList() {
  const { data: users, status, retry } = useUsers()

  return (
    <div>
      {status === 'loading' && (
        <p className="user-list__message">Loading users…</p>
      )}

      {status === 'empty' && (
        <p className="user-list__message">No users to show just yet.</p>
      )}

      {status === 'error' && (
        <div className="user-list__error">
          <p className="user-list__message">
            Sorry, we could not load the users.
          </p>
          <button
            type="button"
            className="user-list__retry"
            onClick={retry}
          >
            Retry
          </button>
        </div>
      )}

      {status === 'success' && (
        <ul className="user-list__grid">
          {users.map((user) => (
            <li key={user.id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserList
