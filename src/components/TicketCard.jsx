import { LAST_STATUS } from '../data/ticketStatuses'
import PriorityBadge from './PriorityBadge'
import './TicketCard.css'

function TicketCard({ ticket, onMove }) {
  // A CLOSED ticket has nowhere further to go, so it gets no button.
  const canMove = ticket.status !== LAST_STATUS

  return (
    <article className="ticket-card">
      <h3 className="ticket-card__title">{ticket.title}</h3>
      <div className="ticket-card__footer">
        <PriorityBadge priority={ticket.priority} />
        {canMove && (
          <button
            type="button"
            className="ticket-card__move"
            onClick={() => onMove(ticket.id)}
          >
            Move to next
          </button>
        )}
      </div>
    </article>
  )
}

export default TicketCard
