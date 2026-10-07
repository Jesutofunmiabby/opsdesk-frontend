import { STATUS_ORDER } from '../data/ticketStatuses'
import type { Ticket, TicketStatus } from '../types'

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

// One more than the highest id in use, so a new ticket never reuses an id,
// even after tickets in the middle of the list are gone. 1 for an empty list.
export function getNextTicketId(tickets: Ticket[]): number {
  return tickets.reduce((highest, ticket) => Math.max(highest, ticket.id), 0) + 1
}

// The ticket id from the URL as a number, or null if it is not one. URL
// parameters are text, and useParams gives undefined when there is none.
// Only whole numbers written as digits count: "4" is 4, but "4.5", "abc",
// " 4" and "" are null, so they are never sent to the API.
export function parseTicketId(id: string | undefined): number | null {
  if (id === undefined || !/^\d+$/.test(id)) {
    return null
  }
  return Number(id)
}
