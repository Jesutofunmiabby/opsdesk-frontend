import './Pagination.css'

interface PaginationProps {
  // The page showing, counting from 0 as the API does. People count from 1,
  // so it is shown as page + 1.
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Previous and Next buttons with "Page X of Y" between them. A button that
// has nowhere to go is disabled.
function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Ticket pages">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 0}
      >
        Previous
      </button>
      {/* aria-live reads the new page number out after a click. */}
      <span className="pagination__status" aria-live="polite">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
