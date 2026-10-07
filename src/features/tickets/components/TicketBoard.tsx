import { useState } from 'react'
import { STATUS_ORDER, STATUS_LABELS } from '../data/ticketStatuses'
import { getNextStatus } from '../utils/tickets'
import type { Ticket, TicketStatus } from '../types'
import { useUpdateTicketMutation } from '../../../store/ticketsApi'
import { useAppDispatch } from '../../../store/hooks'
import { addNotification } from '../../../store/uiSlice'
import Column from './Column'
import './TicketBoard.css'

interface TicketBoardProps {
  tickets: Ticket[]
}

// One column per status, in the order a ticket moves through them.
function TicketBoard({ tickets }: TicketBoardProps) {
  const [updateTicket] = useUpdateTicketMutation()
  const dispatch = useAppDispatch()

  // The status each ticket was in when its move started. A ticket counts as
  // moving until the refreshed list shows it in another status, so its button
  // cannot be pressed twice for one move. Local state: only the board uses it.
  const [movesFrom, setMovesFrom] = useState<
    Partial<Record<number, TicketStatus>>
  >({})

  function isMoving(ticket: Ticket) {
    return movesFrom[ticket.id] === ticket.status
  }

  // Sends only the new status. The mutation invalidates this ticket's tag,
  // so RTK Query fetches the list again and the card moves column by itself.
  async function handleMove(ticketId: number) {
    const ticket = tickets.find((item) => item.id === ticketId)
    const nextStatus = ticket ? getNextStatus(ticket.status) : null
    if (!ticket || nextStatus === null) {
      return
    }
    setMovesFrom((current) => ({ ...current, [ticket.id]: ticket.status }))
    try {
      // unwrap() turns a failed request into an error that catch receives.
      await updateTicket({
        id: ticket.id,
        changes: { status: nextStatus },
      }).unwrap()
    } catch {
      setMovesFrom((current) => {
        const next = { ...current }
        delete next[ticket.id]
        return next
      })
      dispatch(
        addNotification({
          message: `Could not move ticket #${ticket.id}. Please try again.`,
          type: 'error',
        }),
      )
    }
  }

  return (
    <div className="ticket-board">
      {STATUS_ORDER.map((status) => (
        <Column
          key={status}
          label={STATUS_LABELS[status]}
          tickets={tickets.filter((ticket) => ticket.status === status)}
          onMove={handleMove}
          isMoving={isMoving}
        />
      ))}
    </div>
  )
}

export default TicketBoard
