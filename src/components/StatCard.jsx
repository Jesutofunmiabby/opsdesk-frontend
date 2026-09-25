import './StatCard.css'

// One summary figure. state is 'ready' | 'loading' | 'error', so a card whose
// number comes from a request can show what is happening in place of a value.
function StatCard({ label, value, state = 'ready', onRetry }) {
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
