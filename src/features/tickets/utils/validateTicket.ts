import type { TicketFormErrors, TicketFormValues } from '../types'

// The limits in API_CONTRACT.md. The form and the mock API both check them
// here, so they cannot disagree with each other or with the contract.
export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 5000

// Checks the ticket form's values. Returns an object with a message for each
// field that has a problem, and no key for fields that are fine, so an empty
// object means the ticket can be saved. Keys follow the order of the fields
// on the form, so the first key is the first problem on screen.
// Spaces at either end are ignored: "  " is not a title.
export function validateTicket(values: TicketFormValues): TicketFormErrors {
  const errors: TicketFormErrors = {}
  const title = values.title.trim()
  const description = values.description.trim()

  if (title === '') {
    errors.title = 'Enter a title.'
  } else if (title.length < TITLE_MIN_LENGTH) {
    errors.title = `The title must be at least ${TITLE_MIN_LENGTH} characters.`
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `The title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }

  if (description === '') {
    errors.description = 'Enter a description.'
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `The description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }

  return errors
}
