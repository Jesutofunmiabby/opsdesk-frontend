// What a user can do. Only these two words are allowed.
export type UserRole = 'AGENT' | 'ADMIN'

// One OpsDesk user, as GET /users sends it (see "The User object" in
// API_CONTRACT.md).
export interface User {
  id: number
  name: string
  email: string
  // May be empty.
  jobTitle: string
  role: UserRole
  // When the account was created, as an ISO 8601 string in UTC.
  createdAt: string
}
