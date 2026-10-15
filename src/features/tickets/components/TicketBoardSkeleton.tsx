import Skeleton from '../../../components/Skeleton'
import SkeletonRegion from '../../../components/SkeletonRegion'
import { STATUS_ORDER } from '../data/ticketStatuses'
import './TicketBoard.css'
import './Column.css'
import './TicketCard.css'
import './TicketBoardSkeleton.css'

// How many placeholder cards each column gets, so the board looks like a
// real one rather than a perfect grid.
const CARDS_PER_COLUMN = [3, 2, 2, 1]

// The ticket board while the tickets load: the same four columns and cards,
// built from the board's own classes, with grey shapes for the text.
function TicketBoardSkeleton() {
  return (
    <SkeletonRegion label="Loading tickets…">
      <div className="ticket-board">
        {STATUS_ORDER.map((status, index) => (
          <div key={status} className="column">
            <div className="column__header">
              <Skeleton width="50%" height={14} />
              <Skeleton width={30} height={21} shape="pill" />
            </div>
            <div className="column__list">
              {Array.from({ length: CARDS_PER_COLUMN[index] }, (_, card) => (
                <div key={card} className="ticket-card">
                  <div className="ticket-board-skeleton__title">
                    <Skeleton width="90%" height={13} />
                    <Skeleton width="60%" height={13} />
                  </div>
                  <div className="ticket-card__footer">
                    <Skeleton width={56} height={20} shape="pill" />
                    <Skeleton width={96} height={27} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  )
}

export default TicketBoardSkeleton
