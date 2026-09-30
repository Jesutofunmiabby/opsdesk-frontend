import { STATUS_ORDER } from '../data/ticketStatuses'
import { isPriority } from '../data/ticketPriorities'
import type { Ticket, TicketStatus } from '../types'

// Where the tickets are kept in the browser's localStorage.
const STORAGE_KEY = 'opsdesk.tickets'

function isTicketStatus(value: unknown): value is TicketStatus {
  return STATUS_ORDER.some((status) => status === value)
}

// Checks every field of one saved ticket, since anything could be in storage:
// an older format, a half-written value, or something edited by hand.
function isTicket(value: unknown): value is Ticket {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    Number.isInteger(value.id) &&
    'title' in value &&
    typeof value.title === 'string' &&
    'description' in value &&
    typeof value.description === 'string' &&
    'priority' in value &&
    typeof value.priority === 'string' &&
    isPriority(value.priority) &&
    'status' in value &&
    isTicketStatus(value.status)
  )
}

// A list of valid tickets with no id used twice.
function isTicketList(value: unknown): value is Ticket[] {
  if (!Array.isArray(value)) {
    return false
  }
  // Array.isArray types the items as any; treat them as unknown so each one
  // has to pass isTicket.
  const items: unknown[] = value
  if (!items.every(isTicket)) {
    return false
  }
  const ids = new Set(items.map((ticket) => ticket.id))
  return ids.size === items.length
}

// The saved tickets, or fallback when nothing is saved, the saved data is
// broken, or storage cannot be read (it can be blocked, for example in some
// private browsing modes).
export function loadTickets(fallback: Ticket[]): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      return fallback
    }
    // JSON.parse is typed as any; unknown means it must pass the check.
    const parsed: unknown = JSON.parse(saved)
    return isTicketList(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

// Saves the tickets. If storage is full or blocked the app keeps working;
// the changes just will not survive a refresh.
export function saveTickets(tickets: Ticket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // Nothing else to do: the tickets are still in memory.
  }
}
