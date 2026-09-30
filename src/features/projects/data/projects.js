// Mock internal IT projects for the Projects page.
// No backend yet. Status is one of PROJECT_STATUS_LABELS' keys; dueDate is an
// ISO date string (YYYY-MM-DD) so it sorts and parses reliably.

const projects = [
  {
    id: 1,
    name: 'Laptop refresh for the sales team',
    owner: 'Amara Okafor',
    status: 'IN_PROGRESS',
    dueDate: '2026-10-23',
  },
  {
    id: 2,
    name: 'Move file storage to the cloud',
    owner: 'Daniel Mensah',
    status: 'PLANNING',
    dueDate: '2026-12-11',
  },
  {
    id: 3,
    name: 'Roll out multi-factor sign-in',
    owner: 'Priya Shah',
    status: 'IN_PROGRESS',
    dueDate: '2026-11-06',
  },
  {
    id: 4,
    name: 'Upgrade the office Wi-Fi access points',
    owner: 'Tom Adeyemi',
    status: 'ON_HOLD',
    dueDate: '2026-11-27',
  },
  {
    id: 5,
    name: 'New starter onboarding checklist',
    owner: 'Grace Bello',
    status: 'COMPLETE',
    dueDate: '2026-09-18',
  },
  {
    id: 6,
    name: 'Replace meeting room displays',
    owner: 'Samuel Eze',
    status: 'PLANNING',
    dueDate: '2027-01-15',
  },
]

export default projects
