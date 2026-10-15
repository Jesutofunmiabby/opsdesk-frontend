import { delay } from 'msw'
import type { DefaultBodyType, PathParams } from 'msw'
import { http, HttpResponse } from 'msw/http'
import projects from '../features/projects/data/projects'
import type { Project } from '../features/projects/types'
import initialTickets from '../features/tickets/data/tickets'
import {
  FIRST_STATUS,
  isTicketStatus,
} from '../features/tickets/data/ticketStatuses'
import { isPriority } from '../features/tickets/data/ticketPriorities'
import {
  MAX_PAGE_SIZE,
  filterTickets,
  paginate,
} from '../features/tickets/utils/ticketList'
import type { TicketFilters } from '../features/tickets/utils/ticketList'
import { parseTicketId } from '../features/tickets/utils/tickets'
import {
  descriptionError,
  titleError,
} from '../features/tickets/utils/validateTicket'
import { loadTicketDb, saveTicketDb } from './ticketStorage'
import { API_URL } from '../config'
import type {
  Ticket,
  TicketFormValues,
  TicketUpdate,
} from '../features/tickets/types'
import type {
  ApiErrorBody,
  ApiErrorCode,
  PagedResponse,
} from '../store/apiTypes'

// A pretend API that follows API_CONTRACT.md exactly. MSW catches the app's
// requests and answers them here, in the browser (or in Node during tests),
// as the real backend will. If this file and the contract disagree, the
// contract is right and this file is fixed.

// Built from the same API_URL as the app's requests, so if VITE_API_URL
// changes, the mocks still catch them.
const TICKETS_URL = `${API_URL}/tickets`
const TICKET_URL = `${TICKETS_URL}/:id`
const PROJECTS_URL = `${API_URL}/projects`
const PROJECT_URL = `${PROJECTS_URL}/:id`

// How long every answer takes, so the app's loading state can be seen. No
// wait in tests: the loading state still shows on the first render, and the
// tests run faster.
const RESPONSE_DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 500

// Messages from the contract that the form's own checks do not give.
const CHECK_FIELDS = 'Check the highlighted fields.'
const NOT_AN_OBJECT = 'The request body must be a JSON object.'
const PRIORITY_MESSAGE = 'Choose a priority: LOW, MEDIUM or HIGH.'
const STATUS_MESSAGE = 'Choose a status: OPEN, IN_PROGRESS, RESOLVED or CLOSED.'
const CHECK_QUERY = 'Check the query parameters.'
const PAGE_MESSAGE = 'page must be a whole number of 1 or more.'
const SIZE_MESSAGE = `size must be a whole number from 1 to ${MAX_PAGE_SIZE}.`

// The page size when the request does not give one.
const DEFAULT_PAGE_SIZE = 20

// What a handler can answer with: a ticket, or an error.
type TicketOrError = Ticket | ApiErrorBody

// The :id in TICKET_URL or PROJECT_URL. Like every URL parameter it is text.
type IdParams = { id: string }

// What is wrong with a request: a message, and one message per field when
// the problem is in particular fields.
interface Problem {
  message: string
  fields?: Record<string, string>
}

// The "database": the tickets saved in the browser, or the mock tickets the
// first time, and the id the next new ticket gets. Saved again after every
// change, so they survive a refresh.
let { tickets, nextId } = loadTicketDb(initialTickets)

function setTickets(nextTickets: Ticket[]) {
  tickets = nextTickets
  saveTicketDb({ tickets, nextId })
}

// Hands out the next id and moves the counter on. Ids only go up, so one is
// never given out twice, even after its ticket is deleted.
function takeNextId(): number {
  const id = nextId
  nextId += 1
  return id
}

// Back to the starting tickets, as if the app had never been used. Tests
// call this between tests (after clearing localStorage), so a ticket one test
// creates or deletes is not still there in the next.
export function resetTickets() {
  const db = loadTicketDb(initialTickets)
  tickets = db.tickets
  nextId = db.nextId
}

// Every error goes out in the one shape the contract sets. fields is left
// out altogether when there are none.
function errorResponse(status: number, error: ApiErrorCode, problem: Problem) {
  const body: ApiErrorBody = { error, message: problem.message }
  if (problem.fields) {
    body.fields = problem.fields
  }
  return HttpResponse.json<ApiErrorBody>(body, { status })
}

function notFound(param: string) {
  return errorResponse(404, 'NOT_FOUND', {
    message: `There is no ticket with the id "${param}".`,
  })
}

function validationError(problem: Problem) {
  return errorResponse(400, 'VALIDATION_ERROR', problem)
}

