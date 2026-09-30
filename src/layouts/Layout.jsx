import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import './Layout.css'

// The navigation, and the order it appears in. Each path matches a route in
// App.
const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/projects', label: 'Projects' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
]

// The frame every page shares: the blue header with the navigation, and the
// content area. Outlet is where the router draws the page for the current URL.
function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <div className="layout__header-inner">
          <h1 className="layout__title">OpsDesk</h1>
          <NavBar links={NAV_LINKS} />
        </div>
      </header>

      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
