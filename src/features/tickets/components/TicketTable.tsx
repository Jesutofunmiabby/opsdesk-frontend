import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '../data/ticketStatuses'
import type { Ticket } from '../types'
import PriorityBadge from './PriorityBadge'
import './TicketTable.css'

interface TicketTableProps {
  tickets: Ticket[]
}

// One row per ticket. The title links to the ticket's page.
function TicketTable({ tickets }: TicketTableProps) {
  return (
    // Scrolls sideways on its own on a narrow screen, so the page does not.
    <div className="ticket-table__scroll">
      <table className="ticket-table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="ticket-table__id">#{ticket.id}</td>
              <td>
                <Link
                  to={`/tickets/${ticket.id}`}
                  className="ticket-table__link"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className="ticket-table__status">
                {STATUS_LABELS[ticket.status]}
              </td>
              <td>
                <PriorityBadge priority={ticket.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TicketTable
