import type { User } from '../users/types'

// What POST /auth/login is sent (see "Log in" in API_CONTRACT.md).
export interface LoginValues {
  email: string
  password: string
}

// What POST /auth/register is sent (see "Register" in API_CONTRACT.md).
export interface RegisterValues {
  name: string
  email: string
  password: string
}

// What a successful login or register sends back: the token to send on every
// later request, when it stops working, and who it belongs to.
export interface AuthResponse {
  token: string
  // An ISO 8601 time in UTC.
  expiresAt: string
  user: User
}

// One message per field with a problem, keyed by the field's name.
export type FieldErrors<Values> = Partial<Record<keyof Values, string>>
