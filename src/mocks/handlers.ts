import { delay } from 'msw'
import type { DefaultBodyType, PathParams } from 'msw'
import { http, HttpResponse } from 'msw/http'
import projects from '../features/projects/data/projects'
import type { Project } from '../features/projects/types'
import initialTickets, { NO_PEOPLE } from '../features/tickets/data/tickets'
import {
  FIRST_STATUS,
  isTicketStatus,
} from '../features/tickets/data/ticketStatuses'
import { isPriority } from '../features/tickets/data/ticketPriorities'
import {
  MAX_PAGE_SIZE,
  TICKET_SORT_FIELDS,
  filterTickets,
  isSortDirection,
  isTicketSortField,
  paginate,
  sortTickets,
} from '../features/tickets/utils/ticketList'
import type {
  SortDirection,
  TicketFilters,
  TicketSortField,
} from '../features/tickets/utils/ticketList'
import { parseTicketId } from '../features/tickets/utils/tickets'
import users from '../features/users/data/users'
import type { User } from '../features/users/types'
import {
  descriptionError,
  titleError,
} from '../features/tickets/utils/validateTicket'
import { loadTicketDb, saveTicketDb } from './ticketStorage'
import type { AuthResponse } from '../features/auth/types'
import {
  validateLogin,
  validateRegister,
} from '../features/auth/utils/validateAuth'
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

// A pretend API that follows API_CONTRACT.md exactly, for the automated
// tests. MSW catches the app's requests in Node and answers them here, as the
// real backend does, so the tests need no backend running. If this file and
// the contract disagree, the contract is right and this file is fixed.

// Built from the same API_URL as the app's requests, so if VITE_API_URL
// changes, the mocks still catch them.
const TICKETS_URL = `${API_URL}/tickets`
const TICKET_URL = `${TICKETS_URL}/:id`
const PROJECTS_URL = `${API_URL}/projects`
const PROJECT_URL = `${PROJECTS_URL}/:id`
const USERS_URL = `${API_URL}/users`
const REGISTER_URL = `${API_URL}/auth/register`
const LOGIN_URL = `${API_URL}/auth/login`
const ME_URL = `${API_URL}/auth/me`

// How long every answer takes. None: the loading state still shows on the
// first render, and the tests run faster.
const RESPONSE_DELAY_MS = 0

// Messages from the contract that the form's own checks do not give.
const CHECK_FIELDS = 'Check the highlighted fields.'
const NOT_AN_OBJECT = 'The request body must be a JSON object.'
const PRIORITY_MESSAGE = 'Choose a priority: LOW, MEDIUM or HIGH.'
const STATUS_MESSAGE = 'Choose a status: OPEN, IN_PROGRESS, RESOLVED or CLOSED.'
const CHECK_QUERY = 'Check the query parameters.'
const PAGE_MESSAGE = 'page must be a whole number of 0 or more.'
const SIZE_MESSAGE = `size must be a whole number from 1 to ${MAX_PAGE_SIZE}.`
const ASSIGNEE_MESSAGE = 'assigneeId must be a whole number.'
const SORT_MESSAGE = `sort must be ${TICKET_SORT_FIELDS.join(', ')}, optionally followed by ,asc or ,desc.`

const WRONG_LOGIN = 'The email address or password is wrong.'
const LOG_IN_TO_CONTINUE = 'Log in to continue.'
const EMAIL_TAKEN = 'An account with this email address already exists.'

// How long a mock token says it lasts, like the backend's default. The mock
// never actually expires one; tests that need a 401 swap in a handler that
// sends one.
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000

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

// The accounts. Every mock user from data/users can be signed in as with
// their token, but has no password, so none can log in until a test gives
// them one with setMockPassword: passwords only ever appear in tests. People
// who register are added to registeredUsers, with the password they chose.
let registeredUsers: User[] = []
let passwords = new Map<number, string>()

function allUsers(): User[] {
  return [...users, ...registeredUsers]
}

// Emails are matched ignoring capitals, as in the contract.
function findUserByEmail(email: string): User | undefined {
  const wanted = email.toLowerCase()
  return allUsers().find((user) => user.email.toLowerCase() === wanted)
}

