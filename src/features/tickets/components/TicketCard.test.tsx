import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { Ticket } from '../types'
import TicketCard from './TicketCard'

const sampleTicket: Ticket = {
  id: 7,
  title: 'Printer on floor 2 is jammed',
  description: 'Paper stuck in tray 1.',
  priority: 'HIGH',
  status: 'OPEN',
}

describe('TicketCard', () => {
  it('shows the ticket title as a link to its page', () => {
    // MemoryRouter: the card's title is a router Link, which needs a router.
    render(
      <MemoryRouter>
        <TicketCard ticket={sampleTicket} onMove={() => {}} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', {
      name: 'Printer on floor 2 is jammed',
    })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/tickets/7')
  })
})
