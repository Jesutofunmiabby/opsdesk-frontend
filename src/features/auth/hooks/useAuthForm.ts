import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { getApiErrorBody } from '../../../store/apiTypes'
import type { FieldErrors } from '../types'

// Shown when a request fails without the contract's error body, which means
// it never got an answer from the API.
const NO_ANSWER_MESSAGE =
  'Could not reach OpsDesk. Check your connection and try again.'

// The state the login and register forms share: what is in each box, the
// message for each box, and a message for the whole form (such as a wrong
// password). Values is the form's fields, all text.
export function useAuthForm<Values extends { [Key in keyof Values]: string }>(
  initialValues: Values,
  validate: (values: Values) => FieldErrors<Values>,
) {
  const [values, setValues] = useState<Values>(initialValues)
  // The form's own messages only show once someone has tried to submit.
  const [triedToSubmit, setTriedToSubmit] = useState(false)
  // Messages the API sent back for particular fields.
  const [serverErrors, setServerErrors] = useState<FieldErrors<Values>>({})
  const [formError, setFormError] = useState<string | null>(null)

  // The form's own checks first; the API's message for a field shows until
  // that field is changed.
  const errors: FieldErrors<Values> = {
    ...(triedToSubmit ? validate(values) : {}),
    ...serverErrors,
  }

  function isField(name: string): name is Extract<keyof Values, string> {
    return Object.hasOwn(initialValues, name)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    if (!isField(name)) {
      return
    }
    setValues((current) => ({ ...current, [name]: value }))
    // Removed rather than set to undefined, which would hide the form's
    // own message for the field when the two are merged above.
    setServerErrors((current) => {
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  // Called when the form is submitted. Clears the last attempt's messages
  // and checks the values. If something is wrong, moves the cursor to the
  // first field to fix and returns false, so nothing is sent.
  function checkBeforeSending(form: HTMLFormElement): boolean {
    setTriedToSubmit(true)
    setServerErrors({})
    setFormError(null)
    const firstProblem = Object.keys(validate(values))[0]
    if (firstProblem) {
      const field = form.elements.namedItem(firstProblem)
      if (field instanceof HTMLElement) {
        field.focus()
      }
      return false
    }
    return true
  }

  // Shows what the API said was wrong: a message under each field it named,
  // and its overall message when it named no field we show.
  function showRequestError(error: unknown) {
    const body = getApiErrorBody(error)
    if (!body) {
      setFormError(NO_ANSWER_MESSAGE)
      return
    }
    const fieldErrors: FieldErrors<Values> = {}
    for (const [name, message] of Object.entries(body.fields ?? {})) {
      if (isField(name)) {
        fieldErrors[name] = message
      }
    }
    setServerErrors(fieldErrors)
    if (Object.keys(fieldErrors).length === 0) {
      setFormError(body.message)
    }
  }

  return {
    values,
    errors,
    formError,
    handleChange,
    checkBeforeSending,
    showRequestError,
  }
}