// The next id for a registered user, above every existing user's id.
function nextUserId(): number {
  return Math.max(0, ...allUsers().map((user) => user.id)) + 1
}

// For tests: lets them log in as one of the mock users with this password.
export function setMockPassword(email: string, password: string) {
  const user = findUserByEmail(email)
  if (!user) {
    throw new Error(`There is no mock user with the email "${email}".`)
  }
  passwords.set(user.id, password)
}

// Back to the mock users with no passwords and no one registered. Tests call
// this between tests, like resetTickets.
export function resetAccounts() {
  registeredUsers = []
  passwords = new Map()
}

// A mock token just names the user it belongs to. It is not a real token
// and has no signature: it only has to differ from user to user.
const TOKEN_PATTERN = /^Bearer mock-token-(\d+)$/

export function mockTokenFor(user: User): string {
  return `mock-token-${user.id}`
}

// The user a request's "Authorization: Bearer <token>" header belongs to, or
// undefined if there is no header or the token is not one of ours.
function userFromRequest(request: Request): User | undefined {
  const match = TOKEN_PATTERN.exec(request.headers.get('Authorization') ?? '')
  if (!match) {
    return undefined
  }
  const id = Number(match[1])
  return allUsers().find((user) => user.id === id)
}

// What register and login answer with: a token, when it expires, and who it
// belongs to.
function authResponse(user: User): AuthResponse {
  return {
    token: mockTokenFor(user),
    expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString(),
    user,
  }
}

