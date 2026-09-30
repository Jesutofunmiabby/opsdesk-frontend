import type { Ticket, TicketStatus } from '../types'

// The status filter's "All statuses" choice.
export const ALL_STATUSES = 'ALL'

// What the status filter can be set to: one status, or all of them.
export type StatusFilter = TicketStatus | typeof ALL_STATUSES

export const TICKETS_PER_PAGE = 10

// Tickets whose title contains the search text (ignoring capitals and spaces
// at either end) and whose status matches the filter. Both apply together.
export function filterTickets(
  tickets: Ticket[],
  query: string,
  status: StatusFilter,
): Ticket[] {
  const search = query.trim().toLowerCase()
  return tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(search) &&
      (status === ALL_STATUSES || ticket.status === status),
  )
}

// One page of a longer list. T is the type of one item, so this works for
// any kind of list.
export interface Page<T> {
  items: T[]
  // The page actually shown, counting from 1.
  page: number
  // Always at least 1, so an empty list still reads "Page 1 of 1".
  totalPages: number
}

// The items on the given page. A page number that is too high or too low is
// moved to the nearest real page, so the list never shows an empty page just
// because it got shorter.
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(page, 1), totalPages)
  const start = (current - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
  }
}
