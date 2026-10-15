import { Link } from 'react-router-dom'
import './EmptyState.css'

// The one thing someone can do from an empty screen: press a button (such as
// "Clear filters") or follow a link (such as "New ticket").
export type EmptyStateAction =
  | { label: string; onClick: () => void }
  | { label: string; to: string }

interface EmptyStateProps {
  // What is missing, such as "No tickets match your filters."
  title: string
  // An optional line on why, or what to do next.
  text?: string
  action?: EmptyStateAction
}

// Shown where a list would be when it has nothing in it, so an empty screen
// explains itself instead of looking broken.
function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {text && <p className="empty-state__text">{text}</p>}
      {action &&
        ('to' in action ? (
          <Link to={action.to} className="empty-state__action">
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            className="empty-state__action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
    </div>
  )
}

export default EmptyState
