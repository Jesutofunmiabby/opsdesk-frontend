import { useState } from 'react'
import initialTickets from './data/tickets'
import { moveTicketToNextStatus } from './utils/tickets'
import TeamsPage from './pages/TeamsPage'
import TicketsPage from './pages/TicketsPage'
import UsersPage from './pages/UsersPage'
import './App.css'

function App() {
  // The tickets live here rather than in TicketsPage so they outlive that page
  // and can be counted elsewhere.
  const [tickets, setTickets] = useState(initialTickets)

  function moveTicket(ticketId) {
    setTickets((currentTickets) =>
      moveTicketToNextStatus(currentTickets, ticketId),
    )
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <h1 className="app__title">OpsDesk</h1>
        </div>
      </header>

      <main className="app__content">
        <TeamsPage />

        <div className="app__section">
          <TicketsPage tickets={tickets} onMove={moveTicket} />
        </div>

        <div className="app__section">
          <UsersPage />
        </div>
      </main>
    </div>
  )
}

export default App
