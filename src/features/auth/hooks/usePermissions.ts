import type { User } from '../../users/types'
import {
  canAssignTickets,
  canDeleteTickets,
  canListUsers,
} from '../utils/permissions'
import { useCurrentUser } from './useCurrentUser'

export interface Permissions {
  // The signed-in user, or undefined while GET /auth/me is loading.
  user: User | undefined
  canDeleteTickets: boolean
  canAssignTickets: boolean
  canListUsers: boolean
}

// What the signed-in user's role lets them do, for showing or hiding
// buttons and links. Everything is false until their role is known, so a
// button never flashes up and then disappears.
//
// This is a convenience, not security: the backend checks every request.
export function usePermissions(): Permissions {
  const { data: user } = useCurrentUser()
  const role = user?.role
  return {
    user,
    canDeleteTickets: role !== undefined && canDeleteTickets(role),
    canAssignTickets: role !== undefined && canAssignTickets(role),
    canListUsers: role !== undefined && canListUsers(role),
  }
}
