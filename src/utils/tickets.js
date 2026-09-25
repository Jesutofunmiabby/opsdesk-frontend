import { STATUS_ORDER } from '../data/ticketStatuses'

// How many tickets sit in each status. Every status appears in the result,
// including the ones with no tickets, so a dashboard card can show 0 rather
// than undefined.
export function countTicketsByStatus(tickets) {
  const counts = {}
  STATUS_ORDER.forEach((status) => {
    counts[status] = 0
  })
  tickets.forEach((ticket) => {
    if (counts[ticket.status] !== undefined) {
      counts[ticket.status] += 1
    }
  })
  return counts
}

// Returns a new array with one ticket advanced to the next status. A ticket
// already at the last status is returned unchanged. New objects rather than
// edits in place, so React can see that the state changed.
export function moveTicketToNextStatus(tickets, ticketId) {
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
