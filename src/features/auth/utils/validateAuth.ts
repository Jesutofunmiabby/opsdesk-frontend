import type { FieldErrors, LoginValues, RegisterValues } from '../types'

// The limits and messages from "Auth" in API_CONTRACT.md. The forms check
// them before sending, and the mock API uses the same checks, so the form,
// the mock and the backend all give the same message.
export const NAME_MAX_LENGTH = 100
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 128

// Something, an @, something, a dot, something, with no spaces: enough to
// catch typing mistakes. The backend makes the final check.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email)
}

// Login only checks that both boxes are filled in: whether the details are
// right is the server's decision.
export function validateLogin(values: LoginValues): FieldErrors<LoginValues> {
  const errors: FieldErrors<LoginValues> = {}
  if (values.email.trim() === '') {
    errors.email = 'Enter your email address.'
  }
  if (values.password === '') {
    errors.password = 'Enter your password.'
  }
  return errors
}

// Names and emails are trimmed first; passwords never are, since a space can
// be part of one.
export function validateRegister(
  values: RegisterValues,
): FieldErrors<RegisterValues> {
  const errors: FieldErrors<RegisterValues> = {}
  const name = values.name.trim()
  if (name === '') {
    errors.name = 'Enter your name.'
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `The name must be ${NAME_MAX_LENGTH} characters or fewer.`
  }
  if (!isValidEmail(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `The password must be at least ${PASSWORD_MIN_LENGTH} characters.`
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `The password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`
  }
  return errors
}
