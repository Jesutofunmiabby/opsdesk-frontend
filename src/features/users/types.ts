// What a user can do (see "Who can do what" in API_CONTRACT.md). A new user
// from register is always USER.
export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER'

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
