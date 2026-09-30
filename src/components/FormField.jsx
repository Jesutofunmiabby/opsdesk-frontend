import './FormField.css'

// A label, the control passed in as children, and the error message for it
// directly underneath. The control itself should point at the message with
// aria-describedby={`${id}-error`}, so a screen reader reads it out too.
function FormField({ id, label, error, children }) {
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
