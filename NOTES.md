# State notes

Where each piece of state in OpsDesk lives, and why. This describes the app
as released in v1.1.0, running against the real backend.

## The kinds of state

- **Local state:** used by one component (and the children it passes it to).
  It lives in that component with `useState`.
- **URL state:** what should survive a refresh or the Back button, such as
  which ticket is open. It lives in the address, read with React Router.
- **Shared UI state:** about how the app looks or behaves, and needed by
  several components in different parts of the page. It lives in the Redux
  store (`src/store/`).
- **Server state:** data that really belongs to the backend. The app only
  holds a copy, which has to be loaded, can be out of date, and can fail to
  load. It is loaded with RTK Query, or, for two older pages, with the
  `useFetch` hook.

Pick the lowest kind that works: local first, the URL when a refresh or a
link should keep it, shared UI only when several distant components need it,
and server state for anything that comes from the API.

## The Redux store

`src/store/store.ts` builds one store with four parts:

| Key | What it holds | Kind |
| --- | --- | --- |
| `ui` (`uiSlice.ts`) | `sidebarCollapsed` and `notifications` | Shared UI |
| `auth` (`authSlice.ts`) | The login `token` and `sessionExpired` | Shared UI (who is signed in on this browser) |
| `ticketsApi` (`ticketsApi.ts`) | RTK Query's cache of tickets | Server state |
| `authApi` (`authApi.ts`) | RTK Query's cache of the signed-in user | Server state |

Tests build a new store each with `makeStore()`, so cached data, tokens and
notifications never leak from one test to the next.

## Login, the token and roles

- **The token** comes from `POST /auth/login` or `POST /auth/register` and
  goes into the `auth` slice (`loggedIn`). A listener in `store.ts` keeps a
  copy in localStorage (`opsdesk.token`, see `tokenStorage.ts`), so a refresh
  does not sign people out. Why localStorage, and the safer options for a
  later version, are under "Security" in [API_CONTRACT.md](API_CONTRACT.md).
- **Every request carries it.** `baseQuery.ts` adds
  `Authorization: Bearer <token>` to every RTK Query request, and `useFetch`
  does the same for its requests.
- **A 401 ends the session.** If the API refuses the token, the base query
  (or `useFetch`) dispatches `sessionExpired`: the token is removed, the
  `sessionExpired` flag is set, and the login page says "Your session
  expired. Please log in again." A 401 from the login endpoint itself only
  means a wrong password, so it does not end anything.
- **Log out** (`loggedOut`) removes the token. When the token goes away for
  any reason, the listener also empties both RTK Query caches, so the next
  person to log in on this browser never sees the last person's tickets.
- **Who is signed in** (name and role) is server data, not part of the
  `auth` slice. `useCurrentUser` reads it from `GET /auth/me` through
  `authApi`, and every component that asks shares one cached request.
- **Roles.** `usePermissions` turns the user's role into
  `canDeleteTickets`, `canAssignTickets` and `canListUsers`, using the rules
  in `features/auth/utils/permissions.ts`. They only decide which buttons
  and links to show. The backend checks every request itself, and a 403 it
  sends back is shown as a friendly message.
- **Protected pages.** `ProtectedRoute` sends anyone without a token to
  `/login`, passing the page they wanted in the router's location state, so
  login can take them back there (`returnPath.ts`).

## Every piece of state

### Tickets

- tickets (`ticketsApi`) -> server state, RTK Query. `getTickets` loads one
  page (`GET /tickets` with paging, filters and sort) and `getTicket` loads
  one ticket. Each set of parameters is cached on its own. Creating,
  editing, moving, assigning and deleting are mutations, and they refresh
  the cached lists through `invalidatesTags`.
- board (`TicketsPage`) -> server state. One page of the largest size the
  API allows, skipped while the list view is showing.
- dashboard counts (`useTicketCounts`) -> server state. One request per
  status with `size=1`, reading `totalItems`, so the server does the
  counting.
- view, board or list (`TicketsPage`, `?view=list`) -> URL. Refresh and Back
  return to the same view.
- id from the route, `/tickets/:id` (`useTicketFromUrl`, used by the detail
  and edit pages) -> URL. It says which ticket to load, and it is what makes
  ticket links work.
- movesFrom (`TicketBoard`) -> local. Which tickets are being moved, so a
  Move button cannot be pressed twice for one move.
- confirmOpen (`TicketDetailPage`) -> local. Whether the delete
  confirmation dialog is open.

### Ticket list

- query, status, priority, sort and page (`TicketList`) -> local. Only the
  list and its controls use them. They are sent to the API as query
  parameters, so the server does the searching, filtering, sorting and
  paging. The search term is debounced (`useDebouncedValue`) so a request is
  not sent on every key press.

### Forms

- values, triedToSubmit and serverErrors (`TicketForm`, and `useAuthForm`
  for login and register) -> local. Only the form uses them until it is
  sent. Field errors from a 400 `VALIDATION_ERROR` are shown under the
  matching fields.
- fieldError (`AssignTicket`) -> local.

### Users and projects

- users (`useUsers`, `GET /users`) and projects (`useProjects`,
  `GET /projects`) -> server state, loaded with `useFetch` (`useEffect` and
  `useState`). Each page that needs them fetches its own copy. Moving them
  to RTK Query would share one cached copy, as tickets do.

### Team directory

- nameQuery, department and selectedEmployee (`EmployeeDirectory`) ->
  local. Only the directory uses them.

### Shared UI

- sidebarCollapsed -> Redux (`ui`). The toggle button and the layout are in
  different parts of the page, and both need to know.
- notifications -> Redux (`ui`). Any page can add one ("Ticket created"),
  and one place on screen shows and dismisses them.
- paused (`NotificationItem`) -> local. Stops a notification from closing
  while the mouse is over it or it has keyboard focus.

### Not state

- employees (`features/employees/data/employees.ts`) -> fixed data. The
  backend has no endpoint for staff, so the Teams page and the dashboard's
  employee and department counts use this list built into the app.
- The mock data in `features/projects/data/` and `features/users/data/`,
  and `src/mocks/` -> used only by the tests. The MSW mock API answers as
  API_CONTRACT.md says, and keeps its tickets in localStorage
  (`opsdesk.tickets`) in place of a database. The running app never uses
  them.
- Dashboard numbers, labels and anything else worked out from the state
  above -> worked out during render, not stored separately.

## Why most state stays local, not in Redux

- **Easier to follow.** State next to the component that uses it can be read
  in one file. State in a global store can be changed from anywhere, so
  finding out why it changed means searching the whole app.
- **Cleaned up for free.** Local state disappears when its component goes
  away. A search term in Redux would still be there next time you open the
  page, unless someone writes code to clear it.
- **Less code.** One `useState` line does the job of a slice, an action, a
  selector and `useDispatch`.
- **Components stay reusable.** A component that keeps its own state works
  anywhere, without needing a store set up around it.
- **Server data has its own tool.** Loading, caching, errors and refreshing
  are what RTK Query is for. Copying tickets or the signed-in user into a
  Redux slice would mean writing all of that by hand, and keeping two copies
  of the data in step.

Redux is kept for the few things that are UI-only and needed by components
far apart (`sidebarCollapsed`, `notifications`), and for the login token,
which the request code, the protected routes and the login page all need.
