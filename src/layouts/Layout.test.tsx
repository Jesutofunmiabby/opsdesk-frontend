import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { store } from '../store/store'
import Layout from './Layout'

// The layout with a stand-in page, so the test does not depend on any real
// page or the tickets API.
function renderLayout() {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="test" element={<button type="button">In page</button>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('Layout skip link', () => {
  it('is the first thing Tab reaches', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.tab()

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveFocus()
  })

  it('moves focus past the navigation to the page content', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('main')).toHaveFocus()

    // The next Tab lands on the page's first control, not a sidebar link.
    await user.tab()
    expect(screen.getByRole('button', { name: 'In page' })).toHaveFocus()
  })
})
