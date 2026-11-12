import { Link, useNavigate } from 'react-router-dom'
import { useTicketFromUrl } from '../features/tickets/hooks/useTicketFromUrl'
import type {
  TicketFormErrors,
  TicketFormValues,
} from '../features/tickets/types'
import { TICKET_FORM_FIELDS } from '../features/tickets/utils/validateTicket'
import { useShowRequestError } from '../hooks/useShowRequestError'
import { getFormFieldErrors } from '../utils/requestErrors'
import TicketForm from '../features/tickets/components/TicketForm'
import TicketNotFound from '../features/tickets/components/TicketNotFound'
import TicketFormSkeleton from '../features/tickets/components/TicketFormSkeleton'
import RequestError from '../components/RequestError'
import { useAppDispatch } from '../store/hooks'
import { useUpdateTicketMutation } from '../store/ticketsApi'
import { addNotification } from '../store/uiSlice'
import './TicketFormPage.css'

// The same TicketForm as New ticket, started with this ticket's values.
function EditTicketPage() {
  const { id, ticket, isLoading, isNotFound, isError, refetch } =
    useTicketFromUrl()
  const [updateTicket, { isLoading: isSaving }] = useUpdateTicketMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const showRequestError = useShowRequestError()

  if (isNotFound) {
    return <TicketNotFound id={id} />
  }
  if (isLoading) {
    return <TicketFormSkeleton />
  }
  // After the checks above, no ticket means the request failed.
  if (isError || !ticket) {
    return (
      <RequestError
        message="Sorry, we could not load this ticket."
        onRetry={refetch}
      />
    )
  }

  // Copied out after the check above, where TypeScript knows the ticket
  // exists. The check does not carry into handleSubmit on its own.
  const ticketId = ticket.id
  const ticketPath = `/tickets/${ticketId}`

  // Only called once the form's checks have passed. The mutation invalidates
  // this ticket's tag, so its page and the board show the new values.
  async function handleSubmit(
    values: TicketFormValues,
  ): Promise<TicketFormErrors | void> {
    try {
      await updateTicket({ id: ticketId, changes: values }).unwrap()
      dispatch(
        addNotification({
          message: `Ticket #${ticketId} updated`,
          type: 'success',
        }),
      )
      navigate(ticketPath)
    } catch (error) {
      // The form stays as it was, so the changes are not lost. Messages
      // about its fields go back to it; anything else, such as a 403 for
      // someone who may not edit this ticket, is a toast.
      const fieldErrors = getFormFieldErrors(error, TICKET_FORM_FIELDS)
      if (fieldErrors) {
        return fieldErrors
      }
      showRequestError(
        error,
        `Could not save ticket #${ticketId}. Please try again.`,
      )
    }
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
          isSaving={isSaving}
        />
      </div>
    </section>
  )
}

export default EditTicketPage
