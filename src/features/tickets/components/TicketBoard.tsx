import { STATUS_ORDER, STATUS_LABELS } from '../data/ticketStatuses'
import { useTickets } from '../hooks/useTickets'
import Column from './Column'
import './TicketBoard.css'

// One column per status, in the order a ticket moves through them. The
// tickets are shared through TicketsProvider, so the board survives switching
// pages and the dashboard counts the same array.
function TicketBoard() {
  const { tickets, moveTicket } = useTickets()

  return (
    <div className="ticket-board">
      {STATUS_ORDER.map((status) => (
        <Column
          key={status}
          label={STATUS_LABELS[status]}
          tickets={tickets.filter((ticket) => ticket.status === status)}
          onMove={moveTicket}
        />
      ))}
    </div>
  )
}

export default TicketBoard
