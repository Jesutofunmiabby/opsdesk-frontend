import employees from '../features/employees/data/employees'
import {
  STATUS_ORDER,
  STATUS_LABELS,
} from '../features/tickets/data/ticketStatuses'
import { getDepartments } from '../features/employees/utils/employees'
import { usePermissions } from '../features/auth/hooks/usePermissions'
import UsersStatCard from '../features/users/components/UsersStatCard'
import StatCard from '../components/StatCard'
import { useTicketCounts } from '../features/tickets/hooks/useTicketCounts'
import type { StatCardState } from '../components/StatCard'
import './DashboardPage.css'

// Employees and departments come from static data, so they are counted once.
const employeeCount = employees.length
const departmentCount = getDepartments(employees).length

function DashboardPage() {
  // How many tickets are in each status, counted by the API. Moving a ticket
  // on the board refreshes these too, because every change to a ticket
  // refreshes every ticket list.
  const {
    counts: ticketCounts,
    isLoading: ticketsLoading,
    isError: ticketsError,
    refetch: refetchTickets,
  } = useTicketCounts()
  const ticketsState: StatCardState = ticketsLoading
    ? 'loading'
    : ticketsError || !ticketCounts
      ? 'error'
      : 'ready'

  // Only ADMIN and MANAGER may list users, so only they get the Users card.
  // For anyone else the API answers 403, and the card could only say it
  // could not load.
  const { canListUsers } = usePermissions()

  return (
    <section>
      <h2 className="page-title">Dashboard</h2>

      <h3 className="dashboard-page__group">Tickets by status</h3>
      <div className="dashboard-page__grid">
        {STATUS_ORDER.map((status) => (
          <StatCard
            key={status}
            label={STATUS_LABELS[status]}
            value={ticketCounts?.[status]}
            state={ticketsState}
            onRetry={refetchTickets}
          />
        ))}
      </div>

      <h3 className="dashboard-page__group">Organisation</h3>
      <div className="dashboard-page__grid">
        <StatCard label="Employees" value={employeeCount} />
        <StatCard label="Departments" value={departmentCount} />
        {canListUsers && <UsersStatCard />}
      </div>
    </section>
  )
}

export default DashboardPage
