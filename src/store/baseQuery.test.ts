import { saveToken } from '../features/auth/utils/tokenStorage'
import { authApi } from './authApi'
import { selectSessionExpired, selectToken } from './authSlice'
import { makeStore } from './store'
import { ticketsApi } from './ticketsApi'

// A store with this token already saved, as after a page refresh.
function makeSignedInStore(token = 'mock-token-1') {
  saveToken(token)
  return makeStore()
}

describe('Base query and 401s', () => {
  it('ends the session when any other request gets a 401', async () => {
    // A token the mock API does not recognise gets 401 from /auth/me.
    const store = makeSignedInStore('not-a-real-token')

    await store.dispatch(authApi.endpoints.getMe.initiate())

    expect(selectToken(store.getState())).toBeNull()
    expect(selectSessionExpired(store.getState())).toBe(true)
  })

  it('keeps the session when the 401 comes from the login request', async () => {
    const store = makeSignedInStore()

    // Nobody has this password, so login answers 401.
    await store.dispatch(
      authApi.endpoints.login.initiate({
        email: 'amara.okafor@example.com',
        password: 'not the password',
      }),
    )

    expect(selectToken(store.getState())).toBe('mock-token-1')
    expect(selectSessionExpired(store.getState())).toBe(false)
  })

  it('keeps the session for errors other than 401', async () => {
    const store = makeSignedInStore()

    // No such ticket: 404.
    await store.dispatch(ticketsApi.endpoints.getTicket.initiate(999))

    expect(selectToken(store.getState())).toBe('mock-token-1')
  })
})
