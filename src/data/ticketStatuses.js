// The four board columns, in the order a ticket moves through them.
export const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']

// Column headings. The stored values are uppercase keys, not display text.
export const STATUS_LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

// A ticket here has nowhere further to go, so it gets no "Move to next".
export const LAST_STATUS = STATUS_ORDER[STATUS_ORDER.length - 1]
