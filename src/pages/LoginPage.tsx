import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import FormAlert from '../components/FormAlert'
import AuthCard from '../features/auth/components/AuthCard'
import LoginForm from '../features/auth/components/LoginForm'
import { getReturnPath } from '../features/auth/utils/returnPath'
import { selectIsSignedIn, selectSessionExpired } from '../store/authSlice'
import { useAppSelector } from '../store/hooks'

// /login. After logging in, goes back to the page the user was trying to
// open, or the dashboard.
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isSignedIn = useAppSelector(selectIsSignedIn)
  const sessionExpired = useAppSelector(selectSessionExpired)
  const returnPath = getReturnPath(location.state)

  // Already signed in (for example, Back after logging in): nothing to do
  // here.
  if (isSignedIn) {
    return <Navigate to={returnPath} replace />
  }

  return (
    <AuthCard
      title="Log in"
      footer={
        <>
          New to OpsDesk? <Link to="/register">Create an account</Link>
        </>
      }
    >
      {sessionExpired && (
        <FormAlert
          tone="info"
          message="Your session expired. Please log in again."
        />
      )}
      <LoginForm
        onLoggedIn={() => navigate(returnPath, { replace: true })}
      />
    </AuthCard>
  )
}

export default LoginPage
