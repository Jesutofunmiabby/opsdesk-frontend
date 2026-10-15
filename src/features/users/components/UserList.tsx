import EmptyState from '../../../components/EmptyState'
import RequestError from '../../../components/RequestError'
import { useUsers } from '../hooks/useUsers'
import UserCard from './UserCard'
import UserListSkeleton from './UserListSkeleton'
import './UserList.css'

// The users from the API, with placeholder cards while they load, a message
// if there are none, and a Retry if the request fails.
function UserList() {
  const { data: users, status, retry } = useUsers()

  if (status === 'loading') {
    return <UserListSkeleton />
  }
  if (status === 'error') {
    return (
      <RequestError
        message="Sorry, we could not load the users."
        onRetry={retry}
      />
    )
  }
  if (status === 'empty') {
    return (
      <EmptyState
        title="No users yet."
        text="When people are added to OpsDesk they will show up here."
        action={{ label: 'Check again', onClick: retry }}
      />
    )
  }

  return (
    <ul className="user-list__grid">
      {users.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  )
}

export default UserList
