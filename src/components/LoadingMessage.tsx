import './LoadingMessage.css'

interface LoadingMessageProps {
  // What is loading, such as "Loading tickets…".
  text: string
}

// Shown while data is on its way. role="status" lets screen readers announce
// it without interrupting.
function LoadingMessage({ text }: LoadingMessageProps) {
  return (
    <p className="loading-message" role="status">
      {text}
    </p>
  )
}

export default LoadingMessage
