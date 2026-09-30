import type { TicketStatus } from '../types'

// The four board columns, in the order a ticket moves through them.
export const STATUS_ORDER: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]

// Column headings. The stored values are uppercase keys, not display text.
// Record<TicketStatus, string> means every status must have a label here.
export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

// Every new ticket starts here.
export const FIRST_STATUS: TicketStatus = 'OPEN'

// A ticket here has nowhere further to go, so it gets no "Move to next".
export const LAST_STATUS: TicketStatus = 'CLOSED'

// A dropdown or saved data hands back plain values. This checks that a value
// is one of the four statuses; where it returns true, TypeScript treats it as
// a TicketStatus from then on.
export function isTicketStatus(value: unknown): value is TicketStatus {
  return STATUS_ORDER.some((status) => status === value)
}
