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
  // Text the title must contain. Sent to the API as q.
  q?: string
  status?: TicketStatus
  priority?: Priority
  // Only tickets assigned to the user with this id.
  assigneeId?: number
}

// What the list can be sorted by (the sort parameter of GET /tickets), and
// which way round. priority and status are not here: the API stores them as
// text, so they would sort alphabetically.
export const TICKET_SORT_FIELDS = ['id', 'title', 'createdAt', 'updatedAt'] as const
export type TicketSortField = (typeof TICKET_SORT_FIELDS)[number]
export type SortDirection = 'asc' | 'desc'

// The sort parameter: a field, optionally followed by ,asc or ,desc, such as
// 'createdAt,desc'. Left out, the list is oldest first.
export type TicketSort = TicketSortField | `${TicketSortField},${SortDirection}`

export function isTicketSortField(text: string): text is TicketSortField {
  return (TICKET_SORT_FIELDS as readonly string[]).includes(text)
}

export function isSortDirection(text: string): text is SortDirection {
  return text === 'asc' || text === 'desc'
}

// The tickets in the given order. Tickets that tie are put in id order, as
// the API does, so the same ticket never shows up on two pages. The mock API
// uses this to answer GET /tickets.
export function sortTickets(
  tickets: Ticket[],
  field: TicketSortField,
  direction: SortDirection,
): Ticket[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...tickets].sort((a, b) => {
    const order =
      field === 'id' ? a.id - b.id : a[field].localeCompare(b[field])
    return order !== 0 ? sign * order : a.id - b.id
  })
}

// Tickets whose title contains q (ignoring capitals and spaces at either
// end), with the given status, priority and assignee. All filters apply
// together. The mock API uses this to answer GET /tickets.
export function filterTickets(
  tickets: Ticket[],
  { q = '', status, priority, assigneeId }: TicketFilters,
): Ticket[] {
  const text = q.trim().toLowerCase()
  return tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(text) &&
      (status === undefined || ticket.status === status) &&
      (priority === undefined || ticket.priority === priority) &&
      (assigneeId === undefined || ticket.assigneeId === assigneeId),
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

// The priority filter's "All priorities" choice.
export const ALL_PRIORITIES = 'ALL'

// What the priority filter can be set to: one priority, or all of them.
export type PriorityFilter = Priority | typeof ALL_PRIORITIES

// The orders the list offers, as the sort parameter the API is sent. The
// first is the API's own default.
export const SORT_OPTIONS: { value: TicketSort; label: string }[] = [
  { value: 'id,asc', label: 'Oldest first' },
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'updatedAt,desc', label: 'Recently updated' },
  { value: 'title,asc', label: 'Title A to Z' },
]

export const DEFAULT_SORT: TicketSort = SORT_OPTIONS[0].value

// A dropdown hands back plain text; this checks it is one of the orders
// above.
export function isSortOption(value: string): value is TicketSort {
  return SORT_OPTIONS.some((option) => option.value === value)
}
