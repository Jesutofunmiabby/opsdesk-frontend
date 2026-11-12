import { API_URL } from '../config'
import { setMockPassword } from './handlers'

// Checks that the mock API answers exactly as API_CONTRACT.md says, by
// sending it real requests, the way the app (and later the real backend's
// own tests) would. If one of these fails, the mock and the contract
// disagree, and the mock is what gets fixed.

// Sends a request to the API. A body is sent as JSON.
function api(path: string, method = 'GET', body?: unknown) {
  return fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

describe('API contract: base URL', () => {
  it('serves the API under /api/v1', () => {
    expect(API_URL).toMatch(/\/api\/v1$/)
  })
})

describe('API contract: errors', () => {
  it('answers invalid ticket data with the standard error shape', async () => {
    const response = await api('/tickets', 'POST', {
      title: 'ab',
      description: '   ',
      priority: 'URGENT',
    })

    expect(response.status).toBe(400)
    // toEqual: exactly these keys, nothing more.
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the highlighted fields.',
      fields: {
        title: 'The title must be at least 3 characters.',
        description: 'Enter a description.',
        priority: 'Choose a priority: LOW, MEDIUM or HIGH.',
      },
    })
  })

  it('rejects a title over 120 characters', async () => {
    const response = await api('/tickets', 'POST', {
      title: 'x'.repeat(121),
      description: 'Too long a title.',
      priority: 'LOW',
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the highlighted fields.',
      fields: { title: 'The title must be 120 characters or fewer.' },
    })
  })

  it('leaves fields out when the body is not a JSON object', async () => {
    const response = await api('/tickets', 'POST', ['not', 'an', 'object'])

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'The request body must be a JSON object.',
    })
  })

  it('answers an update with no known fields with a 400', async () => {
    const response = await api('/tickets/1', 'PATCH', { id: 99 })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Send at least one of title, description, priority or status.',
    })
  })

  it('answers a missing ticket with 404 NOT_FOUND', async () => {
    const response = await api('/tickets/999')

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'NOT_FOUND',
      message: 'There is no ticket with the id "999".',
    })
  })

  it('checks the 404 before the body on an update', async () => {
    const response = await api('/tickets/999', 'PATCH', { title: '' })

    expect(response.status).toBe(404)
  })

  it('answers out-of-range list parameters with field messages', async () => {
    const response = await api('/tickets?status=DONE&size=500&page=-1')

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the query parameters.',
      fields: {
        page: 'page must be a whole number of 0 or more.',
        size: 'size must be a whole number from 1 to 100.',
        status: 'Choose a status: OPEN, IN_PROGRESS, RESOLVED or CLOSED.',
      },
    })
  })
})

