import './NavBar.css'

// Buttons rather than links: there is no routing yet, so these change state
// rather than navigate to a URL.
function NavBar({ pages, currentPage, onNavigate }) {
  return (
    <nav className="nav-bar" aria-label="Main">
      {pages.map((page) => (
        <button
          key={page.key}
          type="button"
          className={
            page.key === currentPage ? 'nav-bar__link nav-bar__link--current' : 'nav-bar__link'
          }
          aria-current={page.key === currentPage ? 'page' : undefined}
          onClick={() => onNavigate(page.key)}
        >
          {page.label}
        </button>
      ))}
    </nav>
  )
}

export default NavBar
