import { Link, useNavigate } from 'react-router-dom'
import { useTickets } from '../features/tickets/hooks/useTickets'
import TicketForm from '../features/tickets/components/TicketForm'
import type { TicketFormValues } from '../features/tickets/types'
import { useAppDispatch } from '../store/hooks'
import { addNotification } from '../store/uiSlice'
import './TicketFormPage.css'

// A new ticket starts empty, at medium priority. The type keeps 'MEDIUM' as a
// Priority rather than loosening it to any text.
const EMPTY_TICKET: TicketFormValues = {
  title: '',
  description: '',
  priority: 'MEDIUM',
}

function NewTicketPage() {
  const { addTicket } = useTickets()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Only called once the form's checks have passed.
  function handleSubmit(values: TicketFormValues) {
    const newId = addTicket(values)
    dispatch(
      addNotification({ message: `Ticket #${newId} created`, type: 'success' }),
    )
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
