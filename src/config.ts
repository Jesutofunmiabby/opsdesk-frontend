// Settings that change between environments, read from .env files. Vite puts
// every VITE_ variable into the JavaScript it sends to the browser, so
// anyone using the app can read them: never put a secret in one.

// Used when VITE_API_URL is not set, such as a fresh copy of the repo with no
// .env file yet.
const FALLBACK_API_URL = '/api/v1'

function readApiUrl(): string {
  let value = import.meta.env.VITE_API_URL
  if (!value) {
    console.warn(
      `VITE_API_URL is not set, so the API is assumed to be at "${FALLBACK_API_URL}". Copy .env.example to .env to set it.`,
    )
    value = FALLBACK_API_URL
  }
  // A path such as "/api/v1" becomes a full address on the page's own
  // server, such as "http://localhost:5173/api/v1"; a full address stays as
  // it is.
  // Browsers do this for every request anyway, but the tests run in Node,
  // whose fetch only accepts full addresses.
  const url = new URL(value, window.location.origin).href
  // "/api/v1/" and "/api/v1" mean the same; without the slash, joining it
  // to "/tickets" cannot make "/api/v1//tickets".
  return url.replace(/\/+$/, '')
}

// Where the backend API lives. The app's requests and the mock API's
// handlers both build their URLs from this, so they always agree.
export const API_URL = readApiUrl()
