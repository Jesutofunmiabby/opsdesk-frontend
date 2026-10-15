import { useRef, useState } from 'react'
import EmptyState from '../../../components/EmptyState'
import RequestError from '../../../components/RequestError'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { useGetTicketsQuery } from '../../../store/ticketsApi'
import { ALL_STATUSES, TICKETS_PER_PAGE } from '../utils/ticketList'
import type { StatusFilter } from '../utils/ticketList'
import TicketListFilters from './TicketListFilters'
import TicketListSkeleton from './TicketListSkeleton'
import TicketTable from './TicketTable'
import Pagination from './Pagination'
import './TicketList.css'

// How long typing has to pause before the search is sent.
const SEARCH_DELAY_MS = 300

// The tickets as a searchable, filterable list, 10 to a page. The API does
// the searching, filtering and paging (GET /tickets in API_CONTRACT.md), so
// only the page on screen is downloaded, however many tickets there are.
function TicketList() {
  // Local state: only the list and its controls use these.
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUSES)
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  // The box updates on every key press; the search sent waits for a pause.
  const search = useDebouncedValue(query.trim(), SEARCH_DELAY_MS)

  // A new request whenever the page or a filter changes. Filters that are
  // off are left undefined, so they are not sent. While a new page loads,
  // data still holds the last one, so the table stays on screen.
  const { data, isLoading, isError, isFetching, refetch } = useGetTicketsQuery(
    {
      page,
      size: TICKETS_PER_PAGE,
      status: status === ALL_STATUSES ? undefined : status,
      search: search || undefined,
    },
  )

  const filtersOn = query.trim() !== '' || status !== ALL_STATUSES

  // A new search or filter starts again from page 1, where the first matches
  // are. Done here, when the choice changes, rather than in an effect.
  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setPage(1)
  }

  function handleStatusChange(nextStatus: StatusFilter) {
    setStatus(nextStatus)
    setPage(1)
  }

  // Back to every ticket. The Clear filters button disappears once the list
  // fills up again, so focus moves to the search box rather than being lost.
  function handleClearFilters() {
    setQuery('')
    setStatus(ALL_STATUSES)
    setPage(1)
    searchRef.current?.focus()
  }

  // The first load, before there is anything to show.
  if (isLoading) {
    return <TicketListSkeleton />
  }

  function renderResults() {
    if (isError || !data) {
      return (
        <RequestError
          message="Sorry, we could not load the tickets."
          onRetry={refetch}
        />
      )
    }
    if (data.totalItems === 0) {
      return filtersOn ? (
        <EmptyState
          title="No tickets match your filters."
          text="Try a different search or status, or clear them to see every ticket."
          action={{ label: 'Clear filters', onClick: handleClearFilters }}
        />
      ) : (
        <EmptyState
          title="No tickets yet."
          text="Tickets people raise will be listed here."
          action={{ label: 'New ticket', to: '/tickets/new' }}
        />
      )
    }
    return (
      <>
        <p className="ticket-list__count">
          {data.totalItems} {data.totalItems === 1 ? 'ticket' : 'tickets'}
        </p>
        <TicketTable tickets={data.items} />
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      </>
    )
  }

  return (
    <div>
      <TicketListFilters
        query={query}
        onQueryChange={handleQueryChange}
        status={status}
        onStatusChange={handleStatusChange}
        searchRef={searchRef}
      />
      {/* aria-busy tells screen readers the results are being replaced. */}
      <div aria-busy={isFetching}>{renderResults()}</div>
    </div>
  )
}

export default TicketList
