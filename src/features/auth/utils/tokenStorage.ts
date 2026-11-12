// Where the login token is kept in the browser's localStorage, so a page
// refresh does not sign people out.
//
// The trade-off: any JavaScript running on the page can read localStorage.
// If an XSS bug ever let an attacker's script run here, it could read this
// token and use it to act as the user until it expires. That is why the
// project bans dangerouslySetInnerHTML (see "Security" in API_CONTRACT.md).
const STORAGE_KEY = 'opsdesk.token'

// The saved token, or null if there is none or storage cannot be read (it
// can be blocked, for example in some private browsing modes).
export function loadToken(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? saved : null
  } catch {
    return null
  }
}

// Saves the token, or removes it when given null. If storage is blocked the
// app still works; the user just has to log in again after a refresh.
export function saveToken(token: string | null): void {
  try {
    if (token === null) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, token)
    }
  } catch {
    // Nothing else to do: the token is still in the Redux store.
  }
}
