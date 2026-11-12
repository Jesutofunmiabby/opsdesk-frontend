import StatCard from '../../../components/StatCard'
import type { StatCardState } from '../../../components/StatCard'
import { useUsers } from '../hooks/useUsers'

// The dashboard's Users count, from GET /users. A card of its own so the
// dashboard can leave it out for roles that may not list users: the request
// is only sent when this card is on the page.
function UsersStatCard() {
  const { data: users, status, retry } = useUsers()
  const state: StatCardState =
    status === 'loading' || status === 'error' ? status : 'ready'

  return (
    <StatCard
      label="Users"
      value={users.length}
      state={state}
      onRetry={retry}
    />
  )
}

export default UsersStatCard
