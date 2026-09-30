import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTickets } from '../features/tickets/hooks/useTickets'
import { findTicketById } from '../features/tickets/utils/tickets'
import type { TicketFormValues } from '../features/tickets/types'
import TicketForm from '../components/TicketForm'
import TicketNotFound from '../components/TicketNotFound'
import './TicketFormPage.css'

// The same TicketForm as New ticket, started with this ticket's values.
function EditTicketPage() {
  const { id } = useParams()
  const { tickets, updateTicket } = useTickets()
  const navigate = useNavigate()
  const ticket = findTicketById(tickets, id)

  if (!ticket) {
    return <TicketNotFound id={id} />
  }

  // Copied out after the check above, where TypeScript knows the ticket
  // exists. The check does not carry into handleSubmit on its own.
  const ticketId = ticket.id
  const ticketPath = `/tickets/${ticketId}`

  // Only called once the form's checks have passed.
  function handleSubmit(values: TicketFormValues) {
    updateTicket(ticketId, values)
    navigate(ticketPath)
  }

  return (
    <section>
      <Link to={ticketPath} className="ticket-form-page__back">
        ← Ticket #{ticketId}
      </Link>

      <div className="ticket-form-page__panel">
        <h2 className="page-title">Edit ticket #{ticketId}</h2>
        {/* The form copies initialValues into its state once, when it first
            appears. The key gives it a fresh start if the URL moves straight
            to another ticket's edit page. */}
        <TicketForm
          key={ticketId}
          initialValues={{
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          cancelTo={ticketPath}
        />
      </div>
    </section>
  )
}

export default EditTicketPage
