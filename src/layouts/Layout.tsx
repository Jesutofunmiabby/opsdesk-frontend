import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import LoadingMessage from '../components/LoadingMessage'
import Notifications from '../components/Notifications'
import Sidebar from '../components/Sidebar'
import SkipLink from '../components/SkipLink'
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

// The main area's id, so the skip link can jump to it.
const MAIN_ID = 'main-content'

// The frame every page shares: the blue header with the sidebar button, the
// sidebar with the navigation, the content area, and the notifications in
// the corner. Outlet is where the router draws the page for the current URL.
function Layout() {
  return (
    <div className="layout">
      <SkipLink targetId={MAIN_ID} />

      <header className="layout__header">
        <SidebarToggle />
        <h1 className="layout__title">OpsDesk</h1>
      </header>

      <div className="layout__body">
        <Sidebar links={NAV_LINKS} />
        {/* tabIndex={-1} lets the skip link move focus here, without adding
            the main area itself to the Tab order. */}
        <main id={MAIN_ID} className="layout__content" tabIndex={-1}>
          {/* Shown in place of a lazy-loaded page while its code downloads.
              Inside main, so the header and sidebar stay on screen. */}
          <Suspense fallback={<LoadingMessage text="Loading page…" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <Notifications />
    </div>
  )
}

export default Layout
