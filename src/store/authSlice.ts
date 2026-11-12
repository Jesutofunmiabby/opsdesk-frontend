import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { loadToken } from '../features/auth/utils/tokenStorage'
import type { RootState } from './store'

// Who is signed in, as far as this browser knows: only the login token.
// The user it belongs to (name, role) is server data, so it comes from
// GET /auth/me through RTK Query (authApi), not from this slice.
interface AuthState {
  token: string | null
  // True when the last session ended because the API stopped accepting the
  // token, so the login page can say "Your session expired".
  sessionExpired: boolean
}

const authSlice = createSlice({
  name: 'auth',
  // A function, so every new store (one per test) reads localStorage afresh
  // instead of sharing whatever was there when this file first loaded.
  initialState: (): AuthState => ({
    token: loadToken(),
    sessionExpired: false,
  }),
  reducers: {
    // Called with the token from a successful login or register.
    loggedIn(state, action: PayloadAction<string>) {
      state.token = action.payload
      state.sessionExpired = false
    },

    // The user pressed Log out.
    loggedOut(state) {
      state.token = null
      state.sessionExpired = false
    },

    // The API answered 401 to a request sent with this token. Called with
    // the token that was refused: if someone has logged in again since that
    // request started, the new token is kept, and the late answer to the old
    // one is ignored.
    sessionExpired(state, action: PayloadAction<string>) {
      if (state.token !== null && state.token === action.payload) {
        state.token = null
        state.sessionExpired = true
      }
    },
  },
})

export const { loggedIn, loggedOut, sessionExpired } = authSlice.actions

export const selectToken = (state: RootState) => state.auth.token
export const selectIsSignedIn = (state: RootState) => state.auth.token !== null
export const selectSessionExpired = (state: RootState) =>
  state.auth.sessionExpired

export default authSlice.reducer
