import { API_URL } from '../../../config'
import { useFetch } from '../../../hooks/useFetch'
import type { FetchResult } from '../../../hooks/useFetch'
import { isPagedResponse } from '../../../store/apiTypes'
import type { User } from '../types'

// The largest page the API gives, so every user comes back in one request
// while there are only a few.
const USERS_URL = `${API_URL}/users?size=100`

// The API answers with one page; the users are in its items. Defined at
// module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectUsers(body: unknown): User[] {
  return isPagedResponse(body) ? (body.items as User[]) : []
}

// Loads the users from GET /users (see API_CONTRACT.md). Wraps useFetch so
// the URL and the response shape are described in one place, for every page
// that needs users.
export function useUsers(): FetchResult<User> {
  return useFetch(USERS_URL, selectUsers)
}
