import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Decides the notification's colour and icon.
export type NotificationType = 'success' | 'error'

export interface Notification {
  id: string
  message: string
  type: NotificationType
}

// Shared UI state only: things about how the app looks that components in
// different parts of the page need. Data such as tickets does not go here.
interface UiState {
  sidebarCollapsed: boolean
  // Oldest first, so new ones appear at the bottom of the stack.
  notifications: Notification[]
}

const initialState: UiState = {
  sidebarCollapsed: false,
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },

    // Called with { message, type }. The id is made in prepare, before the
    // reducer runs, because a reducer must give the same result every time it
    // is given the same action, and a random id would break that.
    addNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        state.notifications.push(action.payload)
      },
      prepare(notification: Omit<Notification, 'id'>) {
        return { payload: { id: nanoid(), ...notification } }
      },
    },

    // Called with the id of the notification to remove.
    dismissNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      )
    },
  },
})

export const { toggleSidebar, addNotification, dismissNotification } =
  uiSlice.actions

// Selectors: how components read this slice, so they do not depend on where
// it sits in the store.
export const selectSidebarCollapsed = (state: RootState) =>
  state.ui.sidebarCollapsed
export const selectNotifications = (state: RootState) => state.ui.notifications

export default uiSlice.reducer
