import { Link } from 'react-router-dom'
import { STATUS_ORDER, STATUS_LABELS } from '../features/tickets/data/ticketStatuses'
import { useTickets } from '../hooks/useTickets'
import Column from '../components/Column'
import './TicketsPage.css'

// The tickets are shared through TicketsProvider, so the board survives
// switching pages and the dashboard counts the same array.
function TicketsPage() {
  const { tickets, moveTicket } = useTickets()

  return (
    <section>
      <header className="tickets-page__header">
        <h2 className="page-title">Ticket board</h2>
        <Link to="/tickets/new" className="tickets-page__new">
          New ticket
        </Link>
      </header>
      <div className="tickets-page__columns">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            label={STATUS_LABELS[status]}
            tickets={tickets.filter((ticket) => ticket.status === status)}
            onMove={moveTicket}
          />
        ))}
      </div>
    </section>
  )
}

export default TicketsPage
