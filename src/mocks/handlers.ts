import { delay } from 'msw'
import type { DefaultBodyType, PathParams } from 'msw'
import { http, HttpResponse } from 'msw/http'
import initialTickets from '../features/tickets/data/tickets'
import {
  FIRST_STATUS,
  isTicketStatus,
} from '../features/tickets/data/ticketStatuses'
import { isPriority } from '../features/tickets/data/ticketPriorities'
import {
  getNextTicketId,
  parseTicketId,
} from '../features/tickets/utils/tickets'
import { loadTickets, saveTickets } from './ticketStorage'
import { API_URL } from '../config'
import { validateTicket } from '../features/tickets/utils/validateTicket'
import type {
  Ticket,
  TicketFormValues,
  TicketUpdate,
} from '../features/tickets/types'

// A pretend tickets API. MSW catches the app's requests to /api/tickets and
// answers them here, in the browser, as a real server would.

// Built from the same API_URL as the app's requests, so if VITE_API_URL
// changes, the mocks still catch them.
const TICKETS_URL = `${API_URL}/tickets`
const TICKET_URL = `${TICKETS_URL}/:id`

// How long every answer takes, so the app's loading state can be seen. No
// wait in tests: the loading state still shows on the first render, and the
// tests run faster.
const RESPONSE_DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 500

// The body of every error response.
interface ApiError {
  message: string
}

// What a handler can answer with: a ticket, or an error.
type TicketOrError = Ticket | ApiError

// The :id in TICKET_URL. Like every URL parameter it is text.
type TicketParams = { id: string }

// The "database": the tickets saved in the browser, or the mock tickets the
// first time. Saved again after every change, so they survive a refresh.
let tickets: Ticket[] = loadTickets(initialTickets)

function setTickets(nextTickets: Ticket[]) {
  tickets = nextTickets
  saveTickets(tickets)
}

// Back to the starting tickets, as if the app had never been used. Tests
// call this between tests (after clearing localStorage), so a ticket one test
// creates or deletes is not still there in the next.
export function resetTickets() {
  tickets = loadTickets(initialTickets)
}

function notFound(param: string) {
  return HttpResponse.json<ApiError>(
    { message: `There is no ticket with the id "${param}".` },
    { status: 404 },
  )
}

function badRequest(message: string) {
  return HttpResponse.json<ApiError>({ message }, { status: 400 })
}

// Request bodies come from outside, so they are checked before use rather
// than trusted to match the types. This is the first check: a plain object.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// A new ticket needs a title, a description and a priority, under the same
// rules as the form. Returns the tidied values, or a message saying what is
// wrong.
function parseNewTicket(body: unknown): TicketFormValues | string {
  if (!isRecord(body)) {
    return 'The request body must be a JSON object.'
  }
  const { title, description, priority } = body
  if (typeof title !== 'string' || typeof description !== 'string') {
    return 'title and description must be text.'
  }
  if (typeof priority !== 'string' || !isPriority(priority)) {
    return 'priority must be LOW, MEDIUM or HIGH.'
  }
  const values = {
    title: title.trim(),
    description: description.trim(),
    priority,
  }
  const errors = Object.values(validateTicket(values))
  return errors.length > 0 ? errors.join(' ') : values
}

// An update may hold any of title, description, priority and status, but at
// least one, and each one given must be valid. Other fields, such as id, are
// ignored. Returns the changes, or a message saying what is wrong.
function parseUpdate(body: unknown): TicketUpdate | string {
  if (!isRecord(body)) {
    return 'The request body must be a JSON object.'
  }
  const changes: TicketUpdate = {}
  const { title, description, priority, status } = body
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return 'title must be text.'
    }
    changes.title = title.trim()
  }
  if (description !== undefined) {
    if (typeof description !== 'string') {
      return 'description must be text.'
    }
    changes.description = description.trim()
  }
  if (priority !== undefined) {
    if (typeof priority !== 'string' || !isPriority(priority)) {
      return 'priority must be LOW, MEDIUM or HIGH.'
    }
    changes.priority = priority
  }
  if (status !== undefined) {
    if (!isTicketStatus(status)) {
      return 'status must be OPEN, IN_PROGRESS, RESOLVED or CLOSED.'
    }
    changes.status = status
  }
  if (Object.keys(changes).length === 0) {
    return 'Send at least one of title, description, priority or status.'
  }
  return changes
}

export const handlers = [
  // Every ticket.
  http.get(TICKETS_URL, async () => {
    await delay(RESPONSE_DELAY_MS)
    return HttpResponse.json<Ticket[]>(tickets)
  }),

  // One ticket, or 404.
  // The type arguments are the URL parameters, the request body and the
  // response body.
  http.get<TicketParams, never, TicketOrError>(
    TICKET_URL,
    async ({ params }) => {
      await delay(RESPONSE_DELAY_MS)
      const id = parseTicketId(params.id)
      const ticket = tickets.find((item) => item.id === id)
      return ticket ? HttpResponse.json<Ticket>(ticket) : notFound(params.id)
    },
  ),

  // A new ticket. The server chooses its id and starting status, and answers
  // 201 Created with the whole ticket.
  http.post<PathParams, DefaultBodyType, TicketOrError>(
    TICKETS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      // json() fails on a body that is not JSON at all; that is a 400 too.
      const body: unknown = await request.json().catch(() => null)
      const values = parseNewTicket(body)
      if (typeof values === 'string') {
        return badRequest(values)
      }
      const now = new Date().toISOString()
      const ticket: Ticket = {
        id: getNextTicketId(tickets),
        ...values,
        status: FIRST_STATUS,
        createdAt: now,
        updatedAt: now,
      }
      setTickets([...tickets, ticket])
      return HttpResponse.json<Ticket>(ticket, { status: 201 })
    },
  ),

  // Changes some of one ticket's fields. 404 if there is no such ticket, 400
  // if the changes are not valid, otherwise the updated ticket.
  http.patch<TicketParams, DefaultBodyType, TicketOrError>(
    TICKET_URL,
    async ({ params, request }) => {
      await delay(RESPONSE_DELAY_MS)
      const id = parseTicketId(params.id)
      const existing = tickets.find((item) => item.id === id)
      if (!existing) {
        return notFound(params.id)
      }
      const body: unknown = await request.json().catch(() => null)
      const changes = parseUpdate(body)
      if (typeof changes === 'string') {
        return badRequest(changes)
      }
      const updated: Ticket = {
        ...existing,
        ...changes,
        updatedAt: new Date().toISOString(),
      }
      // The same rules as the form, so an update cannot blank out the title.
      const errors = Object.values(validateTicket(updated))
      if (errors.length > 0) {
        return badRequest(errors.join(' '))
      }
      setTickets(
        tickets.map((item) => (item.id === existing.id ? updated : item)),
      )
      return HttpResponse.json<Ticket>(updated)
    },
  ),

  // Removes one ticket for good. 404 if there is no such ticket, otherwise
  // 204 No Content: it worked, and there is nothing left to send back.
  http.delete<TicketParams>(TICKET_URL, async ({ params }) => {
    await delay(RESPONSE_DELAY_MS)
    const id = parseTicketId(params.id)
    const existing = tickets.find((item) => item.id === id)
    if (!existing) {
      return notFound(params.id)
    }
    setTickets(tickets.filter((item) => item.id !== existing.id))
    return new HttpResponse(null, { status: 204 })
  }),
]
