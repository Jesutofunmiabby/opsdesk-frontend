import type { Priority, Ticket, TicketStatus } from '../types'

// The status filter's "All statuses" choice.
export const ALL_STATUSES = 'ALL'

// What the status filter can be set to: one status, or all of them.
export type StatusFilter = TicketStatus | typeof ALL_STATUSES

// How many tickets the list asks for per page.
export const TICKETS_PER_PAGE = 10

// The largest page the API gives (see "Lists and pages" in the contract).
export const MAX_PAGE_SIZE = 100

// What the ticket list can be narrowed by: the filters of GET /tickets in
// API_CONTRACT.md. Each one left out matches every ticket.
export interface TicketFilters {
  search?: string
  status?: TicketStatus
  priority?: Priority
}

// Tickets whose title contains the search (ignoring capitals and spaces at
// either end), with the given status and priority. All filters apply
// together. The mock API uses this to answer GET /tickets.
export function filterTickets(
  tickets: Ticket[],
  { search = '', status, priority }: TicketFilters,
): Ticket[] {
  const text = search.trim().toLowerCase()
  return tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(text) &&
      (status === undefined || ticket.status === status) &&
      (priority === undefined || ticket.priority === priority),
  )
}

// One page of a longer list. T is the type of one item, so this works for
// any kind of list.
export interface Page<T> {
  items: T[]
  // The page actually shown, counting from 0, as the API does.
  page: number
  // Always at least 1, so an empty list still has one page: page 0.
  totalPages: number
}

// The items on the given page, counting from 0. A page number that is too high or too low is
// moved to the nearest real page, so the list never shows an empty page just
// because it got shorter.
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(page, 0), totalPages - 1)
  const start = current * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
  }
}
