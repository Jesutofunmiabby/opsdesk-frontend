import { useMemo, useRef, useState } from 'react'
import EmptyState from '../../../components/EmptyState'
import type { Ticket } from '../types'
import {
  ALL_STATUSES,
  TICKETS_PER_PAGE,
  filterTickets,
  paginate,
} from '../utils/ticketList'
import type { StatusFilter } from '../utils/ticketList'
import TicketListFilters from './TicketListFilters'
import TicketTable from './TicketTable'
import Pagination from './Pagination'
import './TicketList.css'

interface TicketListProps {
  tickets: Ticket[]
}

// Every ticket as a searchable, filterable list, 10 to a page.
function TicketList({ tickets }: TicketListProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUSES)
  const [page, setPage] = useState(1)
  const searchRef = useRef<HTMLInputElement>(null)

  // Worked out from the tickets and the choices above, so the list is always
  // in step with them. useMemo keeps the last result and only filters again
  // when tickets, query or status change, so turning the page does not redo
  // the search. paginate also moves a page number that is out of range to the
  // nearest real page.
  const matches = useMemo(
    () => filterTickets(tickets, query, status),
    [tickets, query, status],
  )
  const shown = paginate(matches, page, TICKETS_PER_PAGE)

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

  function renderEmpty() {
    if (tickets.length === 0) {
      return (
        <EmptyState
          title="No tickets yet."
          text="Tickets people raise will be listed here."
          action={{ label: 'New ticket', to: '/tickets/new' }}
        />
      )
    }
    return (
      <EmptyState
        title="No tickets match your filters."
        text="Try a different search or status, or clear them to see every ticket."
        action={{ label: 'Clear filters', onClick: handleClearFilters }}
      />
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

      {matches.length > 0 ? (
        <>
          <p className="ticket-list__count">
            {matches.length} {matches.length === 1 ? 'ticket' : 'tickets'}
          </p>
          <TicketTable tickets={shown.items} />
          <Pagination
            page={shown.page}
            totalPages={shown.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        renderEmpty()
      )}
    </div>
  )
}

export default TicketList
