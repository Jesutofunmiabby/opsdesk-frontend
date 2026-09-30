import { Link } from 'react-router-dom'
import TicketBoard from '../features/tickets/components/TicketBoard'
import './TicketsPage.css'

function TicketsPage() {
  return (
    <section>
      <header className="tickets-page__header">
        <h2 className="page-title">Ticket board</h2>
        <Link to="/tickets/new" className="tickets-page__new">
          New ticket
        </Link>
      </header>
      <TicketBoard />
    </section>
  )
}

export default TicketsPage
