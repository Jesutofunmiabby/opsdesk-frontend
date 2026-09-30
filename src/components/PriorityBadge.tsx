import type { Priority } from '../types/ticket'
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
