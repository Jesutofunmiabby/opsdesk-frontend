import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'
import NewTicketPage from './NewTicketPage'

// The real create page, store and form together. Submitting an empty form is
// stopped by the form's own checks, so no request is sent.
function renderNewTicketPage() {
  renderWithProviders(<NewTicketPage />)
}

describe('New ticket page', () => {
  it('shows an error and keeps focus on the title when it is left empty', async () => {
    const user = userEvent.setup()
    renderNewTicketPage()

    // No message before anyone has tried to save.
    expect(screen.queryByText('Enter a title.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create ticket' }))

    expect(screen.getByText('Enter a title.')).toBeInTheDocument()
    const title = screen.getByLabelText('Title')
    expect(title).toHaveAttribute('aria-invalid', 'true')
    expect(title).toHaveFocus()
  })
})

describe('Creating a ticket', () => {
  it('adds the ticket and shows a success toast', async () => {
    const user = userEvent.setup()
    // The whole app, so the toast, the redirect and the board are all real.
    renderWithProviders(<AppRoutes />, { route: '/tickets/new' })

    await user.type(
      screen.getByLabelText('Title'),
      'Projector in room 4 has no sound',
    )
    await user.type(
      screen.getByLabelText('Description'),
      'The picture works but the speakers stay silent.',
    )
    await user.selectOptions(screen.getByLabelText('Priority'), 'High')
    await user.click(screen.getByRole('button', { name: 'Create ticket' }))

    // The API chose the id, so any number will do.
    expect(
      await screen.findByText(/^Ticket #\d+ created$/),
    ).toBeInTheDocument()
    // The app went to the new ticket's own page.
    expect(
      await screen.findByRole('heading', {
        name: 'Projector in room 4 has no sound',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('HIGH')).toBeInTheDocument()

    // And it is on the board with the other tickets.
    await user.click(screen.getByRole('link', { name: '← Ticket board' }))
    expect(
      await screen.findByRole('link', {
        name: 'Projector in room 4 has no sound',
      }),
    ).toBeInTheDocument()
  })
})
