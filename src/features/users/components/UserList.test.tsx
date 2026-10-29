import { screen, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../../../config'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import UserList from './UserList'

describe('UserList', () => {
  it('shows a skeleton, then the users from the API with their roles', async () => {
    renderWithProviders(<UserList />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading users…')

    const card = (
      await screen.findByRole('heading', { name: 'Amara Okafor' })
    ).closest('article')
    expect(card).not.toBeNull()
    const amara = within(card as HTMLElement)
    expect(amara.getByText('IT Support Lead')).toBeInTheDocument()
    expect(amara.getByText('Admin')).toBeInTheDocument()
    expect(
      amara.getByRole('link', { name: 'amara.okafor@example.com' }),
    ).toHaveAttribute('href', 'mailto:amara.okafor@example.com')
  })

  it('leaves out an empty job title', async () => {
    renderWithProviders(<UserList />)

    const card = (
      await screen.findByRole('heading', { name: 'Kabelo Dube' })
    ).closest('article')
    expect(card?.querySelector('.user-card__job')).toBeNull()
  })

  it('shows an error with Retry when the request fails', async () => {
    server.use(
      http.get(`${API_URL}/users`, () =>
        HttpResponse.json(
          { error: 'INTERNAL_ERROR', message: 'Something went wrong.' },
          { status: 500 },
        ),
      ),
    )
    renderWithProviders(<UserList />)

    expect(
      await screen.findByText('Sorry, we could not load the users.'),
    ).toBeInTheDocument()
  })
})
