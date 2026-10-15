import { Link, useSearchParams } from 'react-router-dom'
import TicketBoard from '../features/tickets/components/TicketBoard'
import TicketBoardSkeleton from '../features/tickets/components/TicketBoardSkeleton'
import TicketList from '../features/tickets/components/TicketList'
import TicketViewToggle from '../features/tickets/components/TicketViewToggle'
import type { TicketView } from '../features/tickets/types'
import { MAX_PAGE_SIZE } from '../features/tickets/utils/ticketList'
import RequestError from '../components/RequestError'
import { useGetTicketsQuery } from '../store/ticketsApi'
import './TicketsPage.css'

// The board shows every ticket at once, so it asks for the biggest page the
// API allows. Defined once, so every render asks for the same cached page.
const BOARD_PAGE = { size: MAX_PAGE_SIZE }

function TicketsPage() {
  // The view is kept in the URL (/tickets?view=list), so a refresh or the
  // Back button from a ticket returns to the same view. Anything else in the
  // URL means the board.
  const [searchParams, setSearchParams] = useSearchParams()
  const view: TicketView =
    searchParams.get('view') === 'list' ? 'list' : 'board'

  // The board's tickets from the API. The list makes its own requests, page
  // by page, so this one is skipped while the list is showing. isLoading is
  // true until the first answer arrives; isError if the request failed.
  const { data, isLoading, isError, refetch } = useGetTicketsQuery(
    BOARD_PAGE,
    { skip: view === 'list' },
  )

  function handleViewChange(nextView: TicketView) {
    // replace: switching views does not add extra steps to Back.
    setSearchParams(nextView === 'list' ? { view: 'list' } : {}, {
      replace: true,
    })
  }

  function renderBoard() {
    // A placeholder shaped like the board, so the page does not jump when
    // the tickets arrive.
    if (isLoading) {
      return <TicketBoardSkeleton />
    }
    if (isError || !data) {
      return (
        <RequestError
          message="Sorry, we could not load the tickets."
          onRetry={refetch}
        />
      )
    }
    return (
      <>
        {/* Only if there are more tickets than one page holds. */}
        {data.totalItems > data.items.length && (
          <p className="tickets-page__note">
            Showing the first {data.items.length} of {data.totalItems}{' '}
            tickets. Switch to List to see them all.
          </p>
        )}
        <TicketBoard tickets={data.items} />
      </>
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
      {view === 'list' ? <TicketList /> : renderBoard()}
    </section>
  )
}

export default TicketsPage
