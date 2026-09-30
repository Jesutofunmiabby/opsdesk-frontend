import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTickets } from '../hooks/useTickets'
import TicketForm from '../components/TicketForm'
import TicketNotFound from '../components/TicketNotFound'
import './TicketFormPage.css'

// The same TicketForm as New ticket, started with this ticket's values.
function EditTicketPage() {
  const { id } = useParams()
  const { tickets, updateTicket } = useTickets()
  const navigate = useNavigate()
  const ticket = tickets.find((item) => item.id === Number(id))

  if (!ticket) {
    return <TicketNotFound id={id} />
  }

  const ticketPath = `/tickets/${ticket.id}`

  // Only called once the form's checks have passed.
  function handleSubmit(values) {
    updateTicket(ticket.id, values)
    navigate(ticketPath)
  }

  return (
    <section>
      <Link to={ticketPath} className="ticket-form-page__back">
        ← Ticket #{ticket.id}
      </Link>

      <div className="ticket-form-page__panel">
        <h2 className="page-title">Edit ticket #{ticket.id}</h2>
        {/* The form copies initialValues into its state once, when it first
            appears. The key gives it a fresh start if the URL moves straight
            to another ticket's edit page. */}
        <TicketForm
          key={ticket.id}
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
