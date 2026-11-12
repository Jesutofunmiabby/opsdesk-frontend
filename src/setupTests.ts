import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'
import { resetAccounts, resetTickets } from './mocks/handlers'
import { server } from './mocks/server'

// How long findBy... and waitFor keep looking before a test fails. The
// default, 1 second, is too short for tests that render the whole app on the
// slower CI machines (GitHub Actions). A test still fails if the thing never
// appears; it only waits longer for it. It stays under Vitest's 5 second
// limit for a whole test, so a miss still shows which element was missing.
configure({ asyncUtilTimeout: 3000 })

// Start the mock API once, before any test. 'error' fails a test that sends
// a request no handler answers, so a typo in a URL cannot pass unnoticed.
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

// After every test, undo anything it changed so the next one starts clean:
// handlers it swapped in with server.use(), everything in localStorage (the
// saved tickets and any login token), the mock tickets themselves, and any
// accounts it registered or passwords it set.
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
  resetTickets()
  resetAccounts()
})

afterAll(() => {
  server.close()
})
