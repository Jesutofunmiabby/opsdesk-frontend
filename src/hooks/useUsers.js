import { useFetch } from './useFetch'

const USERS_URL = 'https://dummyjson.com/users?limit=12'

// The API answers with an object; the list is inside its users field. Defined
// at module level so it is the same function on every render, which keeps
// useFetch from restarting the request.
function selectUsers(body) {
  return Array.isArray(body.users) ? body.users : []
}

// Loads the users list. Wraps useFetch so the URL and the response shape are
// described in one place, for every page that needs users.
// Returns { data, status, retry }.
export function useUsers() {
  return useFetch(USERS_URL, selectUsers)
}
