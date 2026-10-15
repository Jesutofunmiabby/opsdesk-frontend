import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { makeStore } from '../store/store'
import type { AppStore } from '../store/store'

interface RenderOptions {
  // The URL the test starts at, such as '/tickets/3'. Defaults to '/'.
  route?: string
}

// Renders a component the way the app does: inside a Redux store and a
// router. Every call gets a brand-new store, so tickets cached or toasts
// shown by one test are never seen by the next. MemoryRouter keeps the URL
// in memory instead of the address bar, and starts at the given route.
//
// Hands back everything render() does, plus the store.
export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderOptions = {},
): ReturnType<typeof render> & { store: AppStore } {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  }
}
