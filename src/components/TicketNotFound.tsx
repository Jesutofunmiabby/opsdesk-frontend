import { Link } from 'react-router-dom'
import './TicketNotFound.css'

interface TicketNotFoundProps {
  // The id from the URL, as it was typed. Undefined if the URL had none.
  id?: string
}

// Shown by any ticket page whose URL names a ticket that does not exist.
function TicketNotFound({ id }: TicketNotFoundProps) {
  return (
    <section className="ticket-not-found">
      <h2 className="page-title">Ticket not found</h2>
      <p className="ticket-not-found__text">
        {id === undefined
          ? 'No ticket id was given.'
          : `There is no ticket with the id “${id}”.`}
      </p>
      <Link to="/tickets" className="ticket-not-found__link">
        Back to the ticket board
      </Link>
    </section>
  )
}

export default TicketNotFound
