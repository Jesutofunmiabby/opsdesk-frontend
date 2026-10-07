import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  Ticket,
  TicketFormValues,
  TicketUpdate,
} from '../features/tickets/types'

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
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

  // Labels for cached data. Queries say which tickets they hold
  // (providesTags); mutations say which they changed (invalidatesTags), and
  // any query holding one of those is fetched again.
  tagTypes: ['Ticket'],

  endpoints: (build) => ({
    // build.query<what comes back, what it is called with>.
    getTickets: build.query<Ticket[], void>({
      query: () => '/tickets',
      // A tag for every ticket in the list, plus one for the list itself, so
      // changing any one ticket, or adding a new one, refreshes the list.
      providesTags: (tickets = []) => [
        ...tickets.map((ticket) => ({
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

    // Changing a ticket refreshes everything holding that ticket: its own
    // page, and the list, which provides a tag for each of its tickets.
    updateTicket: build.mutation<Ticket, UpdateTicketArgs>({
      query: ({ id, changes }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: changes,
      }),
      invalidatesTags: (_ticket, _error, { id }) => [{ type: 'Ticket', id }],
    }),
  }),
})

// A hook for each endpoint, named from it: getTickets becomes
// useGetTicketsQuery, createTicket becomes useCreateTicketMutation.
export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
} = ticketsApi
