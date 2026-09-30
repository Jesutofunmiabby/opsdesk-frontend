import { NavLink } from 'react-router-dom'
import './NavBar.css'

// One entry in the navigation: where it goes and what it says.
export interface NavItem {
  to: string
  label: string
}

interface NavBarProps {
  links: NavItem[]
}

// NavLink knows the current URL, so it marks its own link as the current page
// (and sets aria-current="page") without any state of ours. A link stays
// current on the pages beneath it too: Tickets is highlighted on /tickets/4.
function NavBar({ links }: NavBarProps) {
  return (
    <nav className="nav-bar" aria-label="Main">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? 'nav-bar__link nav-bar__link--current' : 'nav-bar__link'
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default NavBar
