import { useState } from 'react'
import TicketsProvider from './context/TicketsProvider'
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

  return (
    <TicketsProvider>
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
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'tickets' && <TicketsPage />}
          {currentPage === 'teams' && <TeamsPage />}
          {currentPage === 'users' && <UsersPage />}
        </main>
      </div>
    </TicketsProvider>
  )
}

export default App
