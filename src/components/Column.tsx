import type { Ticket } from '../features/tickets/types'
import TicketCard from './TicketCard'
import './Column.css'

interface ColumnProps {
  // The column heading, such as "In progress".
  label: string
  // Only the tickets that belong in this column.
  tickets: Ticket[]
  onMove: (ticketId: number) => void
}

function Column({ label, tickets, onMove }: ColumnProps) {
  return (
    <section className="column">
      <header className="column__header">
        <h2 className="column__title">{label}</h2>
        <span className="column__count">{tickets.length}</span>
      </header>
      {tickets.length > 0 ? (
        <ul className="column__list">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} onMove={onMove} />
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
