import type { Ticket } from '../types'

// Mock IT support tickets for the board.
// No backend yet — this is the starting data for the mock API in
// src/mocks/handlers.ts, used until anything has been saved. The Ticket type
// checks every entry: a typo in a priority or status, or a missing field, is
// an error.
const tickets: Ticket[] = [
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
  {
    id: 11,
    title: 'Printer on the third floor jams on every job',
    description:
      'The shared printer on the third floor jams on every print job, even single pages. A replacement roller may be needed.',
    priority: 'MEDIUM',
    status: 'OPEN',
  },
  {
    id: 12,
    title: 'New starter needs a laptop and accounts by Monday',
    description:
      'A new analyst starts in finance on Monday and needs a laptop, an email account and access to the finance shared drive.',
    priority: 'HIGH',
    status: 'OPEN',
  },
  {
    id: 13,
    title: 'Outlook calendar not syncing on a mobile phone',
    description:
      "Calendar changes made in Outlook do not appear on one manager's phone. Email on the same phone works normally.",
    priority: 'LOW',
    status: 'OPEN',
  },
  {
    id: 14,
    title: 'Suspicious email reported by several staff',
    description:
      'Several people received an email asking them to confirm their password on an unknown site. It needs checking and blocking.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
  },
  {
    id: 15,
    title: 'Conference call audio cuts out in the boardroom',
    description:
      'Remote participants hear the boardroom audio cut out every few minutes. The speakerphone firmware may be out of date.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
  },
  {
    id: 16,
    title: 'Request access to the reporting dashboard',
    description:
      'A team lead in operations needs read-only access to the monthly reporting dashboard.',
    priority: 'LOW',
    status: 'OPEN',
  },
  {
    id: 17,
    title: 'Laptop battery drains within an hour',
    description:
      'A sales laptop runs out of battery within an hour of being unplugged. The battery may need replacing.',
    priority: 'MEDIUM',
    status: 'OPEN',
  },
  {
    id: 18,
    title: 'Shared mailbox missing from Outlook',
    description:
      'The customer service shared mailbox has disappeared from Outlook for two team members since yesterday.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
  },
  {
    id: 19,
    title: 'Set up a laptop for a returning contractor',
    description:
      'A contractor returns next week and needs their old laptop wiped, updated and set up again.',
    priority: 'LOW',
    status: 'RESOLVED',
  },
  {
    id: 20,
    title: 'Website contact form not sending emails',
    description:
      'Messages sent through the website contact form are not reaching the sales inbox.',
    priority: 'HIGH',
    status: 'RESOLVED',
  },
  {
    id: 21,
    title: 'Software update stuck on a reception PC',
    description:
      'A software update has been stuck at 30% on the reception PC since this morning.',
    priority: 'LOW',
    status: 'IN_PROGRESS',
  },
  {
    id: 22,
    title: 'Lost phone needs to be locked and wiped',
    description:
      'A member of the field team has lost their work phone. It needs to be locked remotely and wiped.',
    priority: 'HIGH',
    status: 'CLOSED',
  },
  {
    id: 23,
    title: "Extra storage for the design team's shared drive",
    description:
      "The design team's shared drive is almost full. They are asking for more storage.",
    priority: 'MEDIUM',
    status: 'RESOLVED',
  },
  {
    id: 24,
    title: 'Webcam not detected in video calls',
    description:
      "A laptop's built-in webcam is not detected by the video call app, though it works in the camera app.",
    priority: 'LOW',
    status: 'OPEN',
  },
  {
    id: 25,
    title: 'Backup job failed overnight on the file server',
    description:
      "Last night's backup of the file server failed with a disk space error. It needs fixing before tonight's run.",
    priority: 'HIGH',
    status: 'OPEN',
  },
]

export default tickets
