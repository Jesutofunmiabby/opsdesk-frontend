import './Pagination.css'

interface PaginationProps {
  // The page showing, counting from 1.
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
        disabled={page <= 1}
      >
        Previous
      </button>
      {/* aria-live reads the new page number out after a click. */}
      <span className="pagination__status" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
