import TicketsProvider from './features/tickets/hooks/TicketsProvider'
import AppRoutes from './routes/AppRoutes'
import './App.css'

// The whole app: the shared tickets around every route, so any page can use
// them.
function App() {
  return (
    <TicketsProvider>
      <AppRoutes />
    </TicketsProvider>
  )
}

export default App
