import { Link, useSearchParams } from 'react-router-dom'
import TicketBoard from '../features/tickets/components/TicketBoard'
import TicketList from '../features/tickets/components/TicketList'
import TicketViewToggle from '../features/tickets/components/TicketViewToggle'
import type { TicketView } from '../features/tickets/types'
import LoadingMessage from '../components/LoadingMessage'
import RequestError from '../components/RequestError'
import { useGetTicketsQuery } from '../store/ticketsApi'
import './TicketsPage.css'

function TicketsPage() {
  // The view is kept in the URL (/tickets?view=list), so a refresh or the
  // Back button from a ticket returns to the same view. Anything else in the
  // URL means the board.
  const [searchParams, setSearchParams] = useSearchParams()
  const view: TicketView =
    searchParams.get('view') === 'list' ? 'list' : 'board'

  // The tickets from the API. isLoading is true until the first answer
  // arrives (and again on Retry, since there is nothing to show yet);
  // isError is true if the request failed. refetch asks again.
  const { data: tickets = [], isLoading, isError, refetch } =
    useGetTicketsQuery()

  function handleViewChange(nextView: TicketView) {
    // replace: switching views does not add extra steps to Back.
    setSearchParams(nextView === 'list' ? { view: 'list' } : {}, {
      replace: true,
    })
  }

  function renderTickets() {
    if (isLoading) {
      return <LoadingMessage text="Loading tickets…" />
    }
    if (isError) {
      return (
        <RequestError
          message="Sorry, we could not load the tickets."
          onRetry={refetch}
        />
      )
    }
    return view === 'list' ? (
      <TicketList tickets={tickets} />
    ) : (
      <TicketBoard tickets={tickets} />
    )
  }

  return (
    <section>
      <header className="tickets-page__header">
        <h2 className="page-title">Tickets</h2>
        <div className="tickets-page__actions">
          <TicketViewToggle view={view} onViewChange={handleViewChange} />
          <Link to="/tickets/new" className="tickets-page__new">
            New ticket
          </Link>
        </div>
      </header>
      {renderTickets()}
    </section>
  )
}

export default TicketsPage
