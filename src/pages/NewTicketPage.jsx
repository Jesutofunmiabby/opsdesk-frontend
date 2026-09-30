import { Link, useNavigate } from 'react-router-dom'
import { useTickets } from '../hooks/useTickets'
import TicketForm from '../components/TicketForm'
import './TicketFormPage.css'

// A new ticket starts empty, at medium priority.
const EMPTY_TICKET = { title: '', description: '', priority: 'MEDIUM' }

function NewTicketPage() {
  const { addTicket } = useTickets()
  const navigate = useNavigate()

  // Only called once the form's checks have passed.
  function handleSubmit(values) {
    const newId = addTicket(values)
    navigate(`/tickets/${newId}`)
  }

  return (
    <section>
      <Link to="/tickets" className="ticket-form-page__back">
        ← Ticket board
      </Link>

      <div className="ticket-form-page__panel">
        <h2 className="page-title">New ticket</h2>
        <TicketForm
          initialValues={EMPTY_TICKET}
          onSubmit={handleSubmit}
          submitLabel="Create ticket"
          cancelTo="/tickets"
        />
      </div>
    </section>
  )
}

export default NewTicketPage