// Request bodies come from outside, so they are checked before use rather
// than trusted to match the types. This is the first check: a plain object.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Text from a body, trimmed. Anything that is not text counts as empty, so it
// gets the "Enter a ..." message.
function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

// A new ticket needs a title, a description and a priority, under the same
// rules as the form. Every field with a problem is reported, not just the
// first. Returns the tidied values, or what is wrong.
function parseNewTicket(body: unknown): TicketFormValues | Problem {
  if (!isRecord(body)) {
    return { message: NOT_AN_OBJECT }
  }
  const title = asText(body.title)
  const description = asText(body.description)
  const priority =
    typeof body.priority === 'string' && isPriority(body.priority)
      ? body.priority
      : null

  const fields: Record<string, string> = {}
  const titleProblem = titleError(title)
  const descriptionProblem = descriptionError(description)
  if (titleProblem) {
    fields.title = titleProblem
  }
  if (descriptionProblem) {
    fields.description = descriptionProblem
  }
  if (priority === null) {
    fields.priority = PRIORITY_MESSAGE
  }

  if (priority === null || Object.keys(fields).length > 0) {
    return { message: CHECK_FIELDS, fields }
  }
  return { title, description, priority }
}

// An update may hold any of title, description, priority and status, but at
// least one, and each one sent must be valid. Other fields, such as id, are
// ignored. Returns the changes, or what is wrong.
function parseUpdate(body: unknown): TicketUpdate | Problem {
  if (!isRecord(body)) {
    return { message: NOT_AN_OBJECT }
  }
  const changes: TicketUpdate = {}
  const fields: Record<string, string> = {}

  if (body.title !== undefined) {
    changes.title = asText(body.title)
    const problem = titleError(changes.title)
    if (problem) {
      fields.title = problem
    }
  }
  if (body.description !== undefined) {
    changes.description = asText(body.description)
    const problem = descriptionError(changes.description)
    if (problem) {
      fields.description = problem
    }
  }
  if (body.priority !== undefined) {
    if (typeof body.priority === 'string' && isPriority(body.priority)) {
      changes.priority = body.priority
    } else {
      fields.priority = PRIORITY_MESSAGE
    }
  }
  if (body.status !== undefined) {
    if (isTicketStatus(body.status)) {
      changes.status = body.status
    } else {
      fields.status = STATUS_MESSAGE
    }
  }

  if (Object.keys(fields).length > 0) {
    return { message: CHECK_FIELDS, fields }
  }
  if (Object.keys(changes).length === 0) {
    return {
      message: 'Send at least one of title, description, priority or status.',
    }
  }
  return changes
}

// A whole number from the query string, the fallback when it is not there,
// or null when it is there but is not a whole number ("abc", "-1", "2.5").
function readWholeNumber(raw: string | null, fallback: number): number | null {
  if (raw === null) {
    return fallback
  }
  return /^\d+$/.test(raw) ? Number(raw) : null
}

// The page and size asked for, checked against the contract's rules. Any
// problem is added to fields, keyed by the parameter's name.
function readPaging(query: URLSearchParams, fields: Record<string, string>) {
  const page = readWholeNumber(query.get('page'), 1)
  const size = readWholeNumber(query.get('size'), DEFAULT_PAGE_SIZE)
  if (page === null || page < 1) {
    fields.page = PAGE_MESSAGE
  }
  if (size === null || size < 1 || size > MAX_PAGE_SIZE) {
    fields.size = SIZE_MESSAGE
  }
  return { page: page ?? 1, size: size ?? DEFAULT_PAGE_SIZE }
}

// One page of a list in the contract's shape, oldest (lowest id) first. A
// page past the end gives the last page, and says so in page.
function toPage<T extends { id: number }>(
  items: T[],
  page: number,
  size: number,
): PagedResponse<T> {
  const sorted = [...items].sort((a, b) => a.id - b.id)
  const shown = paginate(sorted, page, size)
  return {
    items: shown.items,
    page: shown.page,
    size,
    totalItems: items.length,
    totalPages: shown.totalPages,
  }
}

// The filters for GET /tickets, checked. Any problem is added to fields.
function readTicketFilters(
  query: URLSearchParams,
  fields: Record<string, string>,
): TicketFilters {
  const filters: TicketFilters = {}
  const search = query.get('search')?.trim()
  if (search) {
    filters.search = search
  }
  const status = query.get('status')
  if (status !== null) {
    if (isTicketStatus(status)) {
      filters.status = status
    } else {
      fields.status = STATUS_MESSAGE
    }
  }
  const priority = query.get('priority')
  if (priority !== null) {
    if (isPriority(priority)) {
      filters.priority = priority
    } else {
      fields.priority = PRIORITY_MESSAGE
    }
  }
  return filters
}

