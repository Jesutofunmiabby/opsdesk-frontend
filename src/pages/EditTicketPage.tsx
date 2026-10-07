import { Link, useNavigate } from 'react-router-dom'
import { useTicketFromUrl } from '../features/tickets/hooks/useTicketFromUrl'
import type { TicketFormValues } from '../features/tickets/types'
import TicketForm from '../features/tickets/components/TicketForm'
import TicketNotFound from '../features/tickets/components/TicketNotFound'
import LoadingMessage from '../components/LoadingMessage'
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

  if (isNotFound) {
    return <TicketNotFound id={id} />
  }
  if (isLoading) {
    return <LoadingMessage text="Loading ticket…" />
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
  async function handleSubmit(values: TicketFormValues) {
    try {
      await updateTicket({ id: ticketId, changes: values }).unwrap()
      dispatch(
        addNotification({
          message: `Ticket #${ticketId} updated`,
          type: 'success',
        }),
      )
      navigate(ticketPath)
    } catch {
      // The form stays as it was, so the changes are not lost.
      dispatch(
        addNotification({
          message: `Could not save ticket #${ticketId}. Please try again.`,
          type: 'error',
        }),
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
