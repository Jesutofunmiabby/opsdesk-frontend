import type { TicketFormErrors, TicketFormValues } from '../types'

// The limits in API_CONTRACT.md. The form and the mock API both check them
// here, so they cannot disagree with each other or with the contract.
export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 5000

// What is wrong with a title, or undefined if nothing is. Spaces at either
// end are ignored: "  " is not a title.
export function titleError(value: string): string | undefined {
  const title = value.trim()
  if (title === '') {
    return 'Enter a title.'
  }
  if (title.length < TITLE_MIN_LENGTH) {
    return `The title must be at least ${TITLE_MIN_LENGTH} characters.`
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return `The title must be ${TITLE_MAX_LENGTH} characters or fewer.`
  }
  return undefined
}

// What is wrong with a description, or undefined if nothing is.
export function descriptionError(value: string): string | undefined {
  const description = value.trim()
  if (description === '') {
    return 'Enter a description.'
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return `The description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
  }
  return undefined
}

// Checks the ticket form's values. Returns an object with a message for each
// field that has a problem, and no key for fields that are fine, so an empty
// object means the ticket can be saved. Keys follow the order of the fields
// on the form, so the first key is the first problem on screen.
// Only the title and description have rules here: the priority comes from a
// dropdown, so the form cannot send a wrong one.
export function validateTicket(
  values: Pick<TicketFormValues, 'title' | 'description'>,
): TicketFormErrors {
  const errors: TicketFormErrors = {}
  const title = titleError(values.title)
  const description = descriptionError(values.description)
  if (title) {
    errors.title = title
  }
  if (description) {
    errors.description = description
  }
  return errors
}
