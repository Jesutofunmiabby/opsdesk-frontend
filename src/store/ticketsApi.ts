import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../config'
import type {
  Ticket,
  TicketFormValues,
  TicketUpdate,
} from '../features/tickets/types'
import type { TicketFilters } from '../features/tickets/utils/ticketList'
import type { PagedResponse } from './apiTypes'

// What getTickets is called with: which page, how big, and any filters.
// Anything left out uses the API's default (page 1, 20 a page, no filter).
export interface TicketListParams extends TicketFilters {
  page?: number
  size?: number
}

// What updateTicket is called with: which ticket, and what to change.
interface UpdateTicketArgs {
  id: number
  changes: TicketUpdate
}

// The tickets API. RTK Query makes the requests, keeps the answers in a
// cache in the Redux store, and shares them with every component that asks,
// so the board, list and dashboard use one copy instead of fetching their
// own. This is server data, so it lives here and never in a slice of ours.
export const ticketsApi = createApi({
  // Where the cache sits in the store: state.ticketsApi.
  reducerPath: 'ticketsApi',
  // VITE_API_URL from .env, or "/api" if it is not set.
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),

  // Labels for cached data. Queries say which tickets they hold
  // (providesTags); mutations say which they changed (invalidatesTags), and
  // any query holding one of those is fetched again.
  tagTypes: ['Ticket'],

  endpoints: (build) => ({
    // build.query<what comes back, what it is called with>.
    // One page of tickets (see "List tickets" in API_CONTRACT.md). Each set
    // of params is cached on its own, so the board, the list's pages and the
    // dashboard's counts are separate entries. Params left undefined are not
    // sent.
    getTickets: build.query<PagedResponse<Ticket>, TicketListParams>({
      query: (params) => ({ url: '/tickets', params }),
      // A tag for every ticket on the page, plus one shared by every list,
      // so any change to the tickets can refresh all of them.
      providesTags: (result) => [
        ...(result?.items ?? []).map((ticket) => ({
          type: 'Ticket' as const,
          id: ticket.id,
        })),
        { type: 'Ticket', id: 'LIST' },
      ],
    }),

    getTicket: build.query<Ticket, number>({
      query: (id) => `/tickets/${id}`,
      providesTags: (_ticket, _error, id) => [{ type: 'Ticket', id }],
    }),

    // A new ticket changes what is in the list, so the list is refreshed.
    createTicket: build.mutation<Ticket, TicketFormValues>({
      query: (values) => ({ url: '/tickets', method: 'POST', body: values }),
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),

    // Changing a ticket refreshes its own page and every list. Lists are
    // refreshed even if they do not hold it: a new status can move it into
    // a filtered list, such as the dashboard's count of open tickets.
    updateTicket: build.mutation<Ticket, UpdateTicketArgs>({
      query: ({ id, changes }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: (_ticket, _error, { id }) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),

    // Called with the ticket's id. The API answers 204 with no body, so
    // there is nothing to return (void). Every list is refreshed, and the
    // deleted ticket's own cached page is dropped, so going Back to it asks
    // the API again and shows "not found" instead of the old copy.
    deleteTicket: build.mutation<void, number>({
      query: (id) => ({ url: `/tickets/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Ticket', id },
        { type: 'Ticket', id: 'LIST' },
      ],
    }),
  }),
})

// True if a request failed because the server said there is no such ticket
// (404). RTK Query's errors are either an HTTP answer, which has a status, or
// a problem in the app's own code, which does not.
export function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === 404
  )
}

// A hook for each endpoint, named from it: getTickets becomes
// useGetTicketsQuery, createTicket becomes useCreateTicketMutation.
export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi
