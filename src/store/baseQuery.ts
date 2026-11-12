import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { API_URL } from '../config'
import { selectToken, sessionExpired } from './authSlice'
import type { RootState } from './store'

// The endpoint whose 401 means "wrong email or password", not "your token
// stopped working". Logging out on it would bounce the login page to
// itself.
const LOGIN_ENDPOINT = 'login'

// Sends every request to VITE_API_URL (or "/api/v1" if it is not set), with
// "Authorization: Bearer <token>" when someone is signed in, so the API
// knows who is asking (see "Auth" in API_CONTRACT.md).
const fetchWithToken = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    // RTK Query does not know this store's shape, so it gives the state as
    // unknown; it is this app's store, so it is a RootState.
    const token = selectToken(getState() as RootState)
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

// The base query every API in the app uses. It sends the request as above,
// and if the API answers 401 (the token has expired or is no longer valid),
// it ends the session: the token is cleared and the protected pages send
// the user to /login, which says "Your session expired".
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // The token this request is sent with, read before it goes, so a late
  // 401 cannot end a newer session (see sessionExpired in authSlice).
  const token = selectToken(api.getState() as RootState)
  const result = await fetchWithToken(args, api, extraOptions)

  if (
    result.error?.status === 401 &&
    api.endpoint !== LOGIN_ENDPOINT &&
    token !== null
  ) {
    api.dispatch(sessionExpired(token))
  }
  return result
}
