import './RequestError.css'

interface RequestErrorProps {
  // What could not be done, such as "Sorry, we could not load the tickets."
  message: string
  onRetry: () => void
}

// Shown in place of data that failed to load, with a button to try again.
// role="alert" makes screen readers announce it as soon as it appears.
function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div className="request-error" role="alert">
      <p className="request-error__message">{message}</p>
      <button type="button" className="request-error__retry" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default RequestError
