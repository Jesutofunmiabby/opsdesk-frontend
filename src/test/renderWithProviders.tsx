import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { saveToken } from '../features/auth/utils/tokenStorage'
import users from '../features/users/data/users'
import type { User } from '../features/users/types'
import { mockTokenFor } from '../mocks/handlers'
import { makeStore } from '../store/store'
import type { AppStore } from '../store/store'

// The mock user tests are signed in as unless they say otherwise: Amara
// Okafor, an ADMIN, who may do everything.
const DEFAULT_TEST_USER: User = users[0]

interface RenderOptions {
  // The URL the test starts at, such as '/tickets/3'. Defaults to '/'.
  route?: string
  // Who is signed in when the test starts, or null for nobody. Defaults to
  // DEFAULT_TEST_USER, so pages behind ProtectedRoute show straight away.
  signedInAs?: User | null
}

// Renders a component the way the app does: inside a Redux store and a
// router. Every call gets a brand-new store, so tickets cached or toasts
// shown by one test are never seen by the next. MemoryRouter keeps the URL
// in memory instead of the address bar, and starts at the given route.
//
// Signing in works as it does after a page refresh: the user's token is put
// in localStorage, and the new store reads it from there.
//
// Hands back everything render() does, plus the store.
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', signedInAs = DEFAULT_TEST_USER }: RenderOptions = {},
): ReturnType<typeof render> & { store: AppStore } {
  saveToken(signedInAs ? mockTokenFor(signedInAs) : null)
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
