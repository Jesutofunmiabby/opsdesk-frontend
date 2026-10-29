import type { User } from '../types'

// Mock OpsDesk users, served by the mock API in src/mocks/handlers.ts during
// the automated tests. The app itself reads users from the backend. The User
// type checks every entry.
const users: User[] = [
  {
    id: 1,
    name: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    jobTitle: 'IT Support Lead',
    role: 'ADMIN',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 2,
    name: 'Thabo Molefe',
    email: 'thabo.molefe@example.com',
    jobTitle: 'Network Engineer',
    role: 'AGENT',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 3,
    name: 'Kabelo Dube',
    email: 'kabelo.dube@example.com',
    jobTitle: '',
    role: 'AGENT',
    createdAt: '2026-09-02T09:00:00.000Z',
  },
]

export default users
