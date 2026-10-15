import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
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
  const { pathname } = useLocation()

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
          {/* If a page crashes, only the page is swapped for the error
              message; the header and sidebar keep working. Going to another
              page (a new pathname) clears the error. */}
          <ErrorBoundary resetKey={pathname}>
            {/* Shown in place of a lazy-loaded page while its code downloads.
                Inside main, so the header and sidebar stay on screen. */}
            <Suspense fallback={<LoadingMessage text="Loading page…" />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <Notifications />
    </div>
  )
}

export default Layout
