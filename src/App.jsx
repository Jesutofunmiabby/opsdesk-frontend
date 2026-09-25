import TeamsPage from './pages/TeamsPage'
import TicketsPage from './pages/TicketsPage'
import UsersPage from './pages/UsersPage'
import './App.css'

function App() {
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
          <TicketsPage />
        </div>

        <div className="app__section">
          <UsersPage />
        </div>
      </main>
    </div>
  )
}

export default App
