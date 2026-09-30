// Mock IT support tickets for the board.
// No backend yet — this is the starting array that TicketsProvider copies
// into state. Priority is LOW | MEDIUM | HIGH, status is one of STATUS_ORDER.

const tickets = [
  {
    id: 1,
    title: 'Laptop will not connect to the office Wi-Fi',
    description:
      'Since this morning the laptop sees the office network but fails to connect, saying the password is wrong. Other devices at the same desk connect fine.',
    priority: 'HIGH',
    status: 'OPEN',
  },
  {
    id: 2,
    title: 'Request a second monitor for the finance desk',
    description:
      'The finance desk works across several spreadsheets at once and would like a second monitor. A spare monitor and cable are needed.',
    priority: 'LOW',
    status: 'OPEN',
  },
  {
    id: 3,
    title: 'Shared drive permissions missing for new starter',
    description:
      'A new starter in marketing cannot open the Marketing folder on the shared drive. They need the same access as the rest of their team.',
    priority: 'MEDIUM',
    status: 'OPEN',
  },
  {
    id: 4,
    title: 'Payroll export fails with a timeout error',
    description:
      'The monthly payroll export stops after about a minute with a timeout error. It needs to run before the payroll deadline on Friday.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
  },
  {
    id: 5,
    title: 'Meeting room projector shows no signal',
    description:
      'The projector in the second-floor meeting room shows "No signal" with any laptop. The HDMI cable has already been swapped.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
  },
  {
    id: 6,
    title: 'Install the design software licence on a spare machine',
    description:
      'The design team needs the design software licence installed on a spare machine for a contractor starting next week.',
    priority: 'LOW',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    title: 'Password reset for the warehouse tablet',
    description:
      'The warehouse tablet is locked after too many wrong password attempts. The team needs it reset to scan deliveries.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
  },
  {
    id: 8,
    title: 'Email signatures missing the new company logo',
    description:
      'Email signatures still show the old company logo. All staff signatures need updating to the new logo.',
    priority: 'LOW',
    status: 'RESOLVED',
  },
  {
    id: 9,
    title: 'VPN drops every few minutes for remote staff',
    description:
      'Remote staff lose their VPN connection every few minutes, which interrupts calls and file transfers.',
    priority: 'HIGH',
    status: 'CLOSED',
  },
  {
    id: 10,
    title: 'Replace a faulty keyboard at the front desk',
    description:
      'Several keys on the front desk keyboard have stopped working. It needs replacing with a standard office keyboard.',
    priority: 'LOW',
    status: 'CLOSED',
  },
]

export default tickets
