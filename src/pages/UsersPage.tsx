import EmptyState from '../components/EmptyState'
import LoadingMessage from '../components/LoadingMessage'
import { usePermissions } from '../features/auth/hooks/usePermissions'
import UserList from '../features/users/components/UserList'

// The Users link is hidden from roles that may not list users, but anyone
// can still type /users. They get a clear explanation instead of a request
// the API would refuse with 403.
function UsersPage() {
  const { user, canListUsers } = usePermissions()

  function renderContent() {
    // Wait for the role, so the list is never asked for by mistake.
    if (!user) {
      return <LoadingMessage text="Loading…" />
    }
    if (!canListUsers) {
      return (
        <EmptyState
          title="You don't have access to the Users page."
          text="Only admins and managers can see the list of users."
          action={{ label: 'Go to the dashboard', to: '/dashboard' }}
        />
      )
    }
    return <UserList />
  }

  return (
    <section>
      <h2 className="page-title">Users</h2>
      {renderContent()}
    </section>
  )
}

export default UsersPage
