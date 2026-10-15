import { configureStore } from '@reduxjs/toolkit'
import { ticketsApi } from './ticketsApi'
import uiReducer from './uiSlice'

// Builds a Redux store. Each key is a slice of the state, handled by that
// slice's reducer: state.ui comes from uiSlice, and state.ticketsApi is RTK
// Query's cache of tickets from the API. The app makes one store; tests make
// a new one each, so cached tickets and notifications never leak between
// tests.
export function makeStore() {
  return configureStore({
    reducer: {
      ui: uiReducer,
      [ticketsApi.reducerPath]: ticketsApi.reducer,
    },
    // RTK Query's middleware does the work behind the cache: it starts the
    // requests, removes cached data no component is using any more, and
    // refetches queries when a mutation invalidates their tags.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(ticketsApi.middleware),
  })
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
