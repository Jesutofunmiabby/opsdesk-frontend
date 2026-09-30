import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PRIORITY_OPTIONS, isPriority } from '../features/tickets/data/ticketPriorities'
import { validateTicket } from '../features/tickets/utils/validateTicket'
import type {
  TicketFormErrors,
  TicketFormField,
  TicketFormValues,
} from '../features/tickets/types'
import FormField from './FormField'
import './TicketForm.css'

interface TicketFormProps {
  // What the boxes start with: empty for a new ticket, the ticket's current
  // values when editing.
  initialValues: TicketFormValues
  // Called with the checked, tidied values when the form is saved.
  onSubmit: (values: TicketFormValues) => void
  // The save button's text, such as "Create ticket".
  submitLabel: string
  // Where Cancel goes.
  cancelTo: string
}

// One form for both creating and editing a ticket. The page using it decides
// what goes in (initialValues), what happens on save (onSubmit) and where
// Cancel goes (cancelTo). The form itself only collects and checks the values.
function TicketForm({
  initialValues,
  onSubmit,
  submitLabel,
  cancelTo,
}: TicketFormProps) {
  // Controlled inputs: React state holds what is in each box, and each box
  // shows that state. Typing calls a change handler, which updates the state.
  const [values, setValues] = useState<TicketFormValues>(initialValues)

  // Errors only show once someone has tried to save, not while they are
  // still filling in an empty form for the first time.
  const [triedToSubmit, setTriedToSubmit] = useState(false)

  // Worked out from the current values on every render rather than stored, so
  // once shown, each message disappears as soon as its field is fixed.
  const errors: TicketFormErrors = triedToSubmit ? validateTicket(values) : {}

  // For the title and description boxes, which accept any text.
  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    if (name === 'title' || name === 'description') {
      setValues((currentValues) => ({ ...currentValues, [name]: value }))
    }
  }

  // For the priority dropdown, which must hold a Priority, not any text.
  function handlePriorityChange(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target
    if (isPriority(value)) {
      setValues((currentValues) => ({ ...currentValues, priority: value }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Stop the browser's own form submit, which would reload the page.
    event.preventDefault()
    setTriedToSubmit(true)

    const submitErrors = validateTicket(values)
    const firstProblem = Object.keys(submitErrors)[0]
    if (firstProblem) {
      // Nothing is saved. Move the cursor to the first field to fix.
      const field = event.currentTarget.elements.namedItem(firstProblem)
      if (field instanceof HTMLElement) {
        field.focus()
      }
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
    })
  }

  // The attributes every control shares: its name and value, and whether to
  // mark it (and link its message) as a problem. Each control adds its own
  // change handler.
  function fieldProps(name: TicketFormField) {
    return {
      id: `ticket-${name}`,
      name,
      value: values[name],
      className: 'form-field__control',
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `ticket-${name}-error` : undefined,
    }
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <FormField id="ticket-title" label="Title" error={errors.title}>
        <input
          type="text"
          autoComplete="off"
          onChange={handleTextChange}
          {...fieldProps('title')}
        />
      </FormField>

      <FormField
        id="ticket-description"
        label="Description"
        error={errors.description}
      >
        <textarea
          rows={5}
          onChange={handleTextChange}
          {...fieldProps('description')}
        />
      </FormField>

      <FormField id="ticket-priority" label="Priority">
        <select onChange={handlePriorityChange} {...fieldProps('priority')}>
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
