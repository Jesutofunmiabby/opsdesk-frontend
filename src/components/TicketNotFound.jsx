import { Link } from 'react-router-dom'
import './TicketNotFound.css'

// Shown by any ticket page whose URL names a ticket that does not exist.
function TicketNotFound({ id }) {
  return (
    <section className="ticket-not-found">
      <h2 className="page-title">Ticket not found</h2>
      <p className="ticket-not-found__text">
        There is no ticket with the id “{id}”.
      </p>
      <Link to="/tickets" className="ticket-not-found__link">
        Back to the ticket board
      </Link>
    </section>
  )
}

export default TicketNotFound