// A record id from the URL, or null if it is not a whole number, which the
// contract treats the same as an id that does not exist.
function parseId(text: string): number | null {
  return /^\d+$/.test(text) ? Number(text) : null
}

// parseNewTicket and parseUpdate give back either the values or a Problem.
// Only a Problem has a message.
function isProblem(value: object): value is Problem {
  return 'message' in value
}

export const handlers = [
  // One page of tickets, narrowed by any of status, priority and search.
  http.get<PathParams, never, PagedResponse<Ticket> | ApiErrorBody>(
    TICKETS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const query = new URL(request.url).searchParams
      const fields: Record<string, string> = {}
      const { page, size } = readPaging(query, fields)
      const filters = readTicketFilters(query, fields)
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_QUERY, fields })
      }
      const matches = filterTickets(tickets, filters)
      return HttpResponse.json<PagedResponse<Ticket>>(
        toPage(matches, page, size),
      )
    },
  ),

  // One ticket, or 404.
  // The type arguments are the URL parameters, the request body and the
  // response body.
  http.get<IdParams, never, TicketOrError>(
    TICKET_URL,
    async ({ params }) => {
      await delay(RESPONSE_DELAY_MS)
      const id = parseTicketId(params.id)
      const ticket = tickets.find((item) => item.id === id)
      return ticket ? HttpResponse.json<Ticket>(ticket) : notFound(params.id)
    },
  ),

  // A new ticket. The server chooses its id, starting status and times, and
  // answers 201 Created with the whole ticket and where it now lives.
  http.post<PathParams, DefaultBodyType, TicketOrError>(
    TICKETS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      // json() fails on a body that is not JSON at all; that is a 400 too.
      const body: unknown = await request.json().catch(() => null)
      const values = parseNewTicket(body)
      if (isProblem(values)) {
        return validationError(values)
      }
      const now = new Date().toISOString()
      const ticket: Ticket = {
        id: takeNextId(),
        ...values,
        status: FIRST_STATUS,
        createdAt: now,
        updatedAt: now,
      }
      setTickets([...tickets, ticket])
      return HttpResponse.json<Ticket>(ticket, {
        status: 201,
        headers: { Location: `${TICKETS_URL}/${ticket.id}` },
      })
    },
  ),

  // Changes some of one ticket's fields. 404 if there is no such ticket
  // (checked first), 400 if the changes are not valid, otherwise the whole
  // updated ticket.
  http.patch<IdParams, DefaultBodyType, TicketOrError>(
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
      if (isProblem(changes)) {
        return validationError(changes)
      }
      const updated: Ticket = {
        ...existing,
        ...changes,
        updatedAt: new Date().toISOString(),
      }
      setTickets(
        tickets.map((item) => (item.id === existing.id ? updated : item)),
      )
      return HttpResponse.json<Ticket>(updated)
    },
  ),

  // Removes one ticket for good. 404 if there is no such ticket, otherwise
  // 204 No Content: it worked, and there is nothing left to send back.
  http.delete<IdParams>(TICKET_URL, async ({ params }) => {
    await delay(RESPONSE_DELAY_MS)
    const id = parseTicketId(params.id)
    const existing = tickets.find((item) => item.id === id)
    if (!existing) {
      return notFound(params.id)
    }
    setTickets(tickets.filter((item) => item.id !== existing.id))
    return new HttpResponse(null, { status: 204 })
  }),

  // One page of projects. Read only: projects never change.
  http.get<PathParams, never, PagedResponse<Project> | ApiErrorBody>(
    PROJECTS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const query = new URL(request.url).searchParams
      const fields: Record<string, string> = {}
      const { page, size } = readPaging(query, fields)
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_QUERY, fields })
      }
      return HttpResponse.json<PagedResponse<Project>>(
        toPage(projects, page, size),
      )
    },
  ),

  // One project, or 404.
  http.get<IdParams, never, Project | ApiErrorBody>(
    PROJECT_URL,
    async ({ params }) => {
      await delay(RESPONSE_DELAY_MS)
      const id = parseId(params.id)
      const project = projects.find((item) => item.id === id)
      return project
        ? HttpResponse.json<Project>(project)
        : errorResponse(404, 'NOT_FOUND', {
            message: `There is no project with the id "${params.id}".`,
          })
    },
  ),
]
