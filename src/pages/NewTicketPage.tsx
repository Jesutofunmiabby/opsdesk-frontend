import { Link, useNavigate } from 'react-router-dom'
import TicketForm from '../features/tickets/components/TicketForm'
import type { TicketFormValues } from '../features/tickets/types'
import { useAppDispatch } from '../store/hooks'
import { useCreateTicketMutation } from '../store/ticketsApi'
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
  // createTicket sends the request; isLoading is true until it answers.
  const [createTicket, { isLoading: isSaving }] = useCreateTicketMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Only called once the form's checks have passed. The API chooses the new
  // ticket's id, so the page waits for its answer before going there.
  async function handleSubmit(values: TicketFormValues) {
    try {
      // unwrap() gives the created ticket, or throws if the request failed.
      const ticket = await createTicket(values).unwrap()
      dispatch(
        addNotification({
          message: `Ticket #${ticket.id} created`,
          type: 'success',
        }),
      )
      navigate(`/tickets/${ticket.id}`)
    } catch {
      // The form stays as it was, so nothing typed is lost.
      dispatch(
        addNotification({
          message: 'Could not create the ticket. Please try again.',
          type: 'error',
        }),
      )
    }
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
          isSaving={isSaving}
        />
      </div>
    </section>
  )
}

export default NewTicketPage
