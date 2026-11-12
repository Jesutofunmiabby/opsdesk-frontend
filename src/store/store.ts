import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { saveToken } from '../features/auth/utils/tokenStorage'
import authReducer from './authSlice'
import { ticketsApi } from './ticketsApi'
import uiReducer from './uiSlice'

// Builds a Redux store. Each key is a slice of the state, handled by that
// slice's reducer: state.ui comes from uiSlice, state.auth holds the login
// token, and state.ticketsApi is RTK Query's cache of tickets from the API.
// The app makes one store; tests make a new one each, so cached tickets,
// tokens and notifications never leak between tests.
export function makeStore() {
  // Runs code after actions, for side effects a reducer must not have.
  const listeners = createListenerMiddleware()

  // Whenever the token changes (log in, log out, session expired), keep the
  // copy in localStorage in step. When it goes away, also empty the API
  // caches, so the next person to log in on this browser never sees the
  // last person's tickets.
  listeners.startListening({
    predicate: (_action, currentState, previousState) =>
      selectTokenOf(currentState) !== selectTokenOf(previousState),
    effect: (_action, api) => {
      const token = selectTokenOf(api.getState())
      saveToken(token)
      if (token === null) {
        api.dispatch(ticketsApi.util.resetApiState())
      }
    },
  })

  const store = configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      [ticketsApi.reducerPath]: ticketsApi.reducer,
    },
    // RTK Query's middleware does the work behind the cache: it starts the
    // requests, removes cached data no component is using any more, and
    // refetches queries when a mutation invalidates their tags. The
    // listeners go first, as Redux Toolkit recommends.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(listeners.middleware)
        .concat(ticketsApi.middleware),
  })
  return store
}

// The listener above is given the state as unknown-shaped Redux state, so it
// reads the token through this small helper instead of the slice's selector,
// which needs the full RootState that is still being worked out here.
function selectTokenOf(state: unknown): string | null {
  if (
    typeof state === 'object' &&
    state !== null &&
    'auth' in state &&
    typeof state.auth === 'object' &&
    state.auth !== null &&
    'token' in state.auth &&
    typeof state.auth.token === 'string'
  ) {
    return state.auth.token
  }
  return null
}

// The one store the app uses.
export const store = makeStore()

// A store's type, for code that is given one, such as the test helper.
export type AppStore = ReturnType<typeof makeStore>

// The shape of the whole state, worked out from the reducers above, so it
// stays correct as slices are added.
export type RootState = ReturnType<AppStore['getState']>

// The store's dispatch function, with the actions it accepts.
export type AppDispatch = AppStore['dispatch']
