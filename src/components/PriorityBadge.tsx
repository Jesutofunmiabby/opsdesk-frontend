import type { Priority } from '../features/tickets/types'
import './PriorityBadge.css'

interface PriorityBadgeProps {
  priority: Priority
}

// A ticket's priority as a colour-coded pill: blue for LOW, amber for MEDIUM,
// red for HIGH.
function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`priority-badge priority-badge--${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  )
}

export default PriorityBadge
