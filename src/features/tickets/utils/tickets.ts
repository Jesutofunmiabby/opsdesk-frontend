import { STATUS_ORDER } from '../data/ticketStatuses'
import type { Ticket, TicketStatus } from '../types'

// The status after this one on the board, or null for the last status, which
// has nowhere further to go.
export function getNextStatus(status: TicketStatus): TicketStatus | null {
  const nextIndex = STATUS_ORDER.indexOf(status) + 1
  return nextIndex < STATUS_ORDER.length ? STATUS_ORDER[nextIndex] : null
}

// One more than the highest id in the list. 1 for an empty list. The mock
// API uses it only for its starting next id; after that it counts up on its
// own, because this alone would give a deleted newest ticket's id again.
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
