import { useContext } from 'react'
import { TicketsContext } from '../context/TicketsContext'

// Returns { tickets, moveTicket } from the nearest TicketsProvider.
export function useTickets() {
  const value = useContext(TicketsContext)
  if (value === null) {
    throw new Error('useTickets must be used inside a TicketsProvider')
  }
  return value
}
