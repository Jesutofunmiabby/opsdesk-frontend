import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRIORITY_OPTIONS } from '../data/ticketPriorities'
import { validateTicket } from '../utils/validateTicket'
import FormField from './FormField'
import './TicketForm.css'

// One form for both creating and editing a ticket. The page using it decides
// what goes in (initialValues), what happens on save (onSubmit) and where
// Cancel goes (cancelTo). The form itself only collects and checks the values.
function TicketForm({ initialValues, onSubmit, submitLabel, cancelTo }) {
  // Controlled inputs: React state holds what is in each box, and each box
  // shows that state. Typing calls handleChange, which updates the state.
  const [values, setValues] = useState(initialValues)

  // Errors only show once someone has tried to save, not while they are
  // still filling in an empty form for the first time.
  const [triedToSubmit, setTriedToSubmit] = useState(false)

  // Worked out from the current values on every render rather than stored, so
  // once shown, each message disappears as soon as its field is fixed.
  const errors = triedToSubmit ? validateTicket(values) : {}

  function handleChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  function handleSubmit(event) {
    // Stop the browser's own form submit, which would reload the page.
    event.preventDefault()
    setTriedToSubmit(true)

    const submitErrors = validateTicket(values)
    const firstProblem = Object.keys(submitErrors)[0]
    if (firstProblem) {
      // Nothing is saved. Move the cursor to the first field to fix.
      event.currentTarget.elements[firstProblem].focus()
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
    })
  }

  // The attributes every control shares: its name and value, the change
  // handler, and whether to mark it (and link its message) as a problem.
  function fieldProps(name) {
    return {
      id: `ticket-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      className: 'form-field__control',
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `ticket-${name}-error` : undefined,
    }
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <FormField id="ticket-title" label="Title" error={errors.title}>
        <input type="text" autoComplete="off" {...fieldProps('title')} />
      </FormField>

      <FormField
        id="ticket-description"
        label="Description"
        error={errors.description}
      >
        <textarea rows={5} {...fieldProps('description')} />
      </FormField>

      <FormField id="ticket-priority" label="Priority">
        <select {...fieldProps('priority')}>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className="ticket-form__actions">
        <button type="submit" className="ticket-form__submit">
          {submitLabel}
        </button>
        <Link to={cancelTo} className="ticket-form__cancel">
          Cancel
        </Link>
      </div>
    </form>
  )
}

export default TicketForm
