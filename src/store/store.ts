import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'

// The one Redux store for the app. Each key is a slice of the state, handled
// by that slice's reducer: state.ui comes from uiSlice.
export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
})

// The shape of the whole state, worked out from the reducers above, so it
// stays correct as slices are added.
export type RootState = ReturnType<typeof store.getState>

// The store's dispatch function, with the actions it accepts.
export type AppDispatch = typeof store.dispatch
