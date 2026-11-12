import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../features/auth/hooks/useCurrentUser'
import type { LoginRedirectState } from '../features/auth/utils/returnPath'
import { selectIsSignedIn } from '../store/authSlice'
import { useAppSelector } from '../store/hooks'

// Wraps every page that needs someone signed in. Signed-out visitors are
// sent to /login, which remembers where they were going.
//
// For signed-in visitors it also asks GET /auth/me who they are (name and
// role), while the page loads alongside it rather than waiting. That check
// also catches a token that has stopped working, such as an old one left in
// localStorage: /auth/me answers 401, the base query ends the session, the
// token goes, and this sends them to /login.
function ProtectedRoute() {
  const isSignedIn = useAppSelector(selectIsSignedIn)
  const location = useLocation()
  useCurrentUser()

  if (!isSignedIn) {
    const state: LoginRedirectState = {
      from: `${location.pathname}${location.search}`,
    }
    return <Navigate to="/login" replace state={state} />
  }

  return <Outlet />
}

export default ProtectedRoute
