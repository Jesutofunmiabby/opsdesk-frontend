import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../mocks/server'
import AppRoutes from '../routes/AppRoutes'
import { renderWithProviders } from '../test/renderWithProviders'

// Ticket #3 in the starting mock tickets.
const TITLE = 'Shared drive permissions missing for new starter'

// The method of every request that reaches the mock API, so a test can check
// that nothing was deleted, not just that the page still looks the same.
let methods: string[] = []

function recordMethod({ request }: { request: Request }) {
  methods.push(request.method)
}

beforeEach(() => {
  methods = []
  server.events.on('request:start', recordMethod)
})

afterEach(() => {
  server.events.removeListener('request:start', recordMethod)
})

// The whole app at ticket #3's page, once the ticket has loaded.
async function renderTicketPage() {
  renderWithProviders(<AppRoutes />, { route: '/tickets/3' })
  await screen.findByRole('heading', { name: TITLE })
}

// The Delete button on the page itself, which only opens the dialog. The
// dialog has its own Delete, so this one is found outside it.
function pageDeleteButton() {
  const buttons = screen.getAllByRole('button', { name: 'Delete' })
  const dialog = screen.queryByRole('dialog')
  const button = buttons.find((item) => !dialog?.contains(item))
  if (!button) {
    throw new Error('The page has no Delete button')
  }
  return button
}

describe('Deleting a ticket', () => {
  it('does not delete on Cancel', async () => {
    const user = userEvent.setup()
    await renderTicketPage()

    await user.click(pageDeleteButton())
    const dialog = screen.getByRole('dialog', { name: 'Delete ticket #3?' })
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TITLE })).toBeInTheDocument()
    expect(pageDeleteButton()).toHaveFocus()
    expect(methods).not.toContain('DELETE')
  })

  it('does not delete on Escape', async () => {
    const user = userEvent.setup()
    await renderTicketPage()

    await user.click(pageDeleteButton())
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TITLE })).toBeInTheDocument()
    expect(pageDeleteButton()).toHaveFocus()
    expect(methods).not.toContain('DELETE')
  })

  it('deletes the ticket after confirming, then shows a toast on the tickets page', async () => {
    const user = userEvent.setup()
    await renderTicketPage()

    // One click on the page's Delete only asks.
    await user.click(pageDeleteButton())
    expect(methods).not.toContain('DELETE')

    const dialog = screen.getByRole('dialog', { name: 'Delete ticket #3?' })
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Ticket #3 deleted')).toBeInTheDocument()
    expect(methods).toContain('DELETE')
    // Back on the tickets page, which no longer lists the ticket.
    expect(
      await screen.findByRole('heading', { name: 'Tickets', level: 2 }),
    ).toBeInTheDocument()
    await screen.findByRole('link', {
      name: 'Laptop will not connect to the office Wi-Fi',
    })
    expect(screen.queryByRole('link', { name: TITLE })).not.toBeInTheDocument()
  })
})
