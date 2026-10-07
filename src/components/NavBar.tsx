import { NavLink } from 'react-router-dom'
import './NavBar.css'

// One entry in the navigation: where it goes and what it says.
export interface NavItem {
  to: string
  label: string
}

interface NavBarProps {
  links: NavItem[]
  // Narrow mode: only each link's first letter shows.
  collapsed: boolean
}

// NavLink knows the current URL, so it marks its own link as the current page
// (and sets aria-current="page") without any state of ours. A link stays
// current on the pages beneath it too: Tickets is highlighted on /tickets/4.
function NavBar({ links, collapsed }: NavBarProps) {
  return (
    <nav className="nav-bar" aria-label="Main">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          // The tooltip names the page when only its letter is showing.
          title={collapsed ? link.label : undefined}
          className={({ isActive }) =>
            isActive ? 'nav-bar__link nav-bar__link--current' : 'nav-bar__link'
          }
        >
          {/* The letter is decoration; the label is the link's name. */}
          <span className="nav-bar__letter" aria-hidden="true">
            {link.label.charAt(0)}
          </span>
          {/* Collapsed, the label is hidden on screen but still read out, so
              the link keeps its full name. */}
          <span className={collapsed ? 'visually-hidden' : 'nav-bar__label'}>
            {link.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
