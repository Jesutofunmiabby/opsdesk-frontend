import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { store } from './store/store'

// getElementById returns null when nothing has that id. index.html always has
// one, so if it is missing the page is broken: say so clearly.
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('index.html is missing the <div id="root"> element')
}

// BrowserRouter keeps the page in step with the address bar, so every page
// has a real URL that works with Back, Forward, refresh and bookmarks.
// Provider makes the Redux store available to every component inside it.
// The outer ErrorBoundary is the last safety net: pages have their own inside
// the layout, so this one only shows if the layout or the app around it
// crashes, instead of leaving a blank white page.
createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
