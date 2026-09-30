// The shapes of ticket data, described once and used everywhere.

// Where a ticket is on the board. Only these four words are allowed.
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

// How urgent a ticket is. Only these three words are allowed.
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

// One IT support ticket.
export interface Ticket {
  id: number
  title: string
  description: string
  priority: Priority
  status: TicketStatus
}

// The parts of a ticket someone fills in on the create and edit forms. The id
// and status are set by the app, so they are not part of the form.
export type TicketFormValues = Pick<Ticket, 'title' | 'description' | 'priority'>

// The name of one field on the ticket form: 'title', 'description' or
// 'priority'.
export type TicketFormField = keyof TicketFormValues

// A message for each form field that has a problem. Partial means every field
// is optional: a field with no problem has no entry, so {} means all is well.
export type TicketFormErrors = Partial<Record<TicketFormField, string>>

// How the tickets page shows the tickets: as board columns or as a list.
export type TicketView = 'board' | 'list'
