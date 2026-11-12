import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'

function renderRegisterPage() {
  renderWithProviders(<AppRoutes />, { route: '/register', signedInAs: null })
}

describe('Register page', () => {
  it('creates the account, signs it in as a USER and opens the dashboard', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Name'), 'Ngozi Eze')
    await user.type(
      screen.getByLabelText('Email address'),
      'ngozi.eze@example.com',
    )
    await user.type(screen.getByLabelText('Password'), 'a test password')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(
      await screen.findByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(await screen.findByText('Ngozi Eze')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows the API message for an email that already has an account', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Name'), 'Someone Else')
    await user.type(
      screen.getByLabelText('Email address'),
      'amara.okafor@example.com',
    )
    await user.type(screen.getByLabelText('Password'), 'a test password')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(
      await screen.findByText(
        'An account with this email address already exists.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Create an account' }),
    ).toBeInTheDocument()
  })

  it('checks the fields before sending', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Name'), 'Ngozi Eze')
    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.click(screen.getByRole('button', { name: 'Create account' }))

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
    expect(
      screen.getByText('The password must be at least 8 characters.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toHaveFocus()
  })
})
