// Where to go after logging in when the user did not come from anywhere.
export const HOME_PATH = '/dashboard'

// What ProtectedRoute passes to /login: the page the user was trying to
// open, so login can take them back to it.
export interface LoginRedirectState {
  from: string
}

// The page to return to after login, from the router's location state. The
// state could be anything (it survives refreshes and can come from other
// code), so it is checked, and only a path inside this app is accepted.
export function getReturnPath(state: unknown): string {
  if (
    typeof state === 'object' &&
    state !== null &&
    'from' in state &&
    typeof state.from === 'string' &&
    state.from.startsWith('/') &&
    !state.from.startsWith('//') &&
    !state.from.startsWith('/login') &&
    !state.from.startsWith('/register')
  ) {
    return state.from
  }
  return HOME_PATH
}
