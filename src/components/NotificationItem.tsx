import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { dismissNotification } from '../store/uiSlice'
import type { Notification, NotificationType } from '../store/uiSlice'
import './NotificationItem.css'

// How long a notification stays before it removes itself.
const AUTO_DISMISS_MS = 5000

// What a screen reader says before the message, since the colour and icon
// cannot be seen. Record makes TypeScript insist on a label for every type.
const TYPE_LABELS: Record<NotificationType, string> = {
  success: 'Success:',
  error: 'Error:',
}

interface NotificationItemProps {
  notification: Notification
}

// One notification, with a dismiss button. It removes itself after a few
// seconds, but not while the mouse is over it or it has keyboard focus, so it
// cannot disappear while someone is reading it or about to press dismiss.
function NotificationItem({ notification }: NotificationItemProps) {
  const { id, message, type } = notification
  const dispatch = useAppDispatch()
  // Local state: only this notification cares whether it is paused.
  const [paused, setPaused] = useState(false)

  // Starts the timer, and starts it again from the beginning when the pause
  // ends. The cleanup cancels it if the notification is paused, dismissed by
  // hand, or removed.
  useEffect(() => {
    if (paused) {
      return
    }
    const timer = setTimeout(() => {
      dispatch(dismissNotification(id))
    }, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [paused, id, dispatch])

  return (
    <div
      className={`notification-item notification-item--${type}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="notification-item__icon" aria-hidden="true">
        {type === 'success' ? '✓' : '!'}
      </span>
      <p className="notification-item__message">
        <span className="visually-hidden">{TYPE_LABELS[type]} </span>
        {message}
      </p>
      <button
        type="button"
        className="notification-item__dismiss"
        // Names the notification, so with several showing it is clear which
        // one each button closes.
        aria-label={`Dismiss notification: ${message}`}
        onClick={() => dispatch(dismissNotification(id))}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  )
}

export default NotificationItem
