import type { ChangeEvent, Ref } from 'react'
import { PRIORITY_OPTIONS, isPriority } from '../data/ticketPriorities'
import {
  STATUS_LABELS,
  STATUS_ORDER,
  isTicketStatus,
} from '../data/ticketStatuses'
import {
  ALL_PRIORITIES,
  ALL_STATUSES,
  SORT_OPTIONS,
  isSortOption,
} from '../utils/ticketList'
import type {
  PriorityFilter,
  StatusFilter,
  TicketSort,
} from '../utils/ticketList'
import './TicketListFilters.css'

interface TicketListFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  priority: PriorityFilter
  onPriorityChange: (priority: PriorityFilter) => void
  sort: TicketSort
  onSortChange: (sort: TicketSort) => void
  // Lets the list move focus to the search box, after Clear filters.
  searchRef?: Ref<HTMLInputElement>
}

// The search box and the status, priority and order dropdowns above the
// ticket list. Each choice is sent to the API, which does the work.
function TicketListFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  searchRef,
}: TicketListFiltersProps) {
  // The dropdowns hand back plain text; only pass on real choices.
  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (value === ALL_STATUSES || isTicketStatus(value)) {
      onStatusChange(value)
    }
  }

  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (value === ALL_PRIORITIES || isPriority(value)) {
      onPriorityChange(value)
    }
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (isSortOption(value)) {
      onSortChange(value)
    }
  }

  return (
    <div className="ticket-list-filters">
      <div className="ticket-list-filters__field ticket-list-filters__field--grow">
        <label className="ticket-list-filters__label" htmlFor="ticket-search">
          Search by title
        </label>
        <input
          ref={searchRef}
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

      <div className="ticket-list-filters__field">
        <label
          className="ticket-list-filters__label"
          htmlFor="ticket-priority-filter"
        >
          Priority
        </label>
        <select
          id="ticket-priority-filter"
          className="ticket-list-filters__control"
          value={priority}
          onChange={handlePriorityChange}
        >
          <option value={ALL_PRIORITIES}>All priorities</option>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ticket-list-filters__field">
        <label className="ticket-list-filters__label" htmlFor="ticket-sort">
          Order
        </label>
        <select
          id="ticket-sort"
          className="ticket-list-filters__control"
          value={sort}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TicketListFilters
