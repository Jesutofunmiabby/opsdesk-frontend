import { Link, useNavigate } from 'react-router-dom'
import TicketForm from '../features/tickets/components/TicketForm'
import type {
  TicketFormErrors,
  TicketFormValues,
} from '../features/tickets/types'
import { TICKET_FORM_FIELDS } from '../features/tickets/utils/validateTicket'
import { useShowRequestError } from '../hooks/useShowRequestError'
import { getFormFieldErrors } from '../utils/requestErrors'
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
  const showRequestError = useShowRequestError()

  // Only called once the form's checks have passed. The API chooses the new
  // ticket's id, so the page waits for its answer before going there.
  async function handleSubmit(
    values: TicketFormValues,
  ): Promise<TicketFormErrors | void> {
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
    } catch (error) {
      // The form stays as it was, so nothing typed is lost. Messages about
      // its fields go back to it, to show under each one; anything else is
      // a toast.
      const fieldErrors = getFormFieldErrors(error, TICKET_FORM_FIELDS)
      if (fieldErrors) {
        return fieldErrors
      }
      showRequestError(error, 'Could not create the ticket. Please try again.')
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
