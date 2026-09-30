import { useState } from 'react'
import { useTickets } from '../hooks/useTickets'
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

// Every ticket as a searchable, filterable list, 10 to a page.
function TicketList() {
  const { tickets } = useTickets()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>(ALL_STATUSES)
  const [page, setPage] = useState(1)

  // Worked out on every render from the tickets and the three choices above,
  // so the list is always in step with them. paginate also moves a page
  // number that is out of range to the nearest real page.
  const matches = filterTickets(tickets, query, status)
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

  return (
    <div>
      <TicketListFilters
        query={query}
        onQueryChange={handleQueryChange}
        status={status}
        onStatusChange={handleStatusChange}
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
        <p className="ticket-list__empty">No tickets match</p>
      )}
    </div>
  )
}

export default TicketList
