import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTicketFromUrl } from '../features/tickets/hooks/useTicketFromUrl'
import TicketDetails from '../features/tickets/components/TicketDetails'
import TicketDetailSkeleton from '../features/tickets/components/TicketDetailSkeleton'
import TicketNotFound from '../features/tickets/components/TicketNotFound'
import ConfirmDialog from '../components/ConfirmDialog'
import RequestError from '../components/RequestError'
import { useAppDispatch } from '../store/hooks'
import { useDeleteTicketMutation } from '../store/ticketsApi'
import { addNotification } from '../store/uiSlice'
import './TicketDetailPage.css'

// One ticket, chosen by the :id part of the URL (/tickets/4 shows ticket 4).
function TicketDetailPage() {
  const { id, ticket, isLoading, isNotFound, isError, refetch } =
    useTicketFromUrl()
  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation()
  // Local state: only this page opens its dialog.
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  if (isNotFound) {
    return <TicketNotFound id={id} />
  }
  if (isLoading) {
    return <TicketDetailSkeleton />
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
  // exists. The check does not carry into handleDelete on its own.
  const ticketId = ticket.id

  // Only runs from the dialog's Delete button, never straight from the
  // page's, so one click can never delete a ticket.
  async function handleDelete() {
    try {
      await deleteTicket(ticketId).unwrap()
      dispatch(
        addNotification({
          message: `Ticket #${ticketId} deleted`,
          type: 'success',
        }),
      )
      // The ticket has gone, so there is nothing left to show here.
      navigate('/tickets')
    } catch {
      // Closing the dialog gives focus back to Delete, ready to try again.
      setConfirmOpen(false)
      dispatch(
        addNotification({
          message: `Could not delete ticket #${ticketId}. Please try again.`,
          type: 'error',
        }),
      )
    }
  }

  return (
    <section>
      <div className="ticket-detail-page__toolbar">
        <Link to="/tickets" className="ticket-detail-page__back">
          ← Ticket board
        </Link>
        <div className="ticket-detail-page__actions">
          <Link
            to={`/tickets/${ticketId}/edit`}
            className="ticket-detail-page__edit"
          >
            Edit
          </Link>
          <button
            type="button"
            className="ticket-detail-page__delete"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      </div>
      <TicketDetails ticket={ticket} />

      <ConfirmDialog
        open={confirmOpen}
        title={`Delete ticket #${ticketId}?`}
        message={`“${ticket.title}” will be removed for good. This cannot be undone.`}
        confirmLabel="Delete"
        busyLabel="Deleting…"
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  )
}

export default TicketDetailPage
