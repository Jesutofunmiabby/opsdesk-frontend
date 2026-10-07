import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { store } from './store/store'

// getElementById returns null when nothing has that id. index.html always has
// one, so if it is missing the page is broken: say so clearly.
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('index.html is missing the <div id="root"> element')
}

// There is no real tickets API yet, so in development the mock one answers
// instead. It must be running before the app renders, or the first request
// for tickets would go out before anything could answer it. The import is
// inside the check, so the mocks are left out of the production build.
async function startMockApi() {
  if (!import.meta.env.DEV) {
    return
  }
  const { worker } = await import('./mocks/browser')
  // bypass: requests with no mock, such as the users API, go to the network
  // as normal, without a warning.
  await worker.start({ onUnhandledFrame: 'bypass' })
}

// BrowserRouter keeps the page in step with the address bar, so every page
// has a real URL that works with Back, Forward, refresh and bookmarks.
// Provider makes the Redux store available to every component inside it.
function renderApp(container: HTMLElement) {
  createRoot(container).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  )
}

// If the mock API fails to start, the app still renders; its ticket requests
// then fail and the pages show their error states rather than a blank page.
startMockApi()
  .catch((error: unknown) => {
    console.error('The mock API could not start.', error)
  })
  .then(() => renderApp(rootElement))
