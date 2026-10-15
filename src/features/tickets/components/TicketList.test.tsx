import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { Ticket } from '../types'
import TicketList from './TicketList'

const sampleTickets: Ticket[] = [
  {
    id: 1,
    title: 'Printer on floor 2 is jammed',
    description: 'Paper stuck in tray 1.',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Reset my VPN password',
    description: 'Locked out after three tries.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-02T09:00:00.000Z',
    updatedAt: '2026-09-03T14:00:00.000Z',
  },
]

// MemoryRouter: the table's titles and the empty state's link are router
// Links, which need a router.
function renderTicketList(tickets: Ticket[]) {
  render(
    <MemoryRouter>
      <TicketList tickets={tickets} />
    </MemoryRouter>,
  )
}

describe('TicketList empty states', () => {
  it('clears the search and status when nothing matches', async () => {
    const user = userEvent.setup()
    renderTicketList(sampleTickets)

    const search = screen.getByLabelText('Search by title')
    const status = screen.getByLabelText('Status')
    await user.selectOptions(status, 'OPEN')
    await user.type(search, 'no such ticket')

    expect(
      screen.getByText('No tickets match your filters.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(search).toHaveValue('')
    expect(status).toHaveValue('ALL')
    expect(
      screen.getByRole('link', { name: 'Printer on floor 2 is jammed' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Reset my VPN password' }),
    ).toBeInTheDocument()
    // The button has gone, so focus goes somewhere useful rather than lost.
    expect(search).toHaveFocus()
  })

  it('offers to create a ticket when there are none at all', () => {
    renderTicketList([])

    expect(screen.getByText('No tickets yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New ticket' })).toHaveAttribute(
      'href',
      '/tickets/new',
    )
    expect(
      screen.queryByRole('button', { name: 'Clear filters' }),
    ).not.toBeInTheDocument()
  })
})
