import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../config'
import { server } from '../mocks/server'
import { renderWithProviders } from '../test/renderWithProviders'
import AppRoutes from './AppRoutes'

const TOKEN_KEY = 'opsdesk.token'
const EXPIRED_MESSAGE = 'Your session expired. Please log in again.'

// What the API sends for an expired or invalid token (see "Errors" in
// API_CONTRACT.md).
function unauthenticated() {
  return HttpResponse.json(
    { error: 'UNAUTHENTICATED', message: 'Log in to continue.' },
    { status: 401 },
  )
}

describe('Protected routes', () => {
  it('sends a signed-out visitor to the login page', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/dashboard',
      signedInAs: null,
    })

    expect(
      await screen.findByRole('heading', { name: 'Log in' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Dashboard' }),
    ).not.toBeInTheDocument()
    // Nobody was signed in, so nothing expired.
    expect(screen.queryByText(EXPIRED_MESSAGE)).not.toBeInTheDocument()
  })

  it('sends the login token on API requests', async () => {
    const seen: (string | null)[] = []
    server.use(
      http.get(`${API_URL}/tickets`, ({ request }) => {
        seen.push(request.headers.get('Authorization'))
        // Nothing returned: the normal mock handler answers it.
        return undefined
      }),
    )
    renderWithProviders(<AppRoutes />, { route: '/tickets' })

    expect(
      await screen.findByRole('link', {
        name: 'Laptop will not connect to the office Wi-Fi',
      }),
    ).toBeInTheDocument()
    expect(seen.length).toBeGreaterThan(0)
    expect(seen.every((header) => header === 'Bearer mock-token-1')).toBe(true)
  })

  it('logs out and returns to /login with "Your session expired" when a request gets a 401', async () => {
    server.use(http.get(`${API_URL}/tickets`, unauthenticated))
    renderWithProviders(<AppRoutes />, { route: '/tickets' })

    expect(await screen.findByText(EXPIRED_MESSAGE)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('does the same for an old token left in storage', async () => {
    // The token from last time no longer works, so /auth/me refuses it.
    server.use(http.get(`${API_URL}/auth/me`, unauthenticated))
    renderWithProviders(<AppRoutes />, { route: '/dashboard' })

    expect(await screen.findByText(EXPIRED_MESSAGE)).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('logs out with the Log out button, and the pages stay locked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppRoutes />, { route: '/dashboard' })
    expect(await screen.findByText('Amara Okafor')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(
      await screen.findByRole('heading', { name: 'Log in' }),
    ).toBeInTheDocument()
    // Logging out on purpose is not an expired session.
    expect(screen.queryByText(EXPIRED_MESSAGE)).not.toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(screen.queryByText('Amara Okafor')).not.toBeInTheDocument()
  })
})
