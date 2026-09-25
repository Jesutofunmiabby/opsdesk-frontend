import { useState } from 'react'
import initialTickets from './data/tickets'
import { moveTicketToNextStatus } from './utils/tickets'
import NavBar from './components/NavBar'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import TeamsPage from './pages/TeamsPage'
import UsersPage from './pages/UsersPage'
import './App.css'

// The navigation, and the order it appears in. Each key matches a page below.
const PAGES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'teams', label: 'Teams' },
  { key: 'users', label: 'Users' },
]

function App() {
  // Which page is showing. No router this week: navigation is state.
  const [currentPage, setCurrentPage] = useState('dashboard')

  // The tickets live here rather than in TicketsPage so they outlive that page
  // and the dashboard can count the same array the board edits.
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
          <NavBar
            pages={PAGES}
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
        </div>
      </header>

      <main className="app__content">
        {currentPage === 'dashboard' && <DashboardPage tickets={tickets} />}
        {currentPage === 'tickets' && (
          <TicketsPage tickets={tickets} onMove={moveTicket} />
        )}
        {currentPage === 'teams' && <TeamsPage />}
        {currentPage === 'users' && <UsersPage />}
      </main>
    </div>
  )
}

export default App
