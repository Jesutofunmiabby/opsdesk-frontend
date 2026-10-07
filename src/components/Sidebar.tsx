import { useAppSelector } from '../store/hooks'
import { selectSidebarCollapsed } from '../store/uiSlice'
import NavBar from './NavBar'
import type { NavItem } from './NavBar'
import './Sidebar.css'

// The sidebar's id, so the toggle button can say which element it controls.
export const SIDEBAR_ID = 'sidebar'

interface SidebarProps {
  links: NavItem[]
}

// The navigation down the left of every page. Collapsed, it is a narrow bar
// showing each link's first letter; the full names are still there for
// screen readers.
function Sidebar({ links }: SidebarProps) {
  const collapsed = useAppSelector(selectSidebarCollapsed)

  return (
    <aside
      id={SIDEBAR_ID}
      className={collapsed ? 'sidebar sidebar--collapsed' : 'sidebar'}
    >
      <div className="sidebar__panel">
        <NavBar links={links} collapsed={collapsed} />
      </div>
    </aside>
  )
}

export default Sidebar
