import { getApiErrorBody } from '../store/apiTypes'

// Shown for a 403. The contract's own message ("You are not allowed to do
// this.") is correct but curt; this one says what to do about it.
export const FORBIDDEN_MESSAGE =
  "You don't have permission to do that. Ask an admin if you need it."

// What to tell someone about a failed request, following the contract's
// error shape (see "Errors" in API_CONTRACT.md), or null when there is
// nothing to say.
//
// - 401: null. The session has ended and the app is already on its way to
//   the login page, which says so.
// - 403: a friendly explanation (FORBIDDEN_MESSAGE).
// - 500: the fallback. The server's message is generic and the fallback
//   says what failed.
// - Any other error with the contract's body: its message, which is written
//   for people ("There is no ticket with the id "99".").
// - No body at all (the server could not be reached): the fallback.
export function getRequestErrorMessage(
  error: unknown,
  fallback: string,
): string | null {
  const body = getApiErrorBody(error)
  if (!body) {
    return fallback
  }
  switch (body.error) {
    case 'UNAUTHENTICATED':
      return null
    case 'FORBIDDEN':
      return FORBIDDEN_MESSAGE
    case 'INTERNAL_ERROR':
      return fallback
    default:
      return body.message
  }
}

// The messages a 400 VALIDATION_ERROR gave for the fields a form shows, or
// null if it named none of them. Fields the form does not have (such as
// status, on the ticket form) are left for a toast instead. Field is the
// form's field names.
export function getFormFieldErrors<Field extends string>(
  error: unknown,
  formFields: readonly Field[],
): Partial<Record<Field, string>> | null {
  const body = getApiErrorBody(error)
  if (body?.error !== 'VALIDATION_ERROR' || !body.fields) {
    return null
  }
  const found: Partial<Record<Field, string>> = {}
  for (const field of formFields) {
    const message = body.fields[field]
    if (message) {
      found[field] = message
    }
  }
  return Object.keys(found).length > 0 ? found : null
}
