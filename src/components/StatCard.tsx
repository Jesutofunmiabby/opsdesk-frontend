import './StatCard.css'

// What the card is showing: its number, or what is happening instead.
export type StatCardState = 'ready' | 'loading' | 'error'

interface StatCardProps {
  label: string
  // Not needed while the number is still loading or has failed.
  value?: number
  // Defaults to 'ready'.
  state?: StatCardState
  // Shows a Retry button on the error state when given.
  onRetry?: () => void
}

// One summary figure. A card whose number comes from a request can show what
// is happening in place of a value.
function StatCard({
  label,
  value,
  state = 'ready',
  onRetry,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <span className="stat-card__label">{label}</span>

      {state === 'ready' && <span className="stat-card__value">{value}</span>}

      {state === 'loading' && (
        <span className="stat-card__pending">Loading…</span>
      )}

      {state === 'error' && (
        <span className="stat-card__pending">
          Could not load
          {onRetry && (
            <button
              type="button"
              className="stat-card__retry"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </span>
      )}
    </article>
  )
}

export default StatCard
