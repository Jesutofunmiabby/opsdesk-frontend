import type { UserRole } from '../types'

// How each role is named on screen: on user cards, and next to the
// signed-in user's name in the header.
export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  USER: 'User',
}
