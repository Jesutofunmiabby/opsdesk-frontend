import { Outlet } from 'react-router-dom'
import Notifications from '../components/Notifications'
import Sidebar from '../components/Sidebar'
import SidebarToggle from '../components/SidebarToggle'
import type { NavItem } from '../components/NavBar'
import './Layout.css'

// The navigation, and the order it appears in. Each path matches a route in
// routes/AppRoutes.
const NAV_LINKS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/projects', label: 'Projects' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
]

// The frame every page shares: the blue header with the sidebar button, the
// sidebar with the navigation, the content area, and the notifications in
// the corner. Outlet is where the router draws the page for the current URL.
function Layout() {
  return (
    <div className="layout">
      <header className="layout__header">
        <SidebarToggle />
        <h1 className="layout__title">OpsDesk</h1>
      </header>

      <div className="layout__body">
        <Sidebar links={NAV_LINKS} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>

      <Notifications />
    </div>
  )
}

export default Layout
