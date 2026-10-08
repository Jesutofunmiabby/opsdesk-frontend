import type { Ticket } from '../types'
import { ALL_STATUSES, filterTickets } from './ticketList'

// Just the fields the filter looks at matter; the rest are filler.
function makeTicket(id: number, title: string, status: Ticket['status']): Ticket {
  return { id, title, status, description: 'Details', priority: 'LOW' }
}

const tickets: Ticket[] = [
  makeTicket(1, 'VPN keeps dropping', 'OPEN'),
  makeTicket(2, 'New laptop for Sam', 'IN_PROGRESS'),
  makeTicket(3, 'VPN access for contractor', 'CLOSED'),
  // Closed but not about the VPN, so the status alone is not enough.
  makeTicket(4, 'Monitor flickering', 'CLOSED'),
]

describe('filterTickets', () => {
  it('finds tickets whose title contains the search, ignoring case and spaces', () => {
    const ids = filterTickets(tickets, '  vpn ', ALL_STATUSES).map((t) => t.id)
    expect(ids).toEqual([1, 3])
  })

  it('applies the search and the status filter together', () => {
    const ids = filterTickets(tickets, 'vpn', 'CLOSED').map((t) => t.id)
    expect(ids).toEqual([3])
  })

  it('returns every ticket for an empty search and all statuses', () => {
    expect(filterTickets(tickets, '', ALL_STATUSES)).toHaveLength(4)
  })
})
