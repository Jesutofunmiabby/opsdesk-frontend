# State notes

Where each piece of state in OpsDesk lives, and where it should live.

## The three kinds of state

- **Local state:** used by one component (and the children it passes it to).
  It lives in that component with `useState`.
- **Shared UI state:** about how the app looks or behaves, and needed by
  several components in different parts of the page. It lives in one shared
  place: the Redux store.
- **Server state:** data that really belongs to a server. The app only holds a
  copy, which has to be loaded, can be out of date, and can fail to load. It
  is handled by RTK Query, not `useState` or Redux slices.

Pick the lowest kind that works: local first, shared UI only when several
distant components need it, and server state for anything that comes from an
API.

## Every piece of state

### Tickets

- tickets (`TicketsProvider`, shared through `TicketsContext` and read with
  `useTickets`) -> server state (will come from an API). Right now it is held
  in `useState` and passed through context because the board, list, dashboard
  and ticket pages all need it, but it is real data, not UI. RTK Query
  will load it from `/api/tickets`.
- tickets saved in localStorage (`opsdesk.tickets`, in `ticketStorage.ts`)
  -> server state (goes away). It stands in for a backend so changes survive
  a refresh. The mock API takes over that job.
- moveTicket, addTicket, updateTicket (`TicketsProvider`) -> server state
  (become RTK Query mutations). They change the ticket data, so they will
  become `PATCH` and `POST` requests.

### Tickets page and list

- query, the search term on the tickets list (`TicketList`) -> local (only
  the list uses it).
- status filter on the tickets list (`TicketList`) -> local (only the list
  and its filter controls use it).
- page number on the tickets list (`TicketList`) -> local (only the list and
  its pagination use it).
- view, board or list (`TicketsPage`, `?view=list` in the URL) -> URL / local
  (stays in the URL). Only the tickets page uses it, and keeping it in the URL
  means refresh and Back return to the same view.
- id from the route, `/tickets/:id` (`TicketDetailPage`, `EditTicketPage`)
  -> URL / local (stays in the URL). It says which ticket to show, and putting
  it in the URL is what makes ticket links work.

### Ticket form

- values: title, description and priority being typed (`TicketForm`) ->
  local (only the form uses them until it is saved).
- triedToSubmit (`TicketForm`) -> local (only the form decides when to show
  its errors).

### Users

- users list, with its loading, error and retry state (`useFetch` through
  `useUsers`, used by `UserList` and `DashboardPage`) -> server state (comes
  from the dummyjson API). It is fetched by hand with `useEffect` and
  `useState`, and the two pages each fetch it separately. A server-state tool
  would share one cached copy.

### Team directory

- nameQuery (`EmployeeDirectory`) -> local (only the directory searches by
  it).
- department filter (`EmployeeDirectory`) -> local (only the directory
  filters by it).
- selectedEmployee (`EmployeeDirectory`) -> local (only the directory shows
  the open employee's details).

### New this week

- sidebarCollapsed -> shared UI (Redux). The toggle button and the layout
  are in different parts of the page, and both need to know if the sidebar
  is collapsed.
- notifications -> shared UI (Redux). Any page can add one ("Ticket created")
  and one place on screen shows and dismisses them, so many unrelated
  components need the same list.

### Not state

- employees and projects (`data/employees.ts`, `data/projects.ts`) -> fixed
  data. They never change while the app runs, so they are plain imports.
- Filtered and paged lists, form errors, dashboard counts -> worked out
  during render from the state above, not stored separately.

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
  are what RTK Query is for. Copying tickets into a Redux slice would mean
  writing all of that by hand, and keeping two copies of the data in step.

Redux is kept for the few things that are UI-only and truly needed by
components far apart: this week, `sidebarCollapsed` and `notifications`.
