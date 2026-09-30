# OpsDesk

An internal operations dashboard for an IT support team, built as an
internship project. It brings together what a support team needs day to day —
tickets, a staff directory, projects and a list of user accounts — behind one
set of navigation, with a dashboard summarising them.

Built with **React + Vite**, **TypeScript**, **React Router** and plain
**CSS**. No UI framework: everything here is written by hand so the underlying
React ideas stay visible.

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

### How to run it

```bash
npm install         # install dependencies, once
npm run dev         # start the app at http://localhost:5173/
```

To check the code:

```bash
npm run typecheck   # TypeScript type check
npm run lint        # Oxlint
npm run build       # type check, then production build into dist/
```

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

## The pages

Navigation lives in the blue header, and the current page is highlighted. Each
page has its own URL; `/` opens the Dashboard.

### Dashboard
Summary cards across two groups:

- **Tickets by status** — how many tickets sit in Open, In progress, Resolved
  and Closed. These are counted from the same array the ticket board edits, so
  moving a ticket updates the dashboard.
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

## Folder structure

```
src/
  main.tsx           entry point: the router around the app
  App.tsx            the shared tickets around every route
  index.css          theme: every colour and shape variable lives here
  features/
    tickets/         components/, hooks/, data/, utils/, types.ts
    employees/       components/, data/, utils/, types.ts
    users/           components/, hooks/, types.ts
    projects/        components/, data/, types.ts
  components/        UI shared by several features: FormField, NavBar, StatCard
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
  `validateTicket`, `moveTicketToNextStatus`.
- **`hooks/`** — logic that *does* need React state. The tickets live in
  `TicketsProvider`, shared through React context and read with `useTickets`,
  so the dashboard, board, list and ticket pages all use the same tickets.
  `useUsers` wraps the shared `useFetch` with the users API address.
- **`components/`** — the feature's pieces, from a single card up to a whole
  board or list.
- **`types.ts`** — the TypeScript types for the feature's data.

`data/` folders hold mock data, so tickets, the directory and projects work
with no backend. Only the users list talks to a real API.

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
