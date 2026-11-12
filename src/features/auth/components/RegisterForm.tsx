import type { FormEvent } from 'react'
import FormAlert from '../../../components/FormAlert'
import FormField from '../../../components/FormField'
import { useRegisterMutation } from '../../../store/authApi'
import { loggedIn } from '../../../store/authSlice'
import { useAppDispatch } from '../../../store/hooks'
import { useAuthForm } from '../hooks/useAuthForm'
import type { RegisterValues } from '../types'
import { PASSWORD_MIN_LENGTH, validateRegister } from '../utils/validateAuth'
import './AuthForm.css'

const EMPTY_REGISTER: RegisterValues = { name: '', email: '', password: '' }

interface RegisterFormProps {
  // Called once the new account's token is saved, to move on to the app.
  onRegistered: () => void
}

// Name, email and password for a new account. The API signs the new user
// straight in, so success is handled like a login. New accounts are always
// the USER role; only an admin can change that.
function RegisterForm({ onRegistered }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const [register, { isLoading }] = useRegisterMutation()
  const {
    values,
    errors,
    formError,
    handleChange,
    checkBeforeSending,
    showRequestError,
  } = useAuthForm(EMPTY_REGISTER, validateRegister)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!checkBeforeSending(event.currentTarget)) {
      return
    }
    try {
      const result = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      }).unwrap()
      dispatch(loggedIn(result.token))
      onRegistered()
    } catch (error) {
      // Includes 409, an email address that already has an account.
      showRequestError(error)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && <FormAlert message={formError} />}

      <FormField id="register-name" label="Name" error={errors.name}>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          className="form-field__control"
          value={values.name}
          onChange={handleChange}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? 'register-name-error' : undefined}
        />
      </FormField>

      <FormField
        id="register-email"
        label="Email address"
        error={errors.email}
      >
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          className="form-field__control"
          value={values.email}
          onChange={handleChange}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
        />
      </FormField>

      <FormField
        id="register-password"
        label="Password"
        error={errors.password}
      >
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="form-field__control"
          value={values.password}
          onChange={handleChange}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={
            errors.password
              ? 'register-password-error register-password-hint'
              : 'register-password-hint'
          }
        />
        <p id="register-password-hint" className="auth-form__hint">
          At least {PASSWORD_MIN_LENGTH} characters.
        </p>
      </FormField>

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}

export default RegisterForm
