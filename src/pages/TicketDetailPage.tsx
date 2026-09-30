import { Link, useParams } from 'react-router-dom'
import { STATUS_LABELS } from '../features/tickets/data/ticketStatuses'
import { useTickets } from '../hooks/useTickets'
import { findTicketById } from '../features/tickets/utils/tickets'
import PriorityBadge from '../components/PriorityBadge'
import TicketNotFound from '../components/TicketNotFound'
import './TicketDetailPage.css'

// One ticket, chosen by the :id part of the URL (/tickets/4 shows ticket 4).
function TicketDetailPage() {
  const { id } = useParams()
  const { tickets } = useTickets()
  const ticket = findTicketById(tickets, id)

  if (!ticket) {
    return <TicketNotFound id={id} />
  }

  return (
    <section>
      <div className="ticket-detail-page__toolbar">
        <Link to="/tickets" className="ticket-detail-page__back">
          ← Ticket board
        </Link>
        <Link
          to={`/tickets/${ticket.id}/edit`}
          className="ticket-detail-page__edit"
        >
          Edit
        </Link>
      </div>

      <article className="ticket-detail-page__panel">
        <span className="ticket-detail-page__id">Ticket #{ticket.id}</span>
        <h2 className="ticket-detail-page__title">{ticket.title}</h2>
        <p className="ticket-detail-page__description">
          {ticket.description}
        </p>
        <dl className="ticket-detail-page__details">
          <div>
            <dt>Status</dt>
            <dd>{STATUS_LABELS[ticket.status]}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <PriorityBadge priority={ticket.priority} />
            </dd>
          </div>
        </dl>
      </article>
    </section>
  )
}

export default TicketDetailPage