// A password from a body. Unlike other text it is never trimmed, and
// anything that is not text counts as empty.
function asPassword(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

// The form checks give back only the fields with a problem, but typed as
// possibly undefined; this keeps just the messages.
function onlyMessages(errors: Record<string, string | undefined>) {
  const fields: Record<string, string> = {}
  for (const [name, message] of Object.entries(errors)) {
    if (message) {
      fields[name] = message
    }
  }
  return fields
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
  const page = readWholeNumber(query.get('page'), 0)
  const size = readWholeNumber(query.get('size'), DEFAULT_PAGE_SIZE)
  if (page === null) {
    fields.page = PAGE_MESSAGE
  }
  if (size === null || size < 1 || size > MAX_PAGE_SIZE) {
    fields.size = SIZE_MESSAGE
  }
  return { page: page ?? 0, size: size ?? DEFAULT_PAGE_SIZE }
}

// One page of a list in the contract's shape, oldest (lowest id) first.
function toPage<T extends { id: number }>(
  items: T[],
  page: number,
  size: number,
): PagedResponse<T> {
  return pageOf([...items].sort((a, b) => a.id - b.id), page, size)
}

// One page of items that are already in order, in the contract's shape. A
// page past the end gives the last page, and says so in page. Pages count
// from 0, as in the contract.
function pageOf<T>(items: T[], page: number, size: number): PagedResponse<T> {
  const shown = paginate(items, page, size)
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
  const q = query.get('q')?.trim()
  if (q) {
    filters.q = q
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
  const assigneeId = query.get('assigneeId')
  if (assigneeId !== null) {
    if (/^\d+$/.test(assigneeId)) {
      filters.assigneeId = Number(assigneeId)
    } else {
      fields.assigneeId = ASSIGNEE_MESSAGE
    }
  }
  return filters
}

// The order for GET /tickets, checked: sort=field, or field,asc or
// field,desc. Left out, or wrong (which is added to fields), it is oldest
// first.
function readTicketSort(
  query: URLSearchParams,
  fields: Record<string, string>,
): { field: TicketSortField; direction: SortDirection } {
  const text = query.get('sort')
  if (text === null) {
    return { field: 'id', direction: 'asc' }
  }
  const [field, direction = 'asc', ...extra] = text.split(',')
  if (extra.length === 0 && isTicketSortField(field) && isSortDirection(direction)) {
    return { field, direction }
  }
  fields.sort = SORT_MESSAGE
  return { field: 'id', direction: 'asc' }
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
  // One page of tickets, narrowed by any of status, priority, assigneeId and
  // q, in the order sort asks for.
  http.get<PathParams, never, PagedResponse<Ticket> | ApiErrorBody>(
    TICKETS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const query = new URL(request.url).searchParams
      const fields: Record<string, string> = {}
      const { page, size } = readPaging(query, fields)
      const filters = readTicketFilters(query, fields)
      const sort = readTicketSort(query, fields)
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_QUERY, fields })
      }
      const matches = filterTickets(tickets, filters)
      return HttpResponse.json<PagedResponse<Ticket>>(
        pageOf(sortTickets(matches, sort.field, sort.direction), page, size),
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
        ...NO_PEOPLE,
      }
      setTickets([...tickets, ticket])
      return HttpResponse.json<Ticket>(ticket, {
        status: 201,
        // A path, as in the contract: /api/v1/tickets/26.
        headers: { Location: `${new URL(TICKETS_URL).pathname}/${ticket.id}` },
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

  // One page of users, including anyone who has registered.
  http.get<PathParams, never, PagedResponse<User> | ApiErrorBody>(
    USERS_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const query = new URL(request.url).searchParams
      const fields: Record<string, string> = {}
      const { page, size } = readPaging(query, fields)
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_QUERY, fields })
      }
      return HttpResponse.json<PagedResponse<User>>(
        toPage(allUsers(), page, size),
      )
    },
  ),

  // A new account, signed straight in. The role is always USER: a role in
  // the body is ignored. 400 for a bad field, 409 for an email address that
  // already has an account (ignoring capitals).
  http.post<PathParams, DefaultBodyType, AuthResponse | ApiErrorBody>(
    REGISTER_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const body: unknown = await request.json().catch(() => null)
      if (!isRecord(body)) {
        return validationError({ message: NOT_AN_OBJECT })
      }
      const values = {
        name: asText(body.name),
        email: asText(body.email),
        password: asPassword(body.password),
      }
      const fields = onlyMessages(validateRegister(values))
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_FIELDS, fields })
      }
      if (findUserByEmail(values.email)) {
        return errorResponse(409, 'CONFLICT', { message: EMAIL_TAKEN })
      }
      const user: User = {
        id: nextUserId(),
        name: values.name,
        email: values.email,
        jobTitle: '',
        role: 'USER',
        createdAt: new Date().toISOString(),
      }
      registeredUsers = [...registeredUsers, user]
      passwords.set(user.id, values.password)
      return HttpResponse.json<AuthResponse>(authResponse(user), {
        status: 201,
      })
    },
  ),

  // Signs in. 400 if a field is missing; 401 with the same message whether
  // the email is unknown or the password is wrong, so it does not reveal
  // which addresses have accounts.
  http.post<PathParams, DefaultBodyType, AuthResponse | ApiErrorBody>(
    LOGIN_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const body: unknown = await request.json().catch(() => null)
      if (!isRecord(body)) {
        return validationError({ message: NOT_AN_OBJECT })
      }
      const values = {
        email: asText(body.email),
        password: asPassword(body.password),
      }
      const fields = onlyMessages(validateLogin(values))
      if (Object.keys(fields).length > 0) {
        return validationError({ message: CHECK_FIELDS, fields })
      }
      const user = findUserByEmail(values.email)
      const password = user ? passwords.get(user.id) : undefined
      if (!user || password === undefined || password !== values.password) {
        return errorResponse(401, 'UNAUTHENTICATED', { message: WRONG_LOGIN })
      }
      return HttpResponse.json<AuthResponse>(authResponse(user))
    },
  ),

  // Who the token belongs to, or 401 for no token or one that is not ours.
  http.get<PathParams, never, User | ApiErrorBody>(
    ME_URL,
    async ({ request }) => {
      await delay(RESPONSE_DELAY_MS)
      const user = userFromRequest(request)
      return user
        ? HttpResponse.json<User>(user)
        : errorResponse(401, 'UNAUTHENTICATED', {
            message: LOG_IN_TO_CONTINUE,
          })
    },
  ),
]
