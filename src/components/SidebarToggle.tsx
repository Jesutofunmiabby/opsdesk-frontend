import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectSidebarCollapsed, toggleSidebar } from '../store/uiSlice'
import { SIDEBAR_ID } from './Sidebar'
import './SidebarToggle.css'

// The menu button in the header. It sits far from the sidebar in the page,
// which is why the collapsed setting lives in the Redux store: both read it
// from there instead of passing it through Layout.
function SidebarToggle() {
  const collapsed = useAppSelector(selectSidebarCollapsed)
  const dispatch = useAppDispatch()

  return (
    <button
      type="button"
      className="sidebar-toggle"
      // The label says what pressing it will do. aria-controls links the
      // button to the sidebar it changes.
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-controls={SIDEBAR_ID}
      onClick={() => dispatch(toggleSidebar())}
    >
      {/* Three lines, the usual menu icon. Hidden from screen readers, which
          read the label instead. */}
      <svg
        className="sidebar-toggle__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>
  )
}

export default SidebarToggle
