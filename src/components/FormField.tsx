import type { ReactNode } from 'react'
import './FormField.css'

interface FormFieldProps {
  // The id of the control inside, so the label can point at it.
  id: string
  label: string
  // The message to show under the control, if it has a problem.
  error?: string
  // The control itself: an input, textarea or select.
  children: ReactNode
}

// A label, the control passed in as children, and the error message for it
// directly underneath. The control itself should point at the message with
// aria-describedby={`${id}-error`}, so a screen reader reads it out too.
function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
