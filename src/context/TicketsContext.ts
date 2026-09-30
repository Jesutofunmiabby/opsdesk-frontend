import { createContext } from 'react'
import type { Ticket, TicketFormValues } from '../features/tickets/types'

// Everything TicketsProvider shares: the tickets, and the actions that change
// them.
export interface TicketsContextValue {
  tickets: Ticket[]
  moveTicket: (ticketId: number) => void
  // Returns the new ticket's id.
  addTicket: (values: TicketFormValues) => number
  updateTicket: (ticketId: number, values: TicketFormValues) => void
}

// The shared ticket list and the actions that change it. Filled in by
// TicketsProvider; read with the useTickets hook. Null outside a provider, so
// the hook can say clearly when it has been used in the wrong place.
export const TicketsContext = createContext<TicketsContextValue | null>(null)
