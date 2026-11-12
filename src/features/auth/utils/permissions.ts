import type { Ticket } from '../../tickets/types'
import type { User, UserRole } from '../../users/types'

// "Who can do what" from API_CONTRACT.md, in one place. The app uses these
// only to decide which buttons and links to show, for convenience: the
// backend checks every request itself, whatever the app shows. The mock API
// uses the same rules, so the tests see what the backend would do.

export function canDeleteTickets(role: UserRole): boolean {
  return role === 'ADMIN'
}

export function canAssignTickets(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MANAGER'
}

export function canListUsers(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MANAGER'
}

// A USER only sees the tickets they created; everyone else sees them all.
export function canSeeTicket(user: User, ticket: Ticket): boolean {
  return user.role !== 'USER' || ticket.createdById === user.id
}

// ADMIN and MANAGER any ticket; AGENT only tickets assigned to them; USER
// only their own, while it is still OPEN.
export function canEditTicket(user: User, ticket: Ticket): boolean {
  switch (user.role) {
    case 'ADMIN':
    case 'MANAGER':
      return true
    case 'AGENT':
      return ticket.assigneeId === user.id
    case 'USER':
      return ticket.createdById === user.id && ticket.status === 'OPEN'
  }
}

// Who a ticket can be assigned to: anyone but a USER.
export function canBeAssigned(role: UserRole): boolean {
  return role !== 'USER'
}
