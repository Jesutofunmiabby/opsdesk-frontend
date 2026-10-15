import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// The mock API for tests. Tests run in Node, not a browser, so there is no
// service worker: setupServer catches the requests inside Node instead. It
// uses the same handlers as the browser, so tests see the same API as the
// app does in development.
export const server = setupServer(...handlers)
