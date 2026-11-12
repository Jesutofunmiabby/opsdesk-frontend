import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../config'
import users from '../features/users/data/users'
import type { User, UserRole } from '../features/users/types'
import { server } from '../mocks/server'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'
import { FORBIDDEN_MESSAGE } from '../utils/requestErrors'

// Ticket #1 in the starting mock tickets: OPEN, and assigned to nobody.
const TICKET_TITLE = 'Laptop will not connect to the office Wi-Fi'

// The first mock user with this role.
function mockUser(role: UserRole): User {
  const user = users.find((item) => item.role === role)
  if (!user) {
    throw new Error(`There is no mock ${role}.`)
  }
  return user
}

// The whole app as this user, once GET /auth/me has said who they are (their
// name is in the header), so everything that depends on the role has
// settled.
async function renderAs(role: UserRole, route: string) {
  const user = mockUser(role)
  renderWithProviders(<AppRoutes />, { route, signedInAs: user })
  await screen.findByText(user.name, { selector: '.user-menu__name' })
}

describe('Ticket actions by role', () => {
  it.each([
    ['ADMIN', true, true],
    ['MANAGER', false, true],
    ['AGENT', false, false],
  ] as const)(
    'as %s: Delete shown is %s, Assign shown is %s',
    async (role, deleteShown, assignShown) => {
      await renderAs(role, '/tickets/1')
      await screen.findByRole('heading', { name: TICKET_TITLE })

      expect(
        screen.queryByRole('button', { name: 'Delete' }) !== null,
      ).toBe(deleteShown)
      expect(screen.queryByLabelText('Assign to') !== null).toBe(assignShown)
      // Everyone may try to edit; the API decides.
      expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument()
    },
  )

  it('assigns a ticket and shows who has it', async () => {
    const user = userEvent.setup()
    const agent = mockUser('AGENT')
    await renderAs('MANAGER', '/tickets/1')
    const select = await screen.findByLabelText('Assign to')
    // Only people who can be assigned are offered: no USERs.
    await screen.findByRole('option', { name: agent.name })
    expect(
      screen.queryByRole('option', { name: mockUser('USER').name }),
    ).not.toBeInTheDocument()

    await user.selectOptions(select, String(agent.id))

    expect(
      await screen.findByText(`Ticket #1 assigned to ${agent.name}`),
    ).toBeInTheDocument()
    const assignedTo = screen.getByText('Assigned to').closest('div')
    expect(
      await within(assignedTo as HTMLElement).findByText(agent.name),
    ).toBeInTheDocument()
  })
})

describe('Users page and card by role', () => {
  it.each(['ADMIN', 'MANAGER'] as const)(
    'as %s: shows the Users link and the Users card',
    async (role) => {
      await renderAs(role, '/dashboard')

      expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument()
      // The card, with the count of the five mock users.
      const card = (
        await screen.findByText('Users', { selector: '.stat-card__label' })
      ).closest('article')
      expect(
        await within(card as HTMLElement).findByText('5'),
      ).toBeInTheDocument()
    },
  )

  it.each(['AGENT', 'USER'] as const)(
    'as %s: hides the Users link and card instead of showing "Could not load"',
    async (role) => {
      // Fails the test if the users are asked for at all.
      let usersRequested = false
      server.use(
        http.get(`${API_URL}/users`, () => {
          usersRequested = true
        }),
      )
      await renderAs(role, '/dashboard')
      // The ticket counts have loaded, so the page has settled.
      await screen.findAllByText(/^\d+$/)

      expect(
        screen.queryByRole('link', { name: 'Users' }),
      ).not.toBeInTheDocument()
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
      expect(screen.queryByText('Could not load')).not.toBeInTheDocument()
      expect(usersRequested).toBe(false)
    },
  )

  it('explains, rather than failing, when an AGENT opens /users directly', async () => {
    await renderAs('AGENT', '/users')

    expect(
      await screen.findByText("You don't have access to the Users page."),
    ).toBeInTheDocument()
  })
})

describe('The API still says no', () => {
  it('shows a friendly message when an AGENT saves a ticket that is not theirs', async () => {
    // The Edit link shows for everyone; the mock API, like the backend,
    // refuses an AGENT editing a ticket not assigned to them with 403.
    const user = userEvent.setup()
    await renderAs('AGENT', '/tickets/1/edit')
    const title = await screen.findByLabelText('Title')

    await user.clear(title)
    await user.type(title, 'Wi-Fi fixed by an agent')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText(FORBIDDEN_MESSAGE)).toBeInTheDocument()
    // Still on the form, with what they typed.
    expect(screen.getByLabelText('Title')).toHaveValue('Wi-Fi fixed by an agent')
  })

  it('shows a friendly message when the API refuses a delete the page offered', async () => {
    // Such as an admin demoted since they logged in: their token still
    // says ADMIN, so Delete shows, but the backend says no.
    server.use(
      http.delete(`${API_URL}/tickets/:id`, () =>
        HttpResponse.json(
          { error: 'FORBIDDEN', message: 'You are not allowed to do this.' },
          { status: 403 },
        ),
      ),
    )
    const user = userEvent.setup()
    await renderAs('ADMIN', '/tickets/1')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText(FORBIDDEN_MESSAGE)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TICKET_TITLE })).toBeInTheDocument()
  })
})

describe('Contract errors on the ticket form', () => {
  // A 400 from the API, in the contract's shape.
  function validationError(fields: Record<string, string>) {
    return HttpResponse.json(
      {
        error: 'VALIDATION_ERROR',
        message: 'Check the highlighted fields.',
        fields,
      },
      { status: 400 },
    )
  }

  async function fillInNewTicket() {
    const user = userEvent.setup()
    await renderAs('ADMIN', '/tickets/new')
    await user.type(await screen.findByLabelText('Title'), 'A fine title')
    await user.type(screen.getByLabelText('Description'), 'A description.')
    await user.click(screen.getByRole('button', { name: 'Create ticket' }))
  }

  it('shows a field error from the API under its field', async () => {
    server.use(
      http.post(`${API_URL}/tickets`, () =>
        validationError({ title: 'A ticket with this title already exists.' }),
      ),
    )
    await fillInNewTicket()

    const message = await screen.findByText(
      'A ticket with this title already exists.',
    )
    const title = screen.getByLabelText('Title')
    expect(title).toHaveAttribute('aria-invalid', 'true')
    expect(title).toHaveAttribute('aria-describedby', message.id)
    expect(title).toHaveFocus()
  })

  it('shows anything not about a form field as a toast', async () => {
    server.use(
      http.post(`${API_URL}/tickets`, () =>
        HttpResponse.json(
          { error: 'CONFLICT', message: 'That project is closed.' },
          { status: 409 },
        ),
      ),
    )
    await fillInNewTicket()

    const toast = await screen.findByText('That project is closed.')
    expect(toast.closest('.notifications')).not.toBeNull()
    expect(screen.getByLabelText('Title')).not.toHaveAttribute('aria-invalid')
  })
})
