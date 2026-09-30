import { STATUS_ORDER, STATUS_LABELS } from '../data/ticketStatuses'
import { useTickets } from '../hooks/useTickets'
import Column from '../components/Column'
import './TicketsPage.css'

// The tickets are shared through TicketsProvider, so the board survives
// switching pages and the dashboard counts the same array.
function TicketsPage() {
  const { tickets, moveTicket } = useTickets()

  return (
    <section>
      <h2 className="page-title">Ticket board</h2>
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
