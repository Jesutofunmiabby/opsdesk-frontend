import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from '../store/store'
import NewTicketPage from './NewTicketPage'

// The real create page, store and form together. Submitting an empty form is
// stopped by the form's own checks, so no request is sent.
function renderNewTicketPage() {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <NewTicketPage />
      </MemoryRouter>
    </Provider>,
  )
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
