import { configureStore } from '@reduxjs/toolkit'
import { ticketsApi } from './ticketsApi'
import uiReducer from './uiSlice'

// The one Redux store for the app. Each key is a slice of the state, handled
// by that slice's reducer: state.ui comes from uiSlice, and state.ticketsApi
// is RTK Query's cache of tickets from the API.
export const store = configureStore({
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

// The shape of the whole state, worked out from the reducers above, so it
// stays correct as slices are added.
export type RootState = ReturnType<typeof store.getState>

// The store's dispatch function, with the actions it accepts.
export type AppDispatch = typeof store.dispatch
