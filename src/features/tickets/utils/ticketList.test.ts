import type { Ticket } from '../types'
import { filterTickets } from './ticketList'

// Just the fields the filter looks at matter; the rest are filler.
function makeTicket(
  id: number,
  title: string,
  status: Ticket['status'],
  priority: Ticket['priority'] = 'LOW',
): Ticket {
  return {
    id,
    title,
    status,
    description: 'Details',
    priority,
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  }
}

const tickets: Ticket[] = [
  makeTicket(1, 'VPN keeps dropping', 'OPEN'),
  makeTicket(2, 'New laptop for Sam', 'IN_PROGRESS'),
  makeTicket(3, 'VPN access for contractor', 'CLOSED'),
  // Closed but not about the VPN, so the status alone is not enough.
  makeTicket(4, 'Monitor flickering', 'CLOSED', 'HIGH'),
]

describe('filterTickets', () => {
  it('finds tickets whose title contains the search, ignoring case and spaces', () => {
    const ids = filterTickets(tickets, { search: '  vpn ' }).map((t) => t.id)
    expect(ids).toEqual([1, 3])
  })

  it('applies the search and the status filter together', () => {
    const ids = filterTickets(tickets, { search: 'vpn', status: 'CLOSED' }).map(
      (t) => t.id,
    )
    expect(ids).toEqual([3])
  })

  it('applies the status and priority filters together', () => {
    const ids = filterTickets(tickets, { status: 'CLOSED', priority: 'HIGH' }).map(
      (t) => t.id,
    )
    expect(ids).toEqual([4])
  })

  it('returns every ticket when there are no filters', () => {
    expect(filterTickets(tickets, {})).toHaveLength(4)
  })
})
