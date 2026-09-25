import TicketCard from './TicketCard'
import './Column.css'

function Column({ label, tickets, onMove }) {
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
