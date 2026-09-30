import type { ChangeEvent } from 'react'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  isTicketStatus,
} from '../data/ticketStatuses'
import { ALL_STATUSES } from '../utils/ticketList'
import type { StatusFilter } from '../utils/ticketList'
import './TicketListFilters.css'

interface TicketListFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
}

// The search box and status dropdown above the ticket list.
function TicketListFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
}: TicketListFiltersProps) {
  // The dropdown hands back plain text; only pass on real choices.
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (value === ALL_STATUSES || isTicketStatus(value)) {
      onStatusChange(value)
    }
  }

  return (
    <div className="ticket-list-filters">
      <div className="ticket-list-filters__field ticket-list-filters__field--grow">
        <label className="ticket-list-filters__label" htmlFor="ticket-search">
          Search by title
        </label>
        <input
          id="ticket-search"
          className="ticket-list-filters__control"
          type="search"
          placeholder="Start typing a title"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="ticket-list-filters__field">
        <label
          className="ticket-list-filters__label"
          htmlFor="ticket-status-filter"
        >
          Status
        </label>
        <select
          id="ticket-status-filter"
          className="ticket-list-filters__control"
          value={status}
          onChange={handleStatusChange}
        >
          <option value={ALL_STATUSES}>All statuses</option>
          {STATUS_ORDER.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TicketListFilters
