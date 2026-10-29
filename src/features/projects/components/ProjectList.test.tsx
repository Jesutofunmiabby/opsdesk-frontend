import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { API_URL } from '../../../config'
import { server } from '../../../mocks/server'
import { renderWithProviders } from '../../../test/renderWithProviders'
import ProjectList from './ProjectList'

describe('ProjectList', () => {
  it('shows a loading message, then the projects from the API', async () => {
    renderWithProviders(<ProjectList />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading projects…')
    expect(
      await screen.findByRole('heading', {
        name: 'Laptop refresh for the sales team',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Amara Okafor')).toBeInTheDocument()
  })

  it('shows an error with Retry when the request fails', async () => {
    server.use(
      http.get(`${API_URL}/projects`, () =>
        HttpResponse.json(
          { error: 'INTERNAL_ERROR', message: 'Something went wrong.' },
          { status: 500 },
        ),
      ),
    )
    renderWithProviders(<ProjectList />)

    expect(
      await screen.findByText('Sorry, we could not load the projects.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
