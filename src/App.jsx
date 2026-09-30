import { Routes, Route, Navigate } from 'react-router-dom'
import TicketsProvider from './context/TicketsProvider'
import Layout from './layouts/Layout'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import ProjectsPage from './pages/ProjectsPage'
import TeamsPage from './pages/TeamsPage'
import UsersPage from './pages/UsersPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

// Every URL the app answers to. The routes are nested inside Layout, so each
// page is drawn inside the shared header and content area (at its Outlet).
function App() {
  return (
    <TicketsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TicketsProvider>
  )
}

export default App
