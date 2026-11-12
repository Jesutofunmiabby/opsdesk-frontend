import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthCard from '../features/auth/components/AuthCard'
import RegisterForm from '../features/auth/components/RegisterForm'
import { HOME_PATH } from '../features/auth/utils/returnPath'
import { selectIsSignedIn } from '../store/authSlice'
import { useAppSelector } from '../store/hooks'

// /register. A new account is signed straight in and goes to the dashboard.
function RegisterPage() {
  const navigate = useNavigate()
  const isSignedIn = useAppSelector(selectIsSignedIn)

  if (isSignedIn) {
    return <Navigate to={HOME_PATH} replace />
  }

  return (
    <AuthCard
      title="Create an account"
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <RegisterForm
        onRegistered={() => navigate(HOME_PATH, { replace: true })}
      />
    </AuthCard>
  )
}

export default RegisterPage
