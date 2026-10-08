import type { Ticket } from '../types'
import TicketCard from './TicketCard'
import './Column.css'

interface ColumnProps {
  // The column heading, such as "In progress".
  label: string
  // Only the tickets that belong in this column.
  tickets: Ticket[]
  onMove: (ticketId: number) => void
  // Whether a ticket's move is still being saved.
  isMoving: (ticket: Ticket) => boolean
}

function Column({ label, tickets, onMove, isMoving }: ColumnProps) {
  return (
    <section className="column">
      <header className="column__header">
        <h2 className="column__title">{label}</h2>
        {/* Only the number shows; the hidden word means a screen reader
            says "3 tickets" rather than a bare "3". */}
        <span className="column__count">
          {tickets.length}
          <span className="visually-hidden">
            {tickets.length === 1 ? ' ticket' : ' tickets'}
          </span>
        </span>
      </header>
      {tickets.length > 0 ? (
        <ul className="column__list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard
                ticket={ticket}
                onMove={onMove}
                isMoving={isMoving(ticket)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="column__empty">No tickets</p>
      )}
    </section>
  )
}

export default Column
