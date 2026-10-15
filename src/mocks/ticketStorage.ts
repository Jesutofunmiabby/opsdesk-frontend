import { isTicketStatus } from '../features/tickets/data/ticketStatuses'
import { isPriority } from '../features/tickets/data/ticketPriorities'
import { getNextTicketId } from '../features/tickets/utils/tickets'
import type { Ticket } from '../features/tickets/types'

// Where the tickets are kept in the browser's localStorage.
const STORAGE_KEY = 'opsdesk.tickets'

// Checks every field of one saved ticket, since anything could be in storage:
// an older format (such as tickets saved before they had dates), a
// half-written value, or something edited by hand.
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
    isTicketStatus(value.status) &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    'updatedAt' in value &&
    typeof value.updatedAt === 'string'
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

// What the mock API saves: the tickets, and the id the next new ticket will
// get. The next id is kept rather than worked out from the tickets, so it
// only ever goes up: deleting the newest ticket does not free its id.
export interface TicketDb {
  tickets: Ticket[]
  nextId: number
}

// A saved TicketDb whose next id is a whole number above every ticket's id,
// so it can never hand out an id that is in use.
function isTicketDb(value: unknown): value is TicketDb {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('tickets' in value) ||
    !isTicketList(value.tickets) ||
    !('nextId' in value) ||
    typeof value.nextId !== 'number' ||
    !Number.isInteger(value.nextId)
  ) {
    return false
  }
  const nextId = value.nextId
  return value.tickets.every((ticket) => ticket.id < nextId)
}

// The saved tickets and next id, or a fresh start from fallback when nothing
// is saved, the saved data is broken or in an older format, or storage
// cannot be read (it can be blocked, for example in some private browsing
// modes).
export function loadTicketDb(fallback: Ticket[]): TicketDb {
  const fresh: TicketDb = {
    tickets: fallback,
    nextId: getNextTicketId(fallback),
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      return fresh
    }
    // JSON.parse is typed as any; unknown means it must pass the check.
    const parsed: unknown = JSON.parse(saved)
    return isTicketDb(parsed) ? parsed : fresh
  } catch {
    return fresh
  }
}

// Saves the tickets and next id. If storage is full or blocked the app keeps
// working; the changes just will not survive a refresh.
export function saveTicketDb(db: TicketDb): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // Nothing else to do: the tickets are still in memory.
  }
}
