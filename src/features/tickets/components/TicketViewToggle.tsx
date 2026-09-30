import type { TicketView } from '../types'
import './TicketViewToggle.css'

interface TicketViewToggleProps {
  view: TicketView
  onViewChange: (view: TicketView) => void
}

const VIEWS: { value: TicketView; label: string }[] = [
  { value: 'board', label: 'Board' },
  { value: 'list', label: 'List' },
]

// Two joined buttons; the pressed one is the view showing. aria-pressed tells
// screen readers which one that is.
function TicketViewToggle({ view, onViewChange }: TicketViewToggleProps) {
  return (
    <div className="ticket-view-toggle" role="group" aria-label="View">
      {VIEWS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="ticket-view-toggle__button"
          aria-pressed={view === option.value}
          onClick={() => onViewChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default TicketViewToggle
