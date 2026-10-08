import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import DashboardPage from '../pages/DashboardPage'
import TicketsPage from '../pages/TicketsPage'
import NewTicketPage from '../pages/NewTicketPage'
import TicketDetailPage from '../pages/TicketDetailPage'
import EditTicketPage from '../pages/EditTicketPage'
import TeamsPage from '../pages/TeamsPage'
import NotFoundPage from '../pages/NotFoundPage'

// Loaded only when first visited: each becomes its own file in the build, so
// the code for these pages is not downloaded until someone opens them. While
// it downloads, the Suspense in Layout shows a loading message.
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'))
const UsersPage = lazy(() => import('../pages/UsersPage'))

// Every URL the app answers to. The routes are nested inside Layout, so each
// page is drawn inside the shared header and content area (at its Outlet).
function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/new" element={<NewTicketPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="tickets/:id/edit" element={<EditTicketPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
