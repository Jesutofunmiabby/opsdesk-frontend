// Mock IT support tickets for the board.
// No backend yet — this is the starting array that TicketsPage copies into
// state. Priority is LOW | MEDIUM | HIGH, status is one of STATUS_ORDER.

const tickets = [
  {
    id: 1,
    title: 'Laptop will not connect to the office Wi-Fi',
    priority: 'HIGH',
    status: 'OPEN',
  },
  {
    id: 2,
    title: 'Request a second monitor for the finance desk',
    priority: 'LOW',
    status: 'OPEN',
  },
  {
    id: 3,
    title: 'Shared drive permissions missing for new starter',
    priority: 'MEDIUM',
    status: 'OPEN',
  },
  {
    id: 4,
    title: 'Payroll export fails with a timeout error',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
  },
  {
    id: 5,
    title: 'Meeting room projector shows no signal',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
  },
  {
    id: 6,
    title: 'Install the design software licence on a spare machine',
    priority: 'LOW',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    title: 'Password reset for the warehouse tablet',
    priority: 'MEDIUM',
    status: 'RESOLVED',
  },
  {
    id: 8,
    title: 'Email signatures missing the new company logo',
    priority: 'LOW',
    status: 'RESOLVED',
  },
  {
    id: 9,
    title: 'VPN drops every few minutes for remote staff',
    priority: 'HIGH',
    status: 'CLOSED',
  },
  {
    id: 10,
    title: 'Replace a faulty keyboard at the front desk',
    priority: 'LOW',
    status: 'CLOSED',
  },
]

export default tickets
