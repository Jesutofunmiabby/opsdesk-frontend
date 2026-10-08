# OpsDesk

An internal operations dashboard for an IT support team, built as an
internship project. It brings together what a support team needs day to day —
tickets, a staff directory, projects and a list of user accounts — behind one
set of navigation, with a dashboard summarising them.

Built with **React + Vite**, **TypeScript**, **React Router** and plain
**CSS**. No UI framework: everything here is written by hand so the underlying
React ideas stay visible.

## Week 3

### What changed this week

- **Redux for shared UI state.** A Redux Toolkit store holds the two pieces of
  UI state that distant parts of the page share: whether the sidebar is
  collapsed (the header button and the sidebar both read it), and the stack of
  notifications that any page can add to. Server data such as tickets is never
  kept in a Redux slice.
- **Collapsible sidebar and notifications.** Navigation moved into a sidebar
  that collapses to a narrow bar of letters. Creating or editing a ticket
  shows a success notification in the corner, and a save or move that fails
  shows an error one. Each closes itself after a few seconds, or straight
  away with its dismiss button.
- **Tickets from an API with RTK Query.** Tickets are loaded with RTK Query
  instead of `useState` and `useEffect`. The board, list, dashboard and ticket
  pages share one cached copy. Each page shows a loading message while the
  request runs and an error with a Retry button if it fails, using RTK
  Query's `isLoading` and `isError`. Creating, editing and moving tickets are
  RTK Query mutations; each one marks the tickets it changed as out of date
  (`invalidatesTags`), so the list refreshes by itself.
