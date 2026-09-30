import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// getElementById returns null when nothing has that id. index.html always has
// one, so if it is missing the page is broken: say so clearly.
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('index.html is missing the <div id="root"> element')
}

// BrowserRouter keeps the page in step with the address bar, so every page
// has a real URL that works with Back, Forward, refresh and bookmarks.
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
