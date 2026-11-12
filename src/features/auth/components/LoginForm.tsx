import type { FormEvent } from 'react'
import FormAlert from '../../../components/FormAlert'
import FormField from '../../../components/FormField'
import { useLoginMutation } from '../../../store/authApi'
import { loggedIn } from '../../../store/authSlice'
import { useAppDispatch } from '../../../store/hooks'
import { useAuthForm } from '../hooks/useAuthForm'
import type { LoginValues } from '../types'
import { validateLogin } from '../utils/validateAuth'
import './AuthForm.css'

const EMPTY_LOGIN: LoginValues = { email: '', password: '' }

interface LoginFormProps {
  // Called once the token is saved, to move on to the app.
  onLoggedIn: () => void
}

// Email and password. On success the token goes into the auth slice (and
// from there into localStorage); the protected pages then fetch who it
// belongs to from GET /auth/me.
function LoginForm({ onLoggedIn }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const {
    values,
    errors,
    formError,
    handleChange,
    checkBeforeSending,
    showRequestError,
  } = useAuthForm(EMPTY_LOGIN, validateLogin)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the browser's own form submit, which would reload the page.
    event.preventDefault()
    if (!checkBeforeSending(event.currentTarget)) {
      return
    }
    try {
      // unwrap() turns a failed request into a thrown error, so a wrong
      // password lands in catch with the API's message.
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap()
      dispatch(loggedIn(result.token))
      onLoggedIn()
    } catch (error) {
      showRequestError(error)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && <FormAlert message={formError} />}

      <FormField id="login-email" label="Email address" error={errors.email}>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          className="form-field__control"
          value={values.email}
          onChange={handleChange}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
        />
      </FormField>

      <FormField id="login-password" label="Password" error={errors.password}>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="form-field__control"
          value={values.password}
          onChange={handleChange}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={
            errors.password ? 'login-password-error' : undefined
          }
        />
      </FormField>

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

export default LoginForm
