import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../config'
import { server } from '../mocks/server'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'

// Titles of two of the starting mock tickets.
const FIRST_TICKET = 'Laptop will not connect to the office Wi-Fi'
const SECOND_TICKET = 'Request a second monitor for the finance desk'

// The whole app at the tickets page, talking to the mock API.
function renderTicketsPage(route = '/tickets') {
  renderWithProviders(<AppRoutes />, { route })
}

describe('Tickets page', () => {
  it('shows a skeleton, then the tickets from the API', async () => {
    renderTicketsPage()

    // Straight away, before the API has answered: the placeholder, which
    // screen readers hear as "Loading tickets…".
    expect(screen.getByRole('status')).toHaveTextContent('Loading tickets…')
    expect(
      screen.queryByRole('link', { name: FIRST_TICKET }),
    ).not.toBeInTheDocument()

    // Then the real tickets, in their columns, and the placeholder has gone.
    expect(
      await screen.findByRole('link', { name: FIRST_TICKET }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: SECOND_TICKET })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /open/i, level: 3 }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Loading tickets…')).not.toBeInTheDocument()
  })

  it('shows an empty state when the filters match nothing, and Clear filters brings the tickets back', async () => {
    const user = userEvent.setup()
    renderTicketsPage('/tickets?view=list')
    await screen.findByRole('link', { name: FIRST_TICKET })

    await user.type(screen.getByLabelText('Search by title'), 'no such ticket')

    // The search goes to the API once typing pauses, so wait for the answer.
    expect(
      await screen.findByText('No tickets match your filters.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: FIRST_TICKET }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByLabelText('Search by title')).toHaveValue('')
    expect(
      await screen.findByRole('link', { name: FIRST_TICKET }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('No tickets match your filters.'),
    ).not.toBeInTheDocument()
  })

  it('shows the error state with Retry when the API fails', async () => {
    const user = userEvent.setup()
    // For this test only, the tickets list answers 500 Internal Server
    // Error. setupTests puts the normal handler back afterwards.
    server.use(
      http.get(`${API_URL}/tickets`, () =>
        HttpResponse.json(
          { error: 'INTERNAL_ERROR', message: 'Something went wrong.' },
          { status: 500 },
        ),
      ),
    )
    renderTicketsPage()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Sorry, we could not load the tickets.')
    const retry = within(alert).getByRole('button', { name: 'Retry' })
    expect(
      screen.queryByRole('link', { name: FIRST_TICKET }),
    ).not.toBeInTheDocument()

    // Once the API works again, Retry loads the tickets.
    server.resetHandlers()
    await user.click(retry)

    expect(
      await screen.findByRole('link', { name: FIRST_TICKET }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
