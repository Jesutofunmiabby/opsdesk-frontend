import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setMockPassword } from '../mocks/handlers'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'

// A made-up password for these tests only.
const PASSWORD = 'a test password'
const EMAIL = 'amara.okafor@example.com'

// Where the login token is kept (see tokenStorage).
const TOKEN_KEY = 'opsdesk.token'

// The whole app, signed out, at the given page.
function renderSignedOut(route: string) {
  renderWithProviders(<AppRoutes />, { route, signedInAs: null })
}

describe('Login page', () => {
  it('logs in, saves the token, fetches who the user is and returns to the page they wanted', async () => {
    const user = userEvent.setup()
    setMockPassword(EMAIL, PASSWORD)
    // Signed out, so asking for the tickets lands on the login page.
    renderSignedOut('/tickets')
    expect(
      await screen.findByRole('heading', { name: 'Log in' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email address'), EMAIL)
    await user.type(screen.getByLabelText('Password'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    // Back at the tickets, with the name and role from GET /auth/me.
    expect(
      await screen.findByRole('heading', { name: 'Tickets' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Amara Okafor')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    // The token survives a refresh.
    expect(localStorage.getItem(TOKEN_KEY)).toBe('mock-token-1')
  })

  it('shows the API message for a wrong password, without "session expired"', async () => {
    const user = userEvent.setup()
    setMockPassword(EMAIL, PASSWORD)
    renderSignedOut('/login')

    await user.type(screen.getByLabelText('Email address'), EMAIL)
    await user.type(screen.getByLabelText('Password'), 'not the password')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(
      await screen.findByText('The email address or password is wrong.'),
    ).toBeInTheDocument()
    // The 401 from login means a wrong password, not an expired session.
    expect(screen.queryByText(/session expired/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('asks for both fields before sending anything', async () => {
    const user = userEvent.setup()
    renderSignedOut('/login')

    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByText('Enter your email address.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveFocus()
  })
})
