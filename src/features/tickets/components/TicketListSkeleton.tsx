import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import { TICKETS_PER_PAGE } from '../utils/ticketList'
import './TicketListFilters.css'
import './TicketList.css'
import './TicketTable.css'
import './Pagination.css'

// Title widths for the placeholder rows, repeated down the table, so the
// rows look like real titles of different lengths.
const TITLE_WIDTHS = ['78%', '62%', '88%', '54%', '70%']

// The ticket list while the tickets load: the filters, count, a full page of
// table rows and the page buttons, built from the list's own classes.
function TicketListSkeleton() {
  return (
    <SkeletonRegion label="Loading tickets…">
      <div className="ticket-list-filters">
        <div className="ticket-list-filters__field ticket-list-filters__field--grow">
          <Skeleton width={110} height={12} />
          <Skeleton height={44} />
        </div>
        <div className="ticket-list-filters__field">
          <Skeleton width={50} height={12} />
          <Skeleton height={44} />
        </div>
      </div>

      <div className="ticket-list__count">
        <Skeleton width={70} height={14} />
      </div>

      <div className="ticket-table__scroll">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TICKETS_PER_PAGE }, (_, row) => (
              <tr key={row}>
                <td className="ticket-table__id">
                  <Skeleton width={28} height={14} />
                </td>
                <td>
                  <Skeleton
                    width={TITLE_WIDTHS[row % TITLE_WIDTHS.length]}
                    height={14}
                  />
                </td>
                <td>
                  <Skeleton width={74} height={14} />
                </td>
                <td>
                  <Skeleton width={56} height={20} shape="pill" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <Skeleton width={82} height={32} />
        <Skeleton width={90} height={16} />
        <Skeleton width={58} height={32} />
      </div>
    </SkeletonRegion>
  )
}

export default TicketListSkeleton
