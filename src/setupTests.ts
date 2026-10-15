import '@testing-library/jest-dom/vitest'
import { resetTickets } from './mocks/handlers'
import { server } from './mocks/server'

// Start the mock API once, before any test. 'error' fails a test that sends
// a request no handler answers, so a typo in a URL cannot pass unnoticed.
beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

// After every test, undo anything it changed so the next one starts clean:
// handlers it swapped in with server.use(), the tickets saved in
// localStorage, and the mock tickets themselves.
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
  resetTickets()
})

afterAll(() => {
  server.close()
})
