import { useState } from 'react'
import type { ReactNode } from 'react'
import initialTickets from '../data/tickets'
import { FIRST_STATUS } from '../data/ticketStatuses'
import {
  getNextTicketId,
  moveTicketToNextStatus,
  updateTicketFields,
} from '../utils/tickets'
import { TicketsContext } from './TicketsContext'
import type { Ticket, TicketFormValues } from '../types'

interface TicketsProviderProps {
  // The part of the app that can use the tickets.
  children: ReactNode
}

// Owns the tickets for the whole app. The dashboard, the board and the ticket
// pages all read the same array from here, so a change made on one page shows
// up everywhere, and nothing has to be passed down through the routes.
function TicketsProvider({ children }: TicketsProviderProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  function moveTicket(ticketId: number) {
    setTickets((currentTickets) =>
      moveTicketToNextStatus(currentTickets, ticketId),
    )
  }

  // values is { title, description, priority } from the ticket form. Every new
  // ticket starts as OPEN. Returns the new id, so the caller can go to the
  // ticket's page.
  function addTicket(values: TicketFormValues): number {
    const newTicket: Ticket = {
      id: getNextTicketId(tickets),
      ...values,
      status: FIRST_STATUS,
    }
    setTickets((currentTickets) => [...currentTickets, newTicket])
    return newTicket.id
  }

  // Replaces the title, description and priority of one ticket.
  function updateTicket(ticketId: number, values: TicketFormValues) {
    setTickets((currentTickets) =>
      updateTicketFields(currentTickets, ticketId, values),
    )
  }

  return (
    <TicketsContext.Provider
      value={{ tickets, moveTicket, addTicket, updateTicket }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

export default TicketsProvider
