import { STATUS_ORDER } from '../data/ticketStatuses'
import type { Ticket, TicketFormValues, TicketStatus } from '../types'

// How many tickets sit in each status. Every status appears in the result,
// including the ones with no tickets, so a dashboard card can show 0 rather
// than undefined.
export function countTicketsByStatus(
  tickets: Ticket[],
): Record<TicketStatus, number> {
  // Written out in full so TypeScript can check that no status is missing.
  const counts: Record<TicketStatus, number> = {
    OPEN: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    CLOSED: 0,
  }
  tickets.forEach((ticket) => {
    counts[ticket.status] += 1
  })
  return counts
}

// The status after this one on the board, or null for the last status, which
// has nowhere further to go.
export function getNextStatus(status: TicketStatus): TicketStatus | null {
  const nextIndex = STATUS_ORDER.indexOf(status) + 1
  return nextIndex < STATUS_ORDER.length ? STATUS_ORDER[nextIndex] : null
}

// Returns a new array with one ticket advanced to the next status. A ticket
// already at the last status is returned unchanged. New objects rather than
// edits in place, so React can see that the state changed.
export function moveTicketToNextStatus(
  tickets: Ticket[],
  ticketId: number,
): Ticket[] {
  return tickets.map((ticket) => {
    if (ticket.id !== ticketId) {
      return ticket
    }
    const nextIndex = STATUS_ORDER.indexOf(ticket.status) + 1
    if (nextIndex >= STATUS_ORDER.length) {
      return ticket
    }
    return { ...ticket, status: STATUS_ORDER[nextIndex] }
  })
}

// One more than the highest id in use, so a new ticket never reuses an id,
// even after tickets in the middle of the list are gone. 1 for an empty list.
export function getNextTicketId(tickets: Ticket[]): number {
  return tickets.reduce((highest, ticket) => Math.max(highest, ticket.id), 0) + 1
}

// Returns a new array with one ticket's fields replaced by those in changes.
// Fields not in changes, such as id and status, are kept as they were.
export function updateTicketFields(
  tickets: Ticket[],
  ticketId: number,
  changes: TicketFormValues,
): Ticket[] {
  return tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, ...changes } : ticket,
  )
}

// Finds the ticket whose id is in the URL. URL parameters are text, and
// useParams gives undefined when the route has no such parameter, so both are
// handled here: no id, or text that is not a ticket's id, finds nothing.
export function findTicketById(
  tickets: Ticket[],
  id: string | undefined,
): Ticket | undefined {
  if (id === undefined) {
    return undefined
  }
  return tickets.find((ticket) => ticket.id === Number(id))
}
