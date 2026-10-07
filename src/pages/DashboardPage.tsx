import employees from '../features/employees/data/employees'
import {
  STATUS_ORDER,
  STATUS_LABELS,
} from '../features/tickets/data/ticketStatuses'
import { countTicketsByStatus } from '../features/tickets/utils/tickets'
import { getDepartments } from '../features/employees/utils/employees'
import { useUsers } from '../features/users/hooks/useUsers'
import StatCard from '../components/StatCard'
import { useGetTicketsQuery } from '../store/ticketsApi'
import type { StatCardState } from '../components/StatCard'
import './DashboardPage.css'

// Employees and departments come from static data, so they are counted once.
const employeeCount = employees.length
const departmentCount = getDepartments(employees).length

function DashboardPage() {
  // The same cached query as the tickets page: opening the dashboard after
  // the board uses the tickets already loaded, and a ticket moved on the
  // board refreshes these counts too.
  const {
    data: tickets = [],
    isLoading: ticketsLoading,
    isError: ticketsError,
    refetch: refetchTickets,
  } = useGetTicketsQuery()
  const ticketCounts = countTicketsByStatus(tickets)
  const ticketsState: StatCardState = ticketsLoading
    ? 'loading'
    : ticketsError
      ? 'error'
      : 'ready'

  // The users count comes from the API, so this card has its own states.
  const { data: users, status, retry } = useUsers()
  const usersState: StatCardState =
    status === 'loading' || status === 'error' ? status : 'ready'

  return (
    <section>
      <h2 className="page-title">Dashboard</h2>

      <h3 className="dashboard-page__group">Tickets by status</h3>
      <div className="dashboard-page__grid">
        {STATUS_ORDER.map((status) => (
          <StatCard
            key={status}
            label={STATUS_LABELS[status]}
            value={ticketCounts[status]}
            state={ticketsState}
            onRetry={refetchTickets}
          />
        ))}
      </div>

      <h3 className="dashboard-page__group">Organisation</h3>
      <div className="dashboard-page__grid">
        <StatCard label="Employees" value={employeeCount} />
        <StatCard label="Departments" value={departmentCount} />
        <StatCard
          label="Users"
          value={users.length}
          state={usersState}
          onRetry={retry}
        />
      </div>
    </section>
  )
}

export default DashboardPage
