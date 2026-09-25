import { useFetch } from '../hooks/useFetch'
import UserCard from '../components/UserCard'
import './UsersPage.css'

const USERS_URL = 'https://dummyjson.com/users?limit=12'

// The API answers with an object; the list is inside its users field. Defined
// at module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectUsers(body) {
  return Array.isArray(body.users) ? body.users : []
}

function UsersPage() {
  const { data: users, status, retry } = useFetch(USERS_URL, selectUsers)

  return (
    <section>
      <h2 className="page-title">Users</h2>

      {status === 'loading' && (
        <p className="users-page__message">Loading users…</p>
      )}

      {status === 'empty' && (
        <p className="users-page__message">No users to show just yet.</p>
      )}

      {status === 'error' && (
        <div className="users-page__error">
          <p className="users-page__message">
            Sorry, we could not load the users.
          </p>
          <button
            type="button"
            className="users-page__retry"
            onClick={retry}
          >
            Retry
          </button>
        </div>
      )}

      {status === 'success' && (
        <ul className="users-page__grid">
          {users.map((user) => (
            <li key={user.id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UsersPage
