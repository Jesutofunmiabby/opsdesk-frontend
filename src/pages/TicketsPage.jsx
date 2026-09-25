import { useState } from 'react'
import initialTickets from '../data/tickets'
import { STATUS_ORDER, STATUS_LABELS } from '../data/ticketStatuses'
import Column from '../components/Column'
import './TicketsPage.css'

function TicketsPage() {
  // The whole board's data lives here and nowhere else. Columns and cards
  // receive what they need as props.
  const [tickets, setTickets] = useState(initialTickets)

  function moveTicket(ticketId) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => {
        if (ticket.id !== ticketId) {
          return ticket
        }
        const nextIndex = STATUS_ORDER.indexOf(ticket.status) + 1
        if (nextIndex >= STATUS_ORDER.length) {
          return ticket
        }
        // A new object rather than editing this one, so React sees a change.
        return { ...ticket, status: STATUS_ORDER[nextIndex] }
      }),
    )
  }

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
