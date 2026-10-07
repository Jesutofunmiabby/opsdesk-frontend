import { skipToken } from '@reduxjs/toolkit/query/react'
import { useParams } from 'react-router-dom'
import { isNotFoundError, useGetTicketQuery } from '../../../store/ticketsApi'
import { parseTicketId } from '../utils/tickets'
import type { Ticket } from '../types'

export interface TicketFromUrl {
  // The id as it appears in the URL, for the "not found" message.
  id: string | undefined
  ticket: Ticket | undefined
  isLoading: boolean
  // No such ticket: the id is not a number, or the API answered 404.
  isNotFound: boolean
  // Any other failure, which Retry might fix.
  isError: boolean
  refetch: () => void
}

// Loads the ticket named by the :id in the URL, for the detail and edit
// pages. An id that is not a number is not sent to the API at all: skipToken
// tells RTK Query to skip the request.
export function useTicketFromUrl(): TicketFromUrl {
  const { id } = useParams()
  const ticketId = parseTicketId(id)
  const { data, isLoading, isError, error, refetch } = useGetTicketQuery(
    ticketId ?? skipToken,
  )
  const notFound = ticketId === null || (isError && isNotFoundError(error))

  return {
    id,
    ticket: data,
    isLoading,
    isNotFound: notFound,
    isError: isError && !notFound,
    refetch,
  }
}
