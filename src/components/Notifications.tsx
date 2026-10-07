import { useAppSelector } from '../store/hooks'
import { selectNotifications } from '../store/uiSlice'
import NotificationItem from './NotificationItem'
import './Notifications.css'

// The stack of notifications in the bottom-right corner. Any component can
// add one by dispatching addNotification; this is the one place they show.
function Notifications() {
  const notifications = useAppSelector(selectNotifications)

  // Always on the page, even when empty: screen readers only announce changes
  // to a live region that was already there before the change.
  return (
    <div className="notifications" aria-live="polite">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default Notifications
