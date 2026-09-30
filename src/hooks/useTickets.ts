import { useContext } from 'react'
import { TicketsContext } from '../context/TicketsContext'
import type { TicketsContextValue } from '../context/TicketsContext'

// Returns { tickets, moveTicket, addTicket, updateTicket } from the nearest
// TicketsProvider. After the null check, TypeScript knows the value is real.
export function useTickets(): TicketsContextValue {
  const value = useContext(TicketsContext)
  if (value === null) {
    throw new Error('useTickets must be used inside a TicketsProvider')
  }
  return value
}
