# OpsDesk API contract

This is the agreement between the OpsDesk frontend and its backend: every URL,
what to send, and exactly what comes back. It is the source of truth. The mock
API in `src/mocks/handlers.ts` follows it, and the real backend must too. If
the two ever disagree, the contract wins and the code is fixed.

Version: 1

## Contents

- [General rules](#general-rules)
- [Errors](#errors)
- [Lists and pages](#lists-and-pages)
- [Tickets](#tickets)
- [Projects](#projects)
- [Users](#users)
- [Auth](#auth)
- [What the mock API covers](#what-the-mock-api-covers)
- [Security](#security)

## General rules

**Base URL.** Every path in this document starts from `/api/v1`, so
`GET /tickets` means `GET /api/v1/tickets`. The frontend reads the base URL
from `VITE_API_URL`. The `v1` lets a future, incompatible version live at
`/api/v2` without breaking this one.

**JSON everywhere.** Request and response bodies are JSON, sent with
`Content-Type: application/json`. The only response with no body is
`204 No Content`.

**Names.** URLs use plural nouns (`/tickets`, `/projects`). Field names are
camelCase (`createdAt`). Fixed choices, such as statuses, are uppercase
strings (`IN_PROGRESS`).

**Ids.** Every id is a positive whole number (`4`, never `"4"`), chosen by the
server. Ids only ever go up: **an id is never reused, even after its record is
deleted**. If ticket 25 is deleted, the next ticket is 26, not 25. An id in a
URL that is not a whole number (`/tickets/abc`) gets `404 Not Found`, the same
as an id that does not exist.

**Dates.** Dates and times are ISO 8601 strings. A moment in time is in UTC
with milliseconds and a `Z`: `"2026-10-15T09:30:00.000Z"` (what JavaScript's
`toISOString()` gives). A calendar day with no time is `"2026-10-23"`.

**Text.** Text fields are trimmed (spaces removed from both ends) before they
are checked and saved, so `"  Printer jam  "` is saved as `"Printer jam"`.
Length limits count characters after trimming.

**Unknown fields.** Fields in a request body that this contract does not list
are ignored. Sending `id` or `createdAt` cannot change them.

**Auth.** Until Week 8, no endpoint needs a token. From Week 8, every endpoint
except those under `/auth` needs an `Authorization: Bearer <token>` header,
and answers `401` without a valid one. See [Auth](#auth).

## Errors

Every error, from every endpoint, has the same shape:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Check the highlighted fields.",
  "fields": {
    "title": "The title must be at least 3 characters."
  }
}
```

| Field     | Type   | Always there? | What it is |
|-----------|--------|---------------|------------|
| `error`   | string | Yes | A fixed code from the table below, for code to check. |
| `message` | string | Yes | A sentence a person can read. |
| `fields`  | object | Only for `VALIDATION_ERROR` about particular fields | One message per field that has a problem, keyed by the field's name. Fields with no problem are left out. |

Each code always goes with the same HTTP status:

| Status | `error` | When |
|--------|---------|------|
| 400 | `VALIDATION_ERROR` | The request is not valid: a body that is not a JSON object, a missing or wrong field, or a query parameter out of range. |
| 401 | `UNAUTHENTICATED` | No token, an expired or invalid token (from Week 8), or a wrong email or password at login. |
| 403 | `FORBIDDEN` | Signed in, but not allowed to do this. Reserved: no endpoint in version 1 returns it. |
| 404 | `NOT_FOUND` | There is nothing at this id. |
| 409 | `CONFLICT` | The request clashes with what is already there, such as registering an email address that is taken. |
| 500 | `INTERNAL_ERROR` | Something went wrong on the server. The message never includes internal details such as stack traces. |

## Lists and pages

Every list endpoint returns one page at a time, in the same shape.

**Query parameters**

| Parameter | Type | Default | Rules |
|-----------|------|---------|-------|
| `page` | whole number | `0` | 0 or more. Pages count from 0, so the first page is page 0. |
| `size` | whole number | `20` | 1 to 100: how many items on a page. |

A value that breaks these rules (`page=-1`, `size=500`, `size=abc`) gets
`400 VALIDATION_ERROR` with a message under `fields.page` or `fields.size`.

**Response**

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalItems": 0,
  "totalPages": 1
}
```

| Field | Type | What it is |
|-------|------|------------|
| `items` | array | The items on this page, oldest first (ascending id). |
| `page` | number | The page these items are from, counting from 0. |
| `size` | number | The page size used. |
| `totalItems` | number | How many items match, across all pages. |
| `totalPages` | number | How many pages there are. Always at least 1, so an empty list still has one page: page 0. |

A `page` past the last page is not an error: the last page comes back, and
`page` in the response says which page that is. (With 3 pages, numbered 0 to
2, asking for page 9 gives page 2.)

## Tickets

### The Ticket object

```json
{
  "id": 4,
  "title": "Payroll export fails with a timeout error",
  "description": "The monthly payroll export stops after about a minute with a timeout error. It needs to run before the payroll deadline on Friday.",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "createdAt": "2026-09-04T09:00:00.000Z",
  "updatedAt": "2026-09-05T14:00:00.000Z"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `id` | number | Set by the server. |
| `title` | string | 3 to 120 characters. |
| `description` | string | 1 to 5000 characters. Line breaks are kept. |
| `priority` | string | `LOW`, `MEDIUM` or `HIGH`. |
| `status` | string | `OPEN`, `IN_PROGRESS`, `RESOLVED` or `CLOSED`. A new ticket is always `OPEN`. |
| `createdAt` | string | When it was created. Set by the server, never changes. |
| `updatedAt` | string | When it last changed. Set by the server. Equal to `createdAt` until the first change. |

**Field messages.** When a ticket field breaks a rule, `fields` holds these
messages, the same ones the form shows:

| Field | Problem | Message |
|-------|---------|---------|
| `title` | Missing, not text, or empty | `Enter a title.` |
| `title` | Fewer than 3 characters | `The title must be at least 3 characters.` |
| `title` | More than 120 characters | `The title must be 120 characters or fewer.` |
| `description` | Missing, not text, or empty | `Enter a description.` |
| `description` | More than 5000 characters | `The description must be 5000 characters or fewer.` |
| `priority` | Missing, or not one of the three | `Choose a priority: LOW, MEDIUM or HIGH.` |
| `status` | Not one of the four | `Choose a status: OPEN, IN_PROGRESS, RESOLVED or CLOSED.` |

### List tickets

`GET /tickets`

Takes the [page parameters](#lists-and-pages), plus filters. Filters combine:
`status=OPEN&priority=HIGH` means open **and** high priority.

| Parameter | Type | Rules |
|-----------|------|-------|
| `page`, `size` | whole numbers | As in [Lists and pages](#lists-and-pages). |
| `status` | string | Optional. One of the four statuses. |
| `priority` | string | Optional. One of the three priorities. |
| `search` | string | Optional. Tickets whose title contains this text, ignoring capitals and spaces at either end. Empty means no search. |

**200 OK**

`GET /tickets?status=OPEN&priority=HIGH&size=2`

```json
{
  "items": [
    {
      "id": 1,
      "title": "Laptop will not connect to the office Wi-Fi",
      "description": "Since this morning the laptop sees the office network but fails to connect, saying the password is wrong. Other devices at the same desk connect fine.",
      "priority": "HIGH",
      "status": "OPEN",
      "createdAt": "2026-09-01T09:00:00.000Z",
      "updatedAt": "2026-09-01T09:00:00.000Z"
    },
    {
      "id": 12,
      "title": "New starter needs a laptop and accounts by Monday",
      "description": "A new analyst starts in finance on Monday and needs a laptop, an email account and access to the finance shared drive.",
      "priority": "HIGH",
      "status": "OPEN",
      "createdAt": "2026-09-12T09:00:00.000Z",
      "updatedAt": "2026-09-12T09:00:00.000Z"
    }
  ],
  "page": 0,
  "size": 2,
  "totalItems": 3,
  "totalPages": 2
}
```

**400 Bad Request**: a parameter is out of range or not a known value.

`GET /tickets?status=DONE&size=500`

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Check the query parameters.",
  "fields": {
    "size": "size must be a whole number from 1 to 100.",
    "status": "Choose a status: OPEN, IN_PROGRESS, RESOLVED or CLOSED."
  }
}
```

The page messages are `page must be a whole number of 0 or more.` and
`size must be a whole number from 1 to 100.`

### Get one ticket

`GET /tickets/{id}`

| Path parameter | Type |
|----------------|------|
| `id` | whole number |

**200 OK**: the [Ticket object](#the-ticket-object).

**404 Not Found**

```json
{
  "error": "NOT_FOUND",
  "message": "There is no ticket with the id \"99\"."
}
```

### Create a ticket

`POST /tickets`

| Body field | Type | Required | Rules |
|------------|------|----------|-------|
| `title` | string | Yes | 3 to 120 characters. |
| `description` | string | Yes | 1 to 5000 characters. |
| `priority` | string | Yes | `LOW`, `MEDIUM` or `HIGH`. |

The server chooses the `id`, sets `status` to `OPEN`, and sets `createdAt`
and `updatedAt` to now.

```json
{
  "title": "Projector in room 4 has no sound",
  "description": "The picture works but the speakers stay silent.",
  "priority": "MEDIUM"
}
```

**201 Created**: the new [Ticket object](#the-ticket-object), with a
`Location` header giving its URL (`Location: /api/v1/tickets/26`).

```json
{
  "id": 26,
  "title": "Projector in room 4 has no sound",
  "description": "The picture works but the speakers stay silent.",
  "priority": "MEDIUM",
  "status": "OPEN",
  "createdAt": "2026-10-15T09:30:00.000Z",
  "updatedAt": "2026-10-15T09:30:00.000Z"
}
```

**400 Bad Request**: one or more fields break the rules. Every field with a
problem is listed, not just the first.

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Check the highlighted fields.",
  "fields": {
    "title": "The title must be at least 3 characters.",
    "description": "Enter a description.",
    "priority": "Choose a priority: LOW, MEDIUM or HIGH."
  }
}
```

**400 Bad Request**: the body is not a JSON object (empty, broken JSON, or
an array).

```json
{
  "error": "VALIDATION_ERROR",
  "message": "The request body must be a JSON object."
}
```

### Update a ticket

`PATCH /tickets/{id}`

Changes only the fields sent. At least one is needed. Each one sent follows
the same rules as on create.

| Body field | Type | Required | Rules |
|------------|------|----------|-------|
| `title` | string | No | 3 to 120 characters. |
| `description` | string | No | 1 to 5000 characters. |
| `priority` | string | No | `LOW`, `MEDIUM` or `HIGH`. |
| `status` | string | No | Any of the four statuses. Moves are not limited to the next status. |

```json
{ "status": "IN_PROGRESS" }
```

**200 OK**: the whole updated [Ticket object](#the-ticket-object), with
`updatedAt` set to now.

**400 Bad Request**: a field breaks its rule (same shape and messages as
create), the body is not a JSON object, or it has none of the four fields:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Send at least one of title, description, priority or status."
}
```

**404 Not Found**: as for [Get one ticket](#get-one-ticket). The 404 is
checked first, so a missing ticket is 404 even if the body is also wrong.

### Delete a ticket

`DELETE /tickets/{id}`

No body. Deleting is permanent. The id is never given to another ticket.

**204 No Content**: deleted. No body.

**404 Not Found**: as for [Get one ticket](#get-one-ticket), including when
the ticket was already deleted.

## Projects

Read only in version 1: there is no way to create, change or delete projects.

### The Project object

```json
{
  "id": 1,
  "name": "Laptop refresh for the sales team",
  "owner": "Amara Okafor",
  "status": "IN_PROGRESS",
  "dueDate": "2026-10-23"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `id` | number | Set by the server. |
| `name` | string | 1 to 120 characters. |
| `owner` | string | The person responsible, as a display name. |
| `status` | string | `PLANNING`, `IN_PROGRESS`, `ON_HOLD` or `COMPLETE`. |
| `dueDate` | string | A calendar day: `YYYY-MM-DD`. |

### List projects

`GET /projects`

Takes the [page parameters](#lists-and-pages) only.

**200 OK**

`GET /projects?size=1`

```json
{
  "items": [
    {
      "id": 1,
      "name": "Laptop refresh for the sales team",
      "owner": "Amara Okafor",
      "status": "IN_PROGRESS",
      "dueDate": "2026-10-23"
    }
  ],
  "page": 0,
  "size": 1,
  "totalItems": 6,
  "totalPages": 6
}
```

**400 Bad Request**: `page` or `size` out of range, as in
[Lists and pages](#lists-and-pages).

### Get one project

`GET /projects/{id}`

**200 OK**: the [Project object](#the-project-object).

**404 Not Found**

```json
{
  "error": "NOT_FOUND",
  "message": "There is no project with the id \"99\"."
}
```

## Users

> **Not served by the mock API yet.** The Users page still reads people from
> DummyJSON (`https://dummyjson.com/users`), whose shape is different. When
> the real backend arrives in Week 6, the page moves to `GET /users` below,
> and `UserCard` is updated to the User object's fields.

### The User object

```json
{
  "id": 7,
  "name": "Amara Okafor",
  "email": "amara.okafor@example.com",
  "jobTitle": "IT Support Lead",
  "role": "AGENT",
  "createdAt": "2026-09-01T09:00:00.000Z"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `id` | number | Set by the server. |
| `name` | string | 1 to 100 characters. |
| `email` | string | A valid email address, unique across all users, ignoring capitals. |
| `jobTitle` | string | May be empty. |
| `role` | string | `AGENT` or `ADMIN`. A new user is `AGENT`. |
| `createdAt` | string | When the account was created. |

A user's password, or anything worked out from it, never appears in any
response.

### List users

`GET /users`

Takes the [page parameters](#lists-and-pages) only.

**200 OK**: a page of [User objects](#the-user-object), in the
[list shape](#lists-and-pages).

**400 Bad Request**: `page` or `size` out of range.

## Auth

> **Arrives in Week 8.** These endpoints are agreed now so the backend can be
> built to them, but the frontend does not call them yet and the mock API
> does not serve them.

A successful register or login returns a **token**: a string the frontend
sends back on every later request, in the header
`Authorization: Bearer <token>`, to say who is asking. Tokens expire; after
`expiresAt`, requests with that token get `401 UNAUTHENTICATED` and the person
must log in again.

### Register

`POST /auth/register`

| Body field | Type | Required | Rules |
|------------|------|----------|-------|
| `name` | string | Yes | 1 to 100 characters. |
| `email` | string | Yes | A valid email address, not already registered (ignoring capitals). |
| `password` | string | Yes | 8 to 128 characters. Not trimmed. |

```json
{
  "name": "Amara Okafor",
  "email": "amara.okafor@example.com",
  "password": "correct horse battery staple"
}
```

**201 Created**: signed in as the new user.

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.example.signature",
  "expiresAt": "2026-10-16T09:30:00.000Z",
  "user": {
    "id": 7,
    "name": "Amara Okafor",
    "email": "amara.okafor@example.com",
    "jobTitle": "",
    "role": "AGENT",
    "createdAt": "2026-10-15T09:30:00.000Z"
  }
}
```

**400 Bad Request**

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Check the highlighted fields.",
  "fields": {
    "email": "Enter a valid email address.",
    "password": "The password must be at least 8 characters."
  }
}
```

The messages are: `name`: `Enter your name.` or
`The name must be 100 characters or fewer.`; `email`:
`Enter a valid email address.`; `password`:
`The password must be at least 8 characters.` or
`The password must be 128 characters or fewer.`

**409 Conflict**

```json
{
  "error": "CONFLICT",
  "message": "An account with this email address already exists."
}
```

### Log in

`POST /auth/login`

| Body field | Type | Required |
|------------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**200 OK**: the same shape as register's 201: `token`, `expiresAt` and
`user`.

**400 Bad Request**: `email` or `password` missing, with `fields.email`
(`Enter your email address.`) or `fields.password`
(`Enter your password.`).

**401 Unauthorized**: the email is not registered, or the password is wrong.
The message is the same in both cases, so it does not reveal which email
addresses have accounts.

```json
{
  "error": "UNAUTHENTICATED",
  "message": "The email address or password is wrong."
}
```

## What the mock API covers

| Endpoint | In the mock (`src/mocks/handlers.ts`) | Used by the app |
|----------|---------------------------------------|-----------------|
| `GET /tickets` | Yes | Board, list, dashboard |
| `GET /tickets/{id}` | Yes | Ticket and edit pages |
| `POST /tickets` | Yes | New ticket |
| `PATCH /tickets/{id}` | Yes | Edit, and Move on the board |
| `DELETE /tickets/{id}` | Yes | Delete on the ticket page |
| `GET /projects` | Yes | Not yet: the Projects page still uses local data |
| `GET /projects/{id}` | Yes | Not yet |
| `GET /users` | No: DummyJSON for now | Users page and dashboard, from DummyJSON |
| `POST /auth/register` | No: Week 8 | Not yet |
| `POST /auth/login` | No: Week 8 | Not yet |

The mock keeps its data in the browser's localStorage, so changes survive a
refresh. Its answers take half a second, so loading states can be seen.

## Security

### Results of the check (15 October 2026)

| Check | Result |
|-------|--------|
| `dangerouslySetInnerHTML` | **None.** The code was also searched for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval(` and `new Function(`: none. |
| Secrets in the code | **None** in `src`, `index.html` or `vite.config.ts`. The only places the word "password" appears are the text of mock tickets, such as "Password reset for the warehouse tablet". |
| Secrets in `.env` and `.env.example` | **None.** Both hold only `VITE_API_URL=/api/v1`, an address, not a secret. `.env` is ignored by git and has never been committed. The only `VITE_` variable the code reads is `VITE_API_URL`. |
| Tokens | **None stored.** Nothing in the app stores a token yet; login arrives in Week 8. The only thing in localStorage is the mock API's tickets, which only exist in development. |
| Links built from data | **Safe.** Every link made from data starts with a fixed part (`mailto:`, `tel:`, `/tickets/`), so a crafted email address or id cannot turn into a `javascript:` link. |
| `npm audit` | **1 high-severity warning, in development tools only.** See below. |

### npm audit

`npm audit` reports one high-severity problem: **`source-map-js` 1.2.1**
([GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q)).
A specially made source map can make it loop for a long time, freezing the
program reading it (a "denial of service").

It does **not** affect the app in the browser. `source-map-js` is not one of
our own packages; it comes in through two development tools:

- `vite` → `postcss` → `source-map-js` (the dev server and the build)
- `jsdom` → `css-tree` → `source-map-js` (the test environment)

It is not in the production build: the files in `dist/` were searched and it
is not there. The only risk is that the build or the tests could hang if they
were given a malicious source map, and ours are made by our own tools.

`npm audit fix` would move it to a fixed version within the range those tools
already accept, changing only `package-lock.json`. That is worth doing as its
own small change, so it can be checked on its own.

### XSS (cross-site scripting)

XSS is when an attacker gets their own JavaScript to run on our page, in
someone else's browser. For example, someone creates a ticket titled
`<img src=x onerror="steal()">`. If the page put that title into the HTML as
HTML, everyone who opened the board would run `steal()`, which can do
anything they can do: read the page, send requests as them, take their token.

React protects us by default: text in JSX, such as `{ticket.title}`, is
always shown as text, never run, so that title appears on screen as the
characters `<img src=x ...>`. The protection is lost only when code goes
around React, which is why these are not allowed:

- `dangerouslySetInnerHTML`, which puts a string in as real HTML (banned in
  this project).
- Setting `innerHTML` or similar on elements directly.
- Links whose whole address comes from data, which could be `javascript:...`.

The backend must still check and limit everything it is sent (as the field
rules above do), and in production should send a `Content-Security-Policy`
header, which tells the browser not to run scripts from anywhere unexpected,
as a second line of defence.

### Why storing tokens in localStorage is risky

Any JavaScript running on the page can read localStorage. So if a single XSS
bug ever slips in, from our code or a package we use, the attacker's script
can read the token and send it to themselves. With it they can act as that
person from any computer until the token expires. localStorage also keeps the
token after the browser is closed.

Safer choices for Week 8:

1. **An `httpOnly` cookie set by the backend** (the strongest). JavaScript
   cannot read an `httpOnly` cookie at all, so XSS cannot steal it; the
   browser sends it with each request. It should also be `Secure` (HTTPS
   only) and `SameSite`. It needs protection against cross-site request
   forgery, and if chosen, the [Auth](#auth) section changes from returning a
   token to setting a cookie, as a new version of this contract.
2. **Keeping the token in memory only**, never in localStorage. A script can
   still use it while the page is open, but it cannot be read out of storage
   later. It is lost on refresh, so people would sign in again or the
   backend would also need a refresh token.

### CORS and why the fix belongs on the backend

Browsers only let a page read responses from its own **origin**: the same
scheme, host and port. `https://opsdesk.example.com` and
`https://api.opsdesk.example.com` are different origins. If the frontend
calls an API on another origin, the browser sends the request but blocks the
page from reading the answer, unless the API's response says that origin is
allowed. That permission system is **CORS** (Cross-Origin Resource Sharing).
For requests with JSON bodies or an `Authorization` header, the browser first
asks with an `OPTIONS` request (a "preflight") and only sends the real
request if the answer allows it.

There is no CORS problem in development, because the mock API runs inside the
page itself. The real backend will need it if it runs on a different origin.

The fix belongs on the backend because CORS protects the **server's** data:
it is the server's decision which websites may read its answers, and it says
so in its response headers. The browser enforces that decision. Nothing in
the frontend can give itself permission, which is the point: otherwise any
website could. (Turning CORS off in one browser only hides the problem on one
machine.) The backend should:

- Answer with `Access-Control-Allow-Origin` set to the exact frontend origins
  it trusts, never `*`, especially once cookies or tokens are involved.
- Allow the methods (`GET`, `POST`, `PATCH`, `DELETE`) and headers
  (`Content-Type`, `Authorization`) this contract uses, and answer `OPTIONS`
  preflight requests.
- Send `Access-Control-Expose-Headers: Location`, so the frontend can read
  the `Location` header on `201 Created`.

Serving the frontend and `/api/v1` from the same origin (with a reverse
proxy in front of both) avoids CORS altogether.
