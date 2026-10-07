import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// The mock API in the browser. Once started, it registers
// public/mockServiceWorker.js, which passes every request the page makes back
// to these handlers to answer.
export const worker = setupWorker(...handlers)
