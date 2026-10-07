import AppRoutes from './routes/AppRoutes'
import './App.css'

// The whole app. Tickets come from the API through RTK Query, set up in the
// Redux store in main.tsx, so nothing needs to wrap the routes here.
function App() {
  return <AppRoutes />
}

export default App
