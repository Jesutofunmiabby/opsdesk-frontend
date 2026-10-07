import { Link } from 'react-router-dom'
import { useTicketFromUrl } from '../features/tickets/hooks/useTicketFromUrl'
import TicketDetails from '../features/tickets/components/TicketDetails'
import TicketNotFound from '../features/tickets/components/TicketNotFound'
import LoadingMessage from '../components/LoadingMessage'
import RequestError from '../components/RequestError'
import './TicketDetailPage.css'

// One ticket, chosen by the :id part of the URL (/tickets/4 shows ticket 4).
function TicketDetailPage() {
  const { id, ticket, isLoading, isNotFound, isError, refetch } =
    useTicketFromUrl()

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

  return (
    <section>
      <div className="ticket-detail-page__toolbar">
        <Link to="/tickets" className="ticket-detail-page__back">
          ← Ticket board
        </Link>
        <Link
          to={`/tickets/${ticket.id}/edit`}
          className="ticket-detail-page__edit"
        >
          Edit
        </Link>
      </div>
      <TicketDetails ticket={ticket} />
    </section>
  )
}

export default TicketDetailPage
