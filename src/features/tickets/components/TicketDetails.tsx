import { STATUS_LABELS } from '../data/ticketStatuses'
import type { Ticket } from '../types'
import PriorityBadge from './PriorityBadge'
import './TicketDetails.css'

interface TicketDetailsProps {
  ticket: Ticket
}

// Everything about one ticket: its id, title, description, status and
// priority.
function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <article className="ticket-details">
      <span className="ticket-details__id">Ticket #{ticket.id}</span>
      <h2 className="ticket-details__title">{ticket.title}</h2>
      <p className="ticket-details__description">{ticket.description}</p>
      <dl className="ticket-details__fields">
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
  )
}

export default TicketDetails