describe('API contract: tickets', () => {
  it('lists tickets one page at a time, filtered, oldest first', async () => {
    const response = await api('/tickets?status=OPEN&priority=HIGH&size=2')

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Object.keys(body).sort()).toEqual(
      ['items', 'page', 'size', 'totalItems', 'totalPages'].sort(),
    )
    expect(body).toMatchObject({
      page: 0,
      size: 2,
      totalItems: 3,
      totalPages: 2,
    })
    expect(body.items).toHaveLength(2)
    expect(body.items[0].id).toBeLessThan(body.items[1].id)
    for (const ticket of body.items) {
      expect(ticket).toMatchObject({ status: 'OPEN', priority: 'HIGH' })
    }
  })

  it('counts pages from 0, starting at page 0', async () => {
    const first = await (await api('/tickets?size=10')).json()
    const second = await (await api('/tickets?size=10&page=1')).json()

    expect(first.page).toBe(0)
    expect(first.items[0].id).toBe(1)
    expect(second.page).toBe(1)
    expect(second.items[0].id).toBe(11)
  })

  it('gives the last page when asked for one past the end', async () => {
    const body = await (await api('/tickets?size=10&page=9')).json()

    expect(body).toMatchObject({ page: 2, totalPages: 3, totalItems: 25 })
    expect(body.items).toHaveLength(5)
  })

  it('searches titles, ignoring capitals', async () => {
    const body = await (await api('/tickets?q=%20VPN%20')).json()

    expect(body.totalItems).toBeGreaterThan(0)
    for (const ticket of body.items) {
      expect(ticket.title.toLowerCase()).toContain('vpn')
    }
  })

  it('no longer reads the old search parameter', async () => {
    const body = await (await api('/tickets?search=VPN')).json()

    expect(body.totalItems).toBe(25)
  })

  it('sorts by a field, newest first with desc', async () => {
    const body = await (await api('/tickets?sort=createdAt,desc&size=5')).json()

    const times: string[] = body.items.map((t: { createdAt: string }) => t.createdAt)
    expect(times).toEqual([...times].sort().reverse())
    expect(body.items[0].id).toBe(25)
  })

  it('sorts by title, ascending when no direction is given', async () => {
    const body = await (await api('/tickets?sort=title&size=100')).json()

    const titles: string[] = body.items.map((t: { title: string }) => t.title)
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  })

  it('filters by assigneeId', async () => {
    // The mock's tickets are assigned to nobody.
    const body = await (await api('/tickets?assigneeId=3')).json()

    expect(body).toMatchObject({ items: [], totalItems: 0, totalPages: 1 })
  })

  it('answers a bad sort or assigneeId with field messages', async () => {
    const response = await api('/tickets?sort=priority,up&assigneeId=abc')

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the query parameters.',
      fields: {
        sort: 'sort must be id, title, createdAt, updatedAt, optionally followed by ,asc or ,desc.',
        assigneeId: 'assigneeId must be a whole number.',
      },
    })
  })

  it('gives every ticket its assignee and creator fields', async () => {
    const ticket = await (await api('/tickets/1')).json()

    expect(ticket).toMatchObject({
      assigneeId: null,
      assigneeName: null,
      createdById: null,
      createdByName: null,
    })
  })

  it('creates a ticket with 201, a Location header and ISO times', async () => {
    const response = await api('/tickets', 'POST', {
      title: '  Projector in room 4 has no sound  ',
      description: 'The picture works but the speakers stay silent.',
      priority: 'MEDIUM',
      // Ignored: the server chooses these.
      id: 1,
      status: 'CLOSED',
    })

    expect(response.status).toBe(201)
    const ticket = await response.json()
    expect(response.headers.get('Location')).toBe(
      `/api/v1/tickets/${ticket.id}`,
    )
    expect(ticket).toMatchObject({
      id: 26,
      title: 'Projector in room 4 has no sound',
      status: 'OPEN',
    })
    expect(ticket.createdAt).toBe(new Date(ticket.createdAt).toISOString())
    expect(ticket.updatedAt).toBe(ticket.createdAt)
  })

  it('never reuses an id after a delete', async () => {
    const newTicket = {
      title: 'Printer offline',
      description: 'It will not print.',
      priority: 'LOW',
    }
    const first = await (await api('/tickets', 'POST', newTicket)).json()
    const deleted = await api(`/tickets/${first.id}`, 'DELETE')
    const second = await (await api('/tickets', 'POST', newTicket)).json()

    expect(deleted.status).toBe(204)
    expect(await deleted.text()).toBe('')
    expect(second.id).toBe(first.id + 1)
    expect((await api(`/tickets/${first.id}`)).status).toBe(404)
  })

  it('updates only the fields sent and moves updatedAt on', async () => {
    const before = await (await api('/tickets/1')).json()
    const response = await api('/tickets/1', 'PATCH', { status: 'RESOLVED' })
    const after = await response.json()

    expect(response.status).toBe(200)
    expect(after).toMatchObject({
      ...before,
      status: 'RESOLVED',
      updatedAt: expect.any(String),
    })
    expect(after.createdAt).toBe(before.createdAt)
    expect(Date.parse(after.updatedAt)).toBeGreaterThan(
      Date.parse(before.updatedAt),
    )
  })
})

