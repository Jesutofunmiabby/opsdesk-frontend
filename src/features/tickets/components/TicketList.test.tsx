import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../../../config'
import { server } from '../../../mocks/server'
import type { PagedResponse } from '../../../store/apiTypes'
import { renderWithProviders } from '../../../test/renderWithProviders'
import type { Ticket } from '../types'
import TicketList from './TicketList'

// Two of the starting mock tickets: #1 is OPEN, #4 is IN_PROGRESS.
const OPEN_TICKET = 'Laptop will not connect to the office Wi-Fi'
const IN_PROGRESS_TICKET = 'Payroll export fails with a timeout error'

// The list on its own, talking to the mock API, once its first page is in.
async function renderTicketList() {
  renderWithProviders(<TicketList />)
  await screen.findByRole('link', { name: OPEN_TICKET })
}

describe('TicketList', () => {
  it('asks the API for the status chosen', async () => {
    const user = userEvent.setup()
    await renderTicketList()

    await user.selectOptions(screen.getByLabelText('Status'), 'IN_PROGRESS')

    expect(
      await screen.findByRole('link', { name: IN_PROGRESS_TICKET }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: OPEN_TICKET }),
    ).not.toBeInTheDocument()
  })

  it('clears the search and status when nothing matches', async () => {
    const user = userEvent.setup()
    await renderTicketList()

    const search = screen.getByLabelText('Search by title')
    const status = screen.getByLabelText('Status')
    await user.selectOptions(status, 'OPEN')
    await user.type(search, 'no such ticket')

    expect(
      await screen.findByText('No tickets match your filters.'),
    ).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(search).toHaveValue('')
    expect(status).toHaveValue('ALL')
    expect(
      await screen.findByRole('link', { name: OPEN_TICKET }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: IN_PROGRESS_TICKET }),
    ).toBeInTheDocument()
    // The button has gone, so focus goes somewhere useful rather than lost.
    expect(search).toHaveFocus()
  })

  it('offers to create a ticket when there are none at all', async () => {
    // For this test only, the API has no tickets.
    server.use(
      http.get(`${API_URL}/tickets`, () =>
        HttpResponse.json<PagedResponse<Ticket>>({
          items: [],
          page: 1,
          size: 10,
          totalItems: 0,
          totalPages: 1,
        }),
      ),
    )
    renderWithProviders(<TicketList />)

    expect(await screen.findByText('No tickets yet.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New ticket' })).toHaveAttribute(
      'href',
      '/tickets/new',
    )
    expect(
      screen.queryByRole('button', { name: 'Clear filters' }),
    ).not.toBeInTheDocument()
  })
})