- **Mock API with MSW.** The tickets API is mocked until the real backend
  exists. See [Ticket data is mocked](#ticket-data-is-mocked).
- **Performance.** The Projects and Users pages are lazy-loaded with
  `React.lazy` and `Suspense`, so their code only downloads when they are
  opened. The ticket list's search and status filter are wrapped in `useMemo`,
  so turning the page does not redo the filtering.
- **Accessibility.** A skip link, better contrast, clearer focus rings and
  more. See [Accessibility](#accessibility).
- **Tests.** The first automated tests, run with `npm test`: a component test
  for the ticket card, an integration test for the create form's empty title
  error, a test for the list's search and filter helper, and tests for the
  skip link. See [Running the tests](#running-the-tests).

## Week 2

### What changed this week

- **Routing.** React Router gives every page its own URL: `/dashboard`,
  `/tickets`, `/tickets/:id`, `/tickets/new`, `/tickets/:id/edit`,
  `/projects`, `/teams` and `/users`. `/` goes to the dashboard, and any other
  URL shows a Not Found page with a link back. Every page sits inside a shared
  Layout with the blue header, whose navigation highlights the current page.
  Refresh, Back and Forward all work, and any page can be bookmarked.
- **Ticket pages.** Each ticket has its own page, found from the id in the URL,
  showing its description, status and priority. An unknown id shows "Ticket
  not found". Every card on the board links to its ticket.
- **Forms.** New tickets are created at `/tickets/new` and edited at
  `/tickets/:id/edit`, with one form used for both. The title is required and
  must be at least 3 characters; the description is required. Each problem is
  shown in red directly under its field, and nothing is saved until it is
  fixed. New tickets start as Open.
- **TypeScript.** The whole project is now TypeScript. Tickets, employees,
  users and projects each have a type, every component's props are typed, and
  `any` is never used. The build runs the type check first, so a type error
  stops it.
- **Feature folders.** Code is grouped by feature under `src/features/`
  (tickets, employees, users, projects), with each feature's components,
  hooks, data, helpers and types together. See [Folder
  structure](#folder-structure).
- **Ticket list.** The Tickets page switches between the board and a list. The
  list can be searched by title and filtered by status, shows 10 tickets per
  page with Previous and Next buttons and "Page X of Y", and goes back to page
  1 whenever the search or filter changes. A message shows when nothing
  matches, and each row links to its ticket.
- **Saved tickets.** Tickets are saved in the browser's localStorage, so
  created, edited and moved tickets survive a refresh. On start the app loads
  the saved tickets, and falls back to the 25 mock tickets if nothing is saved
  or the saved data is broken. To start again from the mock tickets, remove
  the `opsdesk.tickets` entry from localStorage in your browser's developer
  tools (or clear the site's data).
- **Projects.** A new Projects page shows six internal IT projects with their
  owner, status and due date.

## Running it

You need [Node.js](https://nodejs.org) (an LTS release; developed on v22).

```bash
npm install     # install dependencies, once
npm run dev     # start the dev server
```

After `npm run dev` the app runs at <http://localhost:5173/>. Vite prints the
URL on start, and picks a different port if 5173 is already in use.

Other commands:

```bash
npm run typecheck # check the TypeScript types
npm run build     # type check, then production build into dist/
npm run lint      # check the code with Oxlint
npm run preview   # serve the production build locally
```

### Running the tests

```bash
npm test               # run the tests and watch for changes
npm test -- --run      # run the tests once and stop
```

The tests use Vitest and React Testing Library and run in jsdom, a pretend
browser, so no real browser is needed. Test files sit next to the code they
test, named `*.test.ts` or `*.test.tsx`.

### Ticket data is mocked

There is no real tickets backend yet. Until there is, ticket data comes from a
mock API built with [MSW](https://mswjs.io) (Mock Service Worker), in
`src/mocks/`. It catches the app's requests to `/api/tickets` in the browser
and answers them as a real server would, after a short delay so the loading
states can be seen. Changes are kept in the browser's localStorage, so they
survive a refresh; remove the `opsdesk.tickets` entry (or clear the site's
data) to go back to the 25 starting tickets.

The app itself only ever talks to `/api/tickets` through RTK Query, so when
the real backend exists, the mock can be removed without changing any page.
The mock only starts under `npm run dev`; a production build (`npm run
preview`) has no tickets API yet, so the ticket pages show their error state.

## The pages

Navigation lives in the sidebar, and the current page is highlighted. The
menu button in the blue header collapses the sidebar to a narrow bar of
letters. Each page has its own URL; `/` opens the Dashboard.

### Dashboard
Summary cards across two groups:

- **Tickets by status** — how many tickets sit in Open, In progress, Resolved
  and Closed. These are counted from the same RTK Query cache the ticket board
  uses, so moving a ticket updates the dashboard.
- **Organisation** — the number of employees, the number of departments, and
  the number of user accounts. The user count is fetched from an API, so that
  card shows its own loading and error states, with a Retry button.

### Tickets
Two views, switched with the **Board** and **List** buttons:

- **Board** — four columns, one per status, with a ticket count in each column
  header. Each ticket shows its title and a colour-coded priority label — blue
  for LOW, amber for MEDIUM, red for HIGH. **Move to next** advances a ticket
  to the following status; tickets already Closed have nowhere to go, so they
  have no button.
- **List** — a table of tickets with a title search, a status filter and 10
  tickets per page.

Clicking a ticket opens its own page, with an **Edit** button. **New ticket**
opens the create form.

### Projects
Internal IT projects as cards, each with its status, owner and due date.

### Teams
The employee directory: a card per employee with their initials, name, role and
department. Search by name as you type (case-insensitive), filter by
department, or combine the two. Clicking a card opens a details panel with
their role, department, email and phone, and highlights the card. A message
appears when nothing matches.

### Users
User accounts loaded from the public [DummyJSON](https://dummyjson.com) API,
shown as cards with a name, job title, email and company. Because the data is
fetched, this page handles four outcomes: a loading message, the cards on
success, a friendly message when the list comes back empty, and an error
message with a Retry button when the request fails.

## Accessibility

The whole app can be used with a keyboard alone. Every link, button and form
control can be reached with **Tab**, used with **Enter** (and **Space** for
buttons), and shows a solid blue focus ring when it has keyboard focus. Text
labels sit on every form control, every clickable thing is a real `<button>`
or link, and the app has no images that would need alt text.

Fixes made while checking this:

- **Skip link.** There was no way past the navigation: a keyboard user had to
  tab through the menu button and all five sidebar links on every page before
  reaching its content. A "Skip to main content" link is now the first thing
  Tab reaches. It is hidden until focused, and pressing it moves focus into the
  page. A test checks that it does.
- **Placeholder contrast.** The placeholder text in the ticket search and the
  employee search was faded to 70%, giving a contrast of about 3.2:1 against
  white, below the 4.5:1 that text needs. It is now full strength, about
  6.3:1.
- **Form focus ring.** Form fields showed focus with only a faint blue wash.
  On a field with an error the red border stayed and the wash turned a faint
  red, so a focused field looked almost the same as an unfocused one. Fields
  now use the same solid blue focus ring as every other control, and a field
  with an error keeps its red border as well.
- **Board column counts.** The number beside each column heading was read out
  on its own, as just "3". Hidden text now makes it "3 tickets" for screen
  readers, with no change on screen.
- **Email links.** The email links on the Users page and in the employee
  details panel had only the browser's default focus outline. They now use the
  app's blue focus ring like everything else.

## Folder structure

```
src/
  main.tsx           entry point: starts the mock API, then renders the app
                     inside the Redux store and the router
  App.tsx            the app's routes
  index.css          theme: every colour and shape variable lives here
  store/             Redux: the store, uiSlice (sidebar and notifications)
                     and ticketsApi (RTK Query, for tickets)
  mocks/             the MSW mock tickets API and its localStorage saving
  features/
    tickets/         components/, hooks/, data/, utils/, types.ts
    employees/       components/, data/, utils/, types.ts
    users/           components/, hooks/, types.ts
    projects/        components/, data/, types.ts
  components/        UI shared by several features: FormField, Sidebar,
                     Notifications, SkipLink, StatCard
  hooks/             shared hooks: useFetch
  utils/             shared helpers: formatDate, getInitials
  layouts/           Layout: the blue header, navigation, and page area
  routes/            AppRoutes: every URL and the page it shows
  pages/             thin pages that put feature components together
```

The guiding rule is **keep each feature together**. Everything about tickets
— its components, hooks, mock data, helpers and types — lives in
`features/tickets/`. Only code that more than one feature uses goes in the
shared `components/`, `hooks/` and `utils/` folders.

Inside a feature:

- **`utils/`** — plain functions. Given the same input they return the same
  output, with no React involved: `filterTickets`, `paginate`,
  `validateTicket`, `getNextStatus`.
- **`hooks/`** — logic that *does* need React. `useTicketFromUrl` reads the
  ticket id from the URL and loads that ticket with RTK Query, for the detail
  and edit pages. `useUsers` wraps the shared `useFetch` with the users API
  address.
- **`components/`** — the feature's pieces, from a single card up to a whole
  board or list.
- **`types.ts`** — the TypeScript types for the feature's data.

Tickets themselves are not held by any feature: they come from the tickets
API through RTK Query (`store/ticketsApi.ts`), which keeps one cached copy for
the dashboard, board, list and ticket pages.

`data/` folders hold static data, so the directory and projects work with no
backend. `features/tickets/data/tickets.ts` holds the starting tickets the
mock API serves. Only the users list talks to a real API.

## Project conventions

**Design.** Light theme, white surfaces, blue accents. Every colour comes from
the variables in `src/index.css` — no hard-coded colours in component styles,
so the whole app can be re-themed from one place. Ticket priority labels are
colour-coded: blue for LOW, amber for MEDIUM, red for HIGH.

**Dependencies.** No new npm packages without discussing it first.

**TypeScript.** All code is TypeScript. `any` is never used to silence an
error.

**Git workflow.** Nothing is committed straight to `main`. Every change goes
through a GitHub issue, then a feature branch, then a pull request. Commits are
kept small, with messages saying what changed and why.

**Components.** Small and focused, one component per file.
