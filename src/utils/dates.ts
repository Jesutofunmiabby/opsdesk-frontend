// Turns an ISO date string such as '2026-10-23' into '23 Oct 2026'.
// The date is read as UTC and shown as UTC, so it never shifts a day in a
// timezone behind or ahead of the one it was written in.
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