describe('API contract: projects', () => {
  it('lists projects in the page shape', async () => {
    const body = await (await api('/projects?size=1')).json()

    expect(body).toMatchObject({
      page: 0,
      size: 1,
      totalItems: 6,
      totalPages: 6,
    })
    expect(body.items[0]).toEqual({
      id: 1,
      name: 'Laptop refresh for the sales team',
      owner: 'Amara Okafor',
      status: 'IN_PROGRESS',
      dueDate: '2026-10-23',
    })
  })

  it('gets one project, or 404 NOT_FOUND', async () => {
    expect((await api('/projects/2')).status).toBe(200)

    const missing = await api('/projects/99')
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({
      error: 'NOT_FOUND',
      message: 'There is no project with the id "99".',
    })
  })
})

describe('API contract: auth', () => {
  // A made-up password for these tests only.
  const PASSWORD = 'a test password'

  // GET /auth/me with the given Authorization header, if any.
  function getMe(authorization?: string) {
    return fetch(`${API_URL}/auth/me`, {
      headers: authorization ? { Authorization: authorization } : {},
    })
  }

  it('registers a USER, ignoring a role in the body, and signs them in', async () => {
    const response = await api('/auth/register', 'POST', {
      name: '  Ngozi Eze  ',
      email: 'ngozi.eze@example.com',
      password: PASSWORD,
      role: 'ADMIN',
    })

    expect(response.status).toBe(201)
    const body = await response.json()
    expect(body).toEqual({
      token: expect.any(String),
      expiresAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T.*\.\d{3}Z$/),
      user: {
        id: expect.any(Number),
        name: 'Ngozi Eze',
        email: 'ngozi.eze@example.com',
        jobTitle: '',
        role: 'USER',
        createdAt: expect.any(String),
      },
    })
    // The password, or anything from it, is never sent back.
    expect(JSON.stringify(body)).not.toContain(PASSWORD)

    // The token it gave works for /auth/me.
    const me = await getMe(`Bearer ${body.token}`)
    expect(me.status).toBe(200)
    expect(await me.json()).toEqual(body.user)
  })

  it('answers bad register fields with the contract messages', async () => {
    const response = await api('/auth/register', 'POST', {
      name: ' ',
      email: 'not-an-email',
      password: 'short',
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the highlighted fields.',
      fields: {
        name: 'Enter your name.',
        email: 'Enter a valid email address.',
        password: 'The password must be at least 8 characters.',
      },
    })
  })

  it('answers a taken email, ignoring capitals, with 409 CONFLICT', async () => {
    const response = await api('/auth/register', 'POST', {
      name: 'Someone Else',
      email: 'AMARA.OKAFOR@example.com',
      password: PASSWORD,
    })

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      error: 'CONFLICT',
      message: 'An account with this email address already exists.',
    })
  })

  it('logs in with the right password and returns the user', async () => {
    setMockPassword('amara.okafor@example.com', PASSWORD)

    const response = await api('/auth/login', 'POST', {
      email: 'amara.okafor@example.com',
      password: PASSWORD,
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.user).toMatchObject({ id: 1, role: 'ADMIN' })
    expect(typeof body.token).toBe('string')
  })

  it('gives the same 401 for a wrong password and an unknown email', async () => {
    setMockPassword('amara.okafor@example.com', PASSWORD)
    const expected = {
      error: 'UNAUTHENTICATED',
      message: 'The email address or password is wrong.',
    }

    const wrongPassword = await api('/auth/login', 'POST', {
      email: 'amara.okafor@example.com',
      password: 'not the password',
    })
    const unknownEmail = await api('/auth/login', 'POST', {
      email: 'nobody@example.com',
      password: PASSWORD,
    })

    expect(wrongPassword.status).toBe(401)
    expect(await wrongPassword.json()).toEqual(expected)
    expect(unknownEmail.status).toBe(401)
    expect(await unknownEmail.json()).toEqual(expected)
  })

  it('answers missing login fields with 400', async () => {
    const response = await api('/auth/login', 'POST', {})

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'VALIDATION_ERROR',
      message: 'Check the highlighted fields.',
      fields: {
        email: 'Enter your email address.',
        password: 'Enter your password.',
      },
    })
  })

  it('answers /auth/me with no token or a bad one with 401', async () => {
    const expected = { error: 'UNAUTHENTICATED', message: 'Log in to continue.' }

    for (const response of [
      await getMe(),
      await getMe('Bearer not-a-real-token'),
    ]) {
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual(expected)
    }
  })
})
