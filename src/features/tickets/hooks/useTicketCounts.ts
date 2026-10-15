import { useGetTicketsQuery } from '../../../store/ticketsApi'
import type { TicketStatus } from '../types'

export interface TicketCounts {
  // How many tickets are in each status. Undefined until they have loaded.
  counts: Record<TicketStatus, number> | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

// How many tickets are in each status, for the dashboard. Each count is the
// totalItems of a one-ticket page filtered to that status, so the server does
// the counting and the numbers stay right however many tickets there are.
// Written out once per status, because hooks cannot be called in a loop.
export function useTicketCounts(): TicketCounts {
  const open = useGetTicketsQuery({ status: 'OPEN', size: 1 })
  const inProgress = useGetTicketsQuery({ status: 'IN_PROGRESS', size: 1 })
  const resolved = useGetTicketsQuery({ status: 'RESOLVED', size: 1 })
  const closed = useGetTicketsQuery({ status: 'CLOSED', size: 1 })
  const all = [open, inProgress, resolved, closed]

  const counts =
    open.data && inProgress.data && resolved.data && closed.data
      ? {
          OPEN: open.data.totalItems,
          IN_PROGRESS: inProgress.data.totalItems,
          RESOLVED: resolved.data.totalItems,
          CLOSED: closed.data.totalItems,
        }
      : undefined

  return {
    counts,
    isLoading: all.some((query) => query.isLoading),
    isError: all.some((query) => query.isError),
    // Asks again for every count, so a Retry fixes whichever failed.
    refetch: () => all.forEach((query) => query.refetch()),
  }
}
