import { STATUS_ORDER, STATUS_LABELS } from '../data/ticketStatuses'
import Column from '../components/Column'
import './TicketsPage.css'

// The tickets live in App, so the board survives switching pages and the
// dashboard counts the same array. This page just draws them.
function TicketsPage({ tickets, onMove }) {
  return (
    <section>
      <h2 className="page-title">Ticket board</h2>
      <div className="tickets-page__columns">
        {STATUS_ORDER.map((status) => (
          <Column
            key={status}
            label={STATUS_LABELS[status]}
            tickets={tickets.filter((ticket) => ticket.status === status)}
            onMove={onMove}
          />
        ))}
      </div>
    </section>
  )
}

export default TicketsPage
