import { useFetch } from '../../../hooks/useFetch'
import type { FetchResult } from '../../../hooks/useFetch'
import type { User, UsersResponse } from '../types'

const USERS_URL = 'https://dummyjson.com/users?limit=12'

// Checks that the API's answer is an object with a users list. Where it
// returns true, TypeScript treats the body as a UsersResponse. It checks the
// outer shape only and trusts the API for the fields of each user.
function isUsersResponse(body: unknown): body is UsersResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    'users' in body &&
    Array.isArray(body.users)
  )
}

// The API answers with an object; the list is inside its users field. Defined
// at module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectUsers(body: unknown): User[] {
  return isUsersResponse(body) ? body.users : []
}

// Loads the users list. Wraps useFetch so the URL and the response shape are
// described in one place, for every page that needs users.
export function useUsers(): FetchResult<User> {
  return useFetch(USERS_URL, selectUsers)
}
