import { useNavigate } from 'react-router-dom'
import { ROLE_LABELS } from '../../users/data/roleLabels'
import { loggedOut } from '../../../store/authSlice'
import { useAppDispatch } from '../../../store/hooks'
import { useCurrentUser } from '../hooks/useCurrentUser'
import './UserMenu.css'

// The right of the header: who is signed in, their role, and Log out.
// Logging out only ends this browser's session; nothing is deleted, so it
// needs no confirmation.
function UserMenu() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()

  function handleLogout() {
    // Clears the token from the store and localStorage, and empties the
    // cached tickets and user (see makeStore).
    dispatch(loggedOut())
    navigate('/login', { replace: true })
  }

  return (
    <div className="user-menu">
      {user && (
        <p className="user-menu__who">
          <span className="user-menu__name">{user.name}</span>
          <span className="user-menu__role">{ROLE_LABELS[user.role]}</span>
        </p>
      )}
      <button
        type="button"
        className="user-menu__logout"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  )
}

export default UserMenu
