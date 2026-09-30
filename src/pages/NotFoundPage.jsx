import { Link } from 'react-router-dom'
import './NotFoundPage.css'

// Shown for any URL that no route matches.
function NotFoundPage() {
  return (
    <section className="not-found-page">
      <h2 className="page-title">Page not found</h2>
      <p className="not-found-page__text">
        There is no page at this address. It may have moved, or the link may
        be mistyped.
      </p>
      <Link to="/dashboard" className="not-found-page__link">
        Back to the dashboard
      </Link>
    </section>
  )
}

export default NotFoundPage
