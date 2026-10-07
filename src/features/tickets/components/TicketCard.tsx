import { Link } from 'react-router-dom'
import { LAST_STATUS } from '../data/ticketStatuses'
import type { Ticket } from '../types'
import PriorityBadge from './PriorityBadge'
import './TicketCard.css'

interface TicketCardProps {
  ticket: Ticket
  // Called with the ticket's id when "Move to next" is pressed.
  onMove: (ticketId: number) => void
  // True while the move is being saved: the button says so and is disabled.
  // Defaults to false.
  isMoving?: boolean
}

function TicketCard({ ticket, onMove, isMoving = false }: TicketCardProps) {
  // A CLOSED ticket has nowhere further to go, so it gets no button.
  const canMove = ticket.status !== LAST_STATUS

  return (
    <article className="ticket-card">
      {/* The title link covers the whole card (see TicketCard.css), so a click
          anywhere opens the ticket. The button is a sibling, not inside the
          link, and sits above it, so it moves the ticket without opening it. */}
      <h3 className="ticket-card__title">
        <Link to={`/tickets/${ticket.id}`} className="ticket-card__link">
          {ticket.title}
        </Link>
      </h3>
      <div className="ticket-card__footer">
        <PriorityBadge priority={ticket.priority} />
        {canMove && (
          <button
            type="button"
            className="ticket-card__move"
            disabled={isMoving}
            onClick={() => onMove(ticket.id)}
          >
            {isMoving ? 'Moving…' : 'Move to next'}
          </button>
        )}
      </div>
    </article>
  )
}

export default TicketCard
