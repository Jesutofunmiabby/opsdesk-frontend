import { useState } from 'react'
import initialTickets from '../data/tickets'
import { moveTicketToNextStatus } from '../utils/tickets'
import { TicketsContext } from './TicketsContext'

// Owns the tickets for the whole app. The dashboard, the board and the ticket
// detail page all read the same array from here, so a move on the board shows
// up everywhere, and nothing has to be passed down through the routes.
function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState(initialTickets)

  function moveTicket(ticketId) {
    setTickets((currentTickets) =>
      moveTicketToNextStatus(currentTickets, ticketId),
    )
  }

  return (
    <TicketsContext.Provider value={{ tickets, moveTicket }}>
      {children}
    </TicketsContext.Provider>
  )
}

export default TicketsProvider
