import { Link, useNavigate } from 'react-router-dom'
import { useTickets } from '../features/tickets/hooks/useTickets'
import TicketForm from '../components/TicketForm'
import type { TicketFormValues } from '../features/tickets/types'
import './TicketFormPage.css'

// A new ticket starts empty, at medium priority. The type keeps 'MEDIUM' as a
// Priority rather than loosening it to any text.
const EMPTY_TICKET: TicketFormValues = { title: '', description: '', priority: 'MEDIUM' }

function NewTicketPage() {
  const { addTicket } = useTickets()
  const navigate = useNavigate()

  // Only called once the form's checks have passed.
  function handleSubmit(values: TicketFormValues) {
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
