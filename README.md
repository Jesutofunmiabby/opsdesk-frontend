# OpsDesk

An internal operations dashboard for an IT support team, built as a Week 1
internship project. It brings together three things a support team needs day to
day — a staff directory, a ticket board, and a list of user accounts — behind
one set of navigation, with a dashboard summarising all of them.

Built with **React + Vite**, plain **JavaScript** and plain **CSS**. No
routing library, no TypeScript, and no UI framework: everything here is written
by hand so the underlying React ideas stay visible.

## Running it

You need [Node.js](https://nodejs.org) (an LTS release; developed on v22).

```bash
npm install     # install dependencies, once
npm run dev     # start the dev server
```

Then open the URL it prints, usually <http://localhost:5173/>.

Other commands:

```bash
npm run build   # production build into dist/
npm run lint    # check the code with Oxlint
npm run preview # serve the production build locally
```

## The pages

Navigation lives in the blue header. One page shows at a time; the app opens on
the Dashboard.

### Dashboard
Summary cards across two groups:

- **Tickets by status** — how many tickets sit in Open, In progress, Resolved
  and Closed. These are counted from the same array the ticket board edits, so
  moving a ticket updates the dashboard.
- **Organisation** — the number of employees, the number of departments, and
  the number of user accounts. The user count is fetched from an API, so that
  card shows its own loading and error states, with a Retry button.

### Tickets
A board of four columns, one per status, with a ticket count in each column
header. Each ticket shows its title and a colour-coded priority label — blue
for LOW, amber for MEDIUM, red for HIGH. **Move to next** advances a ticket to
the following status; tickets already Closed have nowhere to go, so they have
no button.

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
  App.jsx            the shell: header, navigation, and which page is showing
  main.jsx           entry point
  index.css          theme: every colour and shape variable lives here
  App.css            shell layout
  components/        small reusable pieces; take props, own no state
  pages/             full screens; own their state and compose components
  hooks/             reusable logic that uses React state
  utils/             pure helper functions, no React
  data/              mock data
```

The guiding rule is **where state lives**:

- **`utils/`** — plain functions. Given the same input they return the same
  output, with no React involved: `getInitials`, `filterEmployees`,
  `countTicketsByStatus`, `moveTicketToNextStatus`.
- **`hooks/`** — reusable logic that *does* need React state. `useFetch` owns a
  request and reports one of four statuses; `useUsers` wraps it with this
  project's endpoint so pages do not repeat the URL.
- **`components/`** — presentational. A card is handed an employee and draws
  it; it never reaches outside itself.
- **`pages/`** — own the state their section needs and pass it down.
- **`App.jsx`** — owns only what more than one page needs: which page is
  showing, and the tickets. The tickets sit here rather than in the tickets
  page because a page unmounts when you navigate away, which would reset the
  board, and because the dashboard has to count the same array.

`data/` holds mock data, so the directory and board work with no backend. Only
the users list talks to a real API.

## Project conventions

**Design.** Light theme, white surfaces, blue accents. Every colour comes from
the variables in `src/index.css` — no hard-coded colours in component styles,
so the whole app can be re-themed from one place. Ticket priority labels are
colour-coded: blue for LOW, amber for MEDIUM, red for HIGH.

**Dependencies.** No new npm packages without discussing it first. No
TypeScript and no routing library yet — both come later.

**Git workflow.** Nothing is committed straight to `main`. Every change goes
through a GitHub issue, then a feature branch, then a pull request. Commits are
kept small, with messages saying what changed and why.

**Components.** Small and focused, one component per file.
