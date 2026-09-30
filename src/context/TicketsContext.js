import { createContext } from 'react'

// The shared ticket list and the actions that change it. Filled in by
// TicketsProvider; read with the useTickets hook. Null outside a provider, so
// the hook can say clearly when it has been used in the wrong place.
export const TicketsContext = createContext(null)
