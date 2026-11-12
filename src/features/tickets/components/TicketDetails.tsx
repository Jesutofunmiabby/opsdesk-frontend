import { STATUS_LABELS } from '../data/ticketStatuses'
import type { Ticket } from '../types'
import PriorityBadge from './PriorityBadge'
import './TicketDetails.css'

interface TicketDetailsProps {
  ticket: Ticket
}

// Everything about one ticket: its id, title, description, status,
// priority, who it is assigned to and who raised it.
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
        <div>
          <dt>Assigned to</dt>
          <dd>{ticket.assigneeName ?? 'Nobody yet'}</dd>
        </div>
        <div>
          <dt>Raised by</dt>
          {/* Tickets from before logins existed have no creator. */}
          <dd>{ticket.createdByName ?? 'Unknown'}</dd>
        </div>
      </dl>
    </article>
  )
}

export default TicketDetails
