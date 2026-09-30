import { Link, useParams } from 'react-router-dom'
import { useTickets } from '../features/tickets/hooks/useTickets'
import { findTicketById } from '../features/tickets/utils/tickets'
import TicketDetails from '../features/tickets/components/TicketDetails'
import TicketNotFound from '../features/tickets/components/TicketNotFound'
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
      <TicketDetails ticket={ticket} />
    </section>
  )
}

export default TicketDetailPage
