import './FormAlert.css'

interface FormAlertProps {
  message: string
  // 'error' for something that went wrong (red), 'info' for news such as
  // "Your session expired" (blue). Defaults to 'error'.
  tone?: 'error' | 'info'
}

// A message about a whole form rather than one field, shown above it.
// role="alert" makes screen readers announce it as soon as it appears.
function FormAlert({ message, tone = 'error' }: FormAlertProps) {
  return (
    <p className={`form-alert form-alert--${tone}`} role="alert">
      {message}
    </p>
  )
}

export default FormAlert
